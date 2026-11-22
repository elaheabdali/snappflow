"use client";

import { useEffect } from "react";
import { useSnappFlowStore } from "@/store/useSnappFlowStore";

export function useTheme() {
  const theme = useSnappFlowStore((s) => s.theme);
  const setTheme = useSnappFlowStore((s) => s.setTheme);
  const toggleTheme = useSnappFlowStore((s) => s.toggleTheme);

  useEffect(() => {
    const stored = window.localStorage.getItem("snappflow-theme");
    if (stored === "light" || stored === "dark") {
      setTheme(stored);
    }
  }, [setTheme]);

  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    window.localStorage.setItem("snappflow-theme", theme);
  }, [theme]);

  return { theme, isDark: theme === "dark", toggleTheme, setTheme };
}