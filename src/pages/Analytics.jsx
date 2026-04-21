import { motion } from 'framer-motion'
import { BarChart3, TrendingUp, Users, Vote, PieChart, Award, Activity } from 'lucide-react'
import { Link } from 'react-router-dom'
import { VoteBarChart, VotePieChart, LeaderboardChart } from '../components/AnalyticsCharts'
import { PRESIDENTIAL_CANDIDATES } from '../utils/candidatesData'
import { useApp } from '../context/AppContext'

const fadeUp = (d = 0) => ({
  initial: { opacity: 0, y: 20 }, whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-40px' },
  transition: { duration: 0.6, delay: d, ease: [0.16,1,0.3,1] },
})

export default function Analytics() {
  const { voteCounts } = useApp()

  // Compute real totals from aggregate vote counts
  const allCounts = Object.values(voteCounts)
  const totalVotes = allCounts.reduce((s, c) => s + c.yes + c.no + c.unsure, 0)
  const totalYes   = allCounts.reduce((s, c) => s + c.yes, 0)
  const candidatesVoted = Object.keys(voteCounts).length

  const stats = [
    { icon: Vote,        label: 'Total Votes',         value: totalVotes.toLocaleString(), color: 'text-kenya-red'    },
    { icon: Users,       label: 'Candidates Voted On', value: candidatesVoted.toString(),  color: 'text-urban-accent' },
    { icon: TrendingUp,  label: 'Support Votes',        value: totalYes.toLocaleString(),   color: 'text-urban-gold'   },
    { icon: BarChart3,   label: 'Candidates',           value: PRESIDENTIAL_CANDIDATES.length.toString(), color: 'text-green-400' },
  ]

  return (
    <div className="min-h-screen bg-urban-bg pt-16">
      {/* Header */}
      <div className="relative border-b border-white/[0.05] py-16 overflow-hidden">
        <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse 60% 80% at 50% 0%, rgba(0,212,255,0.06) 0%, transparent 70%)' }} />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{duration:.6}}>
            <div className="badge-cyan mb-4">📊 Live Analytics</div>
            <h1 className="section-title mb-3">Public Opinion <span className="gradient-text-cyan">Analytics</span></h1>
            <p className="section-subtitle">Real-time analysis of voting data, ratings, and regional support for Kenya 2027.</p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        {/* Stat cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map(({ icon: Icon, label, value, color }, i) => (
            <motion.div key={label} {...fadeUp(i * .08)} className="card p-5">
              <div className="flex items-start justify-between mb-3">
                <div className="w-9 h-9 rounded-lg bg-white/[0.04] border border-white/[0.07] flex items-center justify-center">
                  <Icon className={`w-4 h-4 ${color}`} />
                </div>
                {totalVotes === 0
                  ? <span className="text-[10px] px-2 py-0.5 rounded-full bg-urban-surface border border-urban-border text-urban-muted font-semibold">Waiting</span>
                  : <span className="text-[10px] px-2 py-0.5 rounded-full bg-green-500/10 border border-green-500/15 text-green-400 font-semibold">Live</span>
                }
              </div>
              <div className={`text-2xl font-display font-bold ${color} mb-0.5`}>{value}</div>
              <div className="text-xs text-urban-muted">{label}</div>
            </motion.div>
          ))}
        </div>

        {/* Main chart */}
        <motion.div {...fadeUp(.05)} className="card p-6">
          <div className="flex items-center gap-2 mb-5">
            <BarChart3 className="w-4 h-4 text-urban-accent" />
            <h2 className="font-semibold text-white">Vote Distribution — All Candidates</h2>
            <span className="ml-auto text-[10px] px-2 py-0.5 rounded-full bg-green-500/10 border border-green-500/15 text-green-400 font-bold">Live</span>
          </div>
          <VoteBarChart />
        </motion.div>

        {/* Per-candidate */}
        <div>
          <motion.h2 {...fadeUp()} className="font-display font-bold text-white text-xl mb-6 flex items-center gap-2">
            <PieChart className="w-5 h-5 text-urban-gold" /> Individual Candidate Analytics
          </motion.h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {PRESIDENTIAL_CANDIDATES.map((c, i) => (
              <motion.div key={c.id} {...fadeUp(i*.05)} className="card p-5">
                <Link to={`/candidates/${c.slug}`} className="flex items-center gap-3 mb-3 group">
                  <div className="w-9 h-9 rounded-lg overflow-hidden shrink-0 ring-1 ring-white/[0.08]">
                    <img src={c.image} alt={c.name} className="w-full h-full object-cover object-top"
                      onError={(e) => { e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(c.name)}&background=C8102E&color=fff` }} />
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-white text-sm truncate group-hover:text-kenya-red transition-colors">{c.name}</p>
                    <p className="text-2xs text-urban-muted">{c.partyShortname}</p>
                  </div>
                </Link>
                <VotePieChart candidateId={c.id} />
              </motion.div>
            ))}
          </div>
        </div>

        {/* Trend chart — unlocks once enough votes accumulate */}
        <motion.div {...fadeUp()} className="card p-6">
          <div className="flex items-center gap-2 mb-5">
            <TrendingUp className="w-4 h-4 text-green-400" />
            <h2 className="font-semibold text-white">Support Trends</h2>
          </div>
          <div className="flex flex-col items-center justify-center py-12 gap-3 text-center">
            <div className="text-4xl opacity-30">📈</div>
            <p className="text-sm font-semibold text-urban-muted">Trend data coming soon</p>
            <p className="text-xs text-urban-muted/60 max-w-xs">
              Historical trend charts will be built from real vote data as the 2027 election approaches.
            </p>
          </div>
        </motion.div>

        {/* Leaderboard + Regional */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <motion.div {...fadeUp(.05)} className="card p-6">
            <div className="flex items-center gap-2 mb-5">
              <Award className="w-4 h-4 text-urban-gold" />
              <h2 className="font-semibold text-white">Support Leaderboard</h2>
            </div>
            <LeaderboardChart />
          </motion.div>

          <motion.div {...fadeUp(.1)} className="card p-6">
            <div className="flex items-center gap-2 mb-5">
              <Activity className="w-4 h-4 text-urban-accent" />
              <h2 className="font-semibold text-white">Regional Breakdown</h2>
            </div>
            <div className="flex flex-col items-center justify-center py-10 gap-3 text-center">
              <div className="text-4xl opacity-30">🗺️</div>
              <p className="text-sm font-semibold text-urban-muted">Regional data coming soon</p>
              <p className="text-xs text-urban-muted/60 max-w-xs">
                Regional breakdowns will appear once county-level voter data is collected.
              </p>
            </div>
          </motion.div>
        </div>

        {/* Disclaimer */}
        <motion.div {...fadeUp()} className="card p-4 border-urban-gold/15 bg-urban-gold/[0.03]">
          <p className="text-xs text-urban-muted">
            <span className="text-urban-gold font-semibold">⚠️ Disclaimer: </span>
            Analytics are based on votes cast on this platform for educational purposes only. They do not represent official polling data.
          </p>
        </motion.div>
      </div>
    </div>
  )
}
