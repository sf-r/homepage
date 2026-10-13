// 작품 상세페이지 공통 로직.
// 1) 사이드바의 '등장인물' 항목을 누르면 하위 인물 목록을 펼친다.
// 2) 본문을 스크롤하면 현재 보고 있는 섹션에 맞춰 사이드바 표시가 자동으로 바뀌고,
//    사이드바(PC는 세로, 모바일은 가로 탭 줄)도 그 항목이 보이는 곳으로 따라 움직인다.

export function initCharToggle() {
  const toggleBtn = document.querySelector("[data-toggle-sublist]");
  if (!toggleBtn) return;
  const sublist = document.getElementById(toggleBtn.getAttribute("aria-controls"));

  toggleBtn.addEventListener("click", () => {
    const expanded = sublist.classList.toggle("expanded");
    toggleBtn.setAttribute("aria-expanded", String(expanded));
  });
}

/* 항목이 안 보이면, 그 항목을 품은 스크롤 영역(사이드바·탭 줄)만 움직여 가운데쯤 보이게 한다.
   scrollIntoView는 페이지 전체까지 움직여서 쓰지 않는다. */
function revealInSidebar(item) {
  let doneY = false;
  let doneX = false;
  let node = item.parentElement;
  while (node && node !== document.body && !(doneY && doneX)) {
    const style = getComputedStyle(node);
    const canY = !doneY && /(auto|scroll)/.test(style.overflowY) && node.scrollHeight > node.clientHeight;
    const canX = !doneX && /(auto|scroll)/.test(style.overflowX) && node.scrollWidth > node.clientWidth;
    const box = node.getBoundingClientRect();
    const r = item.getBoundingClientRect();
    // 가장 가까운 스크롤 영역 하나만 축마다 움직인다 (모바일에서 위쪽 탭 줄까지 끌려가지 않게)
    if (canY) {
      doneY = true;
      if (r.top < box.top || r.bottom > box.bottom) {
        node.scrollTo({ top: node.scrollTop + (r.top - box.top) - (box.height - r.height) / 2, behavior: "smooth" });
      }
    }
    if (canX) {
      doneX = true;
      if (r.left < box.left || r.right > box.right) {
        node.scrollTo({ left: node.scrollLeft + (r.left - box.left) - (box.width - r.width) / 2, behavior: "smooth" });
      }
    }
    node = node.parentElement;
  }
}

/**
 * sections: [{ id: 'world', navItemSelector: '[data-nav="world"]' }, ...]
 * 스크롤에 따라 해당 nav-item(또는 li)에 'active' 클래스를 토글한다.
 */
export function initScrollSpy(sections) {
  const map = new Map();
  for (const s of sections) {
    const el = document.getElementById(s.id);
    const nav = document.querySelector(s.navItemSelector);
    if (el && nav) map.set(el, nav);
  }
  if (map.size === 0) return;

  const clearAll = () => {
    for (const nav of map.values()) nav.classList.remove("active");
  };

  const entriesList = [...map.entries()];
  const [, lastNav] = entriesList[entriesList.length - 1];
  const atBottom = () =>
    window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4;
  const activate = (nav) => {
    if (nav.classList.contains("active")) return;
    clearAll();
    nav.classList.add("active");
    revealInSidebar(nav);
  };

  const observer = new IntersectionObserver(
    (entries) => {
      // 페이지 맨 끝에서는 감지 띠에 닿지 못하는 마지막 항목을 켠다
      if (atBottom()) return activate(lastNav);
      // 화면에서 가장 위쪽에 걸쳐 있는 섹션을 현재 섹션으로 판단
      const visible = entries
        .filter((e) => e.isIntersecting)
        .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
      if (visible.length > 0) activate(map.get(visible[0].target));
    },
    { rootMargin: "-30% 0px -55% 0px", threshold: 0 }
  );

  for (const el of map.keys()) observer.observe(el);

  window.addEventListener("scroll", () => { if (atBottom()) activate(lastNav); }, { passive: true });
}
