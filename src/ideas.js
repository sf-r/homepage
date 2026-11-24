// /소재 (/idea, /ネタ) — 무작위 소재 조합. 제작자 취향과 상관없이 넓은 풀에서 뽑는다.
// 항목마다 [한국어, English, 日本語]. NSFW 풀의 인물은 모두 성인이고, 관계는 합의를 전제로 한다.

const SFW = {
  genre: [
    ["로맨스 판타지", "Romance fantasy", "ロマンスファンタジー"],
    ["현대 판타지", "Urban fantasy", "現代ファンタジー"],
    ["미스터리", "Mystery", "ミステリー"],
    ["회귀물", "Regression", "回帰もの"],
    ["아카데미물", "Academy", "アカデミーもの"],
    ["SF", "Sci-fi", "SF"],
    ["호러", "Horror", "ホラー"],
    ["무협", "Wuxia", "武侠"],
    ["일상 코미디", "Slice-of-life comedy", "日常コメディ"],
    ["아포칼립스", "Post-apocalypse", "終末もの"],
    ["궁중 암투", "Palace intrigue", "宮廷劇"],
    ["모험", "Adventure", "冒険"]
  ],
  setting: [
    ["몰락한 귀족 가문의 저택", "the manor of a fallen noble house", "没落した貴族の屋敷"],
    ["하늘에 떠 있는 섬 도시", "a floating island city", "空に浮かぶ島の都市"],
    ["새벽 3시의 편의점", "a convenience store at 3 a.m.", "午前3時のコンビニ"],
    ["문을 닫은 기숙학교", "a closed-down boarding school", "廃校になった寄宿学校"],
    ["마법 학원의 금서고", "the forbidden archive of a magic academy", "魔法学園の禁書庫"],
    ["겨울이 끝나지 않는 마을", "a village where winter never ends", "冬が終わらない村"],
    ["우주 정거장의 작은 식당", "a tiny diner on a space station", "宇宙ステーションの小さな食堂"],
    ["비가 그치지 않는 항구 도시", "a port city where the rain never stops", "雨のやまない港町"],
    ["시간이 멈춘 놀이공원", "an amusement park where time stopped", "時間が止まった遊園地"],
    ["던전 한가운데의 여관", "an inn in the middle of a dungeon", "ダンジョンの真ん中の宿屋"],
    ["가상현실 게임 속 세계", "the world inside a VR game", "VRゲームの中の世界"],
    ["황궁의 깊은 후원", "the hidden garden of the imperial palace", "皇宮の奥庭"]
  ],
  hero: [
    ["기억을 잃은 기사", "a knight who lost their memory", "記憶を失った騎士"],
    ["몰래 마법을 쓰는 하녀", "a maid who secretly uses magic", "こっそり魔法を使うメイド"],
    ["은퇴한 영웅", "a retired hero", "引退した英雄"],
    ["회귀한 악역 영애", "a villainess who went back in time", "回帰した悪役令嬢"],
    ["운 나쁜 신입 모험가", "an unlucky rookie adventurer", "運の悪い新米冒険者"],
    ["거짓말을 못 하는 탐정", "a detective who can't lie", "嘘がつけない探偵"],
    ["유령이 보이는 바리스타", "a barista who can see ghosts", "幽霊が見えるバリスタ"],
    ["세상에 마지막 남은 용", "the last dragon in the world", "世界に最後の竜"],
    ["빚더미에 앉은 연금술사", "an alchemist buried in debt", "借金まみれの錬金術師"],
    ["소심한 천재 해커", "a timid genius hacker", "気弱な天才ハッカー"],
    ["왕위를 거부한 왕자", "a prince who refused the throne", "王位を拒んだ王子"],
    ["시간을 되감는 우편배달부", "a mail carrier who can rewind time", "時間を巻き戻す郵便配達人"]
  ],
  partner: [
    ["정체를 숨긴 황제", "an emperor in disguise", "正体を隠した皇帝"],
    ["말이 많은 고양이 요정", "a chatty cat spirit", "おしゃべりな猫の妖精"],
    ["냉혈한 공작", "a cold-blooded duke", "冷血な公爵"],
    ["소꿉친구이자 라이벌", "a childhood friend turned rival", "幼なじみでライバル"],
    ["수상한 전학생", "a suspicious transfer student", "怪しい転校生"],
    ["천 년 묵은 여우", "a thousand-year-old fox", "千年生きた狐"],
    ["힘을 잃은 성녀", "a saint who lost her power", "力を失った聖女"],
    ["적국의 스파이", "a spy from the enemy nation", "敵国のスパイ"],
    ["다정한 악마", "a kind-hearted demon", "優しい悪魔"],
    ["같은 하루를 반복하는 이웃", "a neighbor stuck repeating the same day", "同じ一日を繰り返す隣人"],
    ["감정을 배우는 기계 인형", "an automaton learning to feel", "感情を学ぶ機械人形"],
    ["쫓기는 공주", "a princess on the run", "追われる王女"]
  ],
  bond: [
    ["계약 결혼", "a contract marriage", "契約結婚"],
    ["원수에서 동료로", "enemies to allies", "宿敵から仲間へ"],
    ["첫사랑과의 재회", "reunion with a first love", "初恋との再会"],
    ["스승과 제자", "mentor and apprentice", "師匠と弟子"],
    ["가짜 연인", "fake dating", "偽の恋人"],
    ["주군과 기사", "liege and knight", "主君と騎士"],
    ["라이벌 겸 파트너", "rivals and partners", "ライバル兼パートナー"],
    ["서로의 비밀을 쥔 공범", "accomplices holding each other's secrets", "互いの秘密を握る共犯者"],
    ["어쩌다 동거", "accidental roommates", "なりゆきの同居"],
    ["구해 준 쪽과 구해진 쪽", "the rescuer and the rescued", "救った者と救われた者"]
  ],
  hook: [
    ["결혼식 전날 신부가 사라졌다", "the bride vanished the night before the wedding", "結婚式の前夜に花嫁が消えた"],
    ["매일 밤 같은 꿈을 꾼다", "the same dream every night", "毎晩同じ夢を見る"],
    ["갑자기 남의 속마음이 들린다", "suddenly hearing other people's thoughts", "突然他人の心の声が聞こえる"],
    ["1년 뒤 세계가 멸망한다는 예언", "a prophecy that the world ends in a year", "一年後に世界が滅びるという予言"],
    ["집 앞에 버려진 알", "an egg left on the doorstep", "家の前に置かれた卵"],
    ["죽은 줄 알았던 가족의 편지", "a letter from family thought dead", "死んだはずの家族からの手紙"],
    ["몸이 뒤바뀌었다", "a body swap", "体が入れ替わった"],
    ["잘못 배달된 초대장", "a misdelivered invitation", "誤配された招待状"],
    ["마을 사람들이 하나씩 잊힌다", "the villagers are being forgotten one by one", "村人が一人ずつ忘れられていく"],
    ["상대의 남은 수명이 숫자로 보인다", "seeing someone's remaining lifespan as a number", "相手の残り寿命が数字で見える"],
    ["거울 속 내가 먼저 웃었다", "the reflection smiled first", "鏡の中の自分が先に笑った"],
    ["눈앞에 상태창이 떴다", "a status window appeared", "目の前にステータスウィンドウが現れた"]
  ],
  twist: [
    ["사실 이번이 두 번째 삶이었다", "it was a second life all along", "実はこれが二度目の人生だった"],
    ["조력자가 흑막이었다", "the helper was the mastermind", "協力者が黒幕だった"],
    ["주인공이 예언 속 마왕이었다", "the hero is the demon king of the prophecy", "主人公が予言の魔王だった"],
    ["적은 미래의 나였다", "the enemy is your future self", "敵は未来の自分だった"],
    ["이 세계는 누군가의 소설이었다", "this world is someone's novel", "この世界は誰かの小説だった"],
    ["상대는 이미 한 번 죽었다", "the other one has already died once", "相手はすでに一度死んでいる"],
    ["기억이 조작되어 있었다", "the memories were fabricated", "記憶が改ざんされていた"],
    ["둘은 원래 한 사람이었다", "the two were originally one person", "二人はもともと一人だった"],
    ["상대는 처음부터 다 알고 있었다", "the other one knew everything from the start", "相手は最初から全部知っていた"],
    ["반전 없음, 그대로 행복해진다", "no twist: they simply end up happy", "どんでん返しなし、そのまま幸せになる"]
  ]
};

