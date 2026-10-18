// Saffron — 책장에 꽂힐 작품 데이터.
// safe: true 인 책은 safe 모드가 켜져 있으면 제목이 가려지고 뽑을 수 없다.
// langs: ["ko"] 처럼 적으면 그 언어로 볼 때만 책장에 나온다 (없으면 모든 언어).
// spineTitle 이 있으면 책등에는 그걸 쓴다 ("\n"으로 줄을 직접 나눌 수 있다). cover 가 null 이면 표지 이미지를 숨긴다.
// detailUrl 이 없으면 아직 상세 페이지가 준비되지 않은 예시 항목.

// 장르 이름은 언어별로 적습니다. 책의 genres 에는 여기 키를 적고,
// 헤더에는 지금 책장에 꽂힌 책들이 가진 장르만 이 순서대로 나옵니다.
export const GENRES = {
  "romance-fantasy": { ko: "로맨스 판타지", en: "Romance Fantasy", ja: "ロマンスファンタジー" },
  "urban-fantasy": { ko: "현대 판타지", en: "Urban Fantasy", ja: "現代ファンタジー" },
  mystery: { ko: "미스터리", en: "Mystery", ja: "ミステリー" },
  comedy: { ko: "코미디", en: "Comedy", ja: "コメディ" },
  regression: { ko: "회귀", en: "Regression", ja: "回帰" },
  "magical-girl": { ko: "마법소녀", en: "Magical Girl", ja: "魔法少女" },
  adventure: { ko: "모험", en: "Adventure", ja: "冒険" },
  training: { ko: "조교", en: "Training", ja: "調教" }
};

// 각 책의 i18n 안에 en / ja 번역을 두면, 그 언어로 볼 때 덮어씁니다.

export const BOOKS = [
  {
    id: "gongnyeo",
    title: "참교육 못하는 공녀님",
    genres: ["romance-fantasy", "comedy", "training"],
    safe: true,
    langs: ["ko"],
    spine: { bg: "#7a2038", emblem: "❦", height: 210, width: 46 },
    cover: "https://saffran.kr/Thumbnail/6a410b6471b40c3c42220f7c_ko.gif",
    description: "1:1, 메스가키, 공녀님, 여캐플 존재.",
    detailUrl: "pages/gongnyeo/index.html"
  },
  {
    id: "three-futures",
    title: "세 개의 미래에서 온 그녀들",
    genres: ["urban-fantasy", "regression", "mystery"],
    safe: true,
    spine: { bg: "#2b2f5c", emblem: "✦", height: 250, width: 46 },
    cover: "https://saffran.kr/Thumbnail/%EC%84%B8%20%EA%B0%9C%EC%9D%98%20%EB%AF%B8%EB%9E%98%EC%97%90%EC%84%9C%20%EC%98%A8%20%EA%B7%B8%EB%85%80%EB%93%A4.webp",
    description: "30일 뒤 서울 하늘에 열리는 시간의 균열 앞에서, 당신의 선택이 세 미래 중 하나를 확정한다. 그 세 미래가 저마다 회귀자를 한 명씩 보냈고, 셋은 서로의 존재를 몰랐다.",
    detailUrl: "pages/three-futures/index.html",
    i18n: {
      en: {
        title: "Those Who Came from Three Futures",
        description: "Thirty days from now, a rift in time will open in the sky over New York, and your choice before it will lock in one of three futures. Each of those futures has sent back one returner, and none of the three knew the others existed."
      },
      ja: {
        title: "三つの未来から来た彼女たち",
        description: "三十日後、東京の空に開く時間の裂け目。その前でのあなたの選択が、三つの未来のうちひとつを確定させる。三つの未来はそれぞれ一人ずつ回帰者を送り込み、三人は互いの存在を知らなかった。"
      }
    }
  },
  {
    id: "rebloom",
    title: "신세계 프로젝트 마법숙녀 Re:Bloomlution",
    spineTitle: "신세계 프로젝트\n마법숙녀 Re:Bloomlution",
    genres: ["urban-fantasy", "magical-girl", "mystery", "training"],
    safe: true,
    langs: ["ko"],
    spine: { bg: "#5a2a5e", emblem: "✿", height: 250, width: 54 },
    cover: null,
    description: "몇 번이나 무너졌는지 모를 도시, 신세계특별시. 다섯 마법숙녀는 저마다 비밀을 품었고, 그중 한 명은 모든 것을 꾸민 흑막이다. 종말 시계가 다 돌기 전에, 흑막을 지목하라.",
    detailUrl: "pages/rebloom/index.html"
  },
  {
    id: "arcana",
    title: "Arcana: The Witch's Fate",
    spineTitle: "Arcana\nThe Witch's Fate",
    genres: ["romance-fantasy", "adventure", "mystery"],
    safe: true,
    langs: ["ko"],
    spine: { bg: "#4a2050", emblem: "☾", height: 236, width: 50 },
    cover: "https://saffran.kr/Thumbnail/6a867a39dc4c071093b3f38c_ko.gif",
    description: "순애와 NTR 모드 선택 가능, 마녀의 운명을 결정하라.",
    detailUrl: "pages/arcana/index.html"
  }
];
