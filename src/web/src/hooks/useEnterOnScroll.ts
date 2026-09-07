import { useEffect } from "react";

export function useEnterOnScroll() {
  useEffect(() => {
    const nodes = () => document.querySelectorAll(".enter:not(.is-in)");

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      nodes().forEach((el) => el.classList.add("is-in"));
      return;
    }

    if (!("IntersectionObserver" in window)) {
      nodes().forEach((el) => el.classList.add("is-in"));
      return;
    }

    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-in");
        io.unobserve(entry.target);
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -6% 0px" });

    const observe = () => {
      nodes().forEach((el) => io.observe(el));
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
