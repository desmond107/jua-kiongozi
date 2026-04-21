import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { User, Mail, LogOut, Vote, Shield, Calendar } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useApp } from '../context/AppContext'
import { PRESIDENTIAL_CANDIDATES } from '../utils/candidatesData'

export default function Profile() {
  const { user, logout, isAuthenticated } = useAuth()
  const { votes } = useApp()

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-urban-bg flex items-center justify-center pt-16 px-4">
        <div className="text-center">
          <div className="w-16 h-16 rounded-full bg-urban-surface border border-urban-border flex items-center justify-center mx-auto mb-4">
            <User className="w-8 h-8 text-urban-muted" />
          </div>
          <h1 className="text-2xl font-display font-bold text-white mb-2">Not Signed In</h1>
          <p className="text-urban-muted mb-6">Sign in to view your profile and voting history.</p>
          <Link to="/" className="btn-primary">Go Home</Link>
        </div>
      </div>
    )
  }

  const votedCandidates = PRESIDENTIAL_CANDIDATES.filter((c) => votes[c.id])

  return (
    <div className="min-h-screen bg-urban-bg pt-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">

          {/* Profile card */}
          <div className="card p-8">
            <div className="flex items-start gap-5">
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-xl font-bold text-white shrink-0"
                style={{ background: 'linear-gradient(135deg,#e8102a,#7c0015)' }}>
                {(user?.username || user?.email || 'U')[0].toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <h1 className="text-2xl font-display font-bold text-white mb-1">
                  {user?.username || 'Anonymous User'}
                </h1>
                <div className="flex items-center gap-1.5 text-urban-muted text-sm">
                  <Mail className="w-3.5 h-3.5" />
                  {user?.email || 'No email'}
                </div>
                <div className="flex items-center gap-1.5 text-urban-muted text-xs mt-1">
                  <Calendar className="w-3 h-3" />
                  Member since {user?.createdAt ? new Date(user.createdAt).getFullYear() : '2024'}
                </div>
              </div>
              <button
                onClick={logout}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 transition-all text-sm font-semibold"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
            </div>
          </div>

          {/* Voting history */}
          <div className="card p-6">
            <div className="flex items-center gap-2 mb-5">
              <Vote className="w-4 h-4 text-kenya-red" />
              <h2 className="font-bold text-white">Your Votes</h2>
              <span className="badge-red ml-auto">{votedCandidates.length} cast</span>
            </div>

            {votedCandidates.length === 0 ? (
              <div className="text-center py-8">
                <Vote className="w-10 h-10 mx-auto mb-3 text-urban-muted opacity-30" />
                <p className="text-urban-muted text-sm">No votes cast yet.</p>
                <Link to="/candidates" className="text-kenya-red hover:underline text-sm font-semibold mt-2 inline-block">
                  Explore candidates →
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {votedCandidates.map((c) => {
                  const voteType = votes[c.id]
                  const colors = {
                    yes: 'text-green-400 bg-green-500/10 border-green-500/20',
                    no: 'text-red-400 bg-red-500/10 border-red-500/20',
                    unsure: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20',
                  }
                  return (
                    <Link key={c.id} to={`/candidates/${c.slug}`}
                      className="flex items-center gap-3 p-3 rounded-xl bg-urban-surface border border-urban-border hover:border-urban-borderLight transition-all group">
                      <img src={c.image} alt={c.name}
                        className="w-10 h-10 rounded-lg object-cover object-top shrink-0"
                        onError={(e) => { e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(c.name)}&background=C8102E&color=fff` }} />
                      <div className="flex-1 min-w-0">
                        <p className="text-white font-semibold text-sm truncate group-hover:text-kenya-red transition-colors">{c.name}</p>
                        <p className="text-urban-muted text-xs">{c.partyShortname}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full border text-xs font-bold capitalize ${colors[voteType]}`}>
                        {voteType}
                      </span>
                    </Link>
                  )
                })}
              </div>
            )}
          </div>

          {/* Badge */}
          <div className="card p-5 border-urban-accent/15 bg-urban-accent/[0.03]">
            <div className="flex items-center gap-3">
              <Shield className="w-5 h-5 text-urban-accent" />
              <div>
                <p className="text-white font-semibold text-sm">Civic Participant</p>
                <p className="text-urban-muted text-xs">Contributing to Kenya's democratic conversation</p>
              </div>
            </div>
          </div>

        </motion.div>
      </div>
    </div>
  )
}
