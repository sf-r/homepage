// Saffron — 책장에 꽂힐 작품 데이터.
// safe: true 인 책은 safe 모드가 켜져 있으면 제목이 가려지고 뽑을 수 없다.
// detailUrl 이 없으면 아직 상세 페이지가 준비되지 않은 예시 항목.

export const GENRES_LEFT = ["로맨스 판타지", "현대 로맨스"];
export const GENRES_RIGHT = ["BL", "무협"];

export const BOOKS = [
  {
    id: "gongnyeo",
    title: "참교육 못하는 공녀님",
    genre: "로맨스 판타지",
    safe: false,
    spine: { bg: "#7a2038", emblem: "❦", height: 210, width: 46 },
    cover: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=600&q=80",
    description: "공작가의 공녀는 오늘도 참교육에 실패한다. 사고뭉치 집안을 어떻게든 굴려보려는 공녀와, 그런 그녀를 놀리는 데 도가 튼 사람들의 이야기.",
    detailUrl: "pages/gongnyeo/index.html"
  },
  {
    id: "moonlit-vow",
    title: "달빛 서약",
    genre: "현대 로맨스",
    safe: false,
    spine: { bg: "#1f3b4d", emblem: "☾", height: 195, width: 42 },
    cover: "https://images.unsplash.com/photo-1495467033336-2effc0a04b09?w=600&q=80",
    description: "10년 만에 재회한 두 사람, 그리고 그때 끝맺지 못한 약속. (예시 항목 — 상세 페이지 준비 중)",
    detailUrl: null
  },
  {
    id: "ashfall",
    title: "재의 계절",
    genre: "무협",
    safe: true,
    spine: { bg: "#2e2620", emblem: "劍", height: 225, width: 44 },
    cover: "https://images.unsplash.com/photo-1502084400208-fb99cbb2b3b1?w=600&q=80",
    description: "성인 독자 대상의 강렬한 장면이 포함된 작품. (예시 항목 — safe 모드로 가려짐)",
    detailUrl: null
  },
  {
    id: "hollow-crown",
    title: "속 빈 왕관",
    genre: "BL",
    safe: true,
    spine: { bg: "#4a1f42", emblem: "♛", height: 205, width: 40 },
    cover: "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=600&q=80",
    description: "성인 독자 대상의 강렬한 장면이 포함된 작품. (예시 항목 — safe 모드로 가려짐)",
    detailUrl: null
  },
  {
    id: "paper-lantern",
    title: "종이 등불",
    genre: "현대 로맨스",
    safe: false,
    spine: { bg: "#8a6a2c", emblem: "✿", height: 185, width: 38 },
    cover: "https://images.unsplash.com/photo-1519452575417-564c1401ecc0?w=600&q=80",
    description: "작은 서점을 지키는 사람과, 매일 같은 시간에 찾아오는 손님. (예시 항목 — 상세 페이지 준비 중)",
    detailUrl: null
  }
];
