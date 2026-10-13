import { GROUPS, CHARACTERS } from "./characters-data.js";
import { initCharToggle, initScrollSpy } from "../../js/detail.js";
import { fillCharSublist } from "./nav.js";

function el(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text != null) node.textContent = text;
  return node;
}

/* 부품: 초상화 (이미지가 없으면 이름 끝 글자 카드) */
function createPortrait(character) {
  if (character.portrait) {
    const img = el("img", "char-portrait");
    img.src = character.portrait;
    img.alt = character.name + " 초상 이미지";
    return img;
  }
  const card = el("div", "char-portrait char-monogram", character.name.slice(-1));
  card.setAttribute("aria-hidden", "true");
  return card;
}

/* 부품: 버튼을 눌러야 열리는 비밀. when이 있으면 조건 → 내용 2단계로 연다 */
function createSecret(title, when, body) {
  const details = el("details", "secret");
  const summary = el("summary", null, when ? `${title} · 조건 보기` : `${title} · 비밀 보기`);
  const box = el("div", "secret-body");

  const paragraphs = body.map((text) => el("p", null, text));
  if (when) {
    box.appendChild(el("p", "secret-when", "드러나는 때 · " + when));
    const inner = el("details", "secret inner");
    inner.appendChild(el("summary", null, "내용 보기"));
    const innerBox = el("div", "secret-body");
    innerBox.append(...paragraphs);
    inner.appendChild(innerBox);
    box.appendChild(inner);
  } else {
    box.append(...paragraphs);
  }

  details.append(summary, box);
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

  (character.stages || []).forEach((stage, i) => {
    body.appendChild(createSecret(`비밀 ${i + 1}단계`, stage.when, stage.body));
  });
  for (const note of character.notes || []) {
    body.appendChild(createSecret(note.title, null, note.body));
  }

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
