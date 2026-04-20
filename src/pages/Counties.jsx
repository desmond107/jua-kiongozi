import { useState } from 'react'
import { motion } from 'framer-motion'
import { MapPin, Search, ChevronRight, Users, Building2 } from 'lucide-react'
import { KENYA_COUNTIES, KENYA_REGIONS, getCountiesByRegion } from '../utils/counties'

const COUNTY_LEADERS = {
  'Nairobi': { governor: 'Johnson Sakaja', senator: 'Edwin Sifuna', wRep: 'Esther Passaris' },
  'Mombasa': { governor: 'Abdulswamad Nassir', senator: 'Mohamed Faki' },
  'Kisumu': { governor: 'Prof. Peter Anyang\' Nyong\'o', senator: 'Tom Ojienda' },
  'Nakuru': { governor: 'Susan Kihika', senator: 'Samuel Maina Gitonga' },
  'Uasin Gishu': { governor: 'Jonathan Bii', senator: 'Jackson Mandago' },
}

export default function Counties() {
  const [search, setSearch] = useState('')
  const [selectedRegion, setSelectedRegion] = useState('')
  const [selectedCounty, setSelectedCounty] = useState(null)

  const displayCounties = (selectedRegion
    ? getCountiesByRegion(selectedRegion)
    : KENYA_COUNTIES
  ).filter(
    (c) => !search || c.name.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-urban-bg pt-16">
      {/* Header */}
      <div className="bg-gradient-to-b from-green-500/10 to-transparent border-b border-urban-border py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="badge-green mb-4">📍 Devolution</div>
            <h1 className="section-title mb-3">Kenya's 47 Counties</h1>
            <p className="section-subtitle">
              Explore leadership, candidates, and political landscape across all 47 counties of Kenya.
            </p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search county..."
              className="input-field pl-10"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => setSelectedRegion('')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                !selectedRegion ? 'bg-kenya-green text-white' : 'bg-urban-surface border border-urban-border text-gray-400 hover:text-white'
              }`}
            >
              All
            </button>
            {KENYA_REGIONS.map((r) => (
              <button
                key={r}
                onClick={() => setSelectedRegion(selectedRegion === r ? '' : r)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  selectedRegion === r ? 'bg-kenya-green text-white' : 'bg-urban-surface border border-urban-border text-gray-400 hover:text-white'
                }`}
              >
                {r}
              </button>
            ))}
          </div>
        </div>

        {/* County Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {displayCounties.map((county, i) => {
            const leaders = COUNTY_LEADERS[county.name]
            return (
              <motion.div
                key={county.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.03 }}
                onClick={() => setSelectedCounty(selectedCounty?.id === county.id ? null : county)}
                className="card-hover cursor-pointer"
              >
                <div className="p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="text-xs font-bold text-kenya-green mb-1 uppercase tracking-wider">
                        County {county.id}
                      </div>
                      <h3 className="font-bold text-white text-lg">{county.name}</h3>
                      <p className="text-xs text-gray-500">{county.region} Region</p>
                    </div>
                    <MapPin className="w-5 h-5 text-kenya-green opacity-40" />
                  </div>

                  <div className="space-y-1 text-xs text-gray-500">
                    <div className="flex items-center gap-1.5">
                      <Building2 className="w-3 h-3 text-urban-accent" />
                      <span>Capital: {county.capital}</span>
                    </div>
                    {leaders?.governor && (
                      <div className="flex items-center gap-1.5">
                        <Users className="w-3 h-3 text-kenya-red" />
                        <span className="truncate">Gov: {leaders.governor}</span>
                      </div>
                    )}
                  </div>

                  {selectedCounty?.id === county.id && leaders && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="mt-3 pt-3 border-t border-urban-border space-y-1.5"
                    >
                      {leaders.governor && (
                        <div className="text-xs">
                          <span className="text-gray-500">Governor:</span>{' '}
                          <span className="text-white font-medium">{leaders.governor}</span>
                        </div>
                      )}
                      {leaders.senator && (
                        <div className="text-xs">
                          <span className="text-gray-500">Senator:</span>{' '}
                          <span className="text-white font-medium">{leaders.senator}</span>
                        </div>
                      )}
                      {leaders.wRep && (
                        <div className="text-xs">
                          <span className="text-gray-500">Women Rep:</span>{' '}
                          <span className="text-white font-medium">{leaders.wRep}</span>
                        </div>
                      )}
                    </motion.div>
                  )}
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* Leadership positions guide */}
        <div className="mt-16 card p-8">
          <h2 className="font-bold text-white text-xl mb-6">🏛️ Kenya Elective Positions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { pos: 'President', desc: 'Head of State and Government. Elected by majority vote nationally.', color: 'text-kenya-red' },
              { pos: 'Governor', desc: 'County Executive head. Elected from each of the 47 counties.', color: 'text-urban-accent' },
              { pos: 'Senator', desc: 'Upper house member representing county interests at national level.', color: 'text-urban-gold' },
              { pos: 'Member of Parliament', desc: 'National Assembly member representing specific constituencies.', color: 'text-green-400' },
              { pos: 'Deputy Governor', desc: 'Elected alongside the Governor to assist county governance.', color: 'text-purple-400' },
              { pos: 'Women Representative', desc: 'Elected to represent women from each county in National Assembly.', color: 'text-pink-400' },
            ].map(({ pos, desc, color }) => (
              <div key={pos} className="p-4 rounded-xl bg-urban-surface border border-urban-border">
                <h3 className={`font-bold ${color} mb-1 text-sm`}>{pos}</h3>
                <p className="text-xs text-gray-500 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
