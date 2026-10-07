import { initCharToggle, initScrollSpy } from "../../js/detail.js";
import { ui, applyPageText, mountLangSwitcher } from "../../js/i18n.js";
import { PAGE_TEXT } from "./i18n.js";
import { loadGroups, fillCharSublist } from "./nav.js";

/* 부품: 초상화 (이미지가 없으면 이름 끝 글자 카드) */
function createPortrait(character) {
  if (character.portrait) {
    const img = document.createElement("img");
    img.className = "char-portrait";
    img.src = character.portrait;
    img.alt = ui("portraitAlt", { name: character.name });
    return img;
  }
  const card = document.createElement("div");
  card.className = "char-portrait char-monogram";
  card.setAttribute("aria-hidden", "true");
  card.textContent = character.name.slice(-1);
  return card;
}

/* 부품: 버튼을 눌러야 열리는 비밀 */
function createSecret(secret) {
  const details = document.createElement("details");
  details.className = "secret";
  const summary = document.createElement("summary");
  summary.textContent = ui("secretShow", { title: secret.title });
  const body = document.createElement("div");
  body.className = "secret-body";
  for (const text of secret.body) {
    const p = document.createElement("p");
    p.textContent = text;
    body.appendChild(p);
  }
  if (secret.when) {
    const when = document.createElement("p");
    when.className = "secret-when";
    when.textContent = ui("secretWhen", { when: secret.when });
    body.appendChild(when);
  }
  details.append(summary, body);
  return details;
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
  body.append(h2, role);

  if (character.facts.length > 0) {
    const facts = document.createElement("dl");
    facts.className = "char-facts";
    for (const [k, v] of character.facts) {
      const dt = document.createElement("dt");
      dt.textContent = k;
      const dd = document.createElement("dd");
      dd.textContent = v;
      facts.append(dt, dd);
    }
    body.appendChild(facts);
  }

  const desc = document.createElement("p");
  desc.textContent = character.desc;
  body.appendChild(desc);

  for (const secret of character.secrets) {
    body.appendChild(createSecret(secret));
  }

  section.append(createPortrait(character), body);
  return section;
}

/* 부품: 회귀자 / 비회귀자 / 모드 인물 칸 */
function createGroup(group) {
  const wrap = document.createElement("div");
  wrap.className = "char-group";
  wrap.id = group.id;
  const h = document.createElement("h2");
  h.className = "char-group-title";
  h.textContent = group.title;
  const d = document.createElement("p");
  d.className = "char-group-desc";
  d.textContent = group.desc;
  wrap.append(h, d);
  for (const c of group.characters) {
    wrap.appendChild(createCharSection(c));
  }
  return wrap;
}

async function init() {
  applyPageText(PAGE_TEXT);
  mountLangSwitcher(document.getElementById("lang-slot"));

  const groups = await loadGroups();
  fillCharSublist(groups, "");

  const list = document.getElementById("char-list");
  for (const g of groups) {
    if (g.characters.length === 0) continue;
    list.appendChild(createGroup(g));
  }

  initCharToggle();
  initScrollSpy(
    groups.flatMap((g) => g.characters).map((c) => ({ id: c.id, navItemSelector: `[data-char="${c.id}"]` }))
  );

  // 다른 페이지에서 #인물 링크로 들어온 경우, 카드가 그려진 뒤 그 위치로 이동
  if (location.hash) document.getElementById(location.hash.slice(1))?.scrollIntoView();
}

init();
