import { useParams, Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  ArrowLeft, MapPin, Building2, Star, Mail,
  Twitter, Facebook, CheckCircle2, GraduationCap,
  Briefcase, ScrollText, Award, MessageCircle, BarChart3, ExternalLink,
} from 'lucide-react'
import { getCandidate } from '../utils/candidatesData'
import VoteButtons from '../components/VoteButtons'
import RatingWidget from '../components/RatingWidget'
import CommentSection from '../components/CommentSection'
import { VotePieChart } from '../components/AnalyticsCharts'

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.55, delay, ease: [0.16, 1, 0.3, 1] },
})

const Panel = ({ icon: Icon, title, iconColor = 'text-urban-accent', children }) => (
  <div className="card p-6">
    <h3 className="flex items-center gap-2.5 font-display font-bold text-white text-base mb-5">
      <div className={`w-8 h-8 rounded-lg bg-white/[0.05] border border-white/[0.08] flex items-center justify-center shrink-0`}>
        <Icon className={`w-4 h-4 ${iconColor}`} />
      </div>
      {title}
    </h3>
    {children}
  </div>
)

export default function CandidateDetail() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const candidate = getCandidate(slug)

  if (!candidate) return (
    <div className="min-h-screen bg-urban-bg flex items-center justify-center">
      <div className="text-center">
        <p className="text-urban-muted mb-4">Candidate not found</p>
        <Link to="/candidates" className="btn-primary">Back to Candidates</Link>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-urban-bg pt-16">

      {/* ── Hero header ── */}
      <div className="relative overflow-hidden border-b border-white/[0.05]">
        {/* Blurred bg image */}
        <div className="absolute inset-0">
          <img src={candidate.image} alt="" className="w-full h-full object-cover object-top scale-110 blur-[40px] opacity-15" />
          <div className="absolute inset-0 bg-gradient-to-b from-urban-bg/60 to-urban-bg" />
        </div>
        {/* Ambient glow */}
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: `radial-gradient(ellipse 50% 80% at 10% 50%, ${candidate.partyColor}18 0%, transparent 60%)` }} />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <button onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-urban-muted hover:text-white text-sm transition-colors mb-8 group">
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
            Back to Candidates
          </button>

          <div className="flex flex-col md:flex-row gap-8 items-start">
            {/* Photo */}
            <motion.div {...fadeUp()} className="shrink-0">
              <div className="relative w-36 h-36 md:w-44 md:h-44 rounded-2xl overflow-hidden shadow-[0_0_0_1px_rgba(255,255,255,0.08),0_24px_48px_rgba(0,0,0,0.6)]">
                <img src={candidate.image} alt={candidate.name}
                  className="w-full h-full object-cover object-top"
                  onError={(e) => { e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(candidate.name)}&background=C8102E&color=fff&size=400&bold=true` }}
                />
              </div>
              {candidate.verified && (
                <div className="mt-2.5 flex items-center justify-center gap-1.5 text-xs font-medium text-urban-accent">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Verified Profile
                </div>
              )}
            </motion.div>

            {/* Info */}
            <motion.div {...fadeUp(0.1)} className="flex-1 min-w-0">
              <div className="flex flex-wrap gap-2 mb-3">
                <span className="badge text-xs font-bold" style={{ backgroundColor: (candidate.partyColor||'#C8102E')+'25', borderColor: (candidate.partyColor||'#C8102E')+'40', color: candidate.partyColor||'#C8102E' }}>
                  {candidate.partyShortname}
                </span>
                {candidate.status === 'announced'
                  ? <span className="badge-red text-xs">Confirmed</span>
                  : <span className="badge-gold text-xs">Exploring</span>}
                {(candidate.tags||[]).slice(0,2).map((t) => (
                  <span key={t} className="badge-cyan text-xs">#{t}</span>
                ))}
              </div>

              <h1 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-white tracking-tight mb-1"
                style={{ letterSpacing: '-0.02em' }}>
                {candidate.name}
              </h1>
              <p className="text-urban-accent font-semibold mb-5">"{candidate.nickname}"</p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-2 gap-x-6 mb-5">
                {[
                  [MapPin, candidate.constituency,   'text-green-400/70'],
                  [Building2, candidate.party,        'text-kenya-red/70'],
                  [Star,   candidate.currentPosition, 'text-urban-gold/70'],
                  [Mail,   candidate.email,            'text-urban-accent/70'],
                ].map(([Icon, val, ic], i) => (
                  <div key={i} className="flex items-center gap-2 text-sm text-urban-muted">
                    <Icon className={`w-3.5 h-3.5 ${ic} shrink-0`} />
                    <span className="truncate">{val}</span>
                  </div>
                ))}
              </div>

              {/* Social */}
              {candidate.socialMedia?.twitter && (
                <a href={`https://twitter.com/${candidate.socialMedia.twitter}`} target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.05] border border-white/[0.08] hover:border-white/[0.14] text-xs text-urban-muted hover:text-white transition-all">
                  <Twitter className="w-3.5 h-3.5" />
                  @{candidate.socialMedia.twitter}
                  <ExternalLink className="w-3 h-3 opacity-50" />
                </a>
              )}
            </motion.div>
          </div>
        </div>
      </div>

      {/* ── Content ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-7">

          {/* Main */}
          <div className="lg:col-span-2 space-y-6">
            <motion.div {...fadeUp(0.05)}>
              <Panel icon={ScrollText} title="Biography" iconColor="text-urban-accent">
                <p className="text-urban-muted leading-relaxed text-sm">{candidate.biography}</p>
              </Panel>
            </motion.div>

            <motion.div {...fadeUp(0.1)}>
              <Panel icon={ScrollText} title="Manifesto & Vision" iconColor="text-kenya-red">
                <p className="text-urban-muted leading-relaxed text-sm">{candidate.manifesto}</p>
              </Panel>
            </motion.div>

            <motion.div {...fadeUp(0.15)}>
              <Panel icon={Award} title="Key Achievements" iconColor="text-urban-gold">
                <ul className="space-y-3">
                  {(candidate.achievements||[]).map((a, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-urban-muted">
                      <CheckCircle2 className="w-4 h-4 text-green-500/70 shrink-0 mt-0.5" />
                      {a}
                    </li>
                  ))}
                </ul>
              </Panel>
            </motion.div>

            <motion.div {...fadeUp(0.2)}>
              <Panel icon={Briefcase} title="Previous Positions & Experience" iconColor="text-purple-400">
                <ul className="space-y-2.5">
                  {(candidate.previousPositions||[]).map((p, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-urban-muted">
                      <div className="w-1.5 h-1.5 rounded-full bg-kenya-red/60 shrink-0 mt-2" />
                      {p}
                    </li>
                  ))}
                </ul>
              </Panel>
            </motion.div>

            <motion.div {...fadeUp(0.25)}>
              <Panel icon={GraduationCap} title="Education" iconColor="text-green-400">
                <ul className="space-y-2.5">
                  {(candidate.education||[]).map((e, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-urban-muted">
                      <GraduationCap className="w-4 h-4 text-green-500/70 shrink-0 mt-0.5" />
                      {e}
                    </li>
                  ))}
                </ul>
              </Panel>
            </motion.div>

            <motion.div {...fadeUp(0.3)}>
              <Panel icon={MessageCircle} title="Community Discussion" iconColor="text-urban-accent">
                <CommentSection candidateId={candidate.id} />
              </Panel>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-5">
            <motion.div {...fadeUp(0.1)}>
              <div className="card p-6">
                <VoteButtons candidateId={candidate.id} candidateName={candidate.name} />
              </div>
            </motion.div>

            <motion.div {...fadeUp(0.15)}>
              <div className="card p-6">
                <RatingWidget candidateId={candidate.id} candidateName={candidate.name} />
              </div>
            </motion.div>

            <motion.div {...fadeUp(0.2)}>
              <div className="card p-6">
                <div className="flex items-center gap-2 mb-1">
                  <BarChart3 className="w-4 h-4 text-urban-accent" />
                  <span className="font-semibold text-white text-sm">Vote Breakdown</span>
                </div>
                <p className="text-2xs text-urban-muted mb-1">Public opinion snapshot</p>
                <VotePieChart candidateId={candidate.id} />
              </div>
            </motion.div>

            {/* Party card */}
            <motion.div {...fadeUp(0.25)}>
              <div className="card p-5">
                <h3 className="text-xs font-bold text-urban-muted uppercase tracking-widest mb-3">Party</h3>
                <div className="h-1 rounded-full mb-4" style={{ background: candidate.partyColor||'#C8102E' }} />
                <p className="font-semibold text-white text-sm mb-0.5">{candidate.party}</p>
                <p className="text-2xs text-urban-muted mb-4">{candidate.partyShortname}</p>
                <div className="space-y-2 text-xs">
                  {[['County', candidate.county], ['Region', candidate.region], ['Position', candidate.position]].map(([k,v]) => (
                    <div key={k} className="flex justify-between">
                      <span className="text-urban-muted">{k}</span>
                      <span className="text-white font-medium">{v}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Tags */}
            <motion.div {...fadeUp(0.3)}>
              <div className="card p-5">
                <h3 className="text-xs font-bold text-urban-muted uppercase tracking-widest mb-3">Tags</h3>
                <div className="flex flex-wrap gap-1.5">
                  {(candidate.tags||[]).map((t) => (
                    <span key={t} className="text-[10px] px-2.5 py-1 rounded-full bg-white/[0.04] border border-white/[0.06] text-urban-muted">
                      #{t}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}
