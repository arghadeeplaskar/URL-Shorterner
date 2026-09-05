"use client"

import { Zap, ShieldCheck, QrCode, BarChart3, Layers, Sparkles, ArrowUpRight } from "lucide-react"

const FEATURES = [
  {
    icon: Zap,
    badge: "Performance",
    title: "Sub-Millisecond Routing",
    description: "Instant in-memory hash resolution routes visitors to destinations without any intermediate delay or ad gates.",
    gradient: "from-amber-500/20 via-orange-500/10 to-transparent",
    iconColor: "text-amber-400",
  },
  {
    icon: QrCode,
    badge: "Marketing",
    title: "Vector QR Code Studio",
    description: "Generate high-density scannable QR codes on demand. Download crisp PNGs for flyers, events, and slides.",
    gradient: "from-purple-500/20 via-pink-500/10 to-transparent",
    iconColor: "text-purple-400",
  },
  {
    icon: ShieldCheck,
    badge: "Privacy",
    title: "Zero-Tracking Vault",
    description: "Private by design. Your links and metadata stay stored safely in your local environment with zero data selling.",
    gradient: "from-emerald-500/20 via-teal-500/10 to-transparent",
    iconColor: "text-emerald-400",
  },
  {
    icon: BarChart3,
    badge: "Telemetry",
    title: "Real-Time Click Tracking",
    description: "Monitor engagement counters, last-accessed timestamps, and referral tags without external analytics bloat.",
    gradient: "from-blue-500/20 via-indigo-500/10 to-transparent",
    iconColor: "text-blue-400",
  },
  {
    icon: Layers,
    badge: "Productivity",
    title: "Bulk Link Processing",
    description: "Paste batches of long links to convert dozens of URLs into clean shareable links in a single operation.",
    gradient: "from-cyan-500/20 via-blue-500/10 to-transparent",
    iconColor: "text-cyan-400",
  },
  {
    icon: Sparkles,
    badge: "Branding",
    title: "Custom Vanity Aliases",
    description: "Replace cryptic hashes with human-readable slugs like /s/launch or /s/portfolio to boost click-through trust.",
    gradient: "from-violet-500/20 via-purple-500/10 to-transparent",
    iconColor: "text-violet-400",
  },
]

export default function FeaturesGrid() {
  return (
    <section id="features" className="w-full max-w-7xl mx-auto mt-20 pt-8 border-t border-border/40">
      <div className="text-center max-w-2xl mx-auto mb-12">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold uppercase tracking-wider mb-3">
          <Sparkles className="w-3.5 h-3.5" />
          Enterprise-Grade Features
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
          Engineered for <span className="text-gradient-purple">Velocity & Control</span>
        </h2>
        <p className="text-sm sm:text-base text-muted-foreground mt-2">
          Everything you need to shorten, customize, organize, and distribute URLs with complete clarity.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {FEATURES.map((feature, idx) => {
          const Icon = feature.icon
          return (
            <div
              key={idx}
              className="group relative glass-panel p-6 rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-xl"
            >
              {/* Subtle top corner gradient glow */}
              <div
                className={`absolute -top-16 -right-16 w-36 h-36 rounded-full bg-gradient-to-br ${feature.gradient} blur-2xl opacity-60 group-hover:opacity-100 transition-opacity`}
              />

              <div className="relative z-10 flex flex-col h-full">
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-2.5 rounded-xl bg-secondary/80 border border-border/60 ${feature.iconColor} shadow-inner group-hover:scale-110 transition-transform`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-[11px] font-medium tracking-wide uppercase px-2 py-0.5 rounded-full bg-secondary/60 text-muted-foreground border border-border/50">
                    {feature.badge}
                  </span>
                </div>

                <h3 className="text-base font-semibold text-foreground group-hover:text-primary transition-colors flex items-center gap-1">
                  {feature.title}
                </h3>
                <p className="text-xs sm:text-sm text-muted-foreground mt-2 leading-relaxed flex-grow">
                  {feature.description}
                </p>

                <div className="mt-4 pt-3 border-t border-border/40 flex items-center justify-between text-xs text-muted-foreground group-hover:text-foreground transition-colors">
                  <span className="text-[11px] font-mono">Available Out of the Box</span>
                  <ArrowUpRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}
