import { useState, useEffect } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Menu, X, User, LogOut, ChevronDown,
  Vote, MapPin, BarChart3, BookOpen,
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'

const NAV_LINKS = [
  { to: '/', label: 'Home' },
  { to: '/candidates', label: 'Candidates' },
  { to: '/counties', label: 'Counties' },
  { to: '/analytics', label: 'Analytics' },
  { to: '/blog', label: 'Blog' },
]

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [userMenu, setUserMenu] = useState(false)
  const { user, isAuthenticated, logout, setShowAuthModal } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <>
      <motion.nav
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? 'bg-urban-surface border-b border-urban-border shadow-[0_2px_16px_rgba(0,0,0,0.25)]'
            : 'bg-transparent'
        }`}
      >
        {/* Kenyan tri-color top bar */}
        <div className="h-[2px] bg-gradient-to-r from-kenya-red via-black to-kenya-green" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">

            {/* ── Logo ── */}
            <Link to="/" className="flex items-center gap-3 group shrink-0">
              <div className="relative w-9 h-9">
                <div className="absolute inset-0 rounded-lg bg-kenya-red opacity-20 group-hover:opacity-40 blur-md transition-opacity duration-300" />
                <div className="relative w-9 h-9 rounded-lg flex items-center justify-center"
                  style={{ background: 'linear-gradient(135deg,#e8102a,#7c0015)' }}>
                  <Vote className="w-4 h-4 text-white" />
                </div>
              </div>
              <div className="leading-none">
                <div className="text-[13px] font-display font-bold text-white tracking-[0.12em] uppercase">
                  Jua Kiongozi
                </div>
                <div className="text-[9px] font-bold text-kenya-red tracking-[0.3em] uppercase mt-0.5">
                  2027
                </div>
              </div>
            </Link>

            {/* ── Desktop nav ── */}
            <div className="hidden md:flex items-center">
              {NAV_LINKS.map(({ to, label }) => (
                <NavLink
                  key={to}
                  to={to}
                  end={to === '/'}
                  className={({ isActive }) =>
                    `relative px-4 py-2 text-sm font-medium transition-colors duration-200 ${
                      isActive ? 'text-white' : 'text-urban-muted hover:text-white'
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      {label}
                      {isActive && (
                        <motion.span
                          layoutId="nav-pill"
                          className="absolute inset-0 rounded-lg bg-urban-card border border-urban-border"
                          style={{ zIndex: -1 }}
                          transition={{ type: 'spring', bounce: 0.2, duration: 0.4 }}
                        />
                      )}
                    </>
                  )}
                </NavLink>
              ))}
            </div>

            {/* ── Right ── */}
            <div className="hidden md:flex items-center gap-3">
              {isAuthenticated ? (
                <div className="relative">
                  <button
                    onClick={() => setUserMenu(!userMenu)}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-xl bg-urban-card border border-urban-border hover:border-urban-borderLight transition-all duration-200"
                  >
                    <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0"
                      style={{ background: 'linear-gradient(135deg,#e8102a,#7c0015)' }}>
                      {(user?.username || user?.email || 'U')[0].toUpperCase()}
                    </div>
                    <span className="text-sm text-gray-300 max-w-[96px] truncate">
                      {user?.username || user?.email?.split('@')[0]}
                    </span>
                    <ChevronDown className={`w-3.5 h-3.5 text-urban-muted transition-transform duration-200 ${userMenu ? 'rotate-180' : ''}`} />
                  </button>

                  <AnimatePresence>
                    {userMenu && (
                      <motion.div
                        initial={{ opacity: 0, y: 8, scale: 0.96 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.96 }}
                        transition={{ duration: 0.15 }}
                        className="absolute right-0 mt-2 w-48 bg-urban-card border border-urban-border rounded-xl overflow-hidden shadow-[0_8px_24px_rgba(0,0,0,0.25)]"
                        onMouseLeave={() => setUserMenu(false)}
                      >
                        <Link to="/profile" onClick={() => setUserMenu(false)}
                          className="flex items-center gap-2.5 px-4 py-3 text-sm text-gray-300 hover:bg-urban-card hover:text-white transition-colors">
                          <User className="w-4 h-4" /> My Profile
                        </Link>
                        <div className="divider mx-3" />
                        <button onClick={() => { logout(); setUserMenu(false); navigate('/') }}
                          className="w-full flex items-center gap-2.5 px-4 py-3 text-sm text-red-400 hover:bg-red-500/10 transition-colors">
                          <LogOut className="w-4 h-4" /> Sign Out
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <button onClick={() => setShowAuthModal(true)} className="btn-primary py-2 px-5 text-sm">
                  Sign In
                </button>
              )}
            </div>

            {/* ── Mobile toggle ── */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden w-9 h-9 rounded-lg bg-urban-card border border-urban-border flex items-center justify-center text-urban-muted hover:text-white transition-colors"
            >
              {isOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </motion.nav>

      {/* ── Mobile menu ── */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="fixed top-[66px] left-0 right-0 z-40 bg-urban-surface border-b border-urban-border md:hidden"
          >
            <div className="px-4 py-4 space-y-1 max-w-7xl mx-auto">
              {NAV_LINKS.map(({ to, label }) => (
                <NavLink key={to} to={to} end={to === '/'} onClick={() => setIsOpen(false)}
                  className={({ isActive }) =>
                    `block px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                      isActive ? 'bg-white/[0.07] text-white' : 'text-urban-muted hover:text-white hover:bg-urban-card'
                    }`
                  }
                >
                  {label}
                </NavLink>
              ))}
              <div className="pt-3 border-t border-white/[0.06]">
                {isAuthenticated ? (
                  <button onClick={() => { logout(); setIsOpen(false) }}
                    className="w-full flex items-center gap-2 px-4 py-3 text-sm text-red-400 hover:bg-red-500/10 rounded-xl transition-colors">
                    <LogOut className="w-4 h-4" /> Sign Out
                  </button>
                ) : (
                  <button onClick={() => { setShowAuthModal(true); setIsOpen(false) }}
                    className="w-full btn-primary text-sm">
                    Sign In / Register
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
