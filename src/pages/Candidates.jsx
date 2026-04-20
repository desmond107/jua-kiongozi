import { useState } from 'react'
import { motion } from 'framer-motion'
import { Search, Filter, SlidersHorizontal, X } from 'lucide-react'
import CandidateCard from '../components/CandidateCard'
import { PRESIDENTIAL_CANDIDATES, LEADERSHIP_POSITIONS } from '../utils/candidatesData'
import { KENYA_REGIONS } from '../utils/counties'

const PARTIES = [...new Set(PRESIDENTIAL_CANDIDATES.map((c) => c.partyShortname))]

export default function Candidates() {
  const [search, setSearch] = useState('')
  const [region, setRegion] = useState('')
  const [party, setParty] = useState('')
  const [status, setStatus] = useState('')
  const [showFilters, setShowFilters] = useState(false)

  const filtered = PRESIDENTIAL_CANDIDATES.filter((c) => {
    const matchSearch =
      !search ||
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.party.toLowerCase().includes(search.toLowerCase()) ||
      c.constituency.toLowerCase().includes(search.toLowerCase())
    const matchRegion = !region || c.region === region
    const matchParty = !party || c.partyShortname === party
    const matchStatus = !status || c.status === status
    return matchSearch && matchRegion && matchParty && matchStatus
  })

  const hasFilters = region || party || status

  return (
    <div className="min-h-screen bg-urban-bg pt-16">
      {/* Page Hero */}
      <div className="bg-gradient-to-b from-kenya-red/10 to-transparent border-b border-urban-border py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="badge-red mb-4">🏛️ 2027 Presidential Race</div>
            <h1 className="section-title mb-3">Presidential Candidates</h1>
            <p className="section-subtitle">
              Explore profiles, vote, rate and comment on Kenya's 2027 presidential candidates.
              {' '}{filtered.length} candidate{filtered.length !== 1 ? 's' : ''} found.
            </p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Search & Filter Bar */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, party, constituency..."
              className="input-field pl-10"
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-4 py-3 rounded-lg border text-sm font-semibold transition-all ${
              hasFilters
                ? 'bg-kenya-red/10 border-kenya-red/40 text-kenya-red'
                : 'bg-urban-surface border-urban-border text-gray-400 hover:text-white'
            }`}
          >
            <SlidersHorizontal className="w-4 h-4" />
            Filters {hasFilters && `(${[region, party, status].filter(Boolean).length})`}
          </button>
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="card p-6 mb-8 grid grid-cols-1 sm:grid-cols-3 gap-4"
          >
            <div>
              <label className="text-xs text-gray-400 mb-2 block">Region</label>
              <select value={region} onChange={(e) => setRegion(e.target.value)} className="input-field text-sm">
                <option value="">All Regions</option>
                {KENYA_REGIONS.map((r) => <option key={r}>{r}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs text-gray-400 mb-2 block">Party</label>
              <select value={party} onChange={(e) => setParty(e.target.value)} className="input-field text-sm">
                <option value="">All Parties</option>
                {PARTIES.map((p) => <option key={p}>{p}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs text-gray-400 mb-2 block">Status</label>
              <select value={status} onChange={(e) => setStatus(e.target.value)} className="input-field text-sm">
                <option value="">All Statuses</option>
                <option value="announced">Announced</option>
                <option value="exploring">Exploring</option>
              </select>
            </div>
            {hasFilters && (
              <button
                onClick={() => { setRegion(''); setParty(''); setStatus('') }}
                className="sm:col-span-3 flex items-center gap-1 text-xs text-gray-500 hover:text-kenya-red transition-colors"
              >
                <X className="w-3.5 h-3.5" /> Clear all filters
              </button>
            )}
          </motion.div>
        )}

        {/* Results */}
        {filtered.length === 0 ? (
          <div className="text-center py-20 text-gray-500">
            <Filter className="w-12 h-12 mx-auto mb-4 opacity-30" />
            <p className="text-lg font-semibold text-white mb-2">No candidates found</p>
            <p className="text-sm">Try adjusting your search or filters.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((candidate, i) => (
              <CandidateCard key={candidate.id} candidate={candidate} index={i} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
