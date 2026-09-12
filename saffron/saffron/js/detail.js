// 작품 상세페이지 공통 로직.
// 1) 사이드바의 '등장인물' 항목을 누르면 하위 인물 목록을 펼친다.
// 2) 본문을 스크롤하면 현재 보고 있는 섹션에 맞춰 사이드바 표시가 자동으로 바뀐다.

export function initCharToggle() {
  const toggleBtn = document.querySelector("[data-toggle-sublist]");
  if (!toggleBtn) return;
  const sublist = document.getElementById(toggleBtn.getAttribute("aria-controls"));

  toggleBtn.addEventListener("click", () => {
    const expanded = sublist.classList.toggle("expanded");
    toggleBtn.setAttribute("aria-expanded", String(expanded));
  });
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

  const observer = new IntersectionObserver(
    (entries) => {
      // 화면에서 가장 위쪽에 걸쳐 있는 섹션을 현재 섹션으로 판단
      const visible = entries
        .filter((e) => e.isIntersecting)
        .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
      if (visible.length > 0) {
        clearAll();
        map.get(visible[0].target).classList.add("active");
      }
    },
    { rootMargin: "-30% 0px -55% 0px", threshold: 0 }
  );

  for (const el of map.keys()) observer.observe(el);
}