// NSFW: 등장인물은 전원 성인. 강요가 아니라 합의와 긴장감을 전제로 한 소재만 둔다.
const NSFW = {
  genre: [
    ["성인 로맨스 판타지", "Adult romance fantasy", "大人向けロマンスファンタジー"],
    ["오피스 로맨스", "Office romance", "オフィスロマンス"],
    ["다크 판타지", "Dark fantasy", "ダークファンタジー"],
    ["집착 로맨스", "Obsessive romance", "執着ロマンス"],
    ["계약 연애물", "Contract romance", "契約恋愛もの"],
    ["피폐물", "Angst", "ドロドロもの"],
    ["하렘물", "Harem", "ハーレムもの"],
    ["성인 현대물", "Adult modern drama", "大人向け現代もの"],
    ["주종 관계물", "Master and servant", "主従もの"],
    ["로맨틱 코미디 (19금)", "Adult rom-com", "大人のラブコメ"]
  ],
  setting: [
    ["출장지 호텔 스위트룸", "a hotel suite on a business trip", "出張先のホテルのスイートルーム"],
    ["가면무도회의 발코니", "the balcony of a masquerade ball", "仮面舞踏会のバルコニー"],
    ["회원제 비밀 클럽", "a members-only secret club", "会員制の秘密クラブ"],
    ["야근 중인 텅 빈 사무실", "an empty office during overtime", "残業中の誰もいないオフィス"],
    ["눈에 갇힌 산장", "a snowbound mountain lodge", "雪に閉ざされた山荘"],
    ["왕궁의 밀실", "a secret chamber in the palace", "王宮の密室"],
    ["바닷가 별장", "a seaside villa", "海辺の別荘"],
    ["마녀의 탑 꼭대기 방", "the top room of a witch's tower", "魔女の塔の最上階の部屋"],
    ["마왕성의 침실", "the bedchamber of the demon lord's castle", "魔王城の寝室"],
    ["온천 여관의 노천탕", "the open-air bath of a hot-spring inn", "温泉旅館の露天風呂"]
  ],
  hero: [
    ["원칙주의 비서", "a by-the-book secretary", "原則主義の秘書"],
    ["은퇴한 여기사", "a retired knight", "引退した女騎士"],
    ["빚을 갚는 중인 몰락 영애", "a fallen noble lady paying off debts", "借金返済中の没落令嬢"],
    ["입주 메이드", "a live-in maid", "住み込みのメイド"],
    ["단골이 많은 바텐더", "a bartender with many regulars", "常連の多いバーテンダー"],
    ["신입 사원", "a new employee", "新入社員"],
    ["견습 서큐버스", "an apprentice succubus", "見習いサキュバス"],
    ["퇴마사", "an exorcist", "退魔師"],
    ["황실 근위대장", "the captain of the imperial guard", "皇室近衛隊長"],
    ["무명 배우", "an unknown actor", "無名の俳優"]
  ],
  partner: [
    ["집착하는 대공", "a possessive grand duke", "執着する大公"],
    ["계약 배우자", "a contract spouse", "契約上の配偶者"],
    ["냉정한 상사", "a cold boss", "冷たい上司"],
    ["꿈에만 나타나는 몽마", "an incubus who appears only in dreams", "夢にだけ現れる夢魔"],
    ["뱀파이어 귀족", "a vampire noble", "吸血鬼の貴族"],
    ["연하 후배", "a younger coworker", "年下の後輩"],
    ["악명 높은 용병단장", "a notorious mercenary captain", "悪名高い傭兵団長"],
    ["지루해하는 마왕", "a bored demon lord", "退屈している魔王"],
    ["헤어진 전 연인", "an ex who walked away", "別れた元恋人"],
    ["정체를 숨긴 단골손님", "a regular customer hiding who they are", "正体を隠した常連客"]
  ],
  bond: [
    ["몸정에서 맘정으로", "bodies first, hearts later", "体から始まる恋"],
    ["계약 연인", "contract lovers", "契約恋人"],
    ["원나잇 상대가 새 상사", "the one-night stand is the new boss", "一夜の相手が新しい上司"],
    ["합의된 주종 관계", "a consensual master-servant bond", "合意の上の主従関係"],
    ["위장 결혼", "a sham marriage", "偽装結婚"],
    ["앙숙인데 하룻밤", "rivals who spend one night", "犬猿の仲なのに一夜"],
    ["사내 비밀 연애", "a secret office romance", "社内の秘密の恋"],
    ["정략결혼 첫날밤", "the wedding night of an arranged marriage", "政略結婚の初夜"],
    ["전 연인과의 재회", "reunion with an ex", "元恋人との再会"],
    ["내기에서 진 쪽이 하루 동안 따르기", "the loser of a bet obeys for a day", "賭けに負けた方が一日従う"]
  ],
  heat: [
    ["슬로우번 긴장감", "slow-burn tension", "じれったい緊張感"],
    ["질투", "jealousy", "嫉妬"],
    ["키스 금지 규칙", "a no-kissing rule", "キス禁止のルール"],
    ["명령과 복종 (합의)", "consensual command and obedience", "合意の上の命令と服従"],
    ["들킬 뻔한 순간", "almost getting caught", "バレそうになる瞬間"],
    ["눈가리개", "a blindfold", "目隠し"],
    ["서로에게 새겨진 각인", "marks bound to each other", "互いに刻まれた刻印"],
    ["체온 나누기", "sharing body heat", "体温を分け合う"],
    ["주도권 다툼", "a fight for control", "主導権争い"],
    ["첫날밤의 서툼", "first-night awkwardness", "初夜のぎこちなさ"]
  ],
  hook: [
    ["술자리 내기에서 졌다", "lost a drinking bet", "飲み会の賭けに負けた"],
    ["계약서 마지막 조항을 못 읽었다", "missed the last clause of the contract", "契約書の最後の条項を読み落とした"],
    ["하룻밤 실수, 다음 날 아침 회의", "a one-night mistake, a meeting the next morning", "一夜の過ち、翌朝の会議"],
    ["둘만 침실에 갇히는 마법", "a spell that locks the two in a bedroom", "二人だけ寝室に閉じ込める魔法"],
    ["서로 몸에 같은 문양이 떠올랐다", "the same mark appeared on both their bodies", "二人の体に同じ紋様が浮かんだ"],
    ["가면을 벗었더니 아는 얼굴", "under the mask was a familiar face", "仮面の下は知った顔だった"],
    ["폭설로 방이 하나밖에 없다", "a blizzard and only one room left", "大雪で部屋が一つしかない"],
    ["계약 연애의 만료일이 다가온다", "the contract relationship is about to expire", "契約恋愛の期限が近づく"],
    ["몽마와 계약을 맺어 버렸다", "accidentally made a pact with an incubus", "うっかり夢魔と契約してしまった"],
    ["전 연인이 결혼 상대로 나타났다", "the ex shows up as the arranged partner", "元恋人が結婚相手として現れた"]
  ],
  twist: [
    ["짝사랑은 사실 쌍방이었다", "the crush was mutual all along", "片思いは実は両想いだった"],
    ["계약은 상대가 꾸민 것이었다", "the other one set up the contract", "契約は相手が仕組んだものだった"],
    ["상대는 정체를 숨긴 왕족이었다", "the other one is royalty in disguise", "相手は正体を隠した王族だった"],
    ["저주를 푸는 조건은 진심이었다", "the cure for the curse is a true heart", "呪いを解く条件は本心だった"],
    ["집착은 사실 보호였다", "the obsession was protection", "執着は実は守るためだった"],
    ["처음부터 주도권은 상대에게 있었다", "the other one was in control from the start", "最初から主導権は相手にあった"],
    ["둘 다 상대를 유혹하라는 의뢰를 받았다", "both were hired to seduce the other", "二人とも相手を誘惑する依頼を受けていた"],
    ["기억을 잃은 쪽이 전 연인이었다", "the one with amnesia was the ex", "記憶を失った方が元恋人だった"]
  ]
};

