"use client"

import { use, useEffect, useState } from "react"
import Link from "next/link"
import { ExternalLink, ArrowRight, AlertTriangle, ShieldCheck, Zap } from "lucide-react"

type StoredLink = {
  url: string
  createdAt: number
  clicks?: number
}

type StoreShape = {
  byCode: Record<string, StoredLink>
  byUrl: Record<string, string>
}

function readStore(): StoreShape {
  try {
    const raw = localStorage.getItem("d4xa1_links")
    if (!raw) return { byCode: {}, byUrl: {} }
    return JSON.parse(raw)
  } catch {
    return { byCode: {}, byUrl: {} }
  }
}

export default function DirectSlugPage({ params }: { params: Promise<{ code: string }> }) {
  const { code } = use(params)

  const [target, setTarget] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const store = readStore()
    const linkItem = store.byCode?.[code]

    if (linkItem && linkItem.url) {
      setTarget(linkItem.url)

      // Increment click telemetry
      linkItem.clicks = (linkItem.clicks || 0) + 1
      try {
        localStorage.setItem("d4xa1_links", JSON.stringify(store))
      } catch (e) {
        console.error("Failed to update click telemetry", e)
      }

      // Instant redirect
      const timer = setTimeout(() => {
        window.location.href = linkItem.url
      }, 400)

      return () => clearTimeout(timer)
    } else {
      setError("This custom link does not exist or was removed.")
    }
  }, [code])

  return (
    <main className="min-h-screen relative flex items-center justify-center p-4 bg-background overflow-hidden">
      {/* Ambient glow */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-brand-purple/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-brand-blue/20 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 w-full max-w-md glass-panel p-8 text-center rounded-2xl border border-white/10 shadow-2xl">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-brand-purple to-brand-blue text-white shadow-xl shadow-purple-500/20 mb-5 animate-bounce">
          <Zap className="w-7 h-7" />
        </div>

        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          D4XA1 <span className="text-gradient-purple">Redirect</span>
        </h1>

        {!mounted ? (
          <div className="mt-6 flex flex-col items-center gap-3">
            <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            <p className="text-sm text-muted-foreground font-mono">Resolving /{code}…</p>
          </div>
        ) : target ? (
          <div className="mt-6 space-y-4">
            <div className="p-3.5 rounded-xl bg-secondary/50 border border-border text-left">
              <div className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5 mb-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                Target Destination
              </div>
              <p className="text-sm font-mono text-foreground break-all line-clamp-2">
                {target}
              </p>
            </div>

            <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
              </span>
              <span>Redirecting to original URL…</span>
            </div>

            <a
              href={target}
              className="btn-glow inline-flex items-center justify-center gap-2 w-full py-2.5 text-sm font-medium rounded-xl"
            >
              <span>Click if not redirected</span>
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        ) : (
          <div className="mt-6 space-y-4">
            <div className="p-4 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-sm flex items-start gap-2.5 text-left">
              <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">Link Not Found</p>
                <p className="text-xs text-destructive/80 mt-1">{error}</p>
              </div>
            </div>

            <Link
              href="/"
              className="btn-glow inline-flex items-center justify-center gap-2 w-full py-2.5 text-sm font-medium rounded-xl"
            >
              <span>Create New Short Link</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        )}
      </div>
    </main>
  )
}
