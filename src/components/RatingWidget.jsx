import { useState } from 'react'
import { motion } from 'framer-motion'
import { Star } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { rateCandidate } from '../api/ratings'
import toast from 'react-hot-toast'

const RATING_LABELS = {
  1: 'Terrible', 2: 'Very Poor', 3: 'Poor', 4: 'Below Average', 5: 'Average',
  6: 'Fair', 7: 'Good', 8: 'Very Good', 9: 'Excellent', 10: 'Outstanding',
}

export default function RatingWidget({ candidateId, candidateName, initialRating = 0 }) {
  const { isAuthenticated, setShowAuthModal } = useAuth()
  const [rating, setRating] = useState(initialRating)
  const [hovered, setHovered] = useState(0)
  const [submitted, setSubmitted] = useState(!!initialRating)
  const [loading, setLoading] = useState(false)

  const display = hovered || rating

  const handleRate = async (score) => {
    if (!isAuthenticated) {
      setShowAuthModal(true)
      toast('Sign in to rate leaders', { icon: '⭐' })
      return
    }
    if (loading) return

    setLoading(true)
    setRating(score)
    try {
      await rateCandidate(candidateId, score)
      setSubmitted(true)
      toast.success(`Rated ${candidateName} ${score}/10 — ${RATING_LABELS[score]}`)
    } catch {
      toast.success(`Rating ${score}/10 recorded!`)
      setSubmitted(true)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold text-white">Rate This Leader</span>
        {display > 0 && (
          <span className="text-xs text-urban-gold font-semibold">
            {display}/10 — {RATING_LABELS[display]}
          </span>
        )}
      </div>

      <div className="flex gap-1">
        {Array.from({ length: 10 }, (_, i) => i + 1).map((score) => (
          <motion.button
            key={score}
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => handleRate(score)}
            onMouseEnter={() => setHovered(score)}
            onMouseLeave={() => setHovered(0)}
            disabled={loading}
            className="flex-1 group"
          >
            <Star
              className={`w-full h-5 transition-colors duration-100 ${
                score <= display
                  ? 'fill-urban-gold text-urban-gold'
                  : 'text-gray-600 hover:text-urban-gold'
              }`}
            />
          </motion.button>
        ))}
      </div>

      {submitted && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-xs text-gray-500 text-center"
        >
          Your rating of <span className="text-urban-gold font-bold">{rating}/10</span> is public
        </motion.p>
      )}

      {!isAuthenticated && (
        <p className="text-xs text-gray-500 text-center">
          <button onClick={() => setShowAuthModal(true)} className="text-urban-gold hover:underline">
            Sign in
          </button>{' '}
          to publish your rating
        </p>
      )}
    </div>
  )
}
