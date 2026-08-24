# 🚀 Tyrian — Play Tyrian 2000 in Your Browser

<div align="center">

![Tyrian 2000](https://img.shields.io/badge/Game-Tyrian%202000-cyan?style=for-the-badge&logo=data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCI+PHBhdGggZmlsbD0iI2ZmZiIgZD0iTTEyIDJMNCAyMGgxNnoiLz48L3N2Zz4=)
![Next.js](https://img.shields.io/badge/Next.js-16.3-black?style=for-the-badge&logo=nextdotjs)
![TypeScript](https://img.shields.io/badge/TypeScript-Strict-blue?style=for-the-badge&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4.3-38BDF8?style=for-the-badge&logo=tailwindcss)
![PWA](https://img.shields.io/badge/PWA-Serwist%20v9.5-purple?style=for-the-badge)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)

**Tyrian 2000** dijalankan langsung di browser menggunakan **js-dos v8 WebAssembly DOSBox** — tanpa plugin, tanpa install, kecepatan penuh 60 FPS.

[🎮 Main Sekarang](http://localhost:3000) · [📖 Panduan Pilot](http://localhost:3000/manual) · [💻 Source Code](http://localhost:3000/source)

</div>

---

## 🎮 Tentang Proyek Ini

**Tyrian** adalah proyek web yang memungkinkan siapa saja memainkan game klasik **Tyrian 2000** (1999, Epic MegaGames) langsung di browser modern tanpa instalasi apapun.

Game dijalankan menggunakan **js-dos v8** — emulator DOSBox berbasis WebAssembly yang berjalan di sisi klien dengan kecepatan tinggi. Bundle game diunduh dari CDN melalui proxy server Next.js untuk menghindari CORS restriction.

Repository ini juga menyertakan **source code OpenTyrian** (port SDL open-source dari Tyrian) untuk keperluan referensi dan dokumentasi arsitektur game.

---

## ✨ Fitur Utama

| Fitur | Detail |
|-------|--------|
| 🎮 **Emulasi DOSBox WASM** | js-dos v8 — berjalan native di browser tanpa plugin |
| ⚡ **Turbo 60 FPS** | Auto-max CPU cycles, performa penuh sejak pertama kali dijalankan |
| 🖵 **Fullscreen 100%** | Canvas mengisi layar penuh, tidak ada letterboxing |
| 🎮 **Virtual Gamepad** | Kontrol layar sentuh untuk mobile/tablet |
| 🌐 **Bilingual** | Antarmuka Bahasa Indonesia & English |
| 📱 **PWA Offline** | Install sebagai aplikasi, dapat dimainkan offline (Serwist) |
| 💻 **OpenTyrian Source** | Source code C/SDL lengkap tersedia di `opentyrian/` |
| 🎵 **OST Jukebox** | Putar soundtrack Alexander Brandon langsung di halaman |

---

## 🏗️ Arsitektur Teknis

```
tyrian/
├── src/
│   ├── app/
│   │   ├── _components/
│   │   │   ├── game/
│   │   │   │   ├── jdos-player.tsx      # 🎮 Emulator js-dos v8 (core)
│   │   │   │   ├── virtual-gamepad.tsx  # 📱 Touch controller
│   │   │   │   └── controls-guide.tsx   # ⌨️ Keyboard guide
│   │   │   ├── sections/               # Landing page sections
│   │   │   └── ui/                     # Shared UI components
│   │   ├── api/
│   │   │   └── dos-bundle/route.ts     # 🔀 CORS proxy untuk cdn.dos.zone
│   │   ├── manual/page.tsx             # 📖 Panduan pilot & cheats
│   │   ├── source/page.tsx             # 💻 OpenTyrian source showcase
│   │   ├── globals.css                 # 🎨 Design system & CRT effects
│   │   ├── layout.tsx                  # Root layout (SEO, PWA, i18n)
│   │   ├── manifest.ts                 # PWA manifest
│   │   ├── robots.ts                   # SEO robots
│   │   └── sitemap.ts                  # SEO sitemap
│   ├── data/                           # Static JSON data
│   │   ├── ships.json                  # Ship specs
│   │   ├── weapons.json                # Weapons catalog
│   │   ├── episodes.json               # Episode list
│   │   ├── soundtrack.json             # OST tracks
│   │   └── leaderboard.json            # High scores
│   ├── dictionaries/                   # i18n translations
│   │   ├── id.json                     # Bahasa Indonesia
│   │   └── en.json                     # English
│   └── lib/                            # Utilities
│       ├── i18n-server.ts              # Locale + dictionary resolver
│       └── seo.ts                      # JSON-LD structured data
├── opentyrian/                         # 💻 OpenTyrian C/SDL source code
│   └── src/                            # ~104 file C (referensi arsitektur)
├── public/                             # Static assets & PWA icons
├── AGENTS.md                           # AI agent rules
└── GUIDELINE.md                        # Project coding standards
```

### Alur Proxy Bundle Game (Bypass CORS)

```
Browser (localhost:3000)
  │
  ├── GET /api/dos-bundle?game=tyrian-2000   ← same-origin, bebas CORS
  │       │
  │       └── Next.js Server
  │               │
  │               └── fetch("https://cdn.dos.zone/custom/dos/tyrian-2000.jsdos")
  │                       │                ↑ server-to-server, tanpa CORS restriction
  │                       └── stream response → browser → js-dos v8 mounts & runs
```

---

## 🛠️ Setup & Pengembangan

### Prasyarat

- **Bun** ≥ 1.3 — [Install Bun](https://bun.sh)
- Node.js ≥ 20 (opsional, Bun sudah mencakup runtime)

### 1. Clone & Install

```bash
git clone https://github.com/amirisback/tyrian.git
cd tyrian
bun install
```

### 2. Jalankan Development Server

```bash
bun run dev
```

Buka [http://localhost:3000](http://localhost:3000) — klik **⚡ LUNCURKAN GAME** dan nikmati!

### 3. Lint & Build

```bash
# Cek linter
bun run lint

# Build produksi
bun run build
```

---

## 🎮 Cara Memainkan Tyrian

### Kontrol Keyboard (Default)

| Tombol | Fungsi |
|--------|--------|
| `↑ ↓ ← →` | Gerakkan pesawat |
| `SPASI` | Tembakan utama (Front Gun) |
| `LEFT CTRL` | Senjata belakang (Rear Gun) |
| `LEFT ALT` | Sidekick / unit pendamping |
| `ENTER` | Konfirmasi menu |
| `ESC` | Pause / menu opsi |

### Tips Performa

- **`Ctrl + F12`** → Tambah kecepatan DOSBox (jika masih dirasa lambat)
- **`Ctrl + F11`** → Turunkan kecepatan (jika terlalu cepat)
- **`Alt + Enter`** → Fullscreen internal DOSBox
- Klik area layar game sekali untuk mengunci fokus keyboard

---

## 🌐 Halaman & Routes

| Route | Deskripsi |
|-------|-----------|
| `/` | Homepage — Game Arena, Ship Hangar, Weapons, Episodes, OST, Leaderboard |
| `/manual` | Panduan Pilot lengkap + daftar cheat code |
| `/source` | OpenTyrian source code showcase & arsitektur game |
| `/api/dos-bundle?game=tyrian-2000` | CORS proxy endpoint untuk bundle game |

---

## 💻 OpenTyrian Source Code

Repository ini menyertakan **OpenTyrian** (https://github.com/opentyrian/opentyrian) — port open-source resmi Tyrian berbasis C/SDL — di direktori `opentyrian/`.

Source code ini disertakan untuk:
- **Referensi arsitektur** game Tyrian
- **Dokumentasi** pada halaman `/source`
- **Potensi kompilasi WASM** di masa depan menggunakan Emscripten

> **Catatan:** Source C/SDL ini **tidak diikutsertakan** dalam `bun run build` (Next.js hanya mengkompilasi TypeScript). Untuk mengkompilasi ke WebAssembly, diperlukan Emscripten SDK (`emsdk`) secara terpisah.

---

## 🔧 Tech Stack

| Teknologi | Versi | Fungsi |
|-----------|-------|--------|
| Next.js | 16.3.0 | App Router, Server Components, API Routes |
| React | 19.2.8 | UI Library |
| TypeScript | Strict Mode | Type Safety |
| Tailwind CSS | v4.3.3 | Styling & Design System |
| Serwist | v9.5.12 | PWA Service Worker |
| js-dos | v8 (latest) | DOSBox WebAssembly Emulator |
| Bun | ≥ 1.3 | Package Manager & Runtime |

---

## 📜 Lisensi

- **Kode proyek ini**: MIT License — lihat [LICENSE](LICENSE)
- **Tyrian 2000**: Freeware — dirilis gratis oleh Epic MegaGames
- **OpenTyrian**: GNU GPL v2 — lihat [opentyrian/COPYING](opentyrian/COPYING)

---

## 🙏 Kredit

- **Tyrian 2000** — dikembangkan oleh Eclipse Software, dipublikasikan oleh Epic MegaGames (1999)
- **OpenTyrian** — port SDL open-source oleh Carl Reinke et al.
- **js-dos v8** — emulator DOSBox WASM oleh [caiiiycuk](https://github.com/caiiiycuk/js-dos)
- **Musik** — Alexander Brandon (OST Tyrian yang legendaris)
