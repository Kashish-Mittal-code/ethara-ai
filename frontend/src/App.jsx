import React, { useContext } from 'react'
import { Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom'
import { LogOut, Home, FolderOpen, CheckSquare, Settings as SettingsIconLucide, Menu, X } from 'lucide-react'
import { useState } from 'react'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Dashboard from './pages/Dashboard'
import Projects from './pages/Projects'
import Tasks from './pages/Tasks'
import Settings from './pages/Settings'
import Admin from './pages/Admin'
import ProtectedRoute from './routes/ProtectedRoute'
import AuthContext from './context/AuthContext'

export default function App() {
  const { user, logout } = useContext(AuthContext)
  const navigate = useNavigate()
  const location = useLocation()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const isAuthPage = location.pathname === '/login' || location.pathname === '/signup'

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  if (isAuthPage) {
    return <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
    </Routes>
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 backdrop-blur-xl bg-white/80 border-b border-white/20 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2 group">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center transform group-hover:scale-110 transition-transform">
                <CheckSquare className="w-6 h-6 text-white" />
              </div>
              <span className="font-bold text-xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">TaskFlow</span>
            </Link>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-1">
              <NavLink to="/" icon={<Home className="w-4 h-4" />} label="Dashboard" />
              <NavLink to="/projects" icon={<FolderOpen className="w-4 h-4" />} label="Projects" />
              <NavLink to="/tasks" icon={<CheckSquare className="w-4 h-4" />} label="Tasks" />
              <NavLink to="/settings" icon={<SettingsIconLucide className="w-4 h-4" />} label="Settings" />
              {user?.role === 'admin' && <NavLink to="/admin" icon={<CheckSquare className="w-4 h-4" />} label="Admin" />}
            </div>

            {/* User Section */}
            <div className="hidden md:flex items-center space-x-4">
              {user && (
                <>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-gray-800">{user.name}</p>
                    <p className="text-xs text-gray-500">{user.email}</p>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center">
                    <span className="text-white font-bold text-sm">{user.name.charAt(0).toUpperCase()}</span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="p-2 hover:bg-red-50 rounded-lg text-red-600 hover:text-red-700 transition-all"
                  >
                    <LogOut className="w-5 h-5" />
                  </button>
                </>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 hover:bg-gray-100 rounded-lg"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden pb-4 space-y-2">
              <MobileNavLink to="/" label="Dashboard" />
              <MobileNavLink to="/projects" label="Projects" />
              <MobileNavLink to="/tasks" label="Tasks" />
              <MobileNavLink to="/settings" label="Settings" />
              {user && (
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-all"
                >
                  Logout
                </button>
              )}
            </div>
          )}
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/projects" element={<ProtectedRoute><Projects /></ProtectedRoute>} />
          <Route path="/tasks" element={<ProtectedRoute><Tasks /></ProtectedRoute>} />
          <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
          <Route path="/admin" element={<ProtectedRoute><Admin /></ProtectedRoute>} />
        </Routes>
      </main>
    </div>
  )
}

function NavLink({ to, icon, label }) {
  const location = useLocation()
  const isActive = location.pathname === to
  return (
    <Link
      to={to}
      className={`px-4 py-2 rounded-lg flex items-center space-x-2 transition-all ${
        isActive
          ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
          : 'text-gray-700 hover:bg-gray-100'
      }`}
    >
      {icon}
      <span>{label}</span>
    </Link>
  )
}

function MobileNavLink({ to, label }) {
  const location = useLocation()
  const isActive = location.pathname === to
  return (
    <Link
      to={to}
      className={`block px-4 py-2 rounded-lg transition-all ${
        isActive
          ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white'
          : 'text-gray-700 hover:bg-gray-100'
      }`}
    >
      {label}
    </Link>
  )
}
