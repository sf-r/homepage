// 다국어(한국어 · English · 日本語) 공통 로직.
//
// - 한국어는 HTML에 적힌 원문이 그대로 쓰이고, 다른 언어는 사전에서 덮어씁니다.
// - HTML 요소: data-i18n="키"      → 내용(innerHTML)을 사전 값으로 바꿈
//              data-i18n-attr="aria-label:키,alt:키" → 속성을 사전 값으로 바꿈
// - JS 데이터(책·인물): 항목에 i18n: { en: {...}, ja: {...} } 를 두면 loc()가 겹쳐 줍니다.
// - 언어를 바꾸면 저장한 뒤 페이지를 새로 불러옵니다.

const KEY = "saffron-lang";

export const LANGS = [
  ["ko", "한국어", "KO"],
  ["en", "English", "EN"],
  ["ja", "日本語", "JA"]
];

const SUPPORTED = LANGS.map(([code]) => code);

export function getLang() {
  let stored = null;
  try { stored = localStorage.getItem(KEY); } catch {}
  if (SUPPORTED.includes(stored)) return stored;
  const nav = (navigator.language || "ko").slice(0, 2).toLowerCase();
  return SUPPORTED.includes(nav) ? nav : "ko";
}

export function setLang(lang) {
  try { localStorage.setItem(KEY, lang); } catch {}
  location.reload();
}

/* 여러 페이지가 함께 쓰는 짧은 문구 */
const UI = {
  ko: {
    hiddenBook: "가려진 책",
    coverAlt: "{title} 표지 이미지",
    openDetail: "상세정보로 이동",
    safeOn: "Safe ON",
    safeOff: "Safe OFF",
    pickTrack: "재생목록에서 곡을 선택하세요",
    noTracks: "등록된 곡이 없어요",
    portraitAlt: "{name} 초상 이미지",
    secretShow: "{title} · 비밀 보기",
    secretWhen: "드러나는 때 · {when}",
    language: "언어",
    close: "닫기",
    playPause: "재생 또는 일시정지",
    muteToggle: "소리 켜기/끄기",
    openPlaylist: "재생목록 열기",
    volume: "음량 조절",
    seek: "재생 위치"
  },
  en: {
    hiddenBook: "Hidden book",
    coverAlt: "Cover of {title}",
    openDetail: "View details",
    safeOn: "Safe ON",
    safeOff: "Safe OFF",
    pickTrack: "Pick a track from the playlist",
    noTracks: "No tracks yet",
    portraitAlt: "Portrait of {name}",
    secretShow: "{title} · Reveal secret",
    secretWhen: "Revealed when · {when}",
    language: "Language",
    close: "Close",
    playPause: "Play or pause",
    muteToggle: "Sound on/off",
    openPlaylist: "Open playlist",
    volume: "Volume",
    seek: "Playback position"
  },
  ja: {
    hiddenBook: "隠された本",
    coverAlt: "{title}の表紙",
    openDetail: "詳細を見る",
    safeOn: "Safe ON",
    safeOff: "Safe OFF",
    pickTrack: "プレイリストから曲を選んでください",
    noTracks: "曲がまだありません",
    portraitAlt: "{name}の肖像",
    secretShow: "{title} · 秘密を見る",
    secretWhen: "明かされる時 · {when}",
    language: "言語",
    close: "閉じる",
    playPause: "再生・一時停止",
    muteToggle: "サウンドのオン/オフ",
    openPlaylist: "プレイリストを開く",
    volume: "音量",
    seek: "再生位置"
  }
};

export function ui(key, vars = {}) {
  const table = UI[getLang()] || UI.ko;
  let text = table[key] ?? UI.ko[key] ?? key;
  for (const [k, v] of Object.entries(vars)) text = text.replace(`{${k}}`, v);
  return text;
}

/* JS 데이터 항목에 현재 언어 번역을 겹친다 */
export function loc(item) {
  const lang = getLang();
  if (lang === "ko" || !item.i18n || !item.i18n[lang]) return item;
  return { ...item, ...item.i18n[lang] };
}

/* 페이지 사전: { en: { 키: "..." }, ja: { 키: "..." } } */
export function applyPageText(dict = {}) {
  const lang = getLang();
  document.documentElement.lang = lang;
  const table = dict[lang];
  if (lang !== "ko" && table) {
    for (const el of document.querySelectorAll("[data-i18n]")) {
      const value = table[el.dataset.i18n];
      if (value != null) el.innerHTML = value;
    }
    for (const el of document.querySelectorAll("[data-i18n-attr]")) {
      for (const pair of el.dataset.i18nAttr.split(",")) {
        const [attr, key] = pair.split(":").map((s) => s.trim());
        if (table[key] != null) el.setAttribute(attr, table[key]);
      }
    }
    // 등장인물 페이지는 <body data-title-key="pageTitleChars">로 다른 제목을 쓴다
    const titleKey = document.body.dataset.titleKey || "pageTitle";
    if (table[titleKey]) document.title = table[titleKey];
  }
  document.documentElement.classList.remove("i18n-loading");
}

/* 언어 선택 버튼 (KO · EN · JA) */
export function mountLangSwitcher(target) {
  if (!target) return;
  const current = getLang();
  const wrap = document.createElement("div");
  wrap.className = "lang-switch";
  wrap.setAttribute("role", "group");
  wrap.setAttribute("aria-label", ui("language"));
  for (const [code, name, short] of LANGS) {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.textContent = short;
    btn.title = name;
    btn.lang = code;
    btn.setAttribute("aria-pressed", String(code === current));
    if (code !== current) btn.addEventListener("click", () => setLang(code));
    wrap.appendChild(btn);
  }
  target.replaceChildren(wrap);
}
