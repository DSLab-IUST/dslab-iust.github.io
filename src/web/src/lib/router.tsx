import { createContext, useContext, useEffect, useMemo, useState, type MouseEvent, type ReactNode } from "react";
import { PATHS } from "@/lib/site";

export type Route =
  | { name: "home" }
  | { name: "lab" }
  | { name: "university" }
  | { name: "people" }
  | { name: "member"; slug: string }
  | { name: "notfound" };

export function parsePath(pathname: string): Route {
  const path = pathname.replace(/\/+$/, "") || "/";
  if (path === PATHS.home) return { name: "home" };
  if (path === PATHS.lab) return { name: "lab" };
  if (path === PATHS.university) return { name: "university" };
  if (path === PATHS.people) return { name: "people" };
  const match = path.match(/^\/people\/([^/]+)$/);
  if (match) return { name: "member", slug: decodeURIComponent(match[1]) };
  return { name: "notfound" };
}

export function navigate(to: string) {
  const url = new URL(to, window.location.origin);
  if (url.origin !== window.location.origin) {
    window.location.assign(to);
    return;
  }
  const next = url.pathname + url.search + url.hash;
  const current = window.location.pathname + window.location.search + window.location.hash;
  if (next !== current) {
    window.history.pushState({}, "", next);
    window.dispatchEvent(new PopStateEvent("popstate"));
  }
  if (url.hash) {
    requestAnimationFrame(() => document.querySelector(url.hash)?.scrollIntoView());
  } else {
    window.scrollTo(0, 0);
  }
}

interface RouterValue {
  route: Route;
  path: string;
}

const RouterContext = createContext<RouterValue | null>(null);

export function Router({ children }: { children: ReactNode }) {
  const [path, setPath] = useState(() => window.location.pathname);

  useEffect(() => {
    const onPop = () => setPath(window.location.pathname);
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  const value = useMemo<RouterValue>(() => ({
    route: parsePath(path),
    path,
  }), [path]);

  return <RouterContext.Provider value={value}>{children}</RouterContext.Provider>;
}

export function useRoute() {
  const context = useContext(RouterContext);
  if (!context) throw new Error("useRoute must be used within Router");
  return context;
}

export function Link({
  to,
  children,
  className,
  ariaLabel,
  onClick,
}: {
  to: string;
  children: ReactNode;
  className?: string;
  ariaLabel?: string;
  onClick?: (event: MouseEvent<HTMLAnchorElement>) => void;
}) {
  return (
    <a
      href={to}
      className={className}
      aria-label={ariaLabel}
      onClick={(event) => {
        onClick?.(event);
        if (event.defaultPrevented) return;
        if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) return;
        event.preventDefault();
        navigate(to);
      }}
    >
      {children}
    </a>
  );
}
