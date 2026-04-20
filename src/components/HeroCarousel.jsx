import { useEffect, useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight, ArrowRight, Play } from 'lucide-react'
import { Link } from 'react-router-dom'

const SLIDES = [
  {
    id: 1,
    image: '/hero-1.jpg',
    eyebrow: '🦁 Kenya\'s Wild Beauty',
    title: 'The Land\nWe Love',
    highlight: 'Love',
    sub: 'From the golden savannas of Maasai Mara to the shores of Lake Victoria — 47 million voices shaping the soul of a great nation.',
    cta: 'Explore Counties',
    ctaLink: '/counties',
    secondaryCta: 'Read Blog',
    secondaryLink: '/blog',
    accent: '#e8a000',
  },
  {
    id: 2,
    image: '/hero-2.jpg',
    eyebrow: '🌊 Kenya\'s Coastal Heritage',
    title: 'A Nation\nOf Beauty',
    highlight: 'Beauty',
    sub: 'From Lamu\'s ancient dhow harbours to Mombasa\'s coral reefs — Kenya\'s coast carries centuries of culture and history.',
    cta: 'Explore Counties',
    ctaLink: '/counties',
    secondaryCta: 'Read Blog',
    secondaryLink: '/blog',
    accent: '#00d4ff',
  },
  {
    id: 3,
    image: '/hero-3.jpg',
    eyebrow: '⛰️ Rise Like Kilimanjaro',
    title: 'Know Your\nLeaders',
    highlight: 'Leaders',
    sub: 'Just as Kilimanjaro rises above the clouds, Kenya\'s future demands leaders who stand tall for every citizen.',
    cta: 'View Candidates',
    ctaLink: '/candidates',
    secondaryCta: 'Live Analytics',
    secondaryLink: '/analytics',
    accent: '#006600',
  },
  {
    id: 4,
    image: '/hero-4.jpg',
    eyebrow: '🏙️ Urban Kenya Rising',
    title: 'Urban Kenya\nDemands More',
    highlight: 'More',
    sub: 'Silicon Savannah to the streets — Kenya\'s urban revolution demands transparent, accountable, servant leadership.',
    cta: 'Meet the Candidates',
    ctaLink: '/candidates',
    secondaryCta: 'Explore Blog',
    secondaryLink: '/blog',
    accent: '#C8102E',
  },
  {
    id: 5,
    image: '/hero-5.jpg',
    eyebrow: '🔥 Niko Kadi Movement',
    title: 'I Am Here.\nI Vote.',
    highlight: 'Vote.',
    sub: 'Join millions of Kenyans saying NO to poor leadership. Niko Kadi — I am here, I stand, and I will be counted.',
    cta: 'Join the Movement',
    ctaLink: '/candidates',
    secondaryCta: 'View Analytics',
    secondaryLink: '/analytics',
    accent: '#C8102E',
  },
]

const STATS = [
  { val: '9+',   label: 'Candidates' },
  { val: '47',   label: 'Counties' },
  { val: '22M+', label: 'Voters' },
  { val: '2027', label: 'Election' },
]

