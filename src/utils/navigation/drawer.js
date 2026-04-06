import { spring } from "./spring.js";

const drawers = new Map();

export function registerDrawer(id, el) {
  const overlay = el.querySelector("[data-overlay]");
  const panel = el.querySelector("[data-panel]");
  const side = panel.dataset.side;

  function open() {
    el.classList.remove("hidden");
    document.body.classList.add("overflow-hidden");

    spring({
      from: side === "left" ? -100 : 100,
      to: 0,
      onUpdate: (v) => {
        panel.style.transform = `translateX(${v}%)`;
        overlay.style.opacity = Math.min(0.5, Math.abs(v) / 200);
      },
    });
  }

  function close() {
    spring({
      from: 0,
      to: side === "left" ? -100 : 100,
      onUpdate: (v) => {
        panel.style.transform = `translateX(${v}%)`;
        overlay.style.opacity = Math.min(0.5, Math.abs(v) / 200);
      },
    });

    setTimeout(() => {
      el.classList.add("hidden");
      document.body.classList.remove("overflow-hidden");
    }, 200);
  }

  overlay.addEventListener("click", close);

  el.querySelectorAll("[data-close]").forEach((btn) =>
    btn.addEventListener("click", close)
  );

  drawers.set(id, { open, close });
  return { open, close };
}

/* ESC support */
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    drawers.forEach((d) => d.close());
  }
});