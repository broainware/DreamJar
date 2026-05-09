import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import api from '../utils/api'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'

export default function ProfilePage() {
  const { user, logout, refreshUser } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: user?.name || '', avatar_url: user?.avatar_url || '' })
  const [saving, setSaving] = useState(false)

  const handleSave = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      await api.put('/auth/profile', form)
      await refreshUser()
      toast.success('Profile updated! 🎉')
    } catch { toast.error('Failed to update') }
    finally { setSaving(false) }
  }

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const xpForNextLevel = (user?.level || 1) * 100
  const xpProgress = Math.min(((user?.xp || 0) % xpForNextLevel) / xpForNextLevel * 100, 100)

  return (
    <div className="page-wrapper animate-fade-in">
      <div className="mb-6">
        <h1 className="font-display text-3xl text-gray-800"><svg className="w-6 h-6 inline mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg> Profile</h1>
        <p className="text-gray-500 text-sm mt-1">Kelola informasi akun Anda</p>
      </div>

      <div className="max-w-lg space-y-5">
        {/* Avatar & Level */}
        <div className="card bg-gradient-to-br from-primary-50 to-sky-50 text-center">
          <div className="w-20 h-20 rounded-full bg-primary-100 flex items-center justify-center mx-auto mb-3 text-4xl overflow-hidden">
            {user?.avatar_url ? <img src={user.avatar_url} className="w-full h-full object-cover" alt="" /> : <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>}
          </div>
          <h2 className="font-display text-2xl text-gray-800">{user?.name}</h2>
          <p className="text-gray-500 text-sm">{user?.email}</p>

          <div className="flex justify-center gap-4 mt-4">
            <div className="text-center">
              <p className="font-display text-2xl text-lemon-500"><svg className="w-5 h-5 inline mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" /></svg> {user?.coins || 0}</p>
              <p className="text-xs text-gray-400 font-medium">Coins</p>
            </div>
            <div className="text-center">
              <p className="font-display text-2xl text-lavender-500"><svg className="w-5 h-5 inline mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg> {user?.xp || 0}</p>
              <p className="text-xs text-gray-400 font-medium">XP</p>
            </div>
            <div className="text-center">
              <p className="font-display text-2xl text-orange-400"><svg className="w-5 h-5 inline mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.879 16.121A3 3 0 1012.015 11L11 14H9c0 .768.293 1.536.879 2.121z" /></svg> {user?.streak || 0}</p>
              <p className="text-xs text-gray-400 font-medium">Streak</p>
            </div>
          </div>

          {/* Level bar */}
          <div className="mt-4">
            <div className="flex justify-between text-xs font-bold text-gray-500 mb-1">
              <span>Level {user?.level || 1}</span>
              <span>{user?.xp || 0} / {xpForNextLevel} XP</span>
            </div>
            <div className="progress-bar h-3">
              <div className="progress-fill h-3 rounded-full"
                style={{ width: `${xpProgress}%`, background: 'linear-gradient(90deg, #8B5CF6, #3B82F6)' }} />
            </div>
          </div>
        </div>

        {/* Edit Profile */}
        <div className="card">
          <h2 className="font-display text-xl text-gray-800 mb-4"><svg className="w-5 h-5 inline mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg> Edit Profile</h2>
          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <label className="label">Nama</label>
              <input className="input-field" value={form.name}
                onChange={e => setForm({...form, name: e.target.value})} required />
            </div>
            <div>
              <label className="label">Avatar URL</label>
              <input className="input-field" placeholder="https://..."
                value={form.avatar_url}
                onChange={e => setForm({...form, avatar_url: e.target.value})} />
              {form.avatar_url && (
                <img src={form.avatar_url} alt="Preview" className="mt-2 w-16 h-16 rounded-full object-cover border-2 border-primary-200" />
              )}
            </div>
            <button type="submit" disabled={saving} className="btn-primary w-full">
              {saving ? '⏳ Saving...' : <><svg className="w-4 h-4 inline mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" /></svg> Simpan Perubahan</>}
            </button>
          </form>
        </div>

        {/* Biometric Placeholder */}
        <div className="card bg-gray-50 border border-dashed border-gray-200">
          <div className="flex items-center gap-3 opacity-50">
            <span className="text-3xl"><svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg></span>
            <div>
              <h3 className="font-bold text-gray-700">Login Biometrik</h3>
              <p className="text-xs text-gray-400">Tersedia di aplikasi mobile</p>
            </div>
            <span className="ml-auto badge bg-gray-200 text-gray-500">Segera Hadir</span>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="card border-2 border-red-100">
          <button onClick={handleLogout} className="btn-danger w-full">
            <svg className="w-4 h-4 inline mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg> Logout
          </button>
        </div>
      </div>
    </div>
  )
}
