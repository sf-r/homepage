import { CHARACTERS } from "./characters-data.js";
import { initCharToggle, initScrollSpy } from "../../js/detail.js";

/* 부품: 초상화 (이미지가 없으면 이름 첫 글자 카드) */
function createPortrait(character) {
  if (character.portrait) {
    const img = document.createElement("img");
    img.className = "char-portrait";
    img.src = character.portrait;
    img.alt = character.name + " 초상 이미지";
    return img;
  }
  const card = document.createElement("div");
  card.className = "char-portrait char-monogram " + character.future;
  card.setAttribute("aria-hidden", "true");
  card.textContent = character.name.slice(-1);
  return card;
}

/* 부품: 등장인물 카드 하나 */
function createCharSection(character) {
  const section = document.createElement("section");
  section.id = character.id;
  section.className = "char-section " + character.future;

  const body = document.createElement("div");
  const h2 = document.createElement("h2");
  h2.textContent = character.name;
  const role = document.createElement("p");
  role.className = "char-role";
  role.textContent = character.role;

  const facts = document.createElement("dl");
  facts.className = "char-facts";
  for (const [k, v] of character.facts) {
    const dt = document.createElement("dt");
    dt.textContent = k;
    const dd = document.createElement("dd");
    dd.textContent = v;
    facts.append(dt, dd);
  }

  const desc = document.createElement("p");
  desc.textContent = character.desc;

  body.append(h2, role, facts, desc);
  section.append(createPortrait(character), body);
  return section;
}

function init() {
  const list = document.getElementById("char-list");
  for (const c of CHARACTERS) {
    list.appendChild(createCharSection(c));
  }

  initCharToggle();
  initScrollSpy(
    CHARACTERS.map((c) => ({ id: c.id, navItemSelector: `[data-char="${c.id}"]` }))
  );
}

document.addEventListener("DOMContentLoaded", init);
