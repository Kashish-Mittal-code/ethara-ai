import React, { useEffect, useState, useContext } from 'react'
import { Settings as SettingsIcon, User, Mail, Shield, Loader } from 'lucide-react'
import { toast } from 'react-toastify'
import api from '../services/api'
import AuthContext from '../context/AuthContext'

export default function Settings() {
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [editMode, setEditMode] = useState(false)
  const [formData, setFormData] = useState({})
  const [submitting, setSubmitting] = useState(false)
  const { user, login } = useContext(AuthContext)

  const fetchProfile = async () => {
    try {
      const res = await api.get('/auth/me')
      setProfile(res.data.data)
      setFormData(res.data.data)
      setLoading(false)
    } catch (err) {
      toast.error('Failed to load profile')
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProfile()
  }, [])

  const handleSave = async () => {
    setSubmitting(true)
    try {
      const res = await api.put('/auth/profile', formData)
      setProfile(res.data.data)
      toast.success('✓ Profile updated successfully')
      setEditMode(false)
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update profile')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-12 h-12 rounded-full border-4 border-blue-200 border-t-blue-600 animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading settings...</p>
        </div>
      </div>
    )
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Settings
        </h1>
        <p className="text-gray-600 mt-2">Manage your account preferences</p>
      </div>

      {/* Profile Section */}
      <div className="max-w-2xl">
        <div className="bg-gradient-to-br from-white to-gray-50 border-2 border-gray-200 rounded-xl p-8 hover:shadow-lg transition-all">
          {/* Profile Header */}
          <div className="flex items-center gap-6 mb-8">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center flex-shrink-0">
              <span className="text-3xl font-bold text-white">
                {profile?.name?.charAt(0).toUpperCase()}
              </span>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800">{profile?.name}</h2>
              <p className="text-gray-600">{profile?.email}</p>
              <span
                className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-semibold ${
                  profile?.emailVerified
                    ? 'bg-green-100 text-green-700'
                    : 'bg-yellow-100 text-yellow-700'
                }`}
              >
                {profile?.emailVerified ? '✓ Verified' : '⚠ Unverified'}
              </span>
            </div>
          </div>

          {/* Profile Info */}
          {!editMode && (
            <div className="space-y-6">
              {/* Name */}
              <div className="flex items-center gap-4 pb-6 border-b border-gray-200">
                <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                  <User className="w-6 h-6 text-blue-600" />
                </div>
                <div className="flex-grow">
                  <p className="text-sm font-semibold text-gray-600">Full Name</p>
                  <p className="text-lg text-gray-800 font-bold">{profile?.name}</p>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-center gap-4 pb-6 border-b border-gray-200">
                <div className="w-12 h-12 rounded-lg bg-purple-100 flex items-center justify-center flex-shrink-0">
                  <Mail className="w-6 h-6 text-purple-600" />
                </div>
                <div className="flex-grow">
                  <p className="text-sm font-semibold text-gray-600">Email Address</p>
                  <p className="text-lg text-gray-800 font-bold">{profile?.email}</p>
                </div>
              </div>

              {/* Auth Provider */}
              <div className="flex items-center gap-4 pb-6 border-b border-gray-200">
                <div className="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center flex-shrink-0">
                  <Shield className="w-6 h-6 text-green-600" />
                </div>
                <div className="flex-grow">
                  <p className="text-sm font-semibold text-gray-600">Auth Provider</p>
                  <p className="text-lg text-gray-800 font-bold">
                    {profile?.authProvider ? profile.authProvider.charAt(0).toUpperCase() + profile.authProvider.slice(1) : 'Local'}
                  </p>
                </div>
              </div>

              {/* Edit Button */}
              <button
                onClick={() => {
                  setEditMode(true)
                  setFormData(profile)
                }}
                className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold py-3 rounded-lg transition-all transform hover:scale-105"
              >
                Edit Profile
              </button>
            </div>
          )}

          {/* Edit Mode */}
          {editMode && (
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name</label>
                <input
                  type="text"
                  value={formData?.name || ''}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
                <input
                  type="email"
                  value={formData?.email || ''}
                  disabled
                  className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 bg-gray-100 text-gray-600 cursor-not-allowed"
                />
                <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleSave}
                  disabled={submitting}
                  className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold py-3 rounded-lg transition-all flex items-center justify-center space-x-2"
                >
                  {submitting ? (
                    <>
                      <Loader className="w-5 h-5 animate-spin" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <span>Save Changes</span>
                  )}
                </button>
                <button
                  onClick={() => setEditMode(false)}
                  className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-3 rounded-lg transition-all"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Account Info */}
      <div className="mt-8 max-w-2xl bg-blue-50 border-2 border-blue-200 rounded-xl p-6">
        <div className="flex gap-4">
          <SettingsIcon className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
          <div>
            <h3 className="font-bold text-gray-800 mb-2">Account Information</h3>
            <p className="text-gray-700 text-sm">
              Your account was created using local authentication. Keep your password secure and unique to protect your account.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
