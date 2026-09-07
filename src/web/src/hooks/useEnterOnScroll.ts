import { useEffect } from "react";

const ENTERED = "data-in";

function pending() {
  return document.querySelectorAll(`.enter:not([${ENTERED}])`);
}

function markEntered(el: Element) {
  el.setAttribute(ENTERED, "");
  el.classList.add("is-in");
}

export function useEnterOnScroll() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      pending().forEach(markEntered);
      return;
    }

    if (!("IntersectionObserver" in window)) {
      pending().forEach(markEntered);
      return;
    }

    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        markEntered(entry.target);
        io.unobserve(entry.target);
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -6% 0px" });

    const observe = () => {
      pending().forEach((el) => io.observe(el));
    };

    const frame = requestAnimationFrame(observe);
    const root = document.getElementById("root") ?? document.body;
    const mo = new MutationObserver(observe);
    mo.observe(root, { childList: true, subtree: true });

    return () => {
      cancelAnimationFrame(frame);
      io.disconnect();
      mo.disconnect();
    };
  }, []);
}
