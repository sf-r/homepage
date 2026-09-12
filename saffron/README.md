# Saffron

책장에서 책을 뽑아 펼쳐보는 컨셉의 개인 홈페이지. 순수 HTML/CSS/JS로 만들어져
빌드 과정 없이 그대로 깃허브 + Cloudflare Pages로 서비스할 수 있습니다.

## 폴더 구조

```
saffron/
├── index.html              메인 서재 페이지
├── css/
│   ├── tokens.css          공통 색상·폰트 변수
│   ├── main.css            메인 페이지(헤더, 책장, 펼쳐진 책) 스타일
│   ├── detail.css          작품 상세페이지 공통 레이아웃 (모든 작품이 재사용)
│   └── player.css          음악 플레이어 위젯 스타일 (모든 페이지가 재사용)
├── js/
│   ├── data.js             책장에 꽂힐 책 목록 데이터
│   ├── main.js             메인 페이지 로직 (safe 토글, 책 렌더링, 펼치기)
│   ├── detail.js           상세페이지 공통 로직 (사이드바 스크롤스파이 등)
│   ├── music-player.js     음악 플레이어 공통 로직 (initMusicPlayer(tracks))
│   └── music-data.js       메인 페이지 전용 재생목록
└── pages/
    └── gongnyeo/            '참교육 못하는 공녀님' 상세페이지
        ├── index.html       세계관 + 모드 (한 페이지, 스크롤)
        ├── characters.html  등장인물 (한 페이지, 스크롤)
        ├── characters.js
        ├── characters-data.js
        ├── music-data.js    이 작품 전용 재생목록 (메인 페이지와 다른 목록)
        └── gongnyeo-theme.css   이 작품만의 색/장식
```

## 배포 방법 (GitHub + Cloudflare Pages)

- 저장소: `sf-r/homepage`
- 서비스 도메인: `homepage.saffran.kr`

1. 이 `saffron` 폴더 전체 내용을 `sf-r/homepage` 저장소 루트에 커밋·푸시합니다.
2. Cloudflare 대시보드 → **Workers & Pages → Pages → Create → Connect to Git**
   에서 `sf-r/homepage` 저장소를 선택합니다.
3. 빌드 설정: **Build command는 비워두고, Output directory는 `/`** 로 지정합니다
   (빌드 과정이 없는 순수 정적 사이트라서 그대로 서빙됩니다).
4. 배포된 Pages 프로젝트의 **Custom domains**에서 `homepage.saffran.kr`을 연결합니다.

## 음악 플레이어 (R2 버킷)

오른쪽 하단 플레이어는 `<audio>` 태그로 곡을 재생하기 때문에, R2 버킷 파일이
**공개 URL**로 접근 가능해야 합니다. (버킷이 비공개면 파일이 재생되지 않습니다.)

플레이어는 재생/일시정지, 소리 on/off, 음량 슬라이더, 재생목록(♫) 네 가지로
구성되어 있고 **소리는 기본적으로 꺼진 상태**로 시작합니다. 방문자가 소리
아이콘을 눌러야 들리기 시작해요.

작품마다 다른 곡을 틀 수 있도록, 재생목록은 페이지가 아니라 **각 폴더의
`music-data.js`** 에서 따로 관리합니다.

- 메인 페이지 재생목록 → `js/music-data.js`
- '참교육 못하는 공녀님' 재생목록 → `pages/gongnyeo/music-data.js`
  (`index.html`과 `characters.html`이 같은 목록을 공유합니다)

새 작품 상세페이지를 만들 때도 그 폴더 안에 `music-data.js`를 하나 만들고,
HTML 맨 아래 스크립트에서 `import { TRACKS } from "./music-data.js"` 로
불러와 `initMusicPlayer(TRACKS)`를 호출하면 그 작품만의 재생목록이 붙습니다.

