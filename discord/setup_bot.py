"""Saffron 봇의 /작품 명령을 등록하고, 입장·성인 인증 채널에 버튼 메시지를 올린다.

  python3 discord/setup_bot.py            # 등록 + 메시지 올리기 (이미 올린 메시지는 고쳐 쓴다)

봇 토큰은 환경 변수 DISCORD_BOT_TOKEN에서 읽는다. 저장소에 절대 적지 말 것.
버튼을 누르면 디스코드가 Worker(src/discord.js)로 보내므로, 개발자 포털의
Interactions Endpoint URL이 https://www.homepage.saffran.kr/discord/interactions 여야 한다.
"""
import json
import os
import re
import time
import urllib.error
import urllib.request

API = "https://discord.com/api/v10"
APP = "1571482072290172928"
GUILD = "1571467020933800088"
ENTRY_CHANNEL = "1571486695868731393"   # 규칙-입장・rules・ルール (커뮤니티 규칙 채널, 가입·알림 버튼)
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


def genre_choices():
    """사이트 책장의 장르(saffron/js/data.js의 GENRES)를 명령 선택지로. 25개까지."""
    src = open(os.path.join(os.path.dirname(__file__), "..", "saffron", "js", "data.js"), encoding="utf-8").read()
    block = src.split("export const GENRES = {", 1)[1].split("};", 1)[0]
    out = []
    for m in re.finditer(r'"?([\w-]+)"?\s*:\s*\{\s*ko:\s*"([^"]+)",\s*en:\s*"([^"]+)",\s*ja:\s*"([^"]+)"', block):
        key, ko, en, ja = m.groups()
        out.append({"name": en, "name_localizations": {"ko": ko, "ja": ja}, "value": key})
    return out[:25]


def opt(type_, name, ko, ja, desc, desc_ko, desc_ja, **extra):
    return {"type": type_, "name": name, "name_localizations": {"ko": ko, "ja": ja},
            "description": desc, "description_localizations": {"ko": desc_ko, "ja": desc_ja}, **extra}


def cmd(name, ko, ja, desc, desc_ko, desc_ja, options=()):
    return {"type": 1, "name": name, "name_localizations": {"ko": ko, "ja": ja},
            "description": desc, "description_localizations": {"ko": desc_ko, "ja": desc_ja},
            "options": list(options)}


STRING = 3
LANG_CHOICES = [
    {"name": "한국어", "value": "ko"},
    {"name": "English", "value": "en"},
    {"name": "日本語", "value": "ja"},
]
NOTICE_CHOICES = [
    {"name": "Notice", "name_localizations": {"ko": "공지 알림", "ja": "お知らせ"}, "value": "all"},
    {"name": "Notice 🔞", "name_localizations": {"ko": "공지 알림 🔞", "ja": "お知らせ 🔞"}, "value": "adult"},
]

COMMANDS = [
    cmd("works", "작품", "作品", "Saffron works: the list, or one work's card",
        "Saffron 작품 목록, 또는 작품 하나의 카드", "Saffron の作品一覧、または作品カード",
        [opt(STRING, "title", "제목", "タイトル", "Work title (pick from the list)", "작품 제목 (목록에서 고르기)",
             "作品タイトル（リストから選択）", required=False, autocomplete=True)]),
    cmd("genre", "장르", "ジャンル", "Works in a genre", "장르별 작품", "ジャンル別の作品",
        [opt(STRING, "genre", "장르", "ジャンル", "Genre", "장르", "ジャンル", required=True, choices=genre_choices())]),
    cmd("random", "랜덤", "ランダム", "Recommend a random work", "작품 하나를 무작위로 추천", "作品をランダムにおすすめ"),
    cmd("roll", "주사위", "ダイス", "Roll dice, e.g. 2d6+1", "주사위 굴리기 (예: 2d6+1)", "ダイスを振る（例: 2d6+1）",
        [opt(STRING, "dice", "주사위", "ダイス", "Dice like 2d6, d20, 3d6+2 (default 1d100)",
             "2d6, d20, 3d6+2 처럼 (기본 1d100)", "2d6、d20、3d6+2 など（既定 1d100）", required=False, max_length=20)]),
    cmd("notice", "알림", "お知らせ", "Turn notifications on or off", "공지 알림 켜기·끄기", "お知らせ通知のオン・オフ",
        [opt(STRING, "kind", "종류", "種類", "Which notifications (🔞 only in age-restricted channels)",
             "어떤 알림 (🔞 은 연령 제한 채널에서만)", "どの通知（🔞 は年齢制限チャンネルのみ）",
             required=False, choices=NOTICE_CHOICES)]),
    cmd("language", "언어", "言語", "Change your language", "사용 언어 바꾸기", "使用言語を変更",
        [opt(STRING, "lang", "언어", "言語", "Language", "언어", "言語", required=True, choices=LANG_CHOICES)]),
    cmd("help", "도움말", "ヘルプ", "Saffron bot commands", "Saffron 봇 명령어 안내", "Saffron ボットのコマンド"),
]

ENTRY = {
    # 온보딩에서 고른 언어(🇰🇷/🇺🇸/🇯🇵)로 퀴즈가 나오고, 맞히면 그 언어의 멤버 역할을 받는다
    "content": (
        "## Saffron 제작공방\n"
        "이 채널의 규칙을 읽어 주세요. 아래 버튼을 누르면 **규칙에 동의한 것으로 보고**, 질문에 답하면 바로 채널이 열려요.\n"
        "Please read the rules in this channel. Pressing the button below **means you agree to them**; answer the questions and the channels open right away.\n"
        "このチャンネルのルールを読んでください。下のボタンを押すと**ルールに同意したものとみなし**、質問に答えるとすぐにチャンネルが開きます。\n\n"
        "🔔 새 작품·업데이트 알림 / New works & updates / 新作・更新のお知らせ"
    ),
    "components": [
        {"type": 1, "components": [button("규칙에 동의하고 가입 / Agree & Join / 同意して参加", "join:start", 3, "🌱")]},
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
