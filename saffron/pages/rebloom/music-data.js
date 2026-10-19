// '신세계 프로젝트 마법숙녀 Re:Bloomlution' 상세페이지 재생목록.
// character 를 적은 곡은 등장인물 페이지의 그 인물 아래에 '테마곡 재생하기' 버튼이 생깁니다.
// src는 R2 공개 URL입니다. (README '음악 플레이어(R2)' 항목 참고)

export const TRACKS = [
  {
    id: "main-theme",
    after: "#world > .lead",
    button: "전체 테마곡 재생하기",
    title: "Re:Bloom - Re:volution - Re:bloomlution (전체 테마곡)",
    src: "https://music.saffran.kr/Re_Bloom%20-%20Re_volution%20-%20Re_bloomlution.m4a"
  },
  {
    id: "ayane-theme",
    character: "ayane",
    title: "새장 속의 하늘바람 (Hakufū) (아야네의 테마곡)",
    src: "https://music.saffran.kr/%EC%83%88%EC%9E%A5%20%EC%86%8D%EC%9D%98%20%ED%95%98%EB%8A%98%EB%B0%94%EB%9E%8C%20(Hakuf%C5%AB).m4a"
  },
  {
    id: "seolyun-theme",
    character: "seolyun",
    title: "초침의 은빛 (Silver Howl) (강설윤의 테마곡)",
    src: "https://music.saffran.kr/%EC%B4%88%EC%B9%A8%EC%9D%98%20%EC%9D%80%EB%B9%9B%20(Silver%20Howl).m4a"
  },
  {
    id: "melinoe-theme",
    character: "melinoe",
    title: "빛 없는 방의 노래 (Nocturne Veil) (멜리노에의 테마곡)",
    src: "https://music.saffran.kr/%EB%B9%9B%20%EC%97%86%EB%8A%94%20%EB%B0%A9%EC%9D%98%20%EB%85%B8%EB%9E%98%20(Nocturne%20Veil).m4a"
  },
  {
    id: "nolwenn-theme",
    character: "nolwenn",
    title: "실적은 바다 밑에서 (Aqua Dahut No.7) (놀웬의 테마곡)",
    src: "https://music.saffran.kr/%EC%8B%A4%EC%A0%81%EC%9D%80%20%EB%B0%94%EB%8B%A4%20%EB%B0%91%EC%97%90%EC%84%9C%20(Aqua%20Dahut%20No.7).m4a"
  },
  {
    id: "liv-theme",
    character: "liv",
    title: "룬 그리는 아이 (Runelight) (리브의 테마곡)",
    src: "https://music.saffran.kr/%EB%A3%AC%20%EA%B7%B8%EB%A6%AC%EB%8A%94%20%EC%95%84%EC%9D%B4%20(Runelight).m4a"
  },
  {
    id: "bid-bid-o-en",
    after: "#region-lifthrasir dl",
    button: "비드비드 오엔 전곡 듣기",
    title: "리프트라시르의 옛 노래 (Bid Bid, O En) (비드비드 오엔 전곡)",
    src: "https://music.saffran.kr/%EB%A6%AC%ED%94%84%ED%8A%B8%EB%9D%BC%EC%8B%9C%EB%A5%B4%EC%9D%98%20%EC%98%9B%20%EB%85%B8%EB%9E%98%20(Bid%20Bid%2C%20O%20En).m4a"
  },
  {
    id: "bid-bid-o-en-meaning",
    after: "#region-lifthrasir dl",
    button: "비드비드 오엔 해석 듣기",
    title: "리프트라시르의 옛 노래 (Bid Bid, O En) (비드비드 오엔 해석)",
    src: "https://music.saffran.kr/%EB%A6%AC%ED%94%84%ED%8A%B8%EB%9D%BC%EC%8B%9C%EB%A5%B4%EC%9D%98%20%EC%98%9B%20%EB%85%B8%EB%9E%98%20(Bid%20Bid%2C%20O%20En)(%EB%9C%BB%ED%95%B4%EC%84%9D).m4a"
  }
];