1. Cloudflare 대시보드 → **R2 → 해당 버킷 → Settings → Custom Domains** 에서
   서브도메인을 하나 연결합니다. 예: `music.saffran.kr`
   (이미 `saffran.kr`을 Cloudflare에서 관리 중이라 DNS 레코드가 자동으로 추가됩니다.)
2. 연결이 끝나면 파일은 `https://music.saffran.kr/파일명.mp3` 형태의 URL로 열립니다.
   작품별로 폴더를 나누고 싶다면 `https://music.saffran.kr/gongnyeo/track-1.mp3`
   처럼 경로를 나눠도 됩니다 (예시 데이터가 이 형태로 되어 있어요).
3. 각 `music-data.js` 의 `TRACKS` 배열을 실제 파일명·제목으로 채웁니다.

   ```js
   export const TRACKS = [
     { id: "t1", title: "곡 제목", src: "https://music.saffran.kr/song1.mp3" },
     // ...
   ];
   ```

4. 곡을 추가/삭제하고 싶으면 이 배열에 항목을 더하거나 지우면 됩니다. 재생목록
   버튼(♫)을 누르면 이 목록이 그대로 뜨고, 클릭하면 재생됩니다. 한 곡이 끝나면
   다음 곡으로 자동 재생됩니다.
5. 지금은 메인 페이지와 '참교육 못하는 공녀님' 상세페이지에 플레이어가 있습니다.
   다른 상세페이지에도 넣고 싶다면 해당 HTML에 `css/player.css` 링크와 플레이어
   마크업, 그리고 그 폴더의 `music-data.js`를 만들어 `initMusicPlayer(TRACKS)`를
   호출하는 스크립트를 추가하면 됩니다. 다만 이 사이트는 SPA가 아니라 페이지
   이동 시 새로고침되는 구조라, 페이지를 옮기면 재생 중이던 곡은 멈추고 처음부터
   다시 선택해야 합니다.

## 책 새로 추가하기

`js/data.js` 의 `BOOKS` 배열에 항목을 하나 추가하면 자동으로 책장에 나타납니다.

```js
{
  id: "new-book",
  title: "작품 제목",
  genre: "장르명",
  safe: false,               // true면 safe 모드 켜졌을 때 가려짐
  spine: { bg: "#3a5f4a", emblem: "❧", height: 200, width: 42 },
  cover: "https://.../표지이미지.jpg",   // 외부 이미지 URL
  description: "책 뒤표지 느낌의 짧은 소개",
  detailUrl: "pages/새폴더/index.html"   // 상세페이지 없으면 null
}
```

헤더의 장르 목록은 `js/data.js` 상단의 `GENRES_LEFT` / `GENRES_RIGHT` 배열에서
관리합니다.

## 새 작품의 상세페이지 만들기

1. `pages/새작품이름/` 폴더를 만들고 `pages/gongnyeo/` 의 `index.html`,
   `characters.html`, `characters.js`, `characters-data.js`, `music-data.js`
   를 복사해 내용을 바꿉니다. (`css/detail.css`, `js/music-player.js` 는 그대로
   재사용됩니다.)
2. `gongnyeo-theme.css` 처럼 그 작품만의 `테마이름-theme.css` 를 새로 만들어
   `--work-bg`, `--work-header-bg`, `--work-accent`, `--work-accent-bright`
   네 가지 변수만 다시 정의하면 전체 색감이 바뀝니다. 장식 요소(인장 배지 등)를
   더하거나 빼는 것도 이 파일에서 자유롭게 할 수 있습니다.
3. `js/data.js` 의 해당 책 항목에 `detailUrl` 을 새 폴더의 `index.html` 로
   연결합니다.

## safe 모드 동작 방식

- 기본값은 ON이며 브라우저에 저장되어 다음 방문에도 유지됩니다.
- ON일 때 `safe: true` 인 책은 제목이 보이지 않고 책장에서 뽑을 수 없습니다.
- OFF로 바꾸면 책장 조명이 놋쇠빛에서 장밋빛으로 바뀌고, 가려졌던 책도
  뽑아서 펼쳐볼 수 있습니다.
