import type { Metadata, Viewport } from "next";
import { Inter, Newsreader, Roboto_Mono } from "next/font/google";

import "./globals.css";

const serif = Newsreader({
  variable: "--font-newsreader",
  subsets: ["latin"],
  weight: ["300", "400"],
  style: ["normal", "italic"],
  display: "swap",
});

const sans = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const mono = Roboto_Mono({
  variable: "--font-roboto-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "KR Cozinheiro",
    template: "%s · KR Cozinheiro",
  },
  description: "Seu caderno pessoal de receitas.",
  applicationName: "KR Cozinheiro",
  appleWebApp: { capable: true, title: "Cozinheiro", statusBarStyle: "black" },
  robots: { index: false, follow: false },
};

export const viewport: Viewport = {
  themeColor: "#0f1011",
  colorScheme: "dark",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="pt-BR"
      className={`${serif.variable} ${sans.variable} ${mono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">{children}</body>
    </html>
  );
}
