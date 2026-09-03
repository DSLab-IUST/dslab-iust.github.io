export function prefersReducedMotion(): boolean {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export function hashScrollBehavior(): ScrollBehavior {
  return prefersReducedMotion() ? 'auto' : 'smooth';
}

/**
 * Scrolls to a hash target, waiting for an open `<dialog>` so the mobile menu
 * does not steal the scroll container. `#home` and a bare hash both go to top.
 */
export function scrollToHash(
  hash: string,
  behavior: ScrollBehavior = hashScrollBehavior(),
): void {
  const go = (): void => {
    const id = hash.replace(/^#/, '');
    if (!id || id === 'home') {
      const home = document.getElementById('home');
      if (home) {
        home.scrollIntoView({ behavior, block: 'start' });
        return;
      }
      window.scrollTo({ top: 0, behavior });
      return;
    }

    document.getElementById(id)?.scrollIntoView({ behavior, block: 'start' });
  };

  const dialog = document.querySelector<HTMLDialogElement>('dialog[open]');
  if (dialog) {
    dialog.addEventListener('close', () => requestAnimationFrame(go), { once: true });
    return;
  }

  requestAnimationFrame(go);
}
