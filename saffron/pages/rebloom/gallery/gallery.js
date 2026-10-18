import { GALLERY } from "./gallery-data.js";

function el(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text != null) node.textContent = text;
  return node;
}

/* 크게 보기 */
const viewer = document.getElementById("viewer");
const viewerImg = viewer.querySelector("img");
const viewerCaption = viewer.querySelector(".viewer-caption");
function openViewer(src, caption) {
  viewerImg.src = src;
  viewerImg.alt = caption;
  viewerCaption.textContent = caption;
  viewer.hidden = false;
}
function closeViewer() {
  viewer.hidden = true;
  viewerImg.removeAttribute("src");
}
viewer.addEventListener("click", (e) => { if (e.target === viewer || e.target.closest(".viewer-close")) closeViewer(); });
document.addEventListener("keydown", (e) => { if (e.key === "Escape" && !viewer.hidden) closeViewer(); });

function createCard(c) {
  const card = el("section", "gallery-card " + c.color);
  card.id = c.id;
  const head = el("div", "gallery-head");
  head.append(el("h2", null, c.name), el("span", "gallery-sub", c.sub || ""));
  card.appendChild(head);

  const grid = el("div", "gallery-grid");
  if (c.images.length === 0) {
    const empty = el("div", "gallery-empty");
    empty.append(el("span", "gallery-empty-mark", c.name.slice(-1)), el("span", null, "이미지 준비 중"));
    grid.appendChild(empty);
  }
  for (const img of c.images) {
    const caption = img.caption ? `${c.name} · ${img.caption}` : c.name;
    const btn = el("button", "gallery-thumb");
    btn.type = "button";
    const image = el("img");
    image.src = img.src;
    image.alt = caption;
    image.loading = "lazy";
    image.draggable = false;
    btn.appendChild(image);
    if (img.caption) btn.appendChild(el("span", "gallery-caption", img.caption));
    btn.addEventListener("click", () => openViewer(img.src, caption));
    grid.appendChild(btn);
  }
  card.appendChild(grid);
  return card;
}

const root = document.getElementById("gallery");
for (const g of GALLERY) {
  root.appendChild(el("h2", "gallery-group", g.group));
  for (const c of g.characters) root.appendChild(createCard(c));
}

// 이미지 우클릭 저장·끌어서 저장을 조금 번거롭게 (완벽한 방지는 아님)
root.addEventListener("contextmenu", (e) => { if (e.target.tagName === "IMG") e.preventDefault(); });
viewer.addEventListener("contextmenu", (e) => { if (e.target.tagName === "IMG") e.preventDefault(); });
