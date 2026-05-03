import React, { useState, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { Mail, Lock, Eye, EyeOff, Loader } from 'lucide-react'
import { toast } from 'react-toastify'
import api from '../services/api'
import AuthContext from '../context/AuthContext'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})
  const [adminOpen, setAdminOpen] = useState(false)
  const { login } = useContext(AuthContext)
  const navigate = useNavigate()

  const validateForm = () => {
    const newErrors = {}
    if (!email) newErrors.email = 'Email is required'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) newErrors.email = 'Invalid email format'
    if (!password) newErrors.password = 'Password is required'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validateForm()) return

    setLoading(true)
    try {
      const res = await api.post('/auth/login', { email, password })
      login(res.data.data.token, res.data.data.user)
      toast.success('✓ Welcome back!')
      navigate('/')
    } catch (err) {
      const code = err.response?.data?.code
      const msg = err.response?.data?.message || 'Login failed'

      if (code === 'EMAIL_NOT_VERIFIED') {
        toast.info('📧 Email verification required')
        if (window.confirm('Resend verification email?')) {
          try {
            await api.post('/auth/resend-verification', { email })
            toast.success('✓ Verification email sent!')
          } catch {
            toast.error('Failed to resend verification email')
          }
        }
      } else if (msg === 'Invalid credentials') {
        toast.info('📝 New user? Let\'s create your account')
        setTimeout(() => navigate('/signup', { state: { email, fromLogin: true } }), 1500)
      } else {
        toast.error(msg)
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Admin quick access button top-right */}
        <div className="flex justify-end mb-2">
          <button onClick={() => setAdminOpen(true)} className="text-xs text-gray-500 hover:text-gray-700">Admin</button>
        </div>
        {/* Glassmorphism Card */}
        <div className="backdrop-blur-xl bg-white/80 border border-white/20 rounded-2xl shadow-2xl p-8 hover:shadow-3xl transition-shadow">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 mb-4">
              <Lock className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Welcome Back
            </h1>
            <p className="text-gray-600 mt-2">Sign in to your account</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value)
                    if (errors.email) setErrors({ ...errors, email: '' })
                  }}
                  placeholder="you@example.com"
                  className={`w-full pl-10 pr-4 py-3 rounded-lg border-2 transition-all focus:outline-none ${
                    errors.email
                      ? 'border-red-300 focus:border-red-500 bg-red-50'
                      : 'border-gray-200 focus:border-blue-500 bg-gray-50'
                  }`}
                />
              </div>
              {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value)
                    if (errors.password) setErrors({ ...errors, password: '' })
                  }}
                  placeholder="••••••••"
                  className={`w-full pl-10 pr-12 py-3 rounded-lg border-2 transition-all focus:outline-none ${
                    errors.password
                      ? 'border-red-300 focus:border-red-500 bg-red-50'
                      : 'border-gray-200 focus:border-blue-500 bg-gray-50'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full mt-6 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold py-3 rounded-lg transition-all transform hover:scale-105 active:scale-95 flex items-center justify-center space-x-2"
            >
              {loading ? (
                <>
                  <Loader className="w-5 h-5 animate-spin" />
                  <span>Signing in...</span>
                </>
              ) : (
                <span>Sign In</span>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white/80 text-gray-500">New here?</span>
            </div>
          </div>

          {/* Sign Up Link */}
          <button
            type="button"
            onClick={() => navigate('/signup')}
            className="w-full border-2 border-gray-200 hover:border-purple-500 text-gray-700 hover:text-purple-600 font-semibold py-3 rounded-lg transition-all"
          >
            Create Account
          </button>
        </div>

        {/* Footer Info */}
        <p className="text-center text-gray-600 text-sm mt-6">
          Don't worry if you're new. We'll guide you through signup! 🚀
        </p>
      </div>
      <AdminModal open={adminOpen} onClose={() => setAdminOpen(false)} />
    </div>
  )
}

// render AdminModal at root
// add this export default wrapper? Keep simple: nothing else needed


// Admin modal (simple) - placed here for convenience
function AdminModal({ open, onClose }) {
  const [email, setEmail] = React.useState('')
  const [password, setPassword] = React.useState('')
  const { login } = React.useContext(AuthContext)
  const [loading, setLoading] = React.useState(false)
  const navigate = useNavigate()

  if (!open) return null

  const handleAdminLogin = async () => {
    setLoading(true)
    try {
      const res = await api.post('/auth/login', { email, password })
      login(res.data.data.token, res.data.data.user)
      toast.success('Admin signed in')
      onClose()
      navigate('/admin')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Admin login failed')
    } finally { setLoading(false) }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-full max-w-md bg-white rounded-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold">Admin Login</h3>
          <button onClick={onClose} className="text-gray-500">Close</button>
        </div>
        <div className="space-y-3">
          <input placeholder="admin email" value={email} onChange={e=>setEmail(e.target.value)} className="w-full px-3 py-2 border rounded" />
          <input placeholder="admin password" type="password" value={password} onChange={e=>setPassword(e.target.value)} className="w-full px-3 py-2 border rounded" />
          <div className="flex gap-2">
            <button onClick={handleAdminLogin} className="flex-1 bg-blue-600 text-white py-2 rounded">{loading ? 'Signing...' : 'Sign in'}</button>
            <button onClick={onClose} className="flex-1 bg-gray-200 py-2 rounded">Cancel</button>
          </div>
        </div>
      </div>
    </div>
  )
}
