// 음악 플레이어 재생목록.
// src는 Cloudflare R2 버킷의 공개 URL이어야 합니다. (README '음악 플레이어(R2)' 항목 참고)
// 아래는 예시이며, 실제 올려둔 파일명/제목으로 바꿔서 쓰세요.

export const TRACKS = [
  {
    id: "track-1",
    title: "곡 제목을 입력하세요 1",
    src: "https://music.saffran.kr/track-1.mp3"
  },
  {
    id: "track-2",
    title: "곡 제목을 입력하세요 2",
    src: "https://music.saffran.kr/track-2.mp3"
  },
  {
    id: "track-3",
    title: "곡 제목을 입력하세요 3",
    src: "https://music.saffran.kr/track-3.mp3"
  }
];