export default function HeroCarousel() {
  const [idx, setIdx] = useState(0)
  const [paused, setPaused] = useState(false)
  const timerRef = useRef(null)

  const go = (n) => {
    setIdx((i) => (i + n + SLIDES.length) % SLIDES.length)
    setPaused(true)
    clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => setPaused(false), 8000)
  }

  useEffect(() => {
    if (paused) return
    const t = setInterval(() => setIdx((i) => (i + 1) % SLIDES.length), 6000)
    return () => clearInterval(t)
  }, [paused])

  const slide = SLIDES[idx]

  return (
    <div className="relative w-full h-screen min-h-[640px] max-h-[960px] overflow-hidden bg-black">

      {/* ── Background images ── */}
      <AnimatePresence initial={false}>
        <motion.div
          key={idx}
          initial={{ scale: 1.06, opacity: 0 }}
          animate={{ scale: 1,    opacity: 1 }}
          exit={{   scale: 0.98,  opacity: 0 }}
          transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
          className="absolute inset-0"
        >
          <img src={slide.image} alt="" className="w-full h-full object-cover object-center" />
          {/* layered overlays — keep text clearly readable */}
          <div className="absolute inset-0 bg-black/50" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/50 to-black/20" />
          <div className="absolute inset-0 bg-gradient-to-t from-urban-bg via-urban-bg/60 to-transparent" />
          <div className="absolute inset-0" style={{ background: `radial-gradient(ellipse 60% 80% at 15% 50%, ${slide.accent}18 0%, transparent 60%)` }} />
        </motion.div>
      </AnimatePresence>

      {/* ── Kenyan flag left accent ── */}
      <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-kenya-red via-black to-kenya-green z-10" />

      {/* ── Slide counter ── */}
      <div className="absolute top-24 right-6 z-20 hidden md:flex flex-col gap-2">
        {SLIDES.map((_, i) => (
          <button
            key={i}
            onClick={() => { setIdx(i); setPaused(true) }}
            className={`rounded-full transition-all duration-300 ${
              i === idx ? 'w-1.5 h-8 bg-white' : 'w-1.5 h-1.5 bg-white/20 hover:bg-white/40'
            }`}
          />
        ))}
      </div>

      {/* ── Content ── */}
      <div className="relative z-10 h-full flex flex-col justify-center px-6 md:px-16 lg:px-24 max-w-7xl mx-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={idx}
            initial={{ opacity: 0, x: -32 }}
            animate={{ opacity: 1, x: 0  }}
            exit={{   opacity: 0, x: 32  }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-2xl"
          >
            {/* Eyebrow */}
            <motion.div
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-6 text-xs font-semibold text-white/80 tracking-wider uppercase"
              style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)', backdropFilter: 'blur(8px)' }}
            >
              {slide.eyebrow}
            </motion.div>

            {/* Headline */}
            <h1 className="font-display font-bold text-white leading-[1.05] tracking-tight mb-5"
              style={{ fontSize: 'clamp(3rem, 7vw, 6rem)' }}>
              {slide.title.split('\n').map((line, li) => (
                <div key={li}>
                  {line.includes(slide.highlight) ? (
                    <>
                      {line.split(slide.highlight)[0]}
                      <span className="gradient-text-red glow-red">{slide.highlight}</span>
                      {line.split(slide.highlight)[1]}
                    </>
                  ) : line}
                </div>
              ))}
            </h1>

            {/* Sub */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.35 }}
              className="text-gray-200 text-base md:text-lg leading-relaxed mb-8 max-w-lg drop-shadow-[0_1px_4px_rgba(0,0,0,0.8)]"
            >
              {slide.sub}
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45 }}
              className="flex flex-wrap gap-3"
            >
              <Link to={slide.ctaLink} className="btn-primary flex items-center gap-2 text-sm">
                {slide.cta}
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link to={slide.secondaryLink} className="btn-ghost flex items-center gap-2 text-sm">
                {slide.secondaryCta}
              </Link>
            </motion.div>
          </motion.div>
        </AnimatePresence>

        {/* ── Stats bar ── */}
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.6 }}
          className="absolute bottom-20 left-6 md:left-16 lg:left-24 flex gap-8 md:gap-12"
        >
          {STATS.map(({ val, label }) => (
            <div key={label}>
              <div className="text-2xl md:text-3xl font-display font-bold gradient-text-red">{val}</div>
              <div className="text-2xs text-urban-muted uppercase tracking-widest mt-0.5">{label}</div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* ── Prev / Next ── */}
      {['prev','next'].map((dir) => (
        <button
          key={dir}
          onClick={() => go(dir === 'prev' ? -1 : 1)}
          className={`absolute top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full flex items-center justify-center
            transition-all duration-200 group
            ${dir === 'prev' ? 'left-4 md:left-8' : 'right-4 md:right-8'}`}
          style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', backdropFilter: 'blur(8px)' }}
        >
          {dir === 'prev'
            ? <ChevronLeft className="w-5 h-5 text-white/60 group-hover:text-white transition-colors" />
            : <ChevronRight className="w-5 h-5 text-white/60 group-hover:text-white transition-colors" />
          }
        </button>
      ))}

      {/* ── Scroll hint ── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-1"
      >
        <span className="text-2xs text-white/30 uppercase tracking-[0.2em]">Scroll</span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
          className="w-px h-8 bg-gradient-to-b from-white/30 to-transparent"
        />
      </motion.div>
    </div>
  )
}
