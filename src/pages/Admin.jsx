import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  Shield, Users, FileText, BarChart3, LogOut, Vote,
  TrendingUp, Eye, Activity, Settings
} from 'lucide-react'
import AdminLogin from '../components/admin/AdminLogin'
import CandidateManager from '../components/admin/CandidateManager'
import BlogManager from '../components/admin/BlogManager'
import { VoteBarChart, LeaderboardChart } from '../components/AnalyticsCharts'
import { PRESIDENTIAL_CANDIDATES } from '../utils/candidatesData'

const TABS = [
  { id: 'overview', label: 'Overview', icon: BarChart3 },
  { id: 'candidates', label: 'Candidates', icon: Users },
  { id: 'blogs', label: 'Blog Posts', icon: FileText },
  { id: 'analytics', label: 'Analytics', icon: TrendingUp },
]

const OVERVIEW_STATS = [
  { label: 'Total Votes', value: '847,293', change: '+2.4k today', icon: Vote, color: 'text-kenya-red' },
  { label: 'Active Users', value: '12,847', change: '+347 today', icon: Users, color: 'text-urban-accent' },
  { label: 'Candidates', value: PRESIDENTIAL_CANDIDATES.length.toString(), change: 'Active', icon: Shield, color: 'text-urban-gold' },
  { label: 'Blog Posts', value: '6', change: '4 published', icon: FileText, color: 'text-green-400' },
]

export default function Admin() {
  const [authenticated, setAuthenticated] = useState(false)
  const [activeTab, setActiveTab] = useState('overview')

  useEffect(() => {
    if (sessionStorage.getItem('jk_admin') === 'true') {
      setAuthenticated(true)
    }
  }, [])

  const handleLogout = () => {
    sessionStorage.removeItem('jk_admin')
    setAuthenticated(false)
  }

  if (!authenticated) {
    return <AdminLogin onSuccess={() => setAuthenticated(true)} />
  }

  return (
    <div className="min-h-screen bg-urban-bg flex">
      {/* Sidebar */}
      <div className="w-64 shrink-0 bg-black border-r border-urban-border flex flex-col">
        <div className="p-6 border-b border-urban-border">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-kenya-red flex items-center justify-center">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="text-white font-bold text-sm">Admin Panel</div>
              <div className="text-gray-500 text-xs">Jua Kiongozi 2027</div>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {TABS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                activeTab === id
                  ? 'bg-kenya-red/10 text-kenya-red border border-kenya-red/20'
                  : 'text-gray-400 hover:bg-white/5 hover:text-white'
              }`}
            >
              <Icon className="w-4 h-4" />
              {label}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-urban-border">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm text-red-400 hover:bg-red-500/10 transition-all"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </div>

      {/* Main */}
      <div className="flex-1 overflow-auto">
        {/* Top bar */}
        <div className="sticky top-0 z-10 bg-black/80 backdrop-blur border-b border-urban-border px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-white font-bold capitalize">{activeTab}</h1>
            <p className="text-gray-500 text-xs">Jua Kiongozi Admin Dashboard</p>
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <Activity className="w-3.5 h-3.5 text-green-400" />
            System Online
          </div>
        </div>

        <div className="p-6">
          {/* Overview */}
          {activeTab === 'overview' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
              {/* Stats */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {OVERVIEW_STATS.map(({ label, value, change, icon: Icon, color }) => (
                  <div key={label} className="card p-5">
                    <div className="flex items-start justify-between mb-3">
                      <Icon className={`w-5 h-5 ${color}`} />
                      <span className="text-xs text-green-400">{change}</span>
                    </div>
                    <div className={`text-2xl font-display font-bold ${color} mb-1`}>{value}</div>
                    <div className="text-xs text-gray-500">{label}</div>
                  </div>
                ))}
              </div>

              {/* Charts */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="card p-6">
                  <h3 className="font-bold text-white mb-4">Vote Distribution</h3>
                  <VoteBarChart />
                </div>
                <div className="card p-6">
                  <h3 className="font-bold text-white mb-4">Support Leaderboard</h3>
                  <LeaderboardChart />
                </div>
              </div>

              {/* Recent activity */}
              <div className="card p-6">
                <h3 className="font-bold text-white mb-4">Recent Activity</h3>
                <div className="space-y-3">
                  {[
                    { event: 'New vote cast — William Ruto (Yes)', time: '2 min ago', type: 'vote' },
                    { event: 'New comment on Kalonzo Musyoka profile', time: '5 min ago', type: 'comment' },
                    { event: 'New user registration (Google)', time: '8 min ago', type: 'user' },
                    { event: 'Rating submitted — Martha Karua (8/10)', time: '12 min ago', type: 'rating' },
                    { event: 'Blog post viewed: Kenya 2027 Guide (847 views)', time: '15 min ago', type: 'blog' },
                  ].map((a, i) => (
                    <div key={i} className="flex items-center gap-3 text-sm">
                      <div className="w-2 h-2 rounded-full bg-kenya-red shrink-0" />
                      <span className="text-gray-400 flex-1">{a.event}</span>
                      <span className="text-gray-600 text-xs shrink-0">{a.time}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'candidates' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <CandidateManager />
            </motion.div>
          )}

          {activeTab === 'blogs' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <BlogManager />
            </motion.div>
          )}

          {activeTab === 'analytics' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
              <div className="card p-6">
                <h3 className="font-bold text-white mb-4">Vote Analytics — All Candidates</h3>
                <VoteBarChart />
              </div>
              <div className="card p-6">
                <h3 className="font-bold text-white mb-4">Support Rankings</h3>
                <LeaderboardChart />
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  )
}
