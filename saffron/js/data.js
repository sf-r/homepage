// Saffron — 책장에 꽂힐 작품 데이터.
// safe: true 인 책은 safe 모드가 켜져 있으면 제목이 가려지고 뽑을 수 없다.
// detailUrl 이 없으면 아직 상세 페이지가 준비되지 않은 예시 항목.

export const GENRES_LEFT = ["로맨스 판타지", "현대 로맨스", "현대 판타지"];
export const GENRES_RIGHT = ["무협"];

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
    id: "three-futures",
    title: "세 개의 미래에서 온 그녀들",
    genre: "현대 판타지",
    safe: true,
    spine: { bg: "#2b2f5c", emblem: "✦", height: 220, width: 46 },
    cover: "https://saffran.kr/Thumbnail/%EC%84%B8%20%EA%B0%9C%EC%9D%98%20%EB%AF%B8%EB%9E%98%EC%97%90%EC%84%9C%20%EC%98%A8%20%EA%B7%B8%EB%85%80%EB%93%A4.webp",
    description: "30일 뒤 서울 하늘에 열리는 시간의 균열 앞에서, 당신의 선택이 세 미래 중 하나를 확정한다. 그 세 미래가 저마다 회귀자를 한 명씩 보냈고, 셋은 서로의 존재를 몰랐다.",
    detailUrl: "pages/three-futures/index.html"
  }
];
