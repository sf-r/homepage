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
    └── gongnyeo/            '참교육 못하는 공녀님' 상세페이지 (한국어 전용, 성인)
        ├── index.html       소개 · 세계관 · 실비아 · 주변 인물 · 저택의 하루 · 모드 · 조교와 변화 · 업적
        ├── crest.svg        배경에서 천천히 도는 공작가 장미창
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
- 곡에 `character: "인물 id"` 를 적으면 등장인물 페이지의 그 인물 이름 아래에 '♪ 테마곡 재생하기'
  버튼이 생깁니다. 누르면 소리를 켜고 그 곡을 바로 재생합니다. 한 인물에 곡이 여럿이면
  `themeLabel: "ver.1"` 처럼 버튼 이름을 구분합니다.
  인물이 아닌 곳에 두려면 `after: "CSS 선택자"` 와 `button: "버튼 문구"` 를 적습니다.
  그 요소 바로 아래에 버튼이 붙습니다. (예: Re:Bloomlution 전체 테마곡은 세계관 첫 문단 아래,
  비드비드 오엔은 리프트라시르 마을 카드 안) (예: `pages/three-futures/music-data.js`,
  `pages/rebloom/music-data.js`)
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
  genres: ["romance-fantasy"],   // GENRES 의 키, 여러 개 가능
  safe: false,               // true면 safe 모드 켜졌을 때 가려짐
  spine: { bg: "#3a5f4a", emblem: "❧", height: 200, width: 42 },
  cover: "https://.../표지이미지.jpg",   // 외부 이미지 URL
  description: "책 뒤표지 느낌의 짧은 소개",
  detailUrl: "pages/새폴더/index.html"   // 상세페이지 없으면 null
}
```

헤더의 장르 목록은 지금 책장에 꽂힌 책들의 `genres` 로 자동으로 채워집니다.
장르 이름(언어별)과 순서는 `js/data.js` 상단의 `GENRES` 에서 관리합니다.
헤더에서 장르를 누르면 그 장르의 책이 강조되고, 다시 누르면 풀립니다.
Safe ON으로 가려진 책도 까만 책 그대로 강조됩니다 (제목은 여전히 가려지고 펼쳐지지 않음).

## 새 작품의 상세페이지 만들기

1. `pages/새작품이름/` 폴더를 만들고 비슷한 작품 폴더(예: 등장인물 페이지가
   따로 있는 `pages/three-futures/`, 한 페이지짜리 `pages/gongnyeo/`)의 파일을
   복사해 내용을 바꿉니다. (`css/detail.css`, `js/music-player.js` 는 그대로
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

## 다국어 (한국어 · English · 日本語)

모든 페이지 오른쪽 위(메인은 왼쪽 위)의 `KO · EN · JA` 버튼으로 언어를 바꿀 수 있습니다.
고른 언어는 브라우저에 저장되고, 처음 방문하면 브라우저 언어(한국어/영어/일본어)를 따릅니다.

- 공통 로직과 짧은 UI 문구: `js/i18n.js`
- 한국어는 각 HTML에 적힌 원문이 그대로 쓰이고, 영어·일본어는 사전에서 덮어씁니다.
  HTML 요소의 `data-i18n="키"`가 사전의 키와 이어집니다.
- 메인 책장·장르: `js/data.js`의 각 항목 `i18n: { en, ja }`
- 작품별 페이지 사전: `pages/<작품>/i18n.js`
- '세 개의 미래에서 온 그녀들' 인물은 언어판마다 이름·장소가 달라서 파일이 나뉘어 있습니다:
  `characters-data.js`(한국어, 서울) · `characters-data.en.js`(영어, 뉴욕) · `characters-data.ja.js`(일본어, 도쿄).
  세 파일은 같은 id·같은 구조이니, 인물을 고치면 세 파일을 함께 고쳐 주세요.

## 책장 표시 옵션 (`js/data.js`)

- `safe: true` — Safe ON이면 제목이 가려지고 뽑을 수 없음
- `langs: ["ko"]` — 그 언어로 볼 때만 책장에 나옴 (없으면 모든 언어)
- `spineTitle` — 책등에 쓸 짧은 제목, `cover: null` — 펼쳤을 때 표지 이미지 숨김

예: 「신세계 프로젝트 마법숙녀 Re:Bloomlution」(`pages/rebloom/`)은 한국어로 볼 때만 꽂히는 한국어판 전용 작품이고, Safe ON이면 다른 safe 책처럼 제목 없는 까만 책으로 꽂혀 있습니다.

## 아카라이브 전용 페이지 (Cloudflare Worker)

`pages/rebloom/gallery/`(Re:Bloomlution 캐릭터 이미지 미리보기)는 **아카라이브(arca.live)에서 링크를 눌러 들어온 경우에만** 열립니다.

- 검사 코드는 저장소 루트의 `src/worker.js`, 검사할 경로는 `wrangler.jsonc`의 `run_worker_first`.
- 아카라이브에서 들어오면 1시간짜리 입장 쿠키가 생겨, 그동안은 새로고침·이미지 보기가 됩니다.
- 주소를 직접 치거나 다른 곳에서 공유된 링크로 오면 안내 페이지(403)가 뜹니다.
- 갤러리는 캔버스와 같은 규칙으로 `https://saffran.kr/blo/(캐릭터)-(의상)-(코드).webp` 를 불러옵니다.
  의상 탭은 👚 a · 🪄 m · 💥 d · 🔓 r · 🍑 n, 코드는 표정 · 행동 · 🔞 성인(버튼을 눌러야 펼쳐짐) 전부이고,
  없는 이미지는 칸에서 자동으로 빠집니다. 💥 d · 🔓 r 은 지금 '준비 중'이라, 이미지를 올린 뒤
  `gallery-data.js` 의 `CLOTHES` 에서 `ready: true` 로 바꾸면 열립니다.
- 이 이미지는 바깥 주소라 입장 검사를 받지 않습니다. 같은 보호를 받게 하려면 `pages/rebloom/gallery/img/`에
  넣고 `BASE` 를 `img/` 로 바꾸면 됩니다.
- 사이트 안 다른 페이지에서 이 페이지로 링크하면 막히니, 링크는 아카라이브 글에만 겁니다.
- 선택: Cloudflare 대시보드 → Workers → homepage → Settings → Variables and Secrets에 `GALLERY_SECRET`(아무 긴 문자열)을 넣으면 쿠키 서명 키로 씁니다.
