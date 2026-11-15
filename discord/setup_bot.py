"""Saffron 봇의 /작품 명령을 등록하고, 입장·성인 인증 채널에 버튼 메시지를 올린다.

  python3 discord/setup_bot.py            # 등록 + 메시지 올리기 (이미 올린 메시지는 고쳐 쓴다)

봇 토큰은 환경 변수 DISCORD_BOT_TOKEN에서 읽는다. 저장소에 절대 적지 말 것.
버튼을 누르면 디스코드가 Worker(src/discord.js)로 보내므로, 개발자 포털의
Interactions Endpoint URL이 https://www.homepage.saffran.kr/discord/interactions 여야 한다.
"""
import json
import os
import time
import urllib.error
import urllib.request

API = "https://discord.com/api/v10"
APP = "1571482072290172928"
GUILD = "1571467020933800088"
RULES_CHANNEL = "1571468627012624474"   # 규칙-및-주의사항 (커뮤니티 규칙 채널)
ENTRY_CHANNEL = "1571486695868731393"   # 규칙-입장・rules・ルール (알림 버튼)
ADULT_CHANNEL = "1571486707159662774"   # 성인-인증・age-check・年齢認証 (연령 제한)


def call(method, path, body=None):
    data = json.dumps(body).encode() if body is not None else None
    req = urllib.request.Request(API + path, data=data, method=method, headers={
        "Authorization": f"Bot {os.environ.get('DISCORD_BOT_TOKEN', '')}",
        "Content-Type": "application/json",
        "User-Agent": "SaffronSetup (https://www.homepage.saffran.kr, 1)",
    })
    while True:
        try:
            with urllib.request.urlopen(req) as res:
                raw = res.read()
                return json.loads(raw) if raw else None
        except urllib.error.HTTPError as e:
            text = e.read().decode(errors="replace")
            if e.code == 429:
                time.sleep(float(json.loads(text).get("retry_after", 1)) + 0.3)
                continue
            raise SystemExit(f"{method} {path} → {e.code} {text}")


def button(label, custom_id, style=2, emoji=None):
    b = {"type": 2, "style": style, "label": label, "custom_id": custom_id}
    if emoji:
        b["emoji"] = {"name": emoji}
    return b


COMMANDS = [{
    "name": "works",
    "name_localizations": {"ko": "작품", "ja": "作品"},
    "description": "Saffron library: works and links",
    "description_localizations": {"ko": "Saffron 서재의 작품과 링크", "ja": "Saffron 書斎の作品とリンク"},
    "type": 1,
}]

ENTRY = {
    # 사용 언어는 디스코드 온보딩 질문이 정한다(언어별 멤버 역할). 여기는 알림 켜고 끄기만
    "content": (
        "## 🔔 공지 알림 / notice / お知らせ\n"
        "새 작품·업데이트 소식을 알림으로 받으려면 버튼을 누르세요. 다시 누르면 꺼져요.\n"
        "Press the button to get pinged for new works and updates. Press again to turn it off.\n"
        "新作・更新のお知らせを通知で受け取るにはボタンを押してください。もう一度押すとオフになります。"
    ),
    "components": [
        {"type": 1, "components": [button("공지 알림 / notice / お知らせ", "notice:all", 2, "🔔")]},
    ],
    "allowed_mentions": {"parse": []},
}

ADULT = {
    "content": (
        "## 🔞 성인 인증 / Age check / 年齢認証\n"
        "이 채널은 디스코드에서 성인 인증을 마친 계정만 들어올 수 있어요. 버튼을 누르면 🔞 성인 인증 역할을 받고, 사이트 갤러리가 열려요.\n"
        "Only accounts that passed Discord's age check can see this channel. Press the button to get the verified adult role and open the site gallery.\n"
        "このチャンネルはDiscordで年齢確認を済ませたアカウントだけが入れます。ボタンを押すと成人認証ロールが付き、サイトのギャラリーが開きます。\n\n"
        "🔔 Safe OFF 작품 알림 / Safe OFF updates / Safe OFF 作品のお知らせ"
    ),
    "components": [
        {"type": 1, "components": [button("성인 인증 받기 / Get verified / 認証を受ける", "adult:verify", 3, "🔞")]},
        {"type": 1, "components": [button("공지 알림 / notice / お知らせ 🔞", "notice:adult", 2, "🔔")]},
    ],
    "allowed_mentions": {"parse": []},
}


def post_or_edit(channel_id, message, bot_id):
    """그 채널에 봇이 올린 메시지가 있으면 고쳐 쓰고, 없으면 새로 올린다."""
    for m in call("GET", f"/channels/{channel_id}/messages?limit=50"):
        if m["author"]["id"] == bot_id:
            call("PATCH", f"/channels/{channel_id}/messages/{m['id']}", message)
            return "고침"
    call("POST", f"/channels/{channel_id}/messages", message)
    return "올림"


def main():
    bot_id = call("GET", "/users/@me")["id"]
    cmds = call("PUT", f"/applications/{APP}/guilds/{GUILD}/commands", COMMANDS)
    print("명령 등록:", ", ".join("/" + c["name"] for c in cmds))
    print("입장 메시지:", post_or_edit(ENTRY_CHANNEL, ENTRY, bot_id))
    print("성인 인증 메시지:", post_or_edit(ADULT_CHANNEL, ADULT, bot_id))


if __name__ == "__main__":
    main()
