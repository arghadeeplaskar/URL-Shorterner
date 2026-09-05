# ⚡ D4XA1 — Next-Gen URL Shortener & Link Studio

[![Next.js](https://img.shields.io/badge/Next.js-15.5-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-blue?style=for-the-badge&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.0-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg?style=for-the-badge)](LICENSE)

A blazingly fast, modern, and privacy-focused URL shortener built with **Next.js 15 (App Router)**, **React 19**, and **Tailwind CSS**. Features custom vanity aliases, instant vector QR code generation, click telemetry, and privacy-first client-side routing.

---

## ✨ Features

- **⚡ Instant 0ms Redirection**: Direct hash-mapped key-value resolution routes visitors to destination links with sub-millisecond dispatch.
- **🔗 Full Custom Aliases**: Craft clean, memorable vanity URLs (e.g., `http://localhost:3000/my-custom-name` or `yourdomain.com/portfolio`).
- **📱 Vector QR Code Studio**: Generate crisp, scannable QR codes for any short link. Download high-resolution PNGs or copy QR images to clipboard.
- **🛡️ 100% Privacy-First Vault**: Zero third-party tracking, advertising pixels, or invasive tracking cookies. All link entries remain stored in your local browser vault.
- **📊 Real-Time Click Telemetry**: Tracks click count and creation timestamps without external analytics bloat.
- **🎨 Glassmorphic Dark Aesthetics**: Responsive glassmorphism, glowing gradient accents, animated particle background, and fluid micro-interactions.
- **📋 Smart Clipboard Integration**: One-click paste from clipboard, instant copy with animated feedback, and keyboard shortcuts (`Ctrl + Enter` to dispatch).

---

## 🛠️ Tech Stack

- **Framework**: [Next.js 15 (App Router)](https://nextjs.org/)
- **Library**: [React 19](https://react.dev/)
- **Language**: [TypeScript 5](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) & Vanilla CSS Glassmorphism
- **Icons**: [Lucide React](https://lucide.dev/)
- **QR Engine**: [qrcode](https://www.npmjs.com/package/qrcode)
- **Animation**: CSS Keyframes & Canvas 2D Particles

---

## 🚀 Getting Started

### Prerequisites

- **Node.js**: v18.18 or higher (tested on Node v20+)
- **Package Manager**: `npm`, `pnpm`, or `yarn`

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/arghadeeplaskar/URL-Shorterner.git
   cd URL-Shorterner
   ```

2. **Install dependencies**:
   ```bash
   npm install --legacy-peer-deps
   ```

3. **Start the local development server**:
   ```bash
   npm run dev
   ```

4. **Open in browser**:
   Navigate to [http://localhost:3000](http://localhost:3000).

---

## 📁 Project Structure

```text
├── app/
│   ├── [code]/             # Direct root custom slug redirection route
│   │   └── page.tsx
│   ├── s/[code]/           # Short code route (/s/[code])
│   │   └── page.tsx
│   ├── globals.css         # Custom glassmorphism, animations & Tailwind tokens
│   ├── layout.tsx          # Root HTML layout & fonts
│   └── page.tsx            # Main Landing Page & Shortener Studio
├── components/
│   ├── navbar.tsx          # Floating glassmorphic top navigation bar
│   ├── shortener-card.tsx  # Link shortener & custom alias command center
│   ├── qr-modal.tsx        # High-resolution vector QR code modal & PNG downloader
│   ├── particles-bg.tsx    # Interactive canvas particle network
│   ├── features-grid.tsx   # Capabilities showcase bento grid
│   └── ui/                 # Prebuilt accessible UI primitives
├── public/                 # Static public assets
├── package.json            # Scripts & dependencies
├── tsconfig.json           # TypeScript configuration
└── next.config.mjs         # Next.js configuration
```

---

## 🌐 Deploying to Production

You can deploy this project to **Vercel** with zero configuration:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/arghadeeplaskar/URL-Shorterner)

### Custom Domains
Once deployed to Vercel, Netlify, or your custom server:
1. Go to your project settings → **Domains**.
2. Add your custom domain (e.g., `link.yourdomain.com`).
3. Point your DNS CNAME/A records as guided.
4. Your short links and custom aliases will immediately resolve under your branded domain!

---

## 📜 License

This project is open source and available under the [MIT License](LICENSE).

---

## 👤 Author

Developed by **[Agdl(Arghadeep Laskar)](https://github.com/arghadeeplaskar)**.
