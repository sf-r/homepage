"""Saffron 디스코드 서버의 역할·카테고리·채널을 한 번에 만든다.

이미 같은 이름의 역할이나 채널이 있으면 새로 만들지 않고 건너뛴다(여러 번 돌려도 안전).
기존 채널을 지우거나 고치지는 않는다.

  python3 discord/setup_server.py <서버 ID>            # 무엇을 만들지 보여 주기만 함
  python3 discord/setup_server.py <서버 ID> --apply    # 실제로 만듦

봇 토큰은 환경 변수 DISCORD_BOT_TOKEN에서 읽는다. 저장소에 절대 적지 말 것.
봇에게는 서버 관리자 권한(또는 역할 관리 + 채널 관리)이 있어야 한다.
"""
import json
import os
import sys
import time
import urllib.error
import urllib.request

API = "https://discord.com/api/v10"

# 권한 비트 (https://discord.com/developers/docs/topics/permissions)
VIEW = 1 << 10
SEND = 1 << 11
SEND_IN_THREADS = 1 << 38
CREATE_PUBLIC_THREADS = 1 << 35
ADD_REACTIONS = 1 << 6
READ_HISTORY = 1 << 16
EMBED = 1 << 14
ATTACH = 1 << 15
APP_COMMANDS = 1 << 31
ADMIN = 1 << 3
TALK = SEND | SEND_IN_THREADS | CREATE_PUBLIC_THREADS
READ = VIEW | READ_HISTORY

# 역할: 위에서부터 높은 순서. 봇 역할은 디스코드가 봇을 초대할 때 자동으로 만들고,
# 봇이 역할을 줄 수 있도록 서버 설정에서 이 역할들보다 위로 끌어올려야 한다.
ROLES = [
    # 서버에 원래 있던 Saffron 역할을 관리자 역할로 쓴다 (있으면 권한만 맞춤)
    {"name": "Saffron", "color": 0xE9C97A, "hoist": True, "permissions": ADMIN, "ensure": True},
    {"name": "🔞 성인 인증", "color": 0xC0506A, "hoist": False, "permissions": 0},
    {"name": "🌱 멤버", "color": 0x8FDCAE, "hoist": False, "permissions": 0},
    # 3번 자동 공지가 멘션하는 알림 역할. Safe ON 작품과 서버 소식은 공지 알림,
    # Safe OFF 작품 소식은 성인 공지 알림 (연령 제한 채널에 올라간다)
    {"name": "🔔 공지 알림", "color": 0, "mentionable": True},
    {"name": "🔔 성인 공지 알림", "color": 0, "mentionable": True},
]

# @everyone에 있어야 하는 권한: 보이는 채널에서 읽고, 쓰고, 반응하고, 앱 명령을 쓰는 정도.
# 어떤 채널이 보이고 거기서 말할 수 있는지는 카테고리의 권한 덮어쓰기가 정한다.
EVERYONE_PERMS = READ | ADD_REACTIONS | EMBED | ATTACH | APP_COMMANDS | TALK

TEXT, CATEGORY, ANNOUNCEMENT, FORUM = 0, 4, 5, 15

