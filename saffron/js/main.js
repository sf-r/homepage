import { GENRES_LEFT, GENRES_RIGHT, BOOKS } from "./data.js";

const SAFE_KEY = "saffron-safe";

/* ---------- 부품: 장르 리스트 ---------- */
function createGenreList(items, alignRight) {
  const ul = document.createElement("ul");
  ul.className = "genre-nav" + (alignRight ? " right" : "");
  for (const g of items) {
    const li = document.createElement("li");
    const a = document.createElement("a");
    a.href = "#";
    a.textContent = g;
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
  btn.setAttribute("aria-label", hidden ? "가려진 책" : book.title);

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
  overlay.querySelector(".spread-cover").alt = book.title + " 표지 이미지";
  overlay.querySelector(".spread-desc").textContent = book.description;

  const link = overlay.querySelector(".detail-link");
  if (book.detailUrl) {
    link.href = book.detailUrl;
    link.textContent = "상세정보로 이동";
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
function getSafeState() {
  const stored = localStorage.getItem(SAFE_KEY);
  return stored === null ? true : stored === "true";
}

function applySafeState(safeOn) {
  const toggle = document.getElementById("safe-toggle");
  const shelfRoom = document.getElementById("shelf-room");
  toggle.dataset.safe = safeOn ? "on" : "off";
  shelfRoom.dataset.safe = safeOn ? "on" : "off";
  toggle.querySelector(".label").textContent = safeOn ? "Safe ON" : "Safe OFF";
  renderShelves(safeOn);
}

function initSafeToggle() {
  let safeOn = getSafeState();
  applySafeState(safeOn);

  document.getElementById("safe-toggle").addEventListener("click", () => {
    safeOn = !safeOn;
    localStorage.setItem(SAFE_KEY, String(safeOn));
    applySafeState(safeOn);
  });
}

/* ---------- 초기화 ---------- */
function init() {
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
