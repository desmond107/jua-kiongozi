import { motion } from 'framer-motion'
import { BarChart3, TrendingUp, Users, Vote, PieChart, Award, Activity } from 'lucide-react'
import { Link } from 'react-router-dom'
import { VoteBarChart, VotePieChart, LeaderboardChart } from '../components/AnalyticsCharts'
import { PRESIDENTIAL_CANDIDATES } from '../utils/candidatesData'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

const fadeUp = (d = 0) => ({
  initial: { opacity: 0, y: 20 }, whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-40px' },
  transition: { duration: 0.6, delay: d, ease: [0.16,1,0.3,1] },
})

const TREND = [
  { month:'Jan', ruto:42,kalonzo:18,matiangi:15,gachagua:12 },
  { month:'Feb', ruto:40,kalonzo:20,matiangi:17,gachagua:11 },
  { month:'Mar', ruto:38,kalonzo:22,matiangi:18,gachagua:12 },
  { month:'Apr', ruto:36,kalonzo:24,matiangi:20,gachagua:11 },
  { month:'May', ruto:35,kalonzo:23,matiangi:21,gachagua:13 },
  { month:'Jun', ruto:37,kalonzo:21,matiangi:22,gachagua:12 },
]

const REGION_DATA = [
  { r:'Nairobi',    ruto:28,kalonzo:20,matiangi:32,others:20 },
  { r:'Rift Valley',ruto:60,kalonzo:10,matiangi:15,others:15 },
  { r:'Central',    ruto:30,kalonzo:12,matiangi:18,others:40 },
  { r:'Coast',      ruto:25,kalonzo:28,matiangi:20,others:27 },
  { r:'Nyanza',     ruto:15,kalonzo:22,matiangi:18,others:45 },
  { r:'Western',    ruto:20,kalonzo:25,matiangi:22,others:33 },
  { r:'Eastern',    ruto:22,kalonzo:35,matiangi:18,others:25 },
]

const STATS = [
  { icon:Users,  label:'Total Votes',    value:'847,293', change:'+12.4%', color:'text-kenya-red'    },
  { icon:Vote,   label:'Unique Voters',  value:'234,561', change:'+8.7%',  color:'text-urban-accent' },
  { icon:TrendingUp, label:'Avg Rating', value:'6.8/10',  change:'+0.3',   color:'text-urban-gold'   },
  { icon:BarChart3,  label:'Candidates', value:'9',       change:'Active', color:'text-green-400'    },
]

const TT = ({ active, payload, label }) => {
  if (!active||!payload?.length) return null
  return (
    <div className="glass-dark border border-white/[0.08] rounded-xl px-4 py-3 shadow-2xl">
      <p className="text-white font-semibold text-sm mb-1.5">{label}</p>
      {payload.map((e) => (
        <div key={e.name} className="flex items-center gap-2 text-xs mb-0.5">
          <div className="w-2 h-2 rounded-full" style={{ background: e.color }} />
          <span className="text-urban-muted capitalize">{e.name}:</span>
          <span className="text-white font-semibold">{e.value}%</span>
        </div>
      ))}
    </div>
  )
}

export default function Analytics() {
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
          {STATS.map(({ icon:Icon, label, value, change, color }, i) => (
            <motion.div key={label} {...fadeUp(i*.08)} className="card p-5">
              <div className="flex items-start justify-between mb-3">
                <div className={`w-9 h-9 rounded-lg bg-white/[0.04] border border-white/[0.07] flex items-center justify-center`}>
                  <Icon className={`w-4 h-4 ${color}`} />
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-green-500/10 border border-green-500/15 text-green-400 font-semibold">{change}</span>
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

        {/* Trend chart */}
        <motion.div {...fadeUp()} className="card p-6">
          <div className="flex items-center gap-2 mb-5">
            <TrendingUp className="w-4 h-4 text-green-400" />
            <h2 className="font-semibold text-white">Support Trends — 6 Months</h2>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={TREND}>
              <defs>
                {[['ruto','#C8102E'],['kalonzo','#8B0000'],['matiangi','#06b6d4'],['gachagua','#0099CC']].map(([k,c]) => (
                  <linearGradient key={k} id={`g-${k}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor={c} stopOpacity={0.25} />
                    <stop offset="95%" stopColor={c} stopOpacity={0} />
                  </linearGradient>
                ))}
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="month" tick={{fill:'#5a5a72',fontSize:11}} axisLine={false} tickLine={false} />
              <YAxis tick={{fill:'#5a5a72',fontSize:11}} tickFormatter={(v) => `${v}%`} axisLine={false} tickLine={false} />
              <Tooltip content={<TT />} />
              {[['ruto','#C8102E','Ruto'],['kalonzo','#ef4444','Kalonzo'],['matiangi','#06b6d4','Matiangi'],['gachagua','#0099CC','Gachagua']].map(([k,c,n]) => (
                <Area key={k} type="monotone" dataKey={k} stroke={c} fill={`url(#g-${k})`} name={n} strokeWidth={2} dot={false} />
              ))}
            </AreaChart>
          </ResponsiveContainer>
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
            <div className="space-y-3.5">
              {REGION_DATA.map((r) => (
                <div key={r.r}>
                  <div className="flex justify-between text-xs mb-1.5">
                    <span className="font-medium text-white">{r.r}</span>
                  </div>
                  <div className="h-3 rounded-full overflow-hidden flex gap-px">
                    <div className="bg-kenya-red rounded-l-full transition-all" style={{width:`${r.ruto}%`}} title={`Ruto ${r.ruto}%`} />
                    <div className="bg-red-900"               style={{width:`${r.kalonzo}%`}} />
                    <div className="bg-urban-accent"          style={{width:`${r.matiangi}%`}} />
                    <div className="bg-white/10 rounded-r-full flex-1" />
                  </div>
                </div>
              ))}
              <div className="flex gap-4 flex-wrap text-[10px] text-urban-muted pt-1">
                {[['Ruto','bg-kenya-red'],['Kalonzo','bg-red-900'],['Matiangi','bg-urban-accent'],['Others','bg-white/10']].map(([n,bg]) => (
                  <div key={n} className="flex items-center gap-1.5"><div className={`w-2.5 h-2.5 rounded-sm ${bg}`}/>{n}</div>
                ))}
              </div>
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
