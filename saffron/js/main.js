import { GENRES_LEFT, GENRES_RIGHT, BOOKS as RAW_BOOKS } from "./data.js";
import { ui, loc, getLang, applyPageText, mountLangSwitcher } from "./i18n.js";

const BOOKS = RAW_BOOKS.map(loc);

const SAFE_KEY = "saffron-safe";

/* ---------- 부품: 장르 리스트 ---------- */
function createGenreList(items, alignRight) {
  const ul = document.createElement("ul");
  ul.className = "genre-nav" + (alignRight ? " right" : "");
  for (const g of items) {
    const li = document.createElement("li");
    const a = document.createElement("a");
    a.href = "#";
    a.textContent = g[getLang()] || g.ko;
    li.appendChild(a);
    ul.appendChild(li);
  }
  return ul;
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
  btn.setAttribute("aria-label", hidden ? ui("hiddenBook") : book.title);

  if (!hidden) {
    const emblem = document.createElement("span");
    emblem.className = "spine-emblem";
    emblem.textContent = book.spine.emblem;
    btn.appendChild(emblem);

    const title = document.createElement("span");
    title.className = "spine-title";
    title.textContent = book.title;
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

  const rows = [BOOKS.slice(0, 3), BOOKS.slice(3)];
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
}

/* ---------- 책 펼치기(스프레드) ---------- */
function openSpread(book) {
  const overlay = document.getElementById("spread-overlay");
  overlay.querySelector(".spread-title").textContent = book.title;
  overlay.querySelector(".spread-cover").src = book.cover;
  overlay.querySelector(".spread-cover").alt = ui("coverAlt", { title: book.title });
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
  document.getElementById("genre-left").replaceWith(createGenreList(GENRES_LEFT, false));
  document.getElementById("genre-right").replaceWith(createGenreList(GENRES_RIGHT, true));

  initSafeToggle();

  document.getElementById("spread-close").addEventListener("click", closeSpread);
  document.querySelector(".backdrop-close").addEventListener("click", closeSpread);
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeSpread();
  });
}

document.addEventListener("DOMContentLoaded", init);
