import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from 'recharts'
import { PRESIDENTIAL_CANDIDATES } from '../utils/candidatesData'
import { useApp } from '../context/AppContext'

const VOTE_COLORS = { yes: '#22c55e', no: '#ef4444', unsure: '#f59e0b' }

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-urban-card border border-urban-border rounded-xl p-3 shadow-2xl">
      <p className="text-white font-semibold text-sm mb-2">{label}</p>
      {payload.map((entry) => (
        <div key={entry.name} className="flex items-center gap-2 text-xs">
          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
          <span className="text-gray-400 capitalize">{entry.name}:</span>
          <span className="text-white font-semibold">{entry.value?.toLocaleString()}</span>
        </div>
      ))}
    </div>
  )
}

function EmptyChart({ message = 'No votes yet — cast your vote to see data here' }) {
  return (
    <div className="flex flex-col items-center justify-center h-full gap-3 py-8 text-center">
      <div className="text-3xl opacity-40">🗳️</div>
      <p className="text-xs text-urban-muted max-w-[200px] leading-relaxed">{message}</p>
    </div>
  )
}

export function VoteBarChart() {
  const { voteCounts } = useApp()

  const data = PRESIDENTIAL_CANDIDATES.map((c) => {
    const counts = voteCounts[c.id] || { yes: 0, no: 0, unsure: 0 }
    return {
      name: c.name.split(' ').slice(-1)[0],
      yes: counts.yes,
      no: counts.no,
      unsure: counts.unsure,
      party: c.partyShortname,
      partyColor: c.partyColor,
    }
  })

  const hasVotes = data.some((d) => d.yes + d.no + d.unsure > 0)

  if (!hasVotes) {
    return (
      <div style={{ height: 350 }}>
        <EmptyChart message="Vote distribution will appear here once voting begins" />
      </div>
    )
  }

  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 60 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
        <XAxis
          dataKey="name"
          tick={{ fill: '#9ca3af', fontSize: 11 }}
          angle={-35}
          textAnchor="end"
          interval={0}
        />
        <YAxis tick={{ fill: '#9ca3af', fontSize: 11 }} allowDecimals={false} />
        <Tooltip content={<CustomTooltip />} />
        <Legend wrapperStyle={{ color: '#9ca3af', fontSize: 12, paddingTop: 16 }} />
        <Bar dataKey="yes"    stackId="a" fill={VOTE_COLORS.yes}    name="Support" />
        <Bar dataKey="no"     stackId="a" fill={VOTE_COLORS.no}     name="Oppose"  />
        <Bar dataKey="unsure" stackId="a" fill={VOTE_COLORS.unsure} name="Unsure"  radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}

export function VotePieChart({ candidateId }) {
  const { voteCounts } = useApp()

  const candidate = PRESIDENTIAL_CANDIDATES.find((c) => c.id === parseInt(candidateId))
  if (!candidate) return null

  const counts = voteCounts[candidate.id] || { yes: 0, no: 0, unsure: 0 }
  const total = counts.yes + counts.no + counts.unsure

  if (total === 0) {
    return (
      <div style={{ height: 220 }}>
        <EmptyChart message="No votes yet" />
      </div>
    )
  }

  const data = [
    { name: 'Support', value: counts.yes,    color: VOTE_COLORS.yes    },
    { name: 'Oppose',  value: counts.no,     color: VOTE_COLORS.no     },
    { name: 'Unsure',  value: counts.unsure, color: VOTE_COLORS.unsure },
  ].filter((d) => d.value > 0)

  return (
    <ResponsiveContainer width="100%" height={220}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={55}
          outerRadius={85}
          paddingAngle={3}
          dataKey="value"
        >
          {data.map((entry) => (
            <Cell key={entry.name} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip
          content={({ active, payload }) => {
            if (!active || !payload?.length) return null
            const item = payload[0]
            return (
              <div className="bg-urban-card border border-urban-border rounded-lg p-2 text-xs">
                <p style={{ color: item.payload.color }} className="font-bold">{item.name}</p>
                <p className="text-white">
                  {item.value?.toLocaleString()} ({((item.value / total) * 100).toFixed(1)}%)
                </p>
              </div>
            )
          }}
        />
        <Legend formatter={(value) => <span style={{ color: '#9ca3af', fontSize: 11 }}>{value}</span>} />
      </PieChart>
    </ResponsiveContainer>
  )
}

export function LeaderboardChart() {
  const { voteCounts } = useApp()

  const data = PRESIDENTIAL_CANDIDATES.map((c) => {
    const counts = voteCounts[c.id] || { yes: 0, no: 0, unsure: 0 }
    const total = counts.yes + counts.no + counts.unsure
    const support = total > 0 ? Math.round((counts.yes / total) * 100) : 0
    return {
      name: c.name.split(' ').slice(-1)[0],
      fullName: c.name,
      support,
      total,
      color: c.partyColor,
    }
  }).sort((a, b) => b.support - a.support || b.total - a.total)

  const hasVotes = data.some((d) => d.total > 0)

  return (
    <div className="space-y-3">
      {!hasVotes && (
        <p className="text-xs text-urban-muted text-center py-4">
          Leaderboard will update as users vote
        </p>
      )}
      {data.map((item, i) => (
        <div key={item.name} className="flex items-center gap-3">
          <span className="text-xs font-bold text-gray-500 w-5 text-right">{i + 1}</span>
          <div className="flex-1">
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm text-white font-medium">{item.name}</span>
              <span className="text-xs text-gray-400">
                {item.total > 0 ? `${item.support}%` : '—'}
              </span>
            </div>
            <div className="h-2 bg-urban-surface rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-700"
                style={{ width: `${item.support}%`, backgroundColor: item.color || '#BE0027' }}
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
