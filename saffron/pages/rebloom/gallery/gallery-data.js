// 「신세계 프로젝트 마법숙녀 Re:Bloomlution」 캐릭터 이미지 미리보기 목록.
//
// 이 폴더(pages/rebloom/gallery/)는 아카라이브에서 링크로 들어온 사람만 볼 수 있습니다.
// (검사는 저장소 루트의 src/worker.js)
// 이미지는 같은 폴더의 img/ 안에 넣고 src에 "img/파일이름"으로 적으면,
// 이미지 파일도 같은 검사를 받아서 주소만 복사해서는 열리지 않습니다.
// 바깥 주소(https://...)를 적으면 그 이미지는 검사 없이 누구나 열 수 있으니 주의하세요.
//
// images 가 빈 배열이면 "이미지 준비 중"으로 보입니다.

export const GALLERY = [
  {
    group: "마법숙녀",
    characters: [
      { id: "seolyun", name: "강설윤", sub: "실버 하울", color: "silver", images: [] },
      { id: "ayane", name: "시라토리 아야네", sub: "하쿠후", color: "violet", images: [] },
      { id: "melinoe", name: "멜리노에", sub: "녹턴 베일", color: "shadow", images: [] },
      { id: "nolwenn", name: "놀웬", sub: "아쿠아 다후트 No.7", color: "teal", images: [] },
      { id: "liv", name: "리브", sub: "룬라이트", color: "rune", images: [] }
    ]
  }
  // 예: { src: "img/seolyun-1.webp", caption: "평상복" }
];
