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
