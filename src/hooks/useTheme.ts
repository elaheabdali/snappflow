"use client";

import { useEffect } from "react";
import { useSnappFlowStore } from "@/store/useSnappFlowStore";

export function useTheme() {
  const theme = useSnappFlowStore((s) => s.theme);
  const setTheme = useSnappFlowStore((s) => s.setTheme);
  const toggleTheme = useSnappFlowStore((s) => s.toggleTheme);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem("snappflow-theme");
      if (stored === "light" || stored === "dark") {
        setTheme(stored);
      }
    } catch {
      // Ignore storage access errors
    }
  }, [setTheme]);

  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    try {
      window.localStorage.setItem("snappflow-theme", theme);
    } catch {
      // Ignore storage write errors
    }
  }, [theme]);

  return { theme, isDark: theme === "dark", toggleTheme, setTheme };
}