# 카테고리마다: 누가 보는지(view), 누가 말하는지(talk). "@everyone"은 서버 전원.
# nsfw: 디스코드 연령 제한 채널. 성인 인증을 마친 계정만 들어올 수 있다.
LAYOUT = [
    {
        "name": "📌 입구", "view": ["@everyone"], "talk": [],
        "channels": [
            {"name": "규칙-및-입장", "type": TEXT, "topic": "서버 규칙. 온보딩에서 동의하면 🌱 멤버가 됩니다."},
            {"name": "공지", "type": ANNOUNCEMENT, "topic": "Saffron 소식. 새 작품과 업데이트가 자동으로 올라옵니다."},
        ],
    },
    {
        "name": "💬 라운지", "view": ["🌱 멤버"], "talk": ["🌱 멤버"],
        "channels": [
            {"name": "자유", "type": TEXT},
            {"name": "피드백-제보", "type": TEXT, "topic": "작품 피드백, 오류 제보, 건의"},
            {"name": "봇-명령어", "type": TEXT, "topic": "/작품 같은 Saffron 봇 명령어는 여기서"},
        ],
    },
    {
        "name": "📚 작품", "view": ["🌱 멤버"], "talk": ["🌱 멤버"],
        "channels": [
            {"name": "작품-이야기", "type": FORUM, "topic": "Safe ON 작품. 작품마다 글 하나씩."},
        ],
    },
    {
        "name": "🔞 Safe OFF", "view": ["🌱 멤버"], "talk": ["🌱 멤버"], "nsfw": True,
        "channels": [
            {"name": "성인-인증", "type": TEXT, "topic": "버튼을 눌러 🔞 성인 인증 역할을 받으면 사이트 갤러리가 열립니다.", "talk": []},
            {"name": "성인-작품-이야기", "type": FORUM, "topic": "Safe OFF 작품. 작품마다 글 하나씩."},
            {"name": "갤러리-소식", "type": TEXT, "talk": []},
        ],
    },
    {
        "name": "🛠️ 운영", "view": ["Saffron"], "talk": ["Saffron"],
        "channels": [
            {"name": "사이트-로그", "type": TEXT, "topic": "배포·사이트 알림 웹훅"},
            {"name": "가입-로그", "type": TEXT},
        ],
    },
]


def call(method, path, body=None):
    token = os.environ.get("DISCORD_BOT_TOKEN", "")
    data = json.dumps(body).encode() if body is not None else None
    req = urllib.request.Request(API + path, data=data, method=method, headers={
        "Authorization": f"Bot {token}",
        "Content-Type": "application/json",
        "User-Agent": "SaffronSetup (https://www.homepage.saffran.kr, 1)",
    })
    while True:
        try:
            with urllib.request.urlopen(req) as res:
                raw = res.read()
                return json.loads(raw) if raw else None
        except urllib.error.HTTPError as e:
            if e.code == 429:  # 속도 제한: 알려 준 만큼 기다렸다가 다시
                time.sleep(float(json.loads(e.read()).get("retry_after", 1)) + 0.2)
                continue
            raise SystemExit(f"{method} {path} → {e.code} {e.read().decode(errors='replace')}")


def overwrites(guild_id, roles, view, talk):
    """카테고리·채널 권한 덮어쓰기. view에 없는 사람은 못 보고, talk에 없는 사람은 못 쓴다."""
    def rid(name):
        return guild_id if name == "@everyone" else roles[name]
    out = {guild_id: {"id": guild_id, "type": 0, "allow": 0, "deny": 0}}
    if "@everyone" not in view:
        out[guild_id]["deny"] |= VIEW
    if "@everyone" not in talk:
        out[guild_id]["deny"] |= TALK
    for name in view:
        o = out.setdefault(rid(name), {"id": rid(name), "type": 0, "allow": 0, "deny": 0})
        o["allow"] |= VIEW
    for name in talk:
        o = out.setdefault(rid(name), {"id": rid(name), "type": 0, "allow": 0, "deny": 0})
        o["allow"] |= TALK
        o["deny"] &= ~TALK
    for o in out.values():
        o["allow"], o["deny"] = str(o["allow"]), str(o["deny"])
    return list(out.values())


