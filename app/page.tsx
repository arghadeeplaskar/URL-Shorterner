import type { Metadata } from "next"
import ParticlesBackground from "@/components/particles-bg"
import Navbar from "@/components/navbar"
import ShortenerCard from "@/components/shortener-card"
import { Zap, Link2, QrCode } from "lucide-react"

export const metadata: Metadata = {
  title: "D4XA1 | Fast URL Shortener & Custom Links",
  description: "Shorten links instantly with custom vanity aliases and free QR codes.",
}

export default function HomePage() {
  return (
    <div className="relative min-h-screen flex flex-col bg-background text-foreground selection:bg-primary/30 selection:text-primary">
      {/* Dynamic particles background */}
      <ParticlesBackground />

      {/* Sleek top navigation */}
      <Navbar />

      {/* Main hero & card */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-4 sm:px-6 pt-24 pb-12 w-full max-w-4xl mx-auto">
        {/* Header Hero */}
        <section className="text-center max-w-xl mx-auto mb-8 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass-subtle border border-primary/20 text-xs text-primary font-medium shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            <span>Simple, Fast & Free Link Shortener</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight">
            Shorten Links at <span className="text-gradient-purple">Light Speed</span>
          </h1>

          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
            Create clean, memorable short links or custom aliases in seconds.
          </p>
        </section>

        {/* Focused Shortener Card */}
        <ShortenerCard />

        {/* 3 Quick highlights */}
        <section className="mt-8 flex flex-wrap items-center justify-center gap-3 text-xs text-muted-foreground">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-secondary/30 border border-border/50">
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            <span>Instant 0ms Redirection</span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-secondary/30 border border-border/50">
            <Link2 className="w-3.5 h-3.5 text-purple-400" />
            <span>Custom Vanity Slugs</span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-secondary/30 border border-border/50">
            <QrCode className="w-3.5 h-3.5 text-cyan-400" />
            <span>Free Vector QR Codes</span>
          </div>
        </section>
      </main>

      {/* Clean Footer */}
      <footer className="relative z-10 w-full border-t border-border/40 py-6 px-4 text-center text-xs text-muted-foreground">
        <p>
          © 2025 D4XA1 Tools • Simple & Private URL Shortener • Developed by{" "}
          <a
            href="https://github.com/arghadeeplaskar"
            target="_blank"
            rel="noreferrer"
            className="text-foreground hover:text-primary transition-colors font-medium underline underline-offset-4"
          >
            Agdl(Arghadeep Laskar)
          </a>
        </p>
      </footer>
    </div>
  )
}