const LABELS = {
  genre: ["장르", "Genre", "ジャンル"],
  setting: ["무대", "Setting", "舞台"],
  hero: ["주인공", "Protagonist", "主人公"],
  partner: ["상대", "Counterpart", "相手"],
  bond: ["관계", "Relationship", "関係"],
  heat: ["긴장 요소", "Heat", "スパイス"],
  hook: ["사건", "Hook", "事件"],
  twist: ["반전", "Twist", "どんでん返し"]
};
const TITLE = {
  sfw: ["🎲 오늘의 소재", "🎲 Today's story idea", "🎲 今日のネタ"],
  nsfw: ["🔞 오늘의 소재", "🔞 Today's story idea", "🔞 今日のネタ"]
};
const LANG_INDEX = { ko: 0, en: 1, ja: 2 };

const pick = (list) => list[Math.floor(Math.random() * list.length)];

// 무작위 소재 한 벌을 임베드로. kind: "sfw" | "nsfw"
export function ideaEmbed(kind, lang) {
  const i = LANG_INDEX[lang] ?? 0;
  const pool = kind === "nsfw" ? NSFW : SFW;
  const fields = Object.keys(LABELS)
    .filter((key) => pool[key])
    .map((key) => ({ name: LABELS[key][i], value: pick(pool[key])[i], inline: key !== "hook" && key !== "twist" }));
  return {
    title: TITLE[kind][i],
    color: kind === "nsfw" ? 0xc0506a : 0xe9c97a,
    fields
  };
}
