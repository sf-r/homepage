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

/* 부품: 캐릭터 카드 (의상 탭 · 선택한 의상만 불러온다) */
function createCard(character) {
  const card = el("section", "gallery-card " + character.color);
  card.id = character.id;
  const head = el("div", "gallery-head");
  head.append(el("h2", null, character.name), el("span", "gallery-sub", character.sub));
  card.appendChild(head);

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
  card.append(tabs, body);
  if (first) first();
  return card;
}

const root = document.getElementById("gallery");
root.appendChild(el("h2", "gallery-group", "마법숙녀"));
for (const c of CHARACTERS) root.appendChild(createCard(c));

// 이미지 우클릭 저장·끌어서 저장을 조금 번거롭게 (완벽한 방지는 아님)
root.addEventListener("contextmenu", (e) => { if (e.target.tagName === "IMG") e.preventDefault(); });
viewer.addEventListener("contextmenu", (e) => { if (e.target.tagName === "IMG") e.preventDefault(); });
