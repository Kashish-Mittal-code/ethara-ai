import React, { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { User, Mail, Lock, Eye, EyeOff, Loader, CheckCircle } from 'lucide-react'
import { toast } from 'react-toastify'
import api from '../services/api'

export default function Signup() {
  const location = useLocation()
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', email: location.state?.email || '', password: '' })
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})
  const [success, setSuccess] = useState(false)
  const [role, setRole] = useState("member");
  const fromLogin = location.state?.fromLogin

  useEffect(() => {
    if (fromLogin) {
      toast.info('📝 Let\'s create your new account')
    }
  }, [fromLogin])

  const validateForm = () => {
    const newErrors = {}
    if (!form.name.trim()) newErrors.name = 'Name is required'
    if (!form.email) newErrors.email = 'Email is required'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) newErrors.email = 'Invalid email format'
    if (!form.password) newErrors.password = 'Password is required'
    else if (form.password.length < 6) newErrors.password = 'Password must be at least 6 characters'
    if (form.password !== confirmPassword) newErrors.confirmPassword = 'Passwords do not match'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validateForm()) return

    setLoading(true)
    try {
      await api.post('/auth/signup', {
        name: form.name,
        email: form.email,
        password: form.password,
        role: role
      })
      setSuccess(true)
      toast.success('✓ Account created! Check your email to verify.')
      setTimeout(() => {
        navigate('/login')
      }, 3000)
    } catch (err) {
      const msg = err.response?.data?.message || 'Signup failed'
      toast.error(msg)
      if (msg.includes('already')) setErrors({ email: msg })
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md text-center">
          <div className="backdrop-blur-xl bg-white/80 border border-white/20 rounded-2xl shadow-2xl p-8">
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-emerald-600 rounded-full flex items-center justify-center animate-bounce">
                <CheckCircle className="w-8 h-8 text-white" />
              </div>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Account Created!</h2>
            <p className="text-gray-600 mb-6">
              Check your email to verify your account. You'll be able to login right after.
            </p>
            <div className="w-12 h-1 bg-gradient-to-r from-green-400 to-emerald-600 rounded-full mx-auto"></div>
            <p className="text-sm text-gray-500 mt-6">Redirecting to login...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Glassmorphism Card */}
        <div className="backdrop-blur-xl bg-white/80 border border-white/20 rounded-2xl shadow-2xl p-8 hover:shadow-3xl transition-shadow">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 mb-4">
              <User className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
              Create Account
            </h1>
            <p className="text-gray-600 mt-2">Join our team task manager</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name</label>
              <div className="relative">
                <User className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => {
                    setForm({ ...form, name: e.target.value })
                    if (errors.name) setErrors({ ...errors, name: '' })
                  }}
                  placeholder="John Doe"
                  className={`w-full pl-10 pr-4 py-3 rounded-lg border-2 transition-all focus:outline-none ${
                    errors.name
                      ? 'border-red-300 focus:border-red-500 bg-red-50'
                      : 'border-gray-200 focus:border-green-500 bg-gray-50'
                  }`}
                />
              </div>
              {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => {
                    setForm({ ...form, email: e.target.value })
                    if (errors.email) setErrors({ ...errors, email: '' })
                  }}
                  placeholder="you@example.com"
                  className={`w-full pl-10 pr-4 py-3 rounded-lg border-2 transition-all focus:outline-none ${
                    errors.email
                      ? 'border-red-300 focus:border-red-500 bg-red-50'
                      : 'border-gray-200 focus:border-green-500 bg-gray-50'
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
                  value={form.password}
                  onChange={(e) => {
                    setForm({ ...form, password: e.target.value })
                    if (errors.password) setErrors({ ...errors, password: '' })
                  }}
                  placeholder="••••••••"
                  className={`w-full pl-10 pr-12 py-3 rounded-lg border-2 transition-all focus:outline-none ${
                    errors.password
                      ? 'border-red-300 focus:border-red-500 bg-red-50'
                      : 'border-gray-200 focus:border-green-500 bg-gray-50'
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

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Confirm Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                <input
                  type={showConfirm ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value)
                    if (errors.confirmPassword) setErrors({ ...errors, confirmPassword: '' })
                  }}
                  placeholder="••••••••"
                  className={`w-full pl-10 pr-12 py-3 rounded-lg border-2 transition-all focus:outline-none ${
                    errors.confirmPassword
                      ? 'border-red-300 focus:border-red-500 bg-red-50'
                      : 'border-gray-200 focus:border-green-500 bg-gray-50'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-600"
                >
                  {showConfirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.confirmPassword && <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>}
            </div>
            {/* Role Selection */}
          <div className="mt-4">
              <label className="block mb-1 text-sm font-medium">Select Role</label>
                <select
                 value={role}
                onChange={(e) => setRole(e.target.value)}
    className="w-full p-2 border rounded"
  >
    <option value="member">Member</option>
    <option value="admin">Admin</option>
  </select>
</div>
                  
            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full mt-6 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold py-3 rounded-lg transition-all transform hover:scale-105 active:scale-95 flex items-center justify-center space-x-2"
            >
              {loading ? (
                <>
                  <Loader className="w-5 h-5 animate-spin" />
                  <span>Creating Account...</span>
                </>
              ) : (
                <span>Create Account</span>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white/80 text-gray-500">Already have an account?</span>
            </div>
          </div>

          {/* Login Link */}
          <button
            type="button"
            onClick={() => navigate('/login')}
            className="w-full border-2 border-gray-200 hover:border-green-500 text-gray-700 hover:text-green-600 font-semibold py-3 rounded-lg transition-all"
          >
            Sign In
          </button>
        </div>

        {/* Footer Info */}
        <p className="text-center text-gray-600 text-sm mt-6">
          We'll send a verification email to confirm your account 📬
        </p>
      </div>
    </div>
  )
}
