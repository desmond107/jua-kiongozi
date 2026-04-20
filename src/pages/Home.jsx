import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Link } from 'react-router-dom'
import {
  BarChart3, Users, MapPin, BookOpen, ArrowRight, Shield,
  Vote, Flame, Zap, TrendingUp, AlertCircle, ChevronRight,
} from 'lucide-react'
import HeroCarousel from '../components/HeroCarousel'
import CandidateCard from '../components/CandidateCard'
import { VoteBarChart, LeaderboardChart } from '../components/AnalyticsCharts'
import { PRESIDENTIAL_CANDIDATES } from '../utils/candidatesData'

/* ── helpers ─────────────────────────────────────────────── */
const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-60px' },
  transition: { duration: 0.65, delay, ease: [0.16, 1, 0.3, 1] },
})

const SectionLabel = ({ children }) => (
  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/[0.07] bg-white/[0.03] text-xs font-semibold text-urban-muted uppercase tracking-widest mb-4">
    {children}
  </div>
)

/* ── data ────────────────────────────────────────────────── */
const FEATURES = [
  { icon: Users,    title: 'All Candidates',   desc: 'Full profiles — manifesto, education, achievements and party info for every contender.', accent: 'from-kenya-red/20 to-transparent',    border: 'hover:border-kenya-red/30',     iconBg: 'bg-kenya-red/10',    iconColor: 'text-kenya-red',    link: '/candidates' },
  { icon: Vote,     title: 'Cast Your Voice',  desc: 'Vote Yes, No, or Not Sure. Track whether Kenyans support or oppose each candidate.',     accent: 'from-urban-accent/15 to-transparent', border: 'hover:border-urban-accent/30', iconBg: 'bg-urban-accent/10', iconColor: 'text-urban-accent', link: '/candidates' },
  { icon: BarChart3,title: 'Live Analytics',   desc: 'Real-time charts and approval ratings updated with every vote cast on the platform.',     accent: 'from-urban-gold/15 to-transparent',   border: 'hover:border-urban-gold/30',  iconBg: 'bg-urban-gold/10',   iconColor: 'text-urban-gold',  link: '/analytics' },
  { icon: MapPin,   title: '47 Counties',      desc: 'Explore leadership positions and candidates from every Kenyan county.',                  accent: 'from-green-500/15 to-transparent',    border: 'hover:border-green-500/30',   iconBg: 'bg-green-500/10',    iconColor: 'text-green-400',   link: '/counties' },
]

const STATS = [
  { val: 'August 2027', label: 'Election Date',           icon: '📅', color: 'gradient-text-red' },
  { val: '22M+',        label: 'Registered Voters',       icon: '🗳️', color: 'text-urban-gold'   },
  { val: '6',           label: 'Votes Per Citizen',       icon: '🏛️', color: 'text-urban-accent'  },
  { val: '9+',          label: 'Presidential Candidates', icon: '👤', color: 'gradient-text-red'  },
  { val: '47',          label: 'Kenyan Counties',         icon: '📍', color: 'text-green-400'     },
  { val: '~365',        label: 'Days to Election',        icon: '⏳', color: 'text-purple-400'    },
]

const MOVEMENTS = [
  {
    name: 'Niko Kadi Movement', tagline: 'I Am Here. I Vote. I Matter.',
    desc: 'A grassroots civic movement demanding accountability, youth empowerment, and a Kenya that works for all 47 million of its people.',
    icon: Flame, members: '2.4M Members',
    bg: 'bg-gradient-to-br from-kenya-red/10 via-transparent to-transparent',
    border: 'border-kenya-red/15 hover:border-kenya-red/35',
    accent: 'text-kenya-red', badgeBg: 'bg-kenya-red/10 border-kenya-red/20',
  },
  {
    name: 'Gen Z Unity Kenya', tagline: 'The Youth Have Woken.',
    desc: 'Non-partisan civic platform empowering 30 million young Kenyans to demand accountability and reshape the 2027 political landscape.',
    icon: Zap, members: '800K+ Youth',
    bg: 'bg-gradient-to-br from-urban-accent/10 via-transparent to-transparent',
    border: 'border-urban-accent/15 hover:border-urban-accent/35',
    accent: 'text-urban-accent', badgeBg: 'bg-urban-accent/10 border-urban-accent/20',
  },
]

