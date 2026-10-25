import { CHARACTERS, CLOTHES, CODE_GROUPS, imageUrl } from "./gallery-data.js";

function el(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text != null) node.textContent = text;
  return node;
}

/* 크게 보기: 같은 칸 안의 이미지끼리 ←/→ 로 넘긴다 */
const viewer = document.getElementById("viewer");
const viewerImg = viewer.querySelector("img");
const viewerCaption = viewer.querySelector(".viewer-caption");
let viewList = [];
let viewIndex = 0;
function showView(i) {
  viewIndex = (i + viewList.length) % viewList.length;
  const item = viewList[viewIndex];
  viewerImg.src = item.src;
  viewerImg.alt = item.caption;
  viewerCaption.textContent = item.caption;
}
function openViewer(list, i) {
  viewList = list;
  showView(i);
  viewer.hidden = false;
}
function closeViewer() {
  viewer.hidden = true;
  viewerImg.removeAttribute("src");
}
viewer.addEventListener("click", (e) => {
  if (e.target.closest(".viewer-prev")) return showView(viewIndex - 1);
  if (e.target.closest(".viewer-next")) return showView(viewIndex + 1);
  if (e.target === viewer || e.target.closest(".viewer-close")) closeViewer();
});
document.addEventListener("keydown", (e) => {
  if (viewer.hidden) return;
  if (e.key === "Escape") closeViewer();
  if (e.key === "ArrowLeft") showView(viewIndex - 1);
  if (e.key === "ArrowRight") showView(viewIndex + 1);
});

/* 부품: 코드 묶음 하나 (표정 / 행동 / 성인). 없는 이미지는 칸에서 빠진다 */
function createGroupGrid(character, clothes, group) {
  const grid = el("div", "gallery-grid");
  const empty = el("p", "gallery-none", "이 조합의 이미지가 아직 없어요.");
  empty.hidden = true;
  let pending = group.codes.length;
  let shown = 0;
  const settle = () => {
    pending -= 1;
    if (pending === 0 && shown === 0) empty.hidden = false;
  };

  const thumbs = [];
  group.codes.forEach(({ code, name }) => {
    const src = imageUrl(character, clothes, code);
    const caption = `${character.name} · ${clothes.name}${clothes.mark} · ${name}`;
    const btn = el("button", "gallery-thumb");
    btn.type = "button";
    const image = el("img");
    image.alt = caption;
    image.loading = "lazy";
    image.draggable = false;
    image.addEventListener("load", () => { shown += 1; settle(); }, { once: true });
    image.addEventListener("error", () => { btn.remove(); settle(); }, { once: true });
    image.src = src;
    btn.append(image, el("span", "gallery-caption", `${code} · ${name}`));
    const item = { src, caption, btn };
    thumbs.push(item);
    btn.addEventListener("click", () => {
      const live = thumbs.filter((t) => t.btn.isConnected);
      openViewer(live, live.indexOf(item));
    });
    grid.appendChild(btn);
  });

  const wrap = el("div", "gallery-codes");
  wrap.append(grid, empty);
  return wrap;
}

/* 부품: 의상 하나의 내용. 성인 코드는 버튼을 눌러야 펼쳐지고, 펼칠 때 불러온다 */
function createClothesPane(character, clothes) {
  const pane = el("div", "gallery-pane");
  for (const group of CODE_GROUPS) {
    if (group.locked) {
      const details = el("details", "secret gallery-adult");
      details.appendChild(el("summary", null, `${group.title} 코드 보기 (${group.codes.length})`));
      details.addEventListener("toggle", () => {
        if (details.open && !details.querySelector(".gallery-codes")) {
          details.appendChild(createGroupGrid(character, clothes, group));
        }
      });
      pane.appendChild(details);
    } else {
      pane.append(el("h3", "gallery-group-title", group.title), createGroupGrid(character, clothes, group));
    }
  }
  return pane;
}

/* 부품: 캐릭터 카드. 머리를 누르면 접고 펼친다(기본은 접힘).
   처음 펼칠 때 의상 탭을 만들고, 고른 의상의 이미지만 불러온다 */
