import React, { useEffect, useState } from 'react'
import { CheckCircle2, Clock, AlertCircle, Zap } from 'lucide-react'
import { toast } from 'react-toastify'
import api from '../services/api'

export default function Dashboard() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const res = await api.get('/tasks/dashboard/stats')
      setStats(res.data.data)
      setLoading(false)
    } catch (err) {
      toast.error('Failed to load stats')
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-12 h-12 rounded-full border-4 border-blue-200 border-t-blue-600 animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Welcome Back! 👋
        </h1>
        <p className="text-gray-600 mt-2">Here's an overview of your tasks</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          icon={<Zap className="w-8 h-8" />}
          title="Total Tasks"
          value={stats?.total || 0}
          color="from-blue-500 to-blue-600"
          bgColor="from-blue-50 to-blue-100"
        />
        <StatCard
          icon={<CheckCircle2 className="w-8 h-8" />}
          title="Completed"
          value={stats?.completed || 0}
          color="from-green-500 to-green-600"
          bgColor="from-green-50 to-green-100"
        />
        <StatCard
          icon={<Clock className="w-8 h-8" />}
          title="Pending"
          value={stats?.pending || 0}
          color="from-yellow-500 to-yellow-600"
          bgColor="from-yellow-50 to-yellow-100"
        />
        <StatCard
          icon={<AlertCircle className="w-8 h-8" />}
          title="Overdue"
          value={stats?.overdue || 0}
          color="from-red-500 to-red-600"
          bgColor="from-red-50 to-red-100"
        />
      </div>

      {/* Quick Stats */}
      <div className="mt-8 bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-200/50 rounded-xl p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Quick Stats</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
          <div className="text-center">
            <p className="text-3xl font-bold text-blue-600">
              {stats?.total ? Math.round((stats?.completed / stats?.total) * 100) : 0}%
            </p>
            <p className="text-sm text-gray-600 mt-1">Completion Rate</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-green-600">{stats?.completed || 0}</p>
            <p className="text-sm text-gray-600 mt-1">Tasks Done</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-red-600">{stats?.overdue || 0}</p>
            <p className="text-sm text-gray-600 mt-1">Needs Attention</p>
          </div>
        </div>
      </div>
    </div>
  )
}

function StatCard({ icon, title, value, color, bgColor }) {
  return (
    <div className={`bg-gradient-to-br ${bgColor} border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all transform hover:scale-105`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-gray-600 text-sm font-medium">{title}</p>
          <p className={`text-4xl font-bold bg-gradient-to-r ${color} bg-clip-text text-transparent mt-2`}>
            {value}
          </p>
        </div>
        <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${color} text-white flex items-center justify-center opacity-80`}>
          {icon}
        </div>
      </div>
    </div>
  )
}
