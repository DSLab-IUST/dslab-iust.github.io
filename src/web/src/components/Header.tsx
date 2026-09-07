import { useEffect, useId, useRef, useState } from "react";
import { BrandLogo } from "@/components/BrandLogo";
import { Icon } from "@/components/icons";
import { LAB } from "@/config";
import { useLab } from "@/context/LabContext";
import { useTheme } from "@/hooks/useTheme";
import { Link, useRoute, type Route } from "@/lib/router";
import { PATHS } from "@/lib/site";

function isNavActive(href: string, route: Route): boolean {
  if (href === PATHS.home) return route.name === "home";
  if (href === PATHS.people) return route.name === "people" || route.name === "member";
  return route.name === href.slice(1);
}

const NAV = [
  { href: PATHS.home, label: "Home" },
  { href: PATHS.lab, label: "Lab" },
  { href: PATHS.people, label: "People" },
  { href: PATHS.research, label: "Research" },
  { href: PATHS.publications, label: "Publications" },
];

export function Header() {
  const { orgHref } = useLab();
  const { isLight, toggleTheme } = useTheme();
  const { path, route } = useRoute();
  const isLanding = route.name === "home";
  const [menuOpen, setMenuOpen] = useState(false);
  const [detached, setDetached] = useState(
    () => typeof window !== "undefined" && window.scrollY > 8,
  );
  const headerRef = useRef<HTMLElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const menuId = useId();

  useEffect(() => {
    const header = headerRef.current;
    const inner = header?.querySelector<HTMLElement>(".site-header-inner");
    if (!header || !inner) return;

    const apply = () => {
      const border = Number.parseFloat(getComputedStyle(header).borderBottomWidth) || 0;
      document.documentElement.style.setProperty(
        "--header-height",
        `${inner.getBoundingClientRect().height + border}px`,
      );
    };

    apply();
    const observer = new ResizeObserver(apply);
    observer.observe(inner);
    return () => {
      observer.disconnect();
      document.documentElement.style.removeProperty("--header-height");
    };
  }, []);

  useEffect(() => {
    if (!isLanding) {
      setDetached(false);
      return;
    }

    const sync = () => setDetached(window.scrollY > 8);
    sync();
    window.addEventListener("scroll", sync, { passive: true });
    return () => window.removeEventListener("scroll", sync);
  }, [isLanding]);

  useEffect(() => {
    setMenuOpen(false);
  }, [path]);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 981px)");
    const onChange = () => {
      if (mq.matches) setMenuOpen(false);
    };
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      setMenuOpen(false);
      toggleRef.current?.focus();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [menuOpen]);

  return (
    <header
      ref={headerRef}
      className={[
        "site-header",
        isLanding ? "is-landing" : "",
        isLanding && detached ? "is-detached" : "",
        menuOpen ? "is-nav-open" : "",
      ].filter(Boolean).join(" ")}
      id="top"
    >
      <div className="site-header-inner">
        <Link className="brand" to={PATHS.home} ariaLabel={`${LAB.name} home`}>
          <BrandLogo on={isLanding && !detached && isLight ? "light" : "dark"} />
        </Link>

        <nav className="nav-links" aria-label="Primary navigation">
          {NAV.map((item) => {
            const active = isNavActive(item.href, route);
            return (
              <Link
                key={item.href}
                to={item.href}
                className={active ? "is-active" : undefined}
                ariaCurrent={active ? "page" : undefined}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="header-actions">
          <button
            className="theme-toggle"
            type="button"
            aria-label={isLight ? "Switch to dark mode" : "Switch to light mode"}
            aria-pressed={isLight}
            onClick={toggleTheme}
          >
            <span className="theme-toggle-icons" aria-hidden="true">
              <Icon name="sun" className="theme-icon theme-icon-sun" />
              <Icon name="moon" className="theme-icon theme-icon-moon" />
            </span>
            <span className="theme-toggle-label">{isLight ? "Dark" : "Light"}</span>
          </button>
          <a
            className="button button-ghost header-github"
            href={orgHref}
            target="_blank"
            rel="noreferrer"
            aria-label="GitHub"
          >
            <Icon name="github" />
            <span className="header-github-label" aria-hidden="true">GitHub</span>
          </a>
          <button
            ref={toggleRef}
            className="nav-toggle"
            type="button"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            aria-controls={menuId}
            onClick={() => setMenuOpen((open) => !open)}
          >
            <span className="nav-toggle-bars" aria-hidden="true">
              <span />
              <span />
              <span />
            </span>
          </button>
        </div>
      </div>

      <nav
        id={menuId}
        className={`mobile-nav${menuOpen ? " is-open" : ""}`}
        aria-label="Mobile navigation"
        aria-hidden={!menuOpen}
        inert={!menuOpen}
      >
        <div className="mobile-nav-inner">
          <div className="mobile-nav-links">
            {NAV.map((item) => {
              const active = isNavActive(item.href, route);
              return (
                <Link
                  key={item.href}
                  to={item.href}
                  className={active ? "is-active" : undefined}
                  ariaCurrent={active ? "page" : undefined}
                  onClick={() => setMenuOpen(false)}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>
        </div>
      </nav>
    </header>
  );
}
