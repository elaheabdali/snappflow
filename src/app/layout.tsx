import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Vazirmatn } from "next/font/google";
import { AppProviders } from "@/components/providers/AppProviders";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  display: "swap",
});

const vazirmatn = Vazirmatn({
  subsets: ["arabic", "latin"],
  variable: "--font-vazirmatn",
  display: "swap",
});

export const metadata: Metadata = {
  title: "SnappFlow | Real-Time Bilingual Mobility Super-App",
  description:
    "Flagship portfolio project by Elahe Abdali — Next.js App Router, Strict TypeScript, Dijkstra Graph Routing, Simulated WebSockets, Zustand, TanStack Query, Framer Motion, and OWASP Security.",
  keywords: [
    "Next.js",
    "TypeScript",
    "Framer Motion",
    "Zustand",
    "TanStack Query",
    "WebSockets",
    "Snapp",
    "Portfolio",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="fa"
      dir="rtl"
      className={`${jakarta.variable} ${vazirmatn.variable}`}
      suppressHydrationWarning
    >
      <body className="font-sans antialiased selection:bg-brand-500/30 selection:text-white">
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