/* ── component ───────────────────────────────────────────── */
export default function Home() {
  return (
    <div className="min-h-screen bg-urban-bg">
      <HeroCarousel />

      {/* ── Alert ticker ── */}
      <div className="relative overflow-hidden bg-kenya-red/[0.07] border-y border-kenya-red/10">
        <div className="flex items-center gap-3 px-4 py-2.5">
          <div className="flex items-center gap-1.5 shrink-0">
            <span className="w-1.5 h-1.5 rounded-full bg-kenya-red animate-pulse-red" />
            <span className="text-[10px] font-bold text-kenya-red uppercase tracking-widest">Live</span>
          </div>
          <div className="overflow-hidden flex-1">
            <div className="animate-marquee flex gap-16 whitespace-nowrap">
              {[...Array(2)].map((_, j) => (
                <div key={j} className="flex gap-16">
                  {[
                    '🇰🇪 Kenya General Election 2027 — August',
                    '🗳️ Voter Registration: Visit any IEBC centre',
                    '🔥 Niko Kadi Movement growing nationwide',
                    '⚡ Gen Z Unity — 800K youth registered',
                    '📊 Live voting analytics now available',
                    '🏛️ 9 Presidential candidates announced',
                  ].map((t) => (
                    <span key={t} className="text-xs text-gray-400">{t}</span>
                  ))}
                </div>
              ))}
            </div>
          </div>
          <a href="https://www.iebc.or.ke" target="_blank" rel="noopener noreferrer"
            className="shrink-0 flex items-center gap-1 text-[10px] font-semibold text-urban-accent hover:text-white transition-colors">
            Register <ChevronRight className="w-3 h-3" />
          </a>
        </div>
      </div>

      {/* ── Features ── */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div {...fadeUp()} className="text-center mb-14">
          <SectionLabel>🇰🇪 Platform Features</SectionLabel>
          <h2 className="section-title mb-4">
            Everything You Need to<br />
            <span className="gradient-text-brand">Know Your Leaders</span>
          </h2>
          <p className="section-subtitle mx-auto text-center">
            Jua Kiongozi is Kenya's most comprehensive political platform — built to inform, educate, and empower citizens ahead of 2027.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {FEATURES.map(({ icon: Icon, title, desc, accent, border, iconBg, iconColor, link }, i) => (
            <motion.div key={title} {...fadeUp(i * 0.08)}>
              <Link to={link}
                className={`block h-full p-6 rounded-2xl border border-white/[0.06] ${border} bg-gradient-to-br ${accent}
                  hover:-translate-y-1 transition-all duration-300 group`}
                style={{ background: `linear-gradient(135deg, var(--tw-gradient-from), transparent)` }}
              >
                <div className={`w-11 h-11 rounded-xl ${iconBg} border border-white/[0.06] flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300`}>
                  <Icon className={`w-5 h-5 ${iconColor}`} />
                </div>
                <h3 className="font-display font-bold text-white text-base mb-2">{title}</h3>
                <p className="text-sm text-urban-muted leading-relaxed mb-4">{desc}</p>
                <div className={`flex items-center gap-1 text-xs font-semibold ${iconColor}`}>
                  Explore <ArrowRight className="w-3 h-3" />
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── Candidates ── */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/[0.015] to-transparent" />
        <div className="absolute inset-0 border-y border-white/[0.04]" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-14">
            <motion.div {...fadeUp()}>
              <SectionLabel>🏛️ Presidential Race</SectionLabel>
              <h2 className="section-title">
                Meet the <span className="gradient-text-red">Candidates</span>
              </h2>
              <p className="section-subtitle mt-3">Vote, rate, and engage with Kenya's 2027 presidential contenders.</p>
            </motion.div>
            <motion.div {...fadeUp(0.1)} className="hidden md:block shrink-0">
              <Link to="/candidates"
                className="flex items-center gap-2 text-sm font-semibold text-urban-muted hover:text-white transition-colors group">
                View all
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {PRESIDENTIAL_CANDIDATES.slice(0, 6).map((c, i) => (
              <CandidateCard key={c.id} candidate={c} index={i} />
            ))}
          </div>

          <motion.div {...fadeUp(0.3)} className="mt-10 text-center md:hidden">
            <Link to="/candidates" className="btn-secondary inline-flex">
              View All Candidates <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ── Analytics preview ── */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div {...fadeUp()} className="text-center mb-14">
          <SectionLabel>📊 Live Data</SectionLabel>
          <h2 className="section-title">
            Real-Time <span className="gradient-text-cyan">Analytics</span>
          </h2>
          <p className="section-subtitle mx-auto text-center">
            Watch public opinion shift live as Kenyans cast their voices on this platform.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <motion.div {...fadeUp(0.1)} className="lg:col-span-2 card p-6">
            <div className="flex items-center gap-2 mb-5">
              <BarChart3 className="w-4 h-4 text-urban-accent" />
              <h3 className="font-semibold text-white text-sm">Vote Distribution — All Candidates</h3>
              <span className="ml-auto text-[10px] px-2 py-0.5 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 font-semibold">Live</span>
            </div>
            <VoteBarChart />
          </motion.div>

          <motion.div {...fadeUp(0.2)} className="card p-6 flex flex-col">
            <div className="flex items-center gap-2 mb-5">
              <TrendingUp className="w-4 h-4 text-urban-gold" />
              <h3 className="font-semibold text-white text-sm">Support Leaderboard</h3>
            </div>
            <div className="flex-1">
              <LeaderboardChart />
            </div>
            <Link to="/analytics"
              className="mt-6 flex items-center justify-center gap-2 py-2.5 rounded-xl border border-white/[0.07] hover:border-urban-accent/30 text-xs font-semibold text-urban-muted hover:text-urban-accent transition-all duration-200">
              Full Analytics Dashboard <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ── Stats ── */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 border-y border-white/[0.04]" />
        <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse 60% 80% at 50% 50%, rgba(200,16,46,0.04) 0%, transparent 70%)' }} />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div {...fadeUp()} className="text-center mb-12">
            <h2 className="section-title">Kenya Election 2027 — Key Facts</h2>
          </motion.div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {STATS.map(({ val, label, icon, color }, i) => (
              <motion.div key={label} {...fadeUp(i * 0.06)} className="text-center">
                <div className="text-3xl mb-2">{icon}</div>
                <div className={`text-xl md:text-2xl font-display font-bold mb-1 ${color}`}>{val}</div>
                <div className="text-[11px] text-urban-muted uppercase tracking-wider">{label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Movements ── */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div {...fadeUp()} className="text-center mb-14">
          <SectionLabel>⚡ Rising Movements</SectionLabel>
          <h2 className="section-title">Kenya's Political Movements</h2>
          <p className="section-subtitle mx-auto text-center">
            The forces reshaping Kenya's 2027 election from the grassroots up.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {MOVEMENTS.map(({ name, tagline, desc, icon: Icon, members, bg, border, accent, badgeBg }, i) => (
            <motion.div
              key={name}
              {...fadeUp(i * 0.1)}
              className={`relative rounded-2xl border ${border} ${bg} p-8 overflow-hidden transition-all duration-400`}
            >
              {/* Inner glow */}
              <div className="absolute inset-0 rounded-2xl opacity-0 hover:opacity-100 transition-opacity duration-400"
                style={{ background: 'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(255,255,255,0.03) 0%, transparent 60%)' }} />

              <div className="relative flex items-start justify-between mb-6">
                <div className={`w-12 h-12 rounded-xl ${badgeBg} border flex items-center justify-center`}>
                  <Icon className={`w-6 h-6 ${accent}`} />
                </div>
                <span className={`badge ${badgeBg.replace('bg-','bg-').replace('/10','/')} ${accent} border text-[10px]`}>
                  {members}
                </span>
              </div>

              <h3 className={`text-2xl font-display font-bold ${accent} mb-1`}>{name}</h3>
              <p className="text-white font-semibold mb-3 text-sm">{tagline}</p>
              <p className="text-urban-muted text-sm leading-relaxed">{desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-28 relative overflow-hidden">
        <div className="absolute inset-0 border-y border-white/[0.04]" />
        <div className="absolute inset-0" style={{
          background: 'radial-gradient(ellipse 80% 70% at 50% 50%, rgba(200,16,46,0.08) 0%, rgba(124,58,237,0.04) 50%, transparent 80%)',
        }} />
        <div className="relative max-w-3xl mx-auto px-4 text-center">
          <motion.div {...fadeUp()}>
            <div className="w-14 h-14 rounded-2xl mx-auto mb-6 flex items-center justify-center animate-float"
              style={{ background: 'linear-gradient(135deg,rgba(200,16,46,0.2),rgba(200,16,46,0.05))', border: '1px solid rgba(200,16,46,0.2)' }}>
              <Shield className="w-7 h-7 text-kenya-red" />
            </div>

            <h2 className="text-4xl md:text-5xl font-display font-bold text-white mb-5 tracking-tight" style={{ letterSpacing: '-0.02em' }}>
              Your Vote Is Your
              <br /><span className="gradient-text-brand">Greatest Power</span>
            </h2>
            <p className="text-urban-muted text-lg leading-relaxed mb-8 max-w-xl mx-auto">
              Millions of Kenyans depend on informed voters to elect leaders who serve all the people.
              Know your candidates. Register. Vote.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link to="/candidates" className="btn-primary flex items-center gap-2">
                <Vote className="w-4 h-4" /> Explore Candidates
              </Link>
              <a href="https://www.iebc.or.ke" target="_blank" rel="noopener noreferrer"
                className="btn-secondary flex items-center gap-2">
                Register to Vote <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
