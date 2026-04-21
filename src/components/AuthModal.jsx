import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Phone, Mail, Lock, User, Eye, EyeOff, MessageSquare, ArrowRight } from 'lucide-react'
import { useGoogleLogin } from '@react-oauth/google'
import { useAuth } from '../context/AuthContext'
import { loginWithGoogle, loginWithEmail, registerUser, requestWhatsAppOTP, verifyWhatsAppOTP } from '../api/auth'
import toast from 'react-hot-toast'

const TABS = [
  { id: 0, label: 'Sign In' },
  { id: 1, label: 'Register' },
  { id: 2, label: '📱 WhatsApp' },
]

const Field = ({ icon: Icon, type, placeholder, value, onChange, disabled, right, minLength }) => (
  <div className="relative">
    <Icon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-urban-muted" />
    <input
      type={type || 'text'}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      disabled={disabled}
      minLength={minLength}
      className="input-field pl-10 pr-10 text-sm"
    />
    {right}
  </div>
)

export default function AuthModal() {
  const { showAuthModal, setShowAuthModal, login } = useAuth()
  const [tab, setTab] = useState(0)
  const [loading, setLoading] = useState(false)
  const [showPass, setShowPass] = useState(false)
  const [otpSent, setOtpSent] = useState(false)
  const [form, setForm] = useState({ email:'', password:'', username:'', phone:'', otp:'' })
  const set = (k) => (e) => setForm((f) => ({...f,[k]:e.target.value}))

  const eye = (
    <button type="button" onClick={() => setShowPass((v) => !v)}
      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-urban-muted hover:text-white transition-colors">
      {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
    </button>
  )

  const handleGoogle = useGoogleLogin({
    onSuccess: async (t) => {
      setLoading(true)
      try { const d = await loginWithGoogle(t.access_token); login(d.jwt, d.user) }
      catch { toast.error('Google login failed') }
      finally { setLoading(false) }
    },
    onError: () => toast.error('Google auth failed'),
  })

  const handleLogin = async (e) => {
    e.preventDefault(); setLoading(true)
    try { const d = await loginWithEmail(form.email, form.password); login(d.jwt, d.user) }
    catch { toast.error('Invalid email or password') }
    finally { setLoading(false) }
  }

  const handleRegister = async (e) => {
    e.preventDefault(); setLoading(true)
    try { const d = await registerUser({ username:form.username, email:form.email, password:form.password }); login(d.jwt, d.user) }
    catch (err) { toast.error(err?.response?.data?.error?.message || 'Registration failed') }
    finally { setLoading(false) }
  }

  const handleSendOTP = async () => {
    setLoading(true)
    try {
      const p = form.phone.startsWith('0') ? '+254'+form.phone.slice(1) : form.phone
      await requestWhatsAppOTP(p); setOtpSent(true)
      toast.success('OTP sent to your WhatsApp!')
    } catch { toast.error('Failed to send OTP') }
    finally { setLoading(false) }
  }

  const handleVerifyOTP = async (e) => {
    e.preventDefault(); setLoading(true)
    try {
      const p = form.phone.startsWith('0') ? '+254'+form.phone.slice(1) : form.phone
      const d = await verifyWhatsAppOTP(p, form.otp); login(d.jwt, d.user)
    } catch { toast.error('Invalid OTP') }
    finally { setLoading(false) }
  }

  if (!showAuthModal) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="fixed inset-0 z-[200] flex items-center justify-center p-4 modal-overlay"
        style={{ background: 'rgba(0,0,0,0.82)' }}
        onClick={() => setShowAuthModal(false)}
      >
        <motion.div
          initial={{ scale: 0.92, opacity: 0, y: 16 }}
          animate={{ scale: 1,    opacity: 1, y: 0  }}
          exit={{   scale: 0.92,  opacity: 0, y: 16 }}
          transition={{ type: 'spring', damping: 24, stiffness: 300 }}
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-md rounded-2xl overflow-hidden"
          style={{
            background: '#141921',
            border: '1px solid #2d3348',
            boxShadow: '0 16px 48px rgba(0,0,0,0.35)',
          }}
        >
          {/* Top strip */}
          <div className="h-[2px] bg-gradient-to-r from-kenya-red via-urban-gold to-urban-accent" />

          {/* Header */}
          <div className="px-6 pt-6 pb-4 flex items-start justify-between">
            <div>
              <h2 className="font-display font-bold text-xl text-white">Join Jua Kiongozi</h2>
              <p className="text-urban-muted text-sm mt-0.5">Vote, rate & engage with Kenya's leaders</p>
            </div>
            <button onClick={() => setShowAuthModal(false)}
              className="w-8 h-8 rounded-full bg-white/[0.06] hover:bg-white/[0.10] flex items-center justify-center text-urban-muted hover:text-white transition-all shrink-0 ml-3">
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Tabs */}
          <div className="flex px-6 gap-1 border-b border-white/[0.05] mb-5">
            {TABS.map(({ id, label }) => (
              <button key={id} onClick={() => setTab(id)}
                className={`pb-3 px-1 text-xs font-semibold transition-all relative ${
                  tab === id ? 'text-white' : 'text-urban-muted hover:text-gray-300'
                }`}>
                {label}
                {tab === id && (
                  <motion.div layoutId="auth-tab" className="absolute bottom-0 left-0 right-0 h-px bg-kenya-red" />
                )}
              </button>
            ))}
          </div>

          <div className="px-6 pb-6 space-y-4">
            {/* Google */}
            <button onClick={() => handleGoogle()} disabled={loading}
              className="w-full flex items-center justify-center gap-3 py-2.5 px-4 rounded-xl bg-white hover:bg-gray-50 text-gray-800 font-semibold text-sm transition-all disabled:opacity-50 active:scale-[0.98]">
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Continue with Google
            </button>

            <div className="flex items-center gap-3">
              <div className="flex-1 h-px bg-white/[0.06]" />
              <span className="text-[11px] text-urban-muted">or</span>
              <div className="flex-1 h-px bg-white/[0.06]" />
            </div>

            {/* Email login */}
            {tab === 0 && (
              <form onSubmit={handleLogin} className="space-y-3">
                <Field icon={Mail} type="email" placeholder="Email address" value={form.email} onChange={set('email')} />
                <Field icon={Lock} type={showPass?'text':'password'} placeholder="Password" value={form.password} onChange={set('password')} right={eye} />
                <button type="submit" disabled={loading} className="w-full btn-primary text-sm">
                  {loading ? 'Signing in…' : 'Sign In'}
                </button>
              </form>
            )}

            {/* Register */}
            {tab === 1 && (
              <form onSubmit={handleRegister} className="space-y-3">
                <Field icon={User} placeholder="Full name" value={form.username} onChange={set('username')} />
                <Field icon={Mail} type="email" placeholder="Email address" value={form.email} onChange={set('email')} />
                <Field icon={Lock} type={showPass?'text':'password'} placeholder="Password (min 8 chars)" value={form.password} onChange={set('password')} minLength={8} right={eye} />
                <button type="submit" disabled={loading} className="w-full btn-primary text-sm">
                  {loading ? 'Creating account…' : 'Create Account'}
                </button>
              </form>
            )}

            {/* WhatsApp OTP */}
            {tab === 2 && (
              <div className="space-y-3">
                <div className="flex items-center gap-2.5 p-3 rounded-xl bg-green-500/[0.07] border border-green-500/15">
                  <MessageSquare className="w-4 h-4 text-green-400 shrink-0" />
                  <span className="text-xs text-green-400">OTP delivered to your WhatsApp</span>
                </div>
                {!otpSent ? (
                  <>
                    <Field icon={Phone} type="tel" placeholder="e.g. 0712 345 678" value={form.phone} onChange={set('phone')} />
                    <button onClick={handleSendOTP} disabled={loading} className="w-full btn-primary text-sm flex items-center justify-center gap-2">
                      {loading ? 'Sending…' : <><MessageSquare className="w-4 h-4" /> Send WhatsApp OTP</>}
                    </button>
                  </>
                ) : (
                  <form onSubmit={handleVerifyOTP} className="space-y-3">
                    <p className="text-xs text-urban-muted">OTP sent to <span className="text-white font-semibold">{form.phone}</span></p>
                    <input
                      type="text" maxLength={6} value={form.otp} onChange={set('otp')}
                      placeholder="Enter 6-digit OTP"
                      className="input-field text-center text-2xl tracking-[0.4em] font-mono"
                    />
                    <button type="submit" disabled={loading} className="w-full btn-primary text-sm flex items-center justify-center gap-2">
                      {loading ? 'Verifying…' : <>Verify & Sign In <ArrowRight className="w-4 h-4" /></>}
                    </button>
                    <button type="button" onClick={() => setOtpSent(false)}
                      className="w-full text-xs text-urban-muted hover:text-white transition-colors">
                      Change phone number
                    </button>
                  </form>
                )}
              </div>
            )}

            <p className="text-[11px] text-urban-muted/60 text-center">
              By continuing you agree to our{' '}
              <span className="text-urban-muted hover:text-white cursor-pointer transition-colors underline underline-offset-2">Terms</span> and{' '}
              <span className="text-urban-muted hover:text-white cursor-pointer transition-colors underline underline-offset-2">Privacy Policy</span>
            </p>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
