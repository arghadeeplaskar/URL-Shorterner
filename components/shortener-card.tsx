"use client"

import React, { useEffect, useMemo, useState } from "react"
import {
  Link2,
  Copy,
  Check,
  QrCode,
  ExternalLink,
  Trash2,
  Sparkles,
  Clipboard,
  X,
  Clock,
  ArrowRight,
  SlidersHorizontal,
  Globe,
  CheckCircle2,
  AlertCircle,
} from "lucide-react"
import QrModal from "@/components/qr-modal"

export type StoredLink = {
  url: string
  createdAt: number
  clicks?: number
  isCustom?: boolean
}

export type StoreShape = {
  byCode: Record<string, StoredLink>
  byUrl: Record<string, string>
}

const STORAGE_KEY = "d4xa1_links"
const RESERVED_SLUGS = ["s", "api", "favicon.ico", "_next", "public"]

function readStore(): StoreShape {
  if (typeof window === "undefined") return { byCode: {}, byUrl: {} }
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return { byCode: {}, byUrl: {} }
    const parsed = JSON.parse(raw) as StoreShape
    return {
      byCode: parsed.byCode || {},
      byUrl: parsed.byUrl || {},
    }
  } catch {
    return { byCode: {}, byUrl: {} }
  }
}

function writeStore(store: StoreShape) {
  if (typeof window === "undefined") return
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(store))
  } catch (e) {
    console.error("Storage write error", e)
  }
}

function normalizeUrl(input: string) {
  try {
    const trimmed = input.trim()
    if (!trimmed) return ""
    const hasProtocol = /^https?:\/\//i.test(trimmed)
    return new URL(hasProtocol ? trimmed : `https://${trimmed}`).toString()
  } catch {
    return ""
  }
}

function randomCode(len = 5) {
  const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
  let out = ""
  for (let i = 0; i < len; i++) {
    out += chars[Math.floor(Math.random() * chars.length)]
  }
  return out
}

function formatRelativeTime(timestamp: number) {
  const diff = Date.now() - timestamp
  const minutes = Math.floor(diff / 60000)
  if (minutes < 1) return "Just now"
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  return `${days}d ago`
}

