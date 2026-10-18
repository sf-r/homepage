import { GENRES, BOOKS as RAW_BOOKS } from "./data.js";
import { ui, loc, getLang, applyPageText, mountLangSwitcher } from "./i18n.js";

const BOOKS = RAW_BOOKS.map(loc);

const SAFE_KEY = "saffron-safe";

/* ---------- 부품: 장르 리스트 ---------- */
// 지금 언어로 책장에 꽂히는 책들의 장르만, GENRES 에 적힌 순서대로
function shelfBooks() {
  const lang = getLang();
  return BOOKS.filter((b) => !b.langs || b.langs.includes(lang));
}

function usedGenres() {
  const used = new Set(shelfBooks().flatMap((b) => b.genres || []));
  return Object.keys(GENRES).filter((id) => used.has(id));
}

function createGenreList(ids, alignRight) {
  const ul = document.createElement("ul");
  ul.className = "genre-nav" + (alignRight ? " right" : "");
  for (const id of ids) {
    const li = document.createElement("li");
    const a = document.createElement("a");
    a.href = "#";
    a.dataset.genre = id;
    a.textContent = GENRES[id][getLang()] || GENRES[id].ko;
    a.addEventListener("click", (e) => {
      e.preventDefault();
      setActiveGenre(activeGenre === id ? null : id);
    });
    li.appendChild(a);
    ul.appendChild(li);
  }
  return ul;
}

// 장르가 많아 양옆 버튼(언어 · Safe)이나 서로와 겹치면 장르를 아랫줄로 내린다
function fitGenreNav() {
  const header = document.querySelector(".site-header");
  header.classList.remove("genres-wrap");
  const overlaps = (a, b) => a && b && a.left < b.right && b.left < a.right && a.top < b.bottom && b.top < a.bottom;
  const boxes = [...header.querySelectorAll(".genre-nav li")].map((li) => li.getBoundingClientRect());
  const others = ["#lang-slot", "#safe-toggle", ".wordmark"]
    .map((sel) => header.querySelector(sel)?.getBoundingClientRect());
  const clipped = [...header.querySelectorAll(".genre-nav")].some((ul) => ul.scrollWidth > ul.clientWidth + 1);
  if (clipped || boxes.some((box) => others.some((o) => overlaps(box, o)))) header.classList.add("genres-wrap");
}

/* ---------- 장르 강조 ---------- */
// 장르를 누르면 그 장르의 책이 튀어나와 빛나고, 나머지는 어두워진다. 다시 누르면 풀림.
let activeGenre = null;

function setActiveGenre(id) {
  activeGenre = id;
  document.querySelectorAll(".genre-nav a").forEach((a) => {
    const on = a.dataset.genre === id;
    a.classList.toggle("active", on);
    a.setAttribute("aria-pressed", String(on));
  });
  applyGenreHighlight();
}

function applyGenreHighlight() {
  const root = document.getElementById("shelf-rows");
  root.classList.toggle("genre-filtering", activeGenre !== null);
  root.querySelectorAll(".book-spine").forEach((btn) => {
    const genres = (btn.dataset.genres || "").split(" ");
    btn.classList.toggle("genre-hit", activeGenre !== null && genres.includes(activeGenre));
  });
}

/* ---------- 부품: 책 한 권(책등) ---------- */
function createBookSpine(book, safeOn) {
  const hidden = book.safe && safeOn;
  const btn = document.createElement("button");
  btn.className = "book-spine";
  btn.style.background = hidden
    ? "linear-gradient(180deg, #2a241f, #201b17)"
    : `linear-gradient(180deg, ${book.spine.bg}, ${shade(book.spine.bg, -18)})`;
  btn.style.height = book.spine.height + "px";
  btn.style.width = book.spine.width + "px";
  btn.disabled = hidden;
  btn.dataset.genres = (book.genres || []).join(" ");
  btn.setAttribute("aria-label", hidden ? ui("hiddenBook") : book.title);

  if (!hidden) {
    const emblem = document.createElement("span");
    emblem.className = "spine-emblem";
    emblem.textContent = book.spine.emblem;
    btn.appendChild(emblem);

    const title = document.createElement("span");
    title.className = "spine-title";
    title.textContent = book.spineTitle || book.title;
    btn.appendChild(title);

    btn.addEventListener("click", () => openSpread(book));
  }

  return btn;
}

function shade(hex, percent) {
  const n = parseInt(hex.slice(1), 16);
  const r = Math.max(0, Math.min(255, (n >> 16) + percent));
  const g = Math.max(0, Math.min(255, ((n >> 8) & 0xff) + percent));
  const b = Math.max(0, Math.min(255, (n & 0xff) + percent));
  return `rgb(${r}, ${g}, ${b})`;
}

