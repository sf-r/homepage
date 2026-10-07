// 현재 언어의 인물 데이터를 불러오고, 사이드바 '등장인물' 하위 목록을 채운다.
import { getLang } from "../../js/i18n.js";

export async function loadGroups() {
  const lang = getLang();
  const file = lang === "ko" ? "./characters-data.js" : `./characters-data.${lang}.js`;
  const mod = await import(file);
  return mod.GROUPS;
}

/* prefix: 다른 페이지로 가는 링크면 "characters.html", 같은 페이지면 "" */
export function fillCharSublist(groups, prefix) {
  const list = document.getElementById("char-sublist");
  if (!list) return;
  list.replaceChildren();
  for (const g of groups) {
    if (g.characters.length === 0) continue;
    const label = document.createElement("li");
    label.className = "sublist-label";
    label.textContent = g.title;
    list.appendChild(label);
    for (const c of g.characters) {
      const li = document.createElement("li");
      li.dataset.char = c.id;
      const a = document.createElement("a");
      a.href = `${prefix}#${c.id}`;
      a.textContent = c.name;
      li.appendChild(a);
      list.appendChild(li);
    }
  }
}
