import { CHARACTERS } from "./characters-data.js";
import { initCharToggle, initScrollSpy } from "../../js/detail.js";

/* 부품: 등장인물 카드 하나 */
function createCharSection(character) {
  const section = document.createElement("section");
  section.id = character.id;
  section.className = "char-section";

  const img = document.createElement("img");
  img.className = "char-portrait";
  img.src = character.portrait;
  img.alt = character.name + " 초상 이미지";

  const body = document.createElement("div");
  const h2 = document.createElement("h2");
  h2.textContent = character.name;
  const role = document.createElement("p");
  role.className = "char-role";
  role.textContent = character.role;
  const desc = document.createElement("p");
  desc.textContent = character.desc;

  body.append(h2, role, desc);
  section.append(img, body);
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
