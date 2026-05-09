import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useState } from 'react'
import Modal from './Modal'

const navItems = [
  { to: '/dashboard', icon: () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>, label: 'Dashboard' },
  { to: '/goals', icon: () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>, label: 'Goals' },
  { to: '/pet', icon: () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>, label: 'Pet' },
  { to: '/challenges', icon: () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>, label: 'Tantangan' },
  { to: '/habits', icon: () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>, label: 'Habits' },
  { to: '/archive', icon: () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" /></svg>, label: 'Arsip' },
  { to: '/profile', icon: () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>, label: 'Profil' },
]

export default function Layout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [showLogoutModal, setShowLogoutModal] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/login')
    setShowLogoutModal(false)
  }

  return (
    <div className="flex min-h-screen relative overflow-hidden bg-decoration">
      {/* Sidebar - Desktop */}
      <aside className="hidden md:flex flex-col w-64 bg-charcoal-800/90 backdrop-blur-xl shadow-sidebar fixed h-full z-20 border-r border-cream-200/20 rounded-r-5xl">
        {/* Logo */}
        <div className="px-6 py-5 border-b border-cream-200/20">
          <div className="flex items-center gap-3">
            <span className="text-3xl"><svg className="w-8 h-8 text-sage-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg></span>
            <div>
              <h1 className="font-display text-xl text-cream-100">DreamJar</h1>
              <p className="text-xs text-charcoal-300 font-medium">Save. Dream. Grow.</p>
            </div>
          </div>
        </div>

        {/* User mini */}
        <div className="px-5 py-4 border-b border-cream-200/20">
          <div className="flex items-center gap-3 bg-cream-50/10 backdrop-blur-sm rounded-4xl p-3 border border-cream-200/20">
            <div className="w-10 h-10 rounded-full bg-sage-500/20 flex items-center justify-center text-xl border border-sage-400/30">
              {user?.avatar_url ? <img src={user.avatar_url} className="w-full h-full rounded-full object-cover" alt="" /> : <svg className="w-6 h-6 text-sage-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>}
            </div>
            <div className="overflow-hidden">
              <p className="font-bold text-cream-100 text-sm truncate">{user?.name}</p>
              <p className="text-xs text-sage-400 font-semibold"><svg className="w-4 h-4 inline" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" /></svg> {user?.coins || 0} coins</p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-4xl font-bold text-sm transition-all duration-300 ${
                  isActive
                    ? 'bg-sage-500/20 text-sage-300 shadow-glow border border-sage-400/30'
                    : 'text-charcoal-300 hover:bg-cream-50/10 hover:text-cream-100 hover:shadow-soft'
                }`
              }
            >
              <span className="text-lg">{item.icon()}</span>
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-cream-200/20">
          <button
            onClick={() => setShowLogoutModal(true)}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-4xl text-red-300 hover:bg-red-500/10 hover:text-red-200 font-bold text-sm transition-all duration-300"
          >
            <span className="text-lg"><svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg></span>
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-30 bg-charcoal-800/90 backdrop-blur-xl border-b border-cream-200/20 shadow-sidebar rounded-b-5xl">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2">
            <span className="text-2xl"><svg className="w-6 h-6 text-sage-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg></span>
            <h1 className="font-display text-lg text-cream-100">DreamJar</h1>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm font-bold text-sage-400"><svg className="w-4 h-4 inline" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" /></svg> {user?.coins || 0}</span>
            <button onClick={() => setMobileOpen(!mobileOpen)} className="p-2 rounded-3xl bg-cream-50/10 text-cream-100 hover:bg-cream-50/20 transition-colors">
              {mobileOpen ? <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg> : <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>}
            </button>
          </div>
        </div>
        {/* Mobile Menu */}
        {mobileOpen && (
          <div className="bg-charcoal-800/95 backdrop-blur-xl border-t border-cream-200/20 px-4 py-3 space-y-1 animate-slide-up rounded-b-5xl">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-4xl font-bold text-sm transition-all duration-300 ${
                    isActive ? 'bg-sage-500/20 text-sage-300 shadow-glow' : 'text-charcoal-300 hover:bg-cream-50/10 hover:text-cream-100'
                  }`
                }
              >
                <span>{item.icon()}</span><span>{item.label}</span>
              </NavLink>
            ))}
            <button onClick={() => setShowLogoutModal(true)} className="w-full flex items-center gap-3 px-4 py-3 rounded-4xl text-red-300 font-bold text-sm">
              <span><svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg></span><span>Logout</span>
            </button>
          </div>
        )}
      </div>

      {/* Main Content */}
      <main className="flex-1 md:ml-64 pt-16 md:pt-0 min-h-screen">
        <Outlet />
      </main>

      {/* Logout Modal */}
      <Modal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        title="Logout?"
        description="Apakah kamu yakin ingin keluar dari akun ini?"
      >
        <button
          onClick={() => setShowLogoutModal(false)}
          className="btn-secondary px-6"
        >
          Batal
        </button>
        <button
          onClick={handleLogout}
          className="btn-danger px-6"
        >
          Logout
        </button>
      </Modal>
    </div>
  )
}
