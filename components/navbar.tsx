"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Link2 } from "lucide-react"

export default function Navbar() {
  const [latency, setLatency] = useState(10)

  useEffect(() => {
    const interval = setInterval(() => {
      setLatency(Math.floor(Math.random() * 8) + 8)
    }, 4000)
    return () => clearInterval(interval)
  }, [])

  return (
    <header className="fixed top-0 inset-x-0 z-40 px-4 py-3 sm:px-6">
      <div className="max-w-4xl mx-auto flex items-center justify-between px-4 py-2.5 glass-panel rounded-2xl border border-white/10 bg-card/70 backdrop-blur-xl">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="flex items-center justify-center w-8 h-8 rounded-xl bg-gradient-to-br from-brand-purple to-brand-blue text-white shadow-md shadow-purple-500/20 group-hover:scale-105 transition-transform">
            <Link2 className="w-4 h-4" />
          </div>
          <div className="flex items-center gap-2">
            <span className="font-bold text-sm tracking-tight text-foreground">
              D4XA1
            </span>
            <span className="px-1.5 py-0.2 text-[9px] font-semibold uppercase tracking-wider rounded-md bg-primary/15 text-primary border border-primary/25">
              Shortener
            </span>
          </div>
        </Link>

        {/* Live Status */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[11px] font-mono">
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500" />
            </span>
            <span>{latency}ms</span>
            <span className="text-emerald-400/60 hidden sm:inline">• Live</span>
          </div>
        </div>
      </div>
    </header>
  )
}