export default function ShortenerCard() {
  const [inputUrl, setInputUrl] = useState("")
  const [customSlug, setCustomSlug] = useState("")
  const [useCustomUrl, setUseCustomUrl] = useState(false)
  const [store, setStore] = useState<StoreShape>({ byCode: {}, byUrl: {} })
  const [mounted, setMounted] = useState(false)
  const [host, setHost] = useState("http://localhost:3000")
  const [notification, setNotification] = useState<{ type: "success" | "error"; text: string } | null>(null)

  const [lastShortened, setLastShortened] = useState<{
    code: string
    shortUrl: string
    originalUrl: string
    isCustom?: boolean
  } | null>(null)

  const [copiedCode, setCopiedCode] = useState<string | null>(null)
  const [qrModalUrl, setQrModalUrl] = useState<string | null>(null)

  useEffect(() => {
    setMounted(true)
    if (typeof window !== "undefined") {
      setHost(window.location.origin)
      setStore(readStore())
    }
  }, [])

  const notify = (type: "success" | "error", text: string) => {
    setNotification({ type, text })
    setTimeout(() => setNotification(null), 3000)
  }

  const allLinks = useMemo(() => {
    if (!mounted) return []
    return Object.entries(store.byCode)
      .map(([code, item]) => ({ code, ...item }))
      .sort((a, b) => b.createdAt - a.createdAt)
  }, [store, mounted])

  // Custom slug validation (allows letters, numbers, hyphens, underscores, and dots)
  const cleanCustomSlug = useMemo(() => {
    return customSlug.trim().replace(/[^a-zA-Z0-9-_.]/g, "")
  }, [customSlug])

  const slugAvailability = useMemo(() => {
    if (!cleanCustomSlug) return null
    if (cleanCustomSlug.length < 2) return "too-short"
    if (RESERVED_SLUGS.includes(cleanCustomSlug.toLowerCase())) return "reserved"
    if (store.byCode[cleanCustomSlug]) return "taken"
    return "available"
  }, [cleanCustomSlug, store])

  const currentHost = useMemo(() => {
    return host || (typeof window !== "undefined" ? window.location.origin : "http://localhost:3000")
  }, [host])

  const fullCustomUrlPreview = useMemo(() => {
    return `${currentHost}/${cleanCustomSlug || "my-custom-name"}`
  }, [currentHost, cleanCustomSlug])

  const handleShorten = (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    const normalized = normalizeUrl(inputUrl)

    if (!normalized) {
      notify("error", "Please enter a valid original URL.")
      return
    }

    const cur = readStore()
    let code = ""
    let isCustom = false

    if (useCustomUrl && cleanCustomSlug) {
      if (cleanCustomSlug.length < 2) {
        notify("error", "Custom alias must have at least 2 characters.")
        return
      }

      code = cleanCustomSlug
      isCustom = true
    } else {
      // Check existing
      const existing = cur.byUrl[normalized]
      if (existing && cur.byCode[existing]) {
        const workingUrl = `${currentHost}/${existing}`
        setLastShortened({
          code: existing,
          shortUrl: workingUrl,
          originalUrl: normalized,
          isCustom: cur.byCode[existing].isCustom,
        })
        notify("success", "Link was already shortened! Retrieved from cache.")
        return
      }

      code = randomCode(5)
      while (cur.byCode[code]) {
        code = randomCode(5)
      }
    }

    const finalShortUrl = `${currentHost}/${code}`

    cur.byCode[code] = {
      url: normalized,
      createdAt: Date.now(),
      clicks: 0,
      isCustom,
    }
    cur.byUrl[normalized] = code
    writeStore(cur)
    setStore({ ...cur })

    setLastShortened({
      code,
      shortUrl: finalShortUrl,
      originalUrl: normalized,
      isCustom,
    })

    setInputUrl("")
    setCustomSlug("")
    notify("success", isCustom ? `Custom link created: /${code}` : `Short link created!`)
  }

  const handleCopy = async (code: string, url: string) => {
    try {
      await navigator.clipboard.writeText(url)
      setCopiedCode(code)
      notify("success", "Copied URL to clipboard!")
      setTimeout(() => setCopiedCode(null), 2000)
    } catch {
      notify("error", "Copy failed.")
    }
  }

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText()
      if (text) {
        setInputUrl(text)
      }
    } catch {
      notify("error", "Clipboard access was not granted.")
    }
  }

  const handleDelete = (code: string) => {
    const cur = readStore()
    const item = cur.byCode[code]
    if (item) {
      delete cur.byUrl[item.url]
      delete cur.byCode[code]
      writeStore(cur)
      setStore({ ...cur })
      if (lastShortened?.code === code) {
        setLastShortened(null)
      }
      notify("success", "Removed from history.")
    }
  }

  const handleClearHistory = () => {
    if (confirm("Are you sure you want to clear your shortened link history?")) {
      const empty: StoreShape = { byCode: {}, byUrl: {} }
      writeStore(empty)
      setStore(empty)
      setLastShortened(null)
      notify("success", "History cleared.")
    }
  }

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      {/* Toast Notification */}
      {notification && (
        <div
          role="status"
          className={`fixed top-20 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 px-4 py-2.5 rounded-full text-xs font-semibold shadow-2xl backdrop-blur-lg border animate-in fade-in slide-in-from-top-2 duration-200 ${
            notification.type === "success"
              ? "bg-emerald-950/90 border-emerald-500/40 text-emerald-200"
              : "bg-red-950/90 border-red-500/40 text-red-200"
          }`}
        >
          {notification.type === "success" ? (
            <Check className="w-3.5 h-3.5 text-emerald-400" />
          ) : (
            <X className="w-3.5 h-3.5 text-red-400" />
          )}
          <span>{notification.text}</span>
        </div>
      )}

      {/* MAIN SHORTENER & CUSTOM URL CARD */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/10 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-primary/60 to-transparent" />

        <form onSubmit={handleShorten} className="space-y-4">
          {/* Target Long URL Input */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-medium">
              <label htmlFor="original-url-field" className="text-foreground flex items-center gap-1.5 font-semibold">
                <Link2 className="w-4 h-4 text-primary" />
                Original Long URL
              </label>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handlePaste}
                  className="inline-flex items-center gap-1 text-[11px] text-muted-foreground hover:text-primary transition-colors cursor-pointer"
                >
                  <Clipboard className="w-3 h-3" />
                  <span>Paste</span>
                </button>
                {inputUrl && (
                  <button
                    type="button"
                    onClick={() => setInputUrl("")}
                    className="inline-flex items-center gap-1 text-[11px] text-muted-foreground hover:text-destructive transition-colors cursor-pointer"
                  >
                    <X className="w-3 h-3" />
                    <span>Clear</span>
                  </button>
                )}
              </div>
            </div>

            <div className="relative flex items-center">
              <input
                id="original-url-field"
                type="url"
                value={inputUrl}
                onChange={(e) => setInputUrl(e.target.value)}
                placeholder="https://example.com/any-long-url-address"
                className="w-full px-4 py-3.5 text-sm sm:text-base rounded-2xl bg-secondary/50 border border-border text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition shadow-inner"
              />
            </div>
          </div>

          {/* Full Custom URL Toggle & Setup */}
          <div className="pt-1">
            {!useCustomUrl ? (
              <button
                type="button"
                onClick={() => setUseCustomUrl(true)}
                className="inline-flex items-center gap-1.5 text-xs font-medium text-primary hover:text-primary/80 transition-colors cursor-pointer"
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                <span>Make a Full Custom URL (e.g. {mounted ? host.replace(/^https?:\/\//, "") : "localhost:3000"}/my-name)</span>
              </button>
            ) : (
              <div className="p-4 rounded-2xl bg-secondary/30 border border-border space-y-3 animate-in fade-in duration-200">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-foreground flex items-center gap-1.5">
                    <Globe className="w-3.5 h-3.5 text-primary" />
                    Customize Full URL Path
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setUseCustomUrl(false)
                      setCustomSlug("")
                    }}
                    className="text-[11px] text-muted-foreground hover:text-foreground cursor-pointer"
                  >
                    Cancel Custom URL
                  </button>
                </div>

                {/* Slug Input */}
                <div className="flex items-center rounded-xl bg-background border border-border overflow-hidden focus-within:ring-2 focus-within:ring-primary transition">
                  <span className="px-3.5 py-3 text-xs font-mono text-muted-foreground bg-secondary/60 border-r border-border select-none">
                    {currentHost.replace(/^https?:\/\//, "")}/
                  </span>
                  <input
                    id="custom-slug-field"
                    type="text"
                    value={customSlug}
                    onChange={(e) => setCustomSlug(e.target.value)}
                    placeholder="agdltestcustom"
                    className="w-full px-3 py-3 text-sm font-mono bg-transparent text-foreground placeholder:text-muted-foreground/50 focus:outline-none"
                  />
                  {cleanCustomSlug && (
                    <div className="pr-3 shrink-0 text-xs font-semibold">
                      {slugAvailability === "available" && (
                        <span className="text-emerald-400 flex items-center gap-1 text-[11px]">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Available
                        </span>
                      )}
                      {slugAvailability === "taken" && (
                        <span className="text-red-400 flex items-center gap-1 text-[11px]">
                          <AlertCircle className="w-3.5 h-3.5" />
                          Taken
                        </span>
                      )}
                      {slugAvailability === "too-short" && (
                        <span className="text-muted-foreground text-[11px]">Min 2 chars</span>
                      )}
                    </div>
                  )}
                </div>

                {/* Live Preview of full custom URL */}
                <div className="text-[11px] text-muted-foreground flex items-center gap-1.5 font-mono">
                  <span>Redirect Link:</span>
                  <span className="text-primary font-semibold underline truncate">
                    {fullCustomUrlPreview}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Primary Submit Button */}
          <button
            type="submit"
            className="btn-glow w-full py-3.5 text-sm sm:text-base font-semibold rounded-2xl flex items-center justify-center gap-2 shadow-lg cursor-pointer transition-transform"
          >
            <Sparkles className="w-4 h-4" />
            <span>{useCustomUrl ? "Create Full Custom Link" : "Shorten URL"}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* ACTIVE GENERATED RESULT */}
        {lastShortened && (
          <div className="mt-6 pt-5 border-t border-border/60 animate-in zoom-in-95 duration-200 space-y-3">
            <div className="text-xs font-semibold text-muted-foreground flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-emerald-400">
                <Check className="w-3.5 h-3.5" />
                {lastShortened.isCustom ? "Custom URL Live & Ready!" : "Short link ready!"}
              </span>
              <span className="text-[11px] font-mono text-muted-foreground">Redirects to Original</span>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-2xl bg-secondary/40 border border-primary/30">
              <div className="min-w-0 flex-1">
                <a
                  href={lastShortened.shortUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="font-mono text-base font-bold text-primary hover:underline truncate block"
                >
                  {lastShortened.shortUrl}
                </a>
                <p className="text-xs text-muted-foreground truncate font-mono mt-0.5">
                  → {lastShortened.originalUrl}
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => handleCopy(lastShortened.code, lastShortened.shortUrl)}
                  className="btn-glow px-4 py-2 text-xs flex items-center gap-1.5 rounded-xl cursor-pointer"
                >
                  {copiedCode === lastShortened.code ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-300" />
                      <span>Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => setQrModalUrl(lastShortened.shortUrl)}
                  className="p-2 rounded-xl bg-secondary hover:bg-secondary/80 text-foreground border border-border transition cursor-pointer"
                  title="Generate QR Code"
                >
                  <QrCode className="w-4 h-4" />
                </button>

                <a
                  href={lastShortened.shortUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="p-2 rounded-xl bg-secondary hover:bg-secondary/80 text-foreground border border-border transition"
                  title="Test redirect to original URL"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* RECENT LINKS */}
      <div className="glass-panel p-5 sm:p-6 rounded-3xl border border-white/10 space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-border/50">
          <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
            <span>Recent Links</span>
            {mounted && allLinks.length > 0 && (
              <span className="px-2 py-0.5 text-[10px] font-mono rounded-full bg-secondary text-muted-foreground border border-border">
                {allLinks.length}
              </span>
            )}
          </h3>

          {mounted && allLinks.length > 0 && (
            <button
              type="button"
              onClick={handleClearHistory}
              className="text-[11px] text-muted-foreground hover:text-destructive transition-colors flex items-center gap-1 cursor-pointer"
            >
              <Trash2 className="w-3 h-3" />
              <span>Clear</span>
            </button>
          )}
        </div>

        {!mounted ? (
          <p className="text-xs text-muted-foreground py-3 text-center">Loading links…</p>
        ) : allLinks.length === 0 ? (
          <p className="text-xs text-muted-foreground py-4 text-center">
            No shortened links yet. Create your first link above!
          </p>
        ) : (
          <div className="space-y-2">
            {allLinks.slice(0, 5).map((item) => {
              const shortUrl = `${currentHost}/${item.code}`
              return (
                <div
                  key={item.code}
                  className="flex items-center justify-between gap-3 p-3 rounded-xl bg-secondary/30 hover:bg-secondary/60 border border-border/60 transition-colors"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-primary truncate max-w-[220px]">
                        /{item.code}
                      </span>
                      {item.isCustom && (
                        <span className="px-1.5 py-0.2 text-[9px] font-semibold uppercase rounded bg-primary/15 text-primary border border-primary/20">
                          Custom
                        </span>
                      )}
                      <span className="text-[10px] text-muted-foreground flex items-center gap-1 font-mono">
                        <Clock className="w-2.5 h-2.5" />
                        {formatRelativeTime(item.createdAt)}
                      </span>
                    </div>
                    <p className="text-[11px] text-muted-foreground font-mono truncate mt-0.5">
                      → {item.url}
                    </p>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      type="button"
                      onClick={() => handleCopy(item.code, shortUrl)}
                      className="p-1.5 rounded-lg bg-secondary hover:bg-secondary/80 text-foreground transition cursor-pointer"
                      title="Copy URL"
                    >
                      {copiedCode === item.code ? (
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={() => setQrModalUrl(shortUrl)}
                      className="p-1.5 rounded-lg bg-secondary hover:bg-secondary/80 text-foreground transition cursor-pointer"
                      title="QR Code"
                    >
                      <QrCode className="w-3.5 h-3.5" />
                    </button>

                    <a
                      href={shortUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="p-1.5 rounded-lg bg-secondary hover:bg-secondary/80 text-foreground transition"
                      title="Test short link redirect"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>

                    <button
                      type="button"
                      onClick={() => handleDelete(item.code)}
                      className="p-1.5 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition cursor-pointer"
                      title="Delete"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* QR Code Modal */}
      {qrModalUrl && (
        <QrModal
          url={qrModalUrl}
          isOpen={Boolean(qrModalUrl)}
          onClose={() => setQrModalUrl(null)}
        />
      )}
    </div>
  )
}
