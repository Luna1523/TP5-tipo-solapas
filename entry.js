const horizontalTabs = Array.from(document.querySelectorAll(".horizontal-tab"));

horizontalTabs.forEach((tab) => {
  const trigger = tab.querySelector(".horizontal-trigger");
  trigger.addEventListener("click", (event) => {
    const isActive = tab.classList.contains("is-active");
    if (isActive && !event.target.closest(".trigger-mark")) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (isActive) {
      tab.classList.add("is-closing");
      tab.classList.remove("is-expanded");
      trigger.setAttribute("aria-expanded", "false");
      window.setTimeout(() => {
        tab.classList.add("is-resetting");
        tab.classList.remove("is-active", "is-closing");
        document.body.classList.remove("has-open-tab");
        requestAnimationFrame(() => tab.classList.remove("is-resetting"));
      }, reducedMotion ? 0 : 600);
      return;
    }

    const rect = tab.getBoundingClientRect();
    const questionRect = trigger.querySelector("span:first-child").getBoundingClientRect();
    const activeQuestionTop = window.innerWidth <= 760 ? 24 : 26;
    tab.style.setProperty("--open-top", `${Math.max(0, rect.top)}px`);
    tab.style.setProperty("--open-bottom", `${Math.max(0, window.innerHeight - rect.bottom)}px`);
    tab.style.setProperty("--question-shift", `${questionRect.top - activeQuestionTop}px`);
    tab.classList.add("is-active");
    trigger.setAttribute("aria-expanded", "true");
    document.body.classList.add("has-open-tab");

    requestAnimationFrame(() => {
      requestAnimationFrame(() => tab.classList.add("is-expanded"));
    });
  });
});
