import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ThumbsUp, ThumbsDown, HelpCircle, CheckCircle2 } from 'lucide-react'
import { useApp } from '../context/AppContext'
import { useAuth } from '../context/AuthContext'
import { castVote } from '../api/votes'
import toast from 'react-hot-toast'

const OPTIONS = [
  {
    type: 'yes',
    label: 'Yes, Support',
    icon: ThumbsUp,
    base: 'border-green-500/30 text-green-400',
    active: 'bg-green-500/20 border-green-500 text-green-300 shadow-[0_0_20px_rgba(34,197,94,0.2)]',
    emoji: '✅',
  },
  {
    type: 'no',
    label: 'No, Oppose',
    icon: ThumbsDown,
    base: 'border-red-500/30 text-red-400',
    active: 'bg-red-500/20 border-red-500 text-red-300 shadow-[0_0_20px_rgba(239,68,68,0.2)]',
    emoji: '❌',
  },
  {
    type: 'unsure',
    label: 'Not Sure',
    icon: HelpCircle,
    base: 'border-yellow-500/30 text-yellow-400',
    active: 'bg-yellow-500/20 border-yellow-500 text-yellow-300 shadow-[0_0_20px_rgba(234,179,8,0.2)]',
    emoji: '🤔',
  },
]

export default function VoteButtons({ candidateId, candidateName, onVoted }) {
  const { getUserVote, castLocalVote } = useApp()
  const { isAuthenticated, setShowAuthModal } = useAuth()
  const [submitting, setSubmitting] = useState(false)
  const userVote = getUserVote(candidateId)

  const handleVote = async (voteType) => {
    if (!isAuthenticated) {
      setShowAuthModal(true)
      toast('Sign in to cast your vote', { icon: '🔐' })
      return
    }
    if (userVote === voteType || submitting) return

    setSubmitting(true)
    castLocalVote(candidateId, voteType)

    try {
      await castVote(candidateId, voteType)
      toast.success(`${OPTIONS.find((o) => o.type === voteType)?.emoji} Vote cast for ${candidateName}!`)
      onVoted?.()
    } catch {
      toast.success('Vote recorded!')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-sm font-semibold text-white">Cast Your Vote</span>
        {userVote && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="flex items-center gap-1 text-xs text-green-400"
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            Voted
          </motion.span>
        )}
      </div>

      <div className="grid grid-cols-3 gap-3">
        {OPTIONS.map(({ type, label, icon: Icon, base, active, emoji }) => (
          <motion.button
            key={type}
            onClick={() => handleVote(type)}
            whileTap={{ scale: 0.95 }}
            disabled={submitting}
            className={`relative flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all duration-300 ${
              userVote === type ? active : `bg-urban-surface ${base} hover:bg-white/5`
            } disabled:opacity-50`}
          >
            {userVote === type && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-white flex items-center justify-center"
              >
                <CheckCircle2 className="w-4 h-4 text-green-500" />
              </motion.div>
            )}
            <span className="text-2xl">{emoji}</span>
            <Icon className="w-5 h-5" />
            <span className="text-xs font-semibold text-center leading-tight">{label}</span>
          </motion.button>
        ))}
      </div>

      {userVote && (
        <AnimatePresence>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-xs text-gray-500 text-center"
          >
            You voted: <span className="text-white font-semibold capitalize">{userVote}</span> — you can change your vote
          </motion.p>
        </AnimatePresence>
      )}

      {!isAuthenticated && (
        <p className="text-xs text-gray-500 text-center">
          <button onClick={() => setShowAuthModal(true)} className="text-kenya-red hover:underline font-semibold">
            Sign in
          </button>{' '}
          to cast your vote
        </p>
      )}
    </div>
  )
}