def main():
    if len(sys.argv) < 2:
        raise SystemExit(__doc__)
    guild_id, apply = sys.argv[1], "--apply" in sys.argv
    say = (lambda *a: print(*a)) if apply else (lambda *a: print("[미리보기]", *a))

    guild = call("GET", f"/guilds/{guild_id}")
    print(f"서버: {guild['name']} ({guild_id}) · 커뮤니티 기능: {'COMMUNITY' in guild.get('features', [])}")

    # 역할
    all_roles = call("GET", f"/guilds/{guild_id}/roles")
    existing = {r["name"]: r["id"] for r in all_roles}
    # 봇은 자기 역할보다 아래인 역할만 다룰 수 있다: 봇 역할이 맨 위가 아니면 멈춘다
    me = call("GET", "/users/@me")["id"]
    member = call("GET", f"/guilds/{guild_id}/members/{me}")
    bot_top = max((r["position"] for r in all_roles if r["id"] in member["roles"]), default=0)
    others_top = max((r["position"] for r in all_roles if r["id"] not in member["roles"] and r["id"] != guild_id), default=0)
    if bot_top <= others_top:
        raise SystemExit("봇 역할이 맨 위에 있지 않습니다. 서버 설정 → 역할에서 봇 역할을 맨 위로 끌어올린 뒤 다시 실행하세요.")
    roles = dict(existing)
    for r in ROLES:
        if r["name"] in existing:
            print("  역할 있음:", r["name"])
            if r.get("ensure"):
                say("    권한 맞춤:", r["name"])
                if apply:
                    call("PATCH", f"/guilds/{guild_id}/roles/{existing[r['name']]}", {
                        "permissions": str(r.get("permissions", 0)), "hoist": r.get("hoist", False), "color": r.get("color", 0),
                    })
            continue
        say("  역할 만듦:", r["name"])
        if apply:
            made = call("POST", f"/guilds/{guild_id}/roles", {
                "name": r["name"], "color": r.get("color", 0), "hoist": r.get("hoist", False),
                "mentionable": r.get("mentionable", False), "permissions": str(r.get("permissions", 0)),
            })
            roles[r["name"]] = made["id"]
        else:
            roles[r["name"]] = f"<{r['name']}>"
    # @everyone에는 필요한 권한만 더한다. 기존 채널(음성 등)이 쓰던 권한은 빼지 않는다
    everyone_now = int(next(r["permissions"] for r in all_roles if r["id"] == guild_id))
    if everyone_now | EVERYONE_PERMS != everyone_now:
        say("  @everyone 기본 권한에 빠진 것 추가")
    if apply:
        if everyone_now | EVERYONE_PERMS != everyone_now:
            call("PATCH", f"/guilds/{guild_id}/roles/{guild_id}", {"permissions": str(everyone_now | EVERYONE_PERMS)})
        # 위에서 정한 순서대로 정렬 (봇 역할 바로 아래부터)
        # 봇은 자기 역할보다 위 번호를 줄 수 없어서, 위에서부터 하나씩 맨 아래(1)로 끼워 넣는다.
        # 마지막에 넣은 역할이 가장 아래가 되므로 결과는 ROLES 순서와 같다.
        for r in ROLES:
            call("PATCH", f"/guilds/{guild_id}/roles", [{"id": roles[r["name"]], "position": 1}])

    # 카테고리와 채널
    chans = call("GET", f"/guilds/{guild_id}/channels")
    by_key = {(c.get("parent_id"), c["name"]): c for c in chans}
    community = "COMMUNITY" in guild.get("features", [])
    for cat in LAYOUT:
        found = by_key.get((None, cat["name"]))
        if found:
            print("카테고리 있음:", cat["name"]); cat_id = found["id"]
        else:
            say("카테고리 만듦:", cat["name"])
            cat_id = call("POST", f"/guilds/{guild_id}/channels", {
                "name": cat["name"], "type": CATEGORY,
                "permission_overwrites": overwrites(guild_id, roles, cat["view"], cat["talk"]),
            })["id"] if apply else f"<{cat['name']}>"
        for ch in cat["channels"]:
            if (cat_id, ch["name"]) in by_key:
                print("  채널 있음:", ch["name"]); continue
            ctype = ch["type"]
            if ctype in (ANNOUNCEMENT, FORUM) and not community:
                ctype = TEXT  # 공지·포럼 채널은 커뮤니티 서버에서만 만들 수 있다
                print(f"  ※ {ch['name']}: 커뮤니티 기능이 꺼져 있어 일반 채널로 만듦")
            say("  채널 만듦:", ch["name"], "(연령 제한)" if cat.get("nsfw") else "")
            if apply:
                body = {
                    "name": ch["name"], "type": ctype, "parent_id": cat_id, "topic": ch.get("topic"),
                    "nsfw": bool(cat.get("nsfw")),
                    "permission_overwrites": overwrites(guild_id, roles, cat["view"], ch.get("talk", cat["talk"])),
                }
                call("POST", f"/guilds/{guild_id}/channels", body)
    if not apply:
        print("\n미리보기만 했습니다. 실제로 만들려면 --apply 를 붙이세요.")


if __name__ == "__main__":
    main()
