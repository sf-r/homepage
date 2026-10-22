// 「신세계 프로젝트 마법숙녀 Re:Bloomlution」 캐릭터 이미지 미리보기 목록.
//
// 이 폴더(pages/rebloom/gallery/)는 아카라이브에서 링크로 들어온 사람만 볼 수 있습니다.
// (검사는 저장소 루트의 src/worker.js)
//
// 이미지는 캔버스(상태창 갤러리)와 같은 규칙으로 불러옵니다.
//   https://saffran.kr/blo/(캐릭터)-(의상)-(코드).webp     예) yun-a-0.webp = 설윤 · 평상복 · 무표정
// 바깥 주소라서 이미지 파일 자체는 이 페이지의 입장 검사를 받지 않습니다.
// 아직 없는 이미지는 칸에서 자동으로 빠집니다.
//
// 의상을 새로 열 때: CLOTHES 에서 그 의상의 ready 를 true 로 바꾸면 됩니다.
// (d 변신 의상 파괴 💥, r 강제 해제 🔓 는 이미지를 올린 뒤 true 로)

export const BASE = "https://saffran.kr/blo/";
export const EXT = ".webp";

export const CHARACTERS = [
  { code: "yun", id: "seolyun", name: "강설윤", sub: "실버 하울", color: "silver" },
  { code: "nae", id: "ayane", name: "시라토리 아야네", sub: "하쿠후", color: "violet" },
  { code: "mel", id: "melinoe", name: "멜리노에", sub: "녹턴 베일", color: "shadow" },
  { code: "nor", id: "nolwenn", name: "놀웬", sub: "아쿠아 다후트 No.7", color: "teal" },
  { code: "rev", id: "liv", name: "리브", sub: "룬라이트", color: "rune" }
];

export const CLOTHES = [
  { code: "a", name: "평상복", mark: "👚", ready: true },
  { code: "m", name: "변신", mark: "🪄", ready: true },
  { code: "d", name: "변신 의상 파괴", mark: "💥", ready: false },
  { code: "r", name: "강제 해제", mark: "🔓", ready: false },
  { code: "n", name: "누드", mark: "🍑", ready: true }
];

// 캔버스 Image Codes 와 같은 목록. 105/106 처럼 둘인 것은 행위 / 그 절정.
const EMOTION = "0 무표정(기본), 1 웃음(행복), 2 울음(슬픔), 3 부끄러움, 4 공포(두려움), 5 놀람, 6 당황, 7 분노(화남), 9 삐짐, 10 신남, 11 미안, 12 시무룩, 13 걱정, 14 질투, 15 지침, 16 경멸, 17 노려보기";
const ACTION = "8 자는 중, 18 볼 잡아당기기, 19 볼 찌르기, 20 머리 쓰다듬기, 21 뻐큐(뻑유)";
const ADULT = "101 키스, 102 보지벌리기, 103 가슴주무르기, 104 엉덩이주무르기, 105/106 파이즈리, 107/108 풋잡, 109/110 펠라치오, 111/112 고환핥기, 113/114 수유대딸, 115/116 자위, 117/118 핑거링, 119/120 페이스시팅, 121/122 스마타, 123/124 정상위, 125/126 후배위, 127/128 기승위, 129/130 좌위, 131/132 측위, 133/134 입위, 135/136 들박, 137/138 교배프레스, 139/140 아마존프레스, 141/142 겨드랑이핥기";

function parse(list) {
  const codes = [];
  for (const item of list.split(",")) {
    const m = item.trim().match(/^(\d+)(?:\/(\d+))? (.+)$/);
    if (!m) continue;
    codes.push({ code: Number(m[1]), name: m[3] });
    if (m[2]) codes.push({ code: Number(m[2]), name: m[3] + " · 절정" });
  }
  return codes;
}

export const CODE_GROUPS = [
  { id: "emotion", title: "표정", codes: parse(EMOTION) },
  { id: "action", title: "행동", codes: parse(ACTION) },
  { id: "adult", title: "🔞 성인", codes: parse(ADULT), locked: true }
];

export function imageUrl(character, clothes, code) {
  return `${BASE}${character.code}-${clothes.code}-${code}${EXT}`;
}
