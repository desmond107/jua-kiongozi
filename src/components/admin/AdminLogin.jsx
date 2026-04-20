import { useState } from 'react'
import { motion } from 'framer-motion'
import { Lock, Eye, EyeOff, Shield } from 'lucide-react'
import toast from 'react-hot-toast'

const ADMIN_PASSWORD = '226295'

export default function AdminLogin({ onSuccess }) {
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [attempts, setAttempts] = useState(0)
  const [loading, setLoading] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (attempts >= 5) {
      toast.error('Too many failed attempts. Please try again later.')
      return
    }
    setLoading(true)
    setTimeout(() => {
      if (password === ADMIN_PASSWORD) {
        sessionStorage.setItem('jk_admin', 'true')
        onSuccess()
        toast.success('Welcome, Admin!')
      } else {
        setAttempts((a) => a + 1)
        toast.error(`Invalid password. ${5 - attempts - 1} attempts remaining.`)
        setPassword('')
      }
      setLoading(false)
    }, 800)
  }

  return (
    <div className="min-h-screen bg-urban-bg flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-sm"
      >
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-kenya-red/10 border border-kenya-red/20 flex items-center justify-center mx-auto mb-4">
            <Shield className="w-8 h-8 text-kenya-red" />
          </div>
          <h1 className="text-2xl font-display font-bold text-white">Admin Access</h1>
          <p className="text-gray-500 text-sm mt-1">Restricted area — authorized personnel only</p>
        </div>

        <div className="card p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                type={showPass ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Admin password"
                className="input-field pl-10 pr-12"
                disabled={attempts >= 5}
                autoFocus
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
              >
                {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            <button
              type="submit"
              disabled={loading || attempts >= 5 || !password}
              className="w-full btn-primary"
            >
              {loading ? 'Verifying...' : 'Access Dashboard'}
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-gray-600 mt-4">
          This page is not publicly listed. Unauthorized access is logged.
        </p>
      </motion.div>
    </div>
  )
}
