import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ArrowRight, Flame, Zap } from 'lucide-react'
import { useApp } from '../context/AppContext'

const ADS = [
  {
    id: 1,
    label: '🔥 HOT MOVEMENT',
    title: 'NIKO KADI',
    sub: 'I Am Here. I Vote. I Matter.',
    desc: 'Join 2.4 million Kenyans demanding accountable leadership, youth empowerment, and a future built for every citizen.',
    cta: 'Join the Movement',
    Icon: Flame,
    stats: [['2.4M','Members'],['47','Counties'],['Rising','Fast']],
    glow: 'rgba(200,16,46,0.25)',
    border: 'rgba(200,16,46,0.25)',
    accent: '#C8102E',
    bg: 'from-kenya-red/10 via-transparent to-transparent',
    pill: 'bg-kenya-red/15 border-kenya-red/25 text-red-300',
  },
  {
    id: 2,
    label: '⚡ GEN Z POWER',
    title: 'GEN Z UNITY',
    sub: 'The Youth Have Woken.',
    desc: 'Non-partisan civic movement empowering 30 million young Kenyans to reshape the political landscape of Kenya 2027.',
    cta: 'Unite With Us',
    Icon: Zap,
    stats: [['800K+','Youth'],['30M','Eligible'],['Change','Is Now']],
    glow: 'rgba(0,212,255,0.2)',
    border: 'rgba(0,212,255,0.2)',
    accent: '#00d4ff',
    bg: 'from-urban-accent/10 via-transparent to-transparent',
    pill: 'bg-urban-accent/15 border-urban-accent/25 text-cyan-300',
  },
]

export default function AdCarousel() {
  const { showAdModal, setShowAdModal } = useApp()
  const [i, setI] = useState(0)

  useEffect(() => {
    if (!showAdModal) return
    const t = setInterval(() => setI((p) => (p + 1) % ADS.length), 7000)
    return () => clearInterval(t)
  }, [showAdModal])

  if (!showAdModal) return null

  const ad = ADS[i]

  return (
    <AnimatePresence>
      <motion.div
        key="overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center p-4 modal-overlay"
        style={{ background: 'rgba(0,0,0,0.75)' }}
        onClick={() => setShowAdModal(false)}
      >
        <motion.div
          key={ad.id}
          initial={{ scale: 0.88, opacity: 0, y: 32 }}
          animate={{ scale: 1,    opacity: 1, y: 0  }}
          exit={{   scale: 0.92,  opacity: 0, y: -16 }}
          transition={{ type: 'spring', damping: 22, stiffness: 280 }}
          onClick={(e) => e.stopPropagation()}
          className={`relative w-full max-w-md rounded-2xl overflow-hidden`}
          style={{
            background: 'rgba(10,10,14,0.95)',
            border: `1px solid ${ad.border}`,
            boxShadow: `0 0 60px ${ad.glow}, 0 32px 64px rgba(0,0,0,0.6)`,
          }}
        >
          {/* Top gradient band */}
          <div className="h-0.5" style={{ background: `linear-gradient(90deg, transparent, ${ad.accent}, transparent)` }} />

          {/* Close */}
          <button
            onClick={() => setShowAdModal(false)}
            className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center text-urban-muted hover:text-white bg-white/[0.06] hover:bg-white/[0.10] transition-all z-10"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="p-7">
            {/* Pill */}
            <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-[10px] font-bold uppercase tracking-widest mb-5 ${ad.pill}`}>
              {ad.label}
            </div>

            {/* Icon */}
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4"
              style={{ background: `${ad.accent}18`, border: `1px solid ${ad.accent}30` }}>
              <ad.Icon className="w-7 h-7" style={{ color: ad.accent }} />
            </div>

            {/* Text */}
            <h2 className="text-3xl font-display font-bold mb-1" style={{ color: ad.accent }}>
              {ad.title}
            </h2>
            <p className="text-white font-semibold mb-3">{ad.sub}</p>
            <p className="text-urban-muted text-sm leading-relaxed mb-6">{ad.desc}</p>

            {/* Stats row */}
            <div className="flex gap-5 mb-6">
              {ad.stats.map(([val, lbl]) => (
                <div key={lbl}>
                  <div className="text-sm font-bold text-white">{val}</div>
                  <div className="text-[10px] text-urban-muted uppercase tracking-wider">{lbl}</div>
                </div>
              ))}
            </div>

            {/* CTAs */}
            <div className="flex gap-3">
              <button className="flex-1 btn-primary flex items-center justify-center gap-2 text-sm"
                onClick={() => setShowAdModal(false)}>
                <ArrowRight className="w-4 h-4" />
                {ad.cta}
              </button>
              <button onClick={() => setShowAdModal(false)} className="btn-ghost text-sm px-4">
                Close
              </button>
            </div>
          </div>

          {/* Indicators */}
          <div className="flex justify-center gap-1.5 pb-4">
            {ADS.map((_, j) => (
              <button key={j} onClick={() => setI(j)}
                className={`rounded-full transition-all duration-300 ${j === i ? 'w-6 h-1.5 bg-white/60' : 'w-1.5 h-1.5 bg-white/20'}`} />
            ))}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
