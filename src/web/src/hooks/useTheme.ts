import { useCallback, useEffect, useState } from "react";
import { THEME_STORAGE_KEY } from "@/config";
import type { Theme } from "@/types";

function readTheme(): Theme {
  if (typeof document === "undefined") return "dark";
  return document.documentElement.dataset.theme === "light" ? "light" : "dark";
}

function applyTheme(theme: Theme, persist = false) {
  document.documentElement.dataset.theme = theme;
  const themeMeta = document.querySelector('meta[name="theme-color"]');
  themeMeta?.setAttribute("content", theme === "dark" ? "#10141F" : "#F5F6F8");

  if (persist) {
    try {
      localStorage.setItem(THEME_STORAGE_KEY, theme);
    } catch {
      /* Theme still works when storage is unavailable. */
    }
  }
}

export function useTheme() {
  const [theme, setTheme] = useState<Theme>(readTheme);

  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme((current) => {
      const next: Theme = current === "light" ? "dark" : "light";
      applyTheme(next, true);
      return next;
    });
  }, []);

  return { theme, isLight: theme === "light", toggleTheme };
}
