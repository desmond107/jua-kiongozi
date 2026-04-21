import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { MapPin, Building2, ArrowUpRight, ThumbsUp, ThumbsDown, Minus } from 'lucide-react'
import { useApp } from '../context/AppContext'
import { useAuth } from '../context/AuthContext'
import { castVote } from '../api/votes'
import toast from 'react-hot-toast'

const VOTES = [
  { type: 'yes',    Icon: ThumbsUp,   label: 'Yes',    idle: 'text-green-500/60  border-green-500/15 hover:bg-green-500/10 hover:border-green-500/30 hover:text-green-400',  active: 'bg-green-500/15 border-green-500/40 text-green-400 shadow-[0_0_12px_rgba(34,197,94,.2)]' },
  { type: 'no',     Icon: ThumbsDown, label: 'No',     idle: 'text-red-500/60    border-red-500/15   hover:bg-red-500/10   hover:border-red-500/30   hover:text-red-400',    active: 'bg-red-500/15   border-red-500/40   text-red-400   shadow-[0_0_12px_rgba(239,68,68,.2)]'  },
  { type: 'unsure', Icon: Minus,      label: 'Unsure', idle: 'text-amber-500/60  border-amber-500/15 hover:bg-amber-500/10 hover:border-amber-500/30 hover:text-amber-400', active: 'bg-amber-500/15 border-amber-500/40 text-amber-400 shadow-[0_0_12px_rgba(245,158,11,.2)]' },
]

export default function CandidateCard({ candidate, index = 0 }) {
  const { getUserVote, castLocalVote } = useApp()
  const { isAuthenticated, setShowAuthModal } = useAuth()
  const userVote = getUserVote(candidate.id)

  const handleVote = async (type) => {
    if (!isAuthenticated) { setShowAuthModal(true); return }
    if (userVote === type) return
    castLocalVote(candidate.id, type)
    try { await castVote(candidate.id, type) } catch {}
    toast.success(`Vote: ${type.toUpperCase()}`, { duration: 1800 })
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.55, delay: index * 0.07, ease: [0.16,1,0.3,1] }}
      className="group relative card-hover flex flex-col"
    >
      {/* ── Image ── */}
      <div className="relative h-56 overflow-hidden bg-urban-surface">
        <img
          src={candidate.image}
          alt={candidate.name}
          className="candidate-img w-full h-full object-cover object-top"
          onError={(e) => {
            e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(candidate.name)}&background=C8102E&color=fff&size=400&bold=true`
          }}
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-urban-card via-urban-card/30 to-transparent" />

        {/* Party chip */}
        <div
          className="absolute top-3 left-3 px-2.5 py-1 rounded-lg text-[10px] font-bold text-white tracking-wider uppercase"
          style={{ background: candidate.partyColor || '#C8102E' }}
        >
          {candidate.partyShortname}
        </div>

        {/* Status chip */}
        <div className="absolute top-3 right-3">
          {candidate.status === 'announced'
            ? <span className="badge-red text-[10px]">Confirmed</span>
            : <span className="badge-gold text-[10px]">Exploring</span>
          }
        </div>

        {/* Name overlay at bottom of image */}
        <div className="absolute bottom-0 left-0 right-0 px-4 pb-3 pt-6">
          <h3 className="font-display font-bold text-white text-lg leading-tight group-hover:gradient-text-red transition-all">
            {candidate.name}
          </h3>
          <p className="text-urban-accent text-xs font-medium mt-0.5 truncate">"{candidate.nickname}"</p>
        </div>
      </div>

      {/* ── Body ── */}
      <div className="flex flex-col flex-1 p-4 gap-4">

        {/* Meta */}
        <div className="space-y-1.5">
          <div className="flex items-start gap-2 text-xs text-urban-muted">
            <Building2 className="w-3.5 h-3.5 text-kenya-red/70 shrink-0 mt-0.5" />
            <span className="leading-snug">{candidate.party}</span>
          </div>
          <div className="flex items-start gap-2 text-xs text-urban-muted">
            <MapPin className="w-3.5 h-3.5 text-urban-accent/70 shrink-0 mt-0.5" />
            <span className="truncate">{candidate.constituency}</span>
          </div>
        </div>

        {/* Vote buttons */}
        <div className="grid grid-cols-3 gap-1.5">
          {VOTES.map(({ type, Icon, label, idle, active }) => (
            <button
              key={type}
              onClick={() => handleVote(type)}
              className={`flex flex-col items-center gap-1 py-2 rounded-xl border text-[11px] font-semibold transition-all duration-200 ${
                userVote === type ? active : idle
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              {label}
            </button>
          ))}
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5">
          {(candidate.tags || []).slice(0, 3).map((t) => (
            <span key={t} className="text-[10px] px-2 py-0.5 rounded-full bg-urban-surface border border-urban-border text-urban-muted">
              #{t}
            </span>
          ))}
        </div>

        {/* CTA */}
        <Link
          to={`/candidates/${candidate.slug}`}
          className="mt-auto flex items-center justify-between px-4 py-2.5 rounded-xl bg-urban-surface border border-urban-border hover:bg-urban-cardHover hover:border-kenya-red/30 text-gray-300 hover:text-white text-sm font-medium transition-all duration-200 group/btn"
        >
          <span>View Profile</span>
          <ArrowUpRight className="w-4 h-4 opacity-40 group-hover/btn:opacity-100 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-all duration-200" />
        </Link>
      </div>
    </motion.div>
  )
}
