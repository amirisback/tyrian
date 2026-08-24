import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Tyrian — DOS Retro Arcade",
    short_name: "Tyrian",
    description: "Play classic Tyrian DOS game in modern Next.js 16 with J-Dos WebAssembly emulation, OpenTyrian source code showcase, and chiptune OST player.",
    start_url: "/",
    display: "standalone",
    orientation: "any",
    background_color: "#050711",
    theme_color: "#00f0ff",
    categories: ["games", "entertainment", "arcade"],
    icons: [
      {
        src: "/icon-192x192.svg",
        sizes: "192x192",
        type: "image/svg+xml",
        purpose: "any",
      },
      {
        src: "/icon-512x512.svg",
        sizes: "512x512",
        type: "image/svg+xml",
        purpose: "maskable",
      },
    ],
  };
}
