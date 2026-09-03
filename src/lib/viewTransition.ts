type TransitionKind = 'theme' | 'locale';

interface TransitionVariables {
  /** Origin of the circular wipe, as CSS lengths or percentages. */
  originX?: string;
  originY?: string;
  /** `1` when the incoming layout reads left-to-right, `-1` otherwise. */
  direction?: number;
}

const supportsViewTransitions = (): boolean => 'startViewTransition' in document;

const prefersReducedMotion = (): boolean =>
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/**
 * Wraps a DOM mutation in a View Transition so theme and language swaps animate
 * as one composited frame instead of a per-element cascade. Browsers without
 * support — and visitors who ask for less motion — get the plain update, which
 * still cross-fades through the token transitions declared in base.css.
 */
export function runViewTransition(
  kind: TransitionKind,
  update: () => void,
  variables: TransitionVariables = {},
): void {
  const root = document.documentElement;

  if (!supportsViewTransitions() || prefersReducedMotion()) {
    update();
    return;
  }

  if (variables.originX) root.style.setProperty('--transition-origin-x', variables.originX);
  if (variables.originY) root.style.setProperty('--transition-origin-y', variables.originY);
  if (variables.direction) {
    root.style.setProperty('--transition-direction', String(variables.direction));
  }

  root.dataset.transition = kind;

  const transition = document.startViewTransition(update);
  void transition.finished.finally(() => {
    delete root.dataset.transition;
  });
}