/* ---------- 책장 렌더링 ---------- */
function renderShelves(safeOn) {
  const root = document.getElementById("shelf-rows");
  root.innerHTML = "";

  // 현재 언어(langs)에 맞는 책만 꽂고, Safe ON에서도 볼 수 있는 책(safe: false)을 맨 윗줄 앞쪽에 둔다
  const books = shelfBooks().sort((a, b) => Number(!!a.safe) - Number(!!b.safe));
  const rows = [books.slice(0, 3), books.slice(3)];
  for (const row of rows) {
    if (row.length === 0) continue;
    const shelfRow = document.createElement("div");
    shelfRow.className = "shelf-row";

    const spines = document.createElement("div");
    spines.className = "spines";
    for (const book of row) {
      spines.appendChild(createBookSpine(book, safeOn));
    }

    const plank = document.createElement("div");
    plank.className = "plank";

    shelfRow.append(spines, plank);
    root.appendChild(shelfRow);
  }
  applyGenreHighlight();
}

/* ---------- 책 펼치기(스프레드) ---------- */
function openSpread(book) {
  const overlay = document.getElementById("spread-overlay");
  overlay.querySelector(".spread-title").textContent = book.title;
  const cover = overlay.querySelector(".spread-cover");
  cover.hidden = !book.cover;
  if (book.cover) cover.src = book.cover;
  cover.alt = ui("coverAlt", { title: book.title });
  overlay.querySelector(".spread-desc").textContent = book.description;

  const link = overlay.querySelector(".detail-link");
  if (book.detailUrl) {
    link.href = book.detailUrl;
    link.textContent = ui("openDetail");
    link.style.display = "inline-block";
  } else {
    link.style.display = "none";
  }

  overlay.classList.add("open");
}

function closeSpread() {
  document.getElementById("spread-overlay").classList.remove("open");
}

/* ---------- safe 토글 ---------- */
// 새로 접속할 때마다 Safe ON으로 시작하도록, 끈 상태는 같은 탭 안에서만 기억합니다.
function getSafeState() {
  try { localStorage.removeItem(SAFE_KEY); } catch {}
  let stored = null;
  try { stored = sessionStorage.getItem(SAFE_KEY); } catch {}
  return stored === null ? true : stored === "true";
}

function applySafeState(safeOn) {
  const toggle = document.getElementById("safe-toggle");
  const shelfRoom = document.getElementById("shelf-room");
  toggle.dataset.safe = safeOn ? "on" : "off";
  shelfRoom.dataset.safe = safeOn ? "on" : "off";
  toggle.querySelector(".label").textContent = safeOn ? ui("safeOn") : ui("safeOff");
  renderShelves(safeOn);
}

function initSafeToggle() {
  let safeOn = getSafeState();
  applySafeState(safeOn);

  document.getElementById("safe-toggle").addEventListener("click", () => {
    safeOn = !safeOn;
    try { sessionStorage.setItem(SAFE_KEY, String(safeOn)); } catch {}
    applySafeState(safeOn);
  });
}

/* ---------- 초기화 ---------- */
const PAGE_TEXT = {
  en: {
    pageTitle: "Saffron",
    introTitle: "Welcome to the study",
    introText: "Tap a book to open it. Turn off the Safe switch on the right and the lights change, letting you pull out the books that were hidden.",
    close: "Close",
    openDetail: "View details"
  },
  ja: {
    pageTitle: "Saffron",
    introTitle: "書斎へようこそ",
    introText: "本をタップして開いてみてください。右の Safe スイッチを切ると照明が変わり、隠れていた本も取り出せます。",
    close: "閉じる",
    openDetail: "詳細を見る"
  }
};

function init() {
  applyPageText(PAGE_TEXT);
  mountLangSwitcher(document.getElementById("lang-slot"));
  // 장르를 워드마크 양옆으로 반씩 나눠 단다
  const genres = usedGenres();
  const half = Math.ceil(genres.length / 2);
  document.getElementById("genre-left").replaceWith(createGenreList(genres.slice(0, half), false));
  document.getElementById("genre-right").replaceWith(createGenreList(genres.slice(half), true));
  fitGenreNav();
  window.addEventListener("resize", fitGenreNav);
  document.fonts?.ready.then(fitGenreNav);

  initSafeToggle();

  document.getElementById("spread-close").addEventListener("click", closeSpread);
  document.querySelector(".backdrop-close").addEventListener("click", closeSpread);
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeSpread();
  });
}

document.addEventListener("DOMContentLoaded", init);
