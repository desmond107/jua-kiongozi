import { createContext, useContext, useState, useEffect } from 'react'
import { PRESIDENTIAL_CANDIDATES } from '../utils/candidatesData'

const AppContext = createContext(null)

export const AppProvider = ({ children }) => {
  const [candidates, setCandidates] = useState(PRESIDENTIAL_CANDIDATES)
  const [votes, setVotes] = useState({})
  const [showAdModal, setShowAdModal] = useState(false)
  const [selectedCounty, setSelectedCounty] = useState('')
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    const savedVotes = JSON.parse(localStorage.getItem('jk_local_votes') || '{}')
    setVotes(savedVotes)
  }, [])

  useEffect(() => {
    const timer = setTimeout(() => setShowAdModal(true), 4000)
    return () => clearTimeout(timer)
  }, [])

  const castLocalVote = (candidateId, voteType) => {
    const updated = { ...votes, [candidateId]: voteType }
    setVotes(updated)
    localStorage.setItem('jk_local_votes', JSON.stringify(updated))
  }

  const getUserVote = (candidateId) => votes[candidateId] || null

  return (
    <AppContext.Provider
      value={{
        candidates,
        setCandidates,
        votes,
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
