import type { Locale } from "@/types";

const TOMAN_PER_USD = 65000;

export function formatCurrency(toman: number, locale: Locale): string {
  if (locale === "fa") {
    return `${new Intl.NumberFormat("fa-IR").format(toman)} تومان`;
  }
  const usd = toman / TOMAN_PER_USD;
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(usd);
}

export function formatNumber(value: number, locale: Locale): string {
  return new Intl.NumberFormat(locale === "fa" ? "fa-IR" : "en-US").format(value);
}
