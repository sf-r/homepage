import { GROUPS, CHARACTERS } from "./characters-data.js";
import { initCharToggle, initScrollSpy } from "../../js/detail.js";
import { fillCharSublist } from "./nav.js";

function el(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text != null) node.textContent = text;
  return node;
}

/* 부품: 이름 끝 글자 카드 (이미지가 없거나 못 불러올 때) */
function createMonogram(character) {
  const card = el("div", "char-portrait char-monogram", character.name.slice(-1));
  card.setAttribute("aria-hidden", "true");
  return card;
}

/* 부품: 초상화. portraits 가 여럿이면 아래 버튼(평상복 · 변신, 인간형, TS 등)으로 바꿔 볼 수 있다.
   첫 이미지를 못 불러오면 이름 끝 글자 카드로 대신한다. */
function createPortrait(character) {
  const portraits = character.portraits || [];
  if (portraits.length === 0) return createMonogram(character);

  const wrap = el("div", "char-portrait-wrap");
  const img = el("img", "char-portrait");
  img.loading = "lazy";
  const show = (p) => {
    img.src = p.src;
    img.alt = `${character.name} · ${p.label}`;
  };
  show(portraits[0]);
  img.addEventListener("error", () => {
    if (img.getAttribute("src") === portraits[0].src) wrap.replaceWith(createMonogram(character));
  });
  wrap.appendChild(img);

  if (portraits.length > 1) {
    const tabs = el("div", "portrait-tabs");
    portraits.forEach((p, i) => {
      const btn = el("button", "portrait-tab" + (i === 0 ? " active" : ""), p.label);
      btn.type = "button";
      btn.setAttribute("aria-pressed", String(i === 0));
      btn.addEventListener("click", () => {
        show(p);
        tabs.querySelectorAll(".portrait-tab").forEach((b) => {
          b.classList.toggle("active", b === btn);
          b.setAttribute("aria-pressed", String(b === btn));
        });
      });
      tabs.appendChild(btn);
    });
    wrap.appendChild(tabs);
  }
  return wrap;
}

/* 부품: 인물 하나의 숨김 버튼 (약점 · 비밀 단계 · 기타 비밀을 하나로 묶는다).
   비밀 단계는 조건까지만 보이고, 내용은 단계마다 '내용 보기'를 한 번 더 눌러야 열린다. */
function createSecretBox(character) {
  const weak = character.weak || [];
  const stages = character.stages || [];
  const notes = character.notes || [];
  if (weak.length + stages.length + notes.length === 0) return null;

  const details = el("details", "secret char-secret");
  details.appendChild(el("summary", null, `${character.name} · 비밀 보기`));
  const box = el("div", "secret-body");

  if (weak.length > 0) {
    box.appendChild(el("h4", "secret-heading", "몸의 약점"));
    const dl = el("dl", "secret-facts");
    for (const [k, v] of weak) dl.append(el("dt", null, k), el("dd", null, v));
    box.appendChild(dl);
  }

  if (stages.length > 0) {
    box.appendChild(el("h4", "secret-heading", "감춰 둔 것"));
    stages.forEach((stage, i) => {
      const item = el("div", "secret-stage");
      item.appendChild(el("p", "secret-stage-title", `${i + 1}단계`));
      item.appendChild(el("p", "secret-when", "드러나는 때 · " + stage.when));
      const inner = el("details", "secret inner");
      inner.appendChild(el("summary", null, "내용 보기"));
      const innerBox = el("div", "secret-body");
      innerBox.append(...stage.body.map((t) => el("p", null, t)));
      inner.appendChild(innerBox);
      item.appendChild(inner);
      box.appendChild(item);
    });
  }

  for (const note of notes) {
    box.appendChild(el("h4", "secret-heading", note.title));
    box.append(...note.body.map((t) => el("p", null, t)));
  }

  details.appendChild(box);
  return details;
}

/* 부품: 등장인물 카드 하나 */
function createCharSection(character) {
  const section = el("section", "char-section " + character.color);
  section.id = character.id;

  const body = el("div");
  body.append(el("h2", null, character.name), el("p", "char-role", character.role));

  if (character.facts.length > 0) {
    const facts = el("dl", "char-facts");
    for (const [k, v] of character.facts) facts.append(el("dt", null, k), el("dd", null, v));
    body.appendChild(facts);
  }

  body.appendChild(el("p", null, character.desc));

  const secretBox = createSecretBox(character);
  if (secretBox) body.appendChild(secretBox);

  section.append(createPortrait(character), body);
  return section;
}

/* 부품: 마법숙녀 / 소울파트너 / 세력의 인물 칸 */
function createGroup(group) {
  const wrap = el("div", "char-group");
  wrap.id = group.id;
  wrap.append(el("h2", "char-group-title", group.title), el("p", "char-group-desc", group.desc));
  for (const c of group.characters) wrap.appendChild(createCharSection(c));
  return wrap;
}

function init() {
  fillCharSublist(GROUPS, "");

  const list = document.getElementById("char-list");
  for (const g of GROUPS) {
    if (g.characters.length === 0) continue;
    list.appendChild(createGroup(g));
  }

  initCharToggle();
  initScrollSpy(CHARACTERS.map((c) => ({ id: c.id, navItemSelector: `[data-char="${c.id}"]` })));

  // 다른 페이지에서 #인물 링크로 들어온 경우, 카드가 그려진 뒤 그 위치로 이동
  if (location.hash) document.getElementById(location.hash.slice(1))?.scrollIntoView();
}

init();
