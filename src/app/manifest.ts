import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "KR Cozinheiro",
    short_name: "Cozinheiro",
    description: "Seu caderno pessoal de receitas.",
    start_url: "/",
    display: "standalone",
    background_color: "#0f1011",
    theme_color: "#0f1011",
    lang: "pt-BR",
    icons: [{ src: "/icon.svg", sizes: "any", type: "image/svg+xml" }],
  };
}
