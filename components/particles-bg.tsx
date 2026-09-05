"use client"

import { useEffect, useRef } from "react"

type Particle = {
  x: number
  y: number
  vx: number
  vy: number
  r: number
  a: number
}

export default function ParticlesBackground() {
  const ref = useRef<HTMLCanvasElement | null>(null)
  const rafRef = useRef<number | null>(null)

  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const activeCanvas = canvas
    const activeCtx = ctx

    const DPR = Math.min(window.devicePixelRatio || 1, 2)
    let width = (activeCanvas.width = window.innerWidth * DPR)
    let height = (activeCanvas.height = window.innerHeight * DPR)
    activeCanvas.style.width = `${window.innerWidth}px`
    activeCanvas.style.height = `${window.innerHeight}px`

    const particles: Particle[] = []
    const count = Math.min(120, Math.floor((window.innerWidth * window.innerHeight) / 15000))

    function rand(min: number, max: number) {
      return Math.random() * (max - min) + min
    }

    for (let i = 0; i < count; i++) {
      particles.push({
        x: rand(0, width),
        y: rand(0, height),
        vx: rand(-0.2, 0.2) * DPR,
        vy: rand(-0.2, 0.2) * DPR,
        r: rand(0.6, 1.8) * DPR,
        a: rand(0.2, 0.8),
      })
    }

    function draw() {
      activeCtx.clearRect(0, 0, width, height)

      // soft vignette overlay blends with background gradients
      activeCtx.fillStyle = "rgba(0,0,0,0.10)"
      activeCtx.fillRect(0, 0, width, height)

      // particles
      for (const p of particles) {
        p.x += p.vx
        p.y += p.vy

        if (p.x < 0 || p.x > width) p.vx *= -1
        if (p.y < 0 || p.y > height) p.vy *= -1

        activeCtx.beginPath()
        activeCtx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        activeCtx.closePath()
        activeCtx.fillStyle = `rgba(180, 200, 255, ${p.a})`
        activeCtx.fill()
      }

      // subtle connections
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const a = particles[i]
          const b = particles[j]
          const dx = a.x - b.x
          const dy = a.y - b.y
          const dist2 = dx * dx + dy * dy
          if (dist2 < 12000) {
            const alpha = Math.max(0, 1 - dist2 / 12000) * 0.15
            activeCtx.strokeStyle = `rgba(160, 180, 255, ${alpha})`
            activeCtx.lineWidth = 1 * DPR
            activeCtx.beginPath()
            activeCtx.moveTo(a.x, a.y)
            activeCtx.lineTo(b.x, b.y)
            activeCtx.stroke()
          }
        }
      }

      rafRef.current = requestAnimationFrame(draw)
    }

    draw()

    function onResize() {
      width = activeCanvas.width = window.innerWidth * DPR
      height = activeCanvas.height = window.innerHeight * DPR
      activeCanvas.style.width = `${window.innerWidth}px`
      activeCanvas.style.height = `${window.innerHeight}px`
    }

    window.addEventListener("resize", onResize)
    return () => {
      window.removeEventListener("resize", onResize)
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [])

  return <canvas id="particles-canvas" ref={ref} aria-hidden />
}
