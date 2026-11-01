import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";

import "./globals.css";

const sans = Inter({
  variable: "--font-inter",
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
  appleWebApp: { capable: true, title: "Cozinheiro", statusBarStyle: "default" },
  robots: { index: false, follow: false },
};

export const viewport: Viewport = {
  themeColor: "#faf8f5",
  colorScheme: "light",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="pt-BR" className={`${sans.variable} h-full antialiased`}>
      <body className="min-h-full">{children}</body>
    </html>
  );
}
