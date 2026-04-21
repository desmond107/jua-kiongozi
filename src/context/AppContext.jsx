import { createContext, useContext, useState, useEffect } from 'react'
import { PRESIDENTIAL_CANDIDATES } from '../utils/candidatesData'

const AppContext = createContext(null)

export const AppProvider = ({ children }) => {
  const [candidates, setCandidates] = useState(PRESIDENTIAL_CANDIDATES)
  const [votes, setVotes] = useState({})
  // voteCounts: { [candidateId]: { yes: 0, no: 0, unsure: 0 } }
  // Tracks aggregate totals so analytics start at 0 and grow with each vote.
  const [voteCounts, setVoteCounts] = useState({})
  const [showAdModal, setShowAdModal] = useState(false)
  const [selectedCounty, setSelectedCounty] = useState('')
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    const savedVotes  = JSON.parse(localStorage.getItem('jk_local_votes')  || '{}')
    const savedCounts = JSON.parse(localStorage.getItem('jk_vote_counts')  || '{}')
    setVotes(savedVotes)
    setVoteCounts(savedCounts)
  }, [])

  useEffect(() => {
    const timer = setTimeout(() => setShowAdModal(true), 4000)
    return () => clearTimeout(timer)
  }, [])

  const castLocalVote = (candidateId, voteType) => {
    const prevVote = votes[candidateId]

    // Record this user's current choice
    const updatedVotes = { ...votes, [candidateId]: voteType }
    setVotes(updatedVotes)
    localStorage.setItem('jk_local_votes', JSON.stringify(updatedVotes))

    // Update aggregate counts
    const prev = voteCounts[candidateId] || { yes: 0, no: 0, unsure: 0 }
    const next = { ...prev }
    if (prevVote && prevVote !== voteType) {
      // Changing an existing vote — remove the old tally
      next[prevVote] = Math.max(0, next[prevVote] - 1)
    }
    if (!prevVote || prevVote !== voteType) {
      next[voteType] = (next[voteType] || 0) + 1
    }
    const updatedCounts = { ...voteCounts, [candidateId]: next }
    setVoteCounts(updatedCounts)
    localStorage.setItem('jk_vote_counts', JSON.stringify(updatedCounts))
  }

  const getUserVote = (candidateId) => votes[candidateId] || null

  return (
    <AppContext.Provider
      value={{
        candidates,
        setCandidates,
        votes,
        voteCounts,
        castLocalVote,
        getUserVote,
        showAdModal,
        setShowAdModal,
        selectedCounty,
        setSelectedCounty,
        searchQuery,
        setSearchQuery,
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

export const useApp = () => {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used within AppProvider')
  return ctx
}
