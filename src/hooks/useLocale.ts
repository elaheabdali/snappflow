"use client";

import { useEffect } from "react";
import { enMessages } from "@/messages/en";
import { faMessages } from "@/messages/fa";
import { useSnappFlowStore } from "@/store/useSnappFlowStore";

export function useLocale() {
  const locale = useSnappFlowStore((s) => s.locale);
  const toggleLocale = useSnappFlowStore((s) => s.toggleLocale);
  const setLocale = useSnappFlowStore((s) => s.setLocale);

  useEffect(() => {
    const html = document.documentElement;
    html.lang = locale;
    html.dir = locale === "fa" ? "rtl" : "ltr";
  }, [locale]);

  const t = locale === "fa" ? faMessages : enMessages;

  return {
    locale,
    isRtl: locale === "fa",
    t,
    toggleLocale,
    setLocale,
  };
}
