"use client"

import { useEffect, useState } from "react"
import { QrCode, Download, Copy, Check, X, ExternalLink } from "lucide-react"

interface QrModalProps {
  url: string
  isOpen: boolean
  onClose: () => void
}

export default function QrModal({ url, isOpen, onClose }: QrModalProps) {
  const [dataUrl, setDataUrl] = useState<string>("")
  const [copied, setCopied] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!isOpen || !url) return

    let isSubscribed = true
    setLoading(true)

    // dynamic import of qrcode for client safety
    import("qrcode")
      .then((QRCode) => {
        return QRCode.toDataURL(url, {
          width: 380,
          margin: 2,
          color: {
            dark: "#0b0d13",
            light: "#ffffff",
          },
        })
      })
      .then((generatedUrl) => {
        if (isSubscribed) {
          setDataUrl(generatedUrl)
          setLoading(false)
        }
      })
      .catch((err) => {
        console.error("QR Code error:", err)
        setLoading(false)
      })

    return () => {
      isSubscribed = false
    }
  }, [isOpen, url])

  if (!isOpen) return null

  const handleDownload = () => {
    if (!dataUrl) return
    const link = document.createElement("a")
    link.download = `d4xa1-qr-${Date.now()}.png`
    link.href = dataUrl
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handleCopyImage = async () => {
    if (!dataUrl) return
    try {
      const res = await fetch(dataUrl)
      const blob = await res.blob()
      await navigator.clipboard.write([
        new ClipboardItem({
          [blob.type]: blob,
        }),
      ])
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // fallback copy URL
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-sm glass-panel p-6 border border-white/10 shadow-2xl bg-gradient-to-b from-card/95 to-card/90 text-card-foreground rounded-2xl animate-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
        aria-labelledby="qr-modal-title"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-border/60">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-primary/10 text-primary">
              <QrCode className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 id="qr-modal-title" className="text-base font-semibold leading-none">Instant QR Code</h3>
              <p className="text-xs text-muted-foreground mt-0.5">High-resolution vector matrix</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-colors"
            aria-label="Close modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* QR Display Area */}
        <div className="my-5 flex flex-col items-center justify-center">
          <div className="p-3 bg-white rounded-xl shadow-lg border border-border/30 transition-transform duration-300 hover:scale-[1.02]">
            {loading ? (
              <div className="w-52 h-52 flex items-center justify-center text-xs text-muted-foreground">
                <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin mr-2" />
                Generating QR...
              </div>
            ) : dataUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={dataUrl}
                alt={`QR code for ${url}`}
                className="w-52 h-52 object-contain rounded-lg"
              />
            ) : (
              <div className="w-52 h-52 flex items-center justify-center text-xs text-destructive">
                Failed to render QR
              </div>
            )}
          </div>

          <p className="mt-3 text-xs text-center text-muted-foreground max-w-[260px] truncate font-mono bg-secondary/40 px-2.5 py-1 rounded-md border border-border/50">
            {url}
          </p>
        </div>

        {/* Actions */}
        <div className="grid grid-cols-2 gap-2 pt-2 border-t border-border/50">
          <button
            onClick={handleDownload}
            disabled={!dataUrl || loading}
            className="btn-secondary-modern text-xs py-2.5 w-full flex items-center justify-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download PNG</span>
          </button>

          <button
            onClick={handleCopyImage}
            disabled={!dataUrl || loading}
            className="btn-glow text-xs py-2.5 w-full flex items-center justify-center gap-1.5"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-300" />
                <span>Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy QR</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
