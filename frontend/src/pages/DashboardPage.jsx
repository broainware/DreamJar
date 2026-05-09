import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../utils/api'
import { formatRupiah, calcProgress, daysLeft, getCategoryEmoji, getPetEmoji } from '../utils/helpers'
import toast from 'react-hot-toast'

export default function DashboardPage() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/dashboard').then(res => {
      setData(res.data)
    }).catch(() => toast.error('Gagal memuat dashboard')).finally(() => setLoading(false))
  }, [])

  if (loading) return (
    <div className="page-wrapper flex items-center justify-center min-h-[60vh]">
      <div className="text-center">
        <div className="text-5xl animate-float mb-3"><svg className="w-12 h-12 text-sage-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg></div>
        <p className="text-charcoal-400 font-medium">Memuat dashboard...</p>
      </div>
    </div>
  )

  const { user, stats, active_goals, pet, recent_transactions, active_challenges } = data || {}

  return (
    <div className="page-wrapper animate-fade-in relative min-h-screen" style={{
      background: `
        radial-gradient(circle at 25% 25%, rgba(34, 197, 94, 0.08) 0%, transparent 50%),
        radial-gradient(circle at 75% 75%, rgba(132, 204, 22, 0.06) 0%, transparent 50%),
        radial-gradient(circle at 50% 50%, rgba(16, 185, 129, 0.04) 0%, transparent 50%),
        linear-gradient(135deg, rgba(27, 67, 50, 0.95) 0%, rgba(54, 83, 20, 0.9) 35%, rgba(6, 78, 59, 0.95) 70%, rgba(27, 67, 50, 0.98) 100%)
      `,
      backgroundAttachment: 'fixed'
    }}>
      {/* Ambient lighting effects */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-400/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/3 right-1/3 w-80 h-80 bg-sage-400/4 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
        <div className="absolute top-3/4 left-1/2 w-64 h-64 bg-olive-400/3 rounded-full blur-3xl animate-pulse" style={{animationDelay: '4s'}}></div>
      </div>

      {/* Floating blur blobs */}
      <div className="absolute top-20 left-20 w-32 h-32 bg-sage-400/10 rounded-full blur-xl animate-float opacity-60"></div>
      <div className="absolute bottom-32 right-32 w-40 h-40 bg-emerald-400/8 rounded-full blur-xl animate-float opacity-50" style={{animationDelay: '3s'}}></div>
      <div className="absolute top-1/2 left-3/4 w-24 h-24 bg-olive-400/6 rounded-full blur-xl animate-float opacity-40" style={{animationDelay: '1.5s'}}></div>

      {/* Subtle noise texture overlay */}
      <div className="absolute inset-0 opacity-[0.02]" style={{
        backgroundImage: `url("data:image/svg+xml,%3csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3e%3cfilter id='noiseFilter'%3e%3cfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3e%3c/filter%3e%3crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3e%3c/svg%3e")`,
        pointerEvents: 'none'
      }}></div>

      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl text-text-primary">
            Hallo, {user?.name?.split(' ')[0]}!
          </h1>
          <p className="text-text-secondary text-sm mt-1 font-medium">
            {new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long' })}
          </p>
        </div>
        <div className="hidden md:flex items-center gap-2 bg-cream-50/10 backdrop-blur-sm rounded-4xl px-4 py-2 border border-cream-200/20">
          <svg className="w-6 h-6 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.879 16.121A3 3 0 1012.015 11L11 14H9c0 .768.293 1.536.879 2.121z" /></svg>
          <div>
            <p className="text-xs text-text-tertiary font-medium">Streak</p>
            <p className="font-display text-lg text-text-accent">{user?.streak || 0} days</p>
          </div>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        {[
          { icon: () => <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>, label: 'Goals Aktif', value: stats?.active_goals || 0, color: 'bg-sage-500/20 text-sage-300 border-sage-400/30' },
          { icon: () => <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>, label: 'Goals Selesai', value: stats?.completed_goals || 0, color: 'bg-emerald-500/20 text-emerald-300 border-emerald-400/30' },
          { icon: () => <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" /></svg>, label: 'Total Disimpan', value: formatRupiah(stats?.total_saved || 0), color: 'bg-olive-500/20 text-olive-300 border-olive-400/30', small: true },
          { icon: () => <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" /></svg>, label: 'Koin', value: user?.coins || 0, color: 'bg-yellow-500/20 text-yellow-300 border-yellow-400/30' },
        ].map((s) => (
          <div key={s.label} className={`stat-card ${s.color}`}>
            {s.icon()}
            <div>
              <p className="text-xs font-bold opacity-70">{s.label}</p>
              <p className={`font-display ${s.small ? 'text-base' : 'text-2xl'} font-bold`}>{s.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Active Goals */}
        <div className="md:col-span-2">
          <div className="flex items-center justify-between mb-3">
            <h2 className="section-title mb-0"><svg className="w-5 h-5 inline mr-2 text-text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg> Goal Aktif</h2>
            <Link to="/goals/new" className="btn-primary text-sm py-2 px-4">+ Goal Baru</Link>
          </div>

          {active_goals?.length === 0 ? (
            <div className="card text-center py-10">
              <div className="text-5xl mb-3"><svg className="w-12 h-12 text-sage-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg></div>
              <p className="font-bold text-text-dark">Belum ada goal aktif!</p>
              <Link to="/goals/new" className="btn-primary mt-4 inline-flex text-sm">Buat goal pertama kamu</Link>
            </div>
          ) : (
            <div className="space-y-3">
              {active_goals?.map((goal) => {
                const pct = calcProgress(goal.saved_amount, goal.target_amount)
                const dl = daysLeft(goal.deadline)
                return (
                  <Link to={`/goals/${goal.id}`} key={goal.id} className="card card-hover block">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">{getCategoryEmoji(goal.category)}</span>
                        <div>
                          <h3 className="font-bold text-charcoal-800">{goal.title}</h3>
                          <p className="text-xs text-charcoal-400">{dl > 0 ? `${dl} days left` : 'Deadline passed!'}</p>
                        </div>
                      </div>
                      <span className={`badge ${dl < 7 ? 'bg-red-500/20 text-red-300 border-red-400/30' : 'bg-sage-500/20 text-sage-300 border-sage-400/30'}`}>
                        {pct}%
                      </span>
                    </div>
                    <div className="progress-bar mb-2">
                      <div
                        className="progress-fill"
                        style={{
                          width: `${pct}%`,
                          background: pct >= 100 ? '#22C55E' : pct >= 60 ? '#16A34A' : '#15803D'
                        }}
                      />
                    </div>
                    <div className="flex justify-between text-xs font-bold text-text-dark-secondary">
                      <span>{formatRupiah(goal.saved_amount)}</span>
                      <span>{formatRupiah(goal.target_amount)}</span>
                    </div>
                  </Link>
                )
              })}
              {active_goals?.length > 0 && (
                <Link to="/goals" className="block text-center text-sm text-text-accent font-bold hover:underline py-2">
                  Lihat semua goal →
                </Link>
              )}
            </div>
          )}
        </div>

        {/* Right Column */}
        <div className="space-y-4">
          {/* Pet Widget */}
          {pet && (
            <div className="card bg-gradient-to-br from-sage-500/10 to-emerald-500/10 border border-sage-400/20">
              <h2 className="section-title mb-3"><svg className="w-5 h-5 inline mr-2 text-text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg> {pet.name}</h2>
              <div className="text-center py-2">
                <div className="text-6xl animate-float inline-block mb-2">
                  {getPetEmoji(pet.type, pet.mood)}
                </div>
                <p className="text-xs font-bold text-text-dark-secondary capitalize">{pet.mood}</p>
              </div>
              <div className="space-y-2 mt-3">
                {[
                  { label: '🍖 Hunger', value: pet.hunger, color: '#F59E0B' },
                  { label: '😊 Happy', value: pet.happiness, color: '#22C55E' },
                  { label: '⚡ Energy', value: pet.energy, color: '#16A34A' },
                ].map(s => (
                  <div key={s.label}>
                    <div className="flex justify-between text-xs font-bold text-text-dark-secondary mb-1">
                      <span>{s.label}</span><span>{s.value}%</span>
                    </div>
                    <div className="progress-bar h-2">
                      <div className="progress-fill h-2 rounded-full" style={{ width: `${s.value}%`, background: s.color }} />
                    </div>
                  </div>
                ))}
              </div>
              <Link to="/pet" className="btn-secondary w-full mt-4 text-sm py-2">Visit Pet <svg className="w-4 h-4 inline ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg></Link>
            </div>
          )}

          {/* Active Challenges */}
          {active_challenges?.length > 0 && (
            <div className="card">
              <h2 className="section-title mb-3"><svg className="w-5 h-5 inline mr-2 text-text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg> Tantangan Aktif</h2>
              <div className="space-y-2">
                {active_challenges.slice(0, 2).map(c => (
                  <div key={c.id} className="bg-cream-50/10 backdrop-blur-sm rounded-4xl p-3 border border-cream-200/20">
                    <p className="font-bold text-sm text-text-dark">{c.title}</p>
                    <p className="text-xs text-text-dark-secondary mt-1">Joined {new Date(c.joined_at).toLocaleDateString('id-ID')}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Recent Transactions */}
          {recent_transactions?.length > 0 && (
            <div className="card">
              <h2 className="section-title mb-3"><svg className="w-5 h-5 inline mr-2 text-text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" /></svg> Tabungan Terbaru</h2>
              <div className="space-y-2">
                {recent_transactions.map(tx => (
                  <div key={tx.id} className="flex items-center justify-between py-2 border-b border-cream-200/20 last:border-0">
                    <div>
                      <p className="font-bold text-sm text-text-dark">{tx.goal_title}</p>
                      <p className="text-xs text-text-dark-secondary">{new Date(tx.date).toLocaleDateString('id-ID')}</p>
                    </div>
                    <span className="font-bold text-text-accent text-sm">+{formatRupiah(tx.amount)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