function createCard(character) {
  const card = el("section", "gallery-card " + character.color);
  card.id = character.id;
  const head = el("button", "gallery-head");
  head.type = "button";
  head.setAttribute("aria-expanded", "false");
  head.append(el("h2", null, character.name), el("span", "gallery-sub", character.sub), el("span", "gallery-fold", "펼치기"));
  card.appendChild(head);

  const inner = el("div", "gallery-inner");
  inner.hidden = true;
  card.appendChild(inner);

  let built = false;
  const build = () => {
    const tabs = el("div", "gallery-tabs");
    const body = el("div", "gallery-body");
    const panes = new Map();
    const select = (clothes, btn) => {
      tabs.querySelectorAll(".gallery-tab").forEach((b) => {
        b.classList.toggle("active", b === btn);
        b.setAttribute("aria-pressed", String(b === btn));
      });
      if (!panes.has(clothes.code)) panes.set(clothes.code, createClothesPane(character, clothes));
      body.replaceChildren(panes.get(clothes.code));
    };
    let first = null;
    for (const clothes of CLOTHES) {
      const btn = el("button", "gallery-tab", `${clothes.mark} ${clothes.name}`);
      btn.type = "button";
      if (!clothes.ready) {
        btn.disabled = true;
        btn.title = "준비 중";
        btn.appendChild(el("span", "gallery-soon", "준비 중"));
      } else {
        btn.addEventListener("click", () => select(clothes, btn));
        if (!first) first = () => select(clothes, btn);
      }
      tabs.appendChild(btn);
    }
    inner.append(tabs, body);
    if (first) first();
  };

  const setOpen = (open) => {
    if (open && !built) { build(); built = true; }
    inner.hidden = !open;
    card.classList.toggle("open", open);
    head.setAttribute("aria-expanded", String(open));
    head.querySelector(".gallery-fold").textContent = open ? "접기" : "펼치기";
  };
  head.addEventListener("click", () => setOpen(inner.hidden));
  card.setOpen = setOpen;
  return card;
}

/* 검색: 이름 · 의상 · 표정/행위 이름 · 코드 번호를 띄어쓰기로 이어 찾는다 (예: "설윤 웃음", "누드 키스", "105").
   모든 낱말이 들어간 조합만 보여 주고, 없는 이미지는 빠진다 */
const SEARCH_PAGE = 60;
function searchItems(query) {
  const words = query.toLowerCase().split(/\s+/).filter(Boolean);
  const items = [];
  for (const character of CHARACTERS) {
    for (const clothes of CLOTHES) {
      if (!clothes.ready) continue;
      for (const group of CODE_GROUPS) {
        for (const { code, name } of group.codes) {
          const label = [character.name, character.sub, character.code, clothes.name, clothes.mark, clothes.code, group.title, name, String(code)].join(" ").toLowerCase();
          if (words.every((w) => label.includes(w))) {
            items.push({
              src: imageUrl(character, clothes, code),
              caption: `${character.name} · ${clothes.name}${clothes.mark} · ${name}`,
              short: `${character.name} · ${clothes.mark} ${code} · ${name}`,
              color: character.color
            });
          }
        }
      }
    }
  }
  return items;
}

function renderSearch(query) {
  const box = document.getElementById("gallery-results");
  box.replaceChildren();
  const q = query.trim();
  box.hidden = !q;
  document.getElementById("gallery").hidden = !!q;
  if (!q) return;

  const items = searchItems(q);
  const head = el("p", "gallery-result-count");
  box.appendChild(head);
  if (items.length === 0) { head.textContent = "맞는 조합이 없어요."; return; }

  const grid = el("div", "gallery-grid");
  box.appendChild(grid);
  let shownCount = 0;
  const thumbs = [];
  const update = () => { head.textContent = `‘${q}’ 검색 결과 · 조합 ${items.length}개 중 이미지가 있는 것만 보여요`; };
  const more = el("button", "gallery-more");
  more.type = "button";
  const addPage = () => {
    for (const item of items.slice(shownCount, shownCount + SEARCH_PAGE)) {
      const btn = el("button", "gallery-thumb " + item.color);
      btn.type = "button";
      const image = el("img");
      image.alt = item.caption;
      image.loading = "lazy";
      image.draggable = false;
      image.addEventListener("error", () => btn.remove(), { once: true });
      image.src = item.src;
      btn.append(image, el("span", "gallery-caption", item.short));
      const entry = { src: item.src, caption: item.caption, btn };
      thumbs.push(entry);
      btn.addEventListener("click", () => {
        const live = thumbs.filter((t) => t.btn.isConnected);
        openViewer(live, live.indexOf(entry));
      });
      grid.appendChild(btn);
    }
    shownCount = Math.min(items.length, shownCount + SEARCH_PAGE);
    more.hidden = shownCount >= items.length;
    more.textContent = `더 보기 (${items.length - shownCount}개 남음)`;
  };
  more.addEventListener("click", addPage);
  box.appendChild(more);
  update();
  addPage();
}

const root = document.getElementById("gallery");
root.appendChild(el("h2", "gallery-group", "마법숙녀"));
for (const c of CHARACTERS) root.appendChild(createCard(c));

const searchInput = document.getElementById("gallery-search");
let searchTimer = 0;
searchInput.addEventListener("input", () => {
  clearTimeout(searchTimer);
  searchTimer = setTimeout(() => renderSearch(searchInput.value), 200);
});
document.getElementById("gallery-results").addEventListener("contextmenu", (e) => { if (e.target.tagName === "IMG") e.preventDefault(); });

// 이미지 우클릭 저장·끌어서 저장을 조금 번거롭게 (완벽한 방지는 아님)
root.addEventListener("contextmenu", (e) => { if (e.target.tagName === "IMG") e.preventDefault(); });
viewer.addEventListener("contextmenu", (e) => { if (e.target.tagName === "IMG") e.preventDefault(); });
