import { useEffect, useState } from 'react'
import api from '../utils/api'
import toast from 'react-hot-toast'

const CHALLENGE_ICONS = {
  no_shopping: () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>,
  no_snacks: () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" /></svg>,
  daily_save: () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" /></svg>,
  weekend_save: () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>,
  custom: () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" /></svg>
}

export default function ChallengePage() {
  const [challenges, setChallenges] = useState([])
  const [myChallenges, setMyChallenges] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('all')

  const fetchData = async () => {
    try {
      const [allRes, myRes] = await Promise.all([
        api.get('/challenges'),
        api.get('/challenges/my')
      ])
      setChallenges(allRes.data.challenges)
      setMyChallenges(myRes.data.challenges)
    } catch { toast.error('Failed to load challenges') }
    finally { setLoading(false) }
  }

  useEffect(() => { fetchData() }, [])

  const handleJoin = async (challenge_id) => {
    try {
      await api.post('/challenges/join', { challenge_id })
      toast.success('Tantangan bergabung! 🎯 Kamu bisa!')
      fetchData()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Gagal bergabung')
    }
  }

  const handleComplete = async (user_challenge_id) => {
    try {
      const res = await api.post('/challenges/complete', { user_challenge_id })
      toast.success(`Tantangan selesai! +${res.data.reward_coins}🪙 +${res.data.reward_xp}XP`)
      fetchData()
    } catch { toast.error('Gagal menyelesaikan tantangan') }
  }

  return (
    <div className="page-wrapper animate-fade-in">
      <div className="mb-6">
        <h1 className="font-display text-3xl text-gray-800"><svg className="w-8 h-8 inline mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg> Tantangan</h1>
        <p className="text-gray-500 text-sm mt-1">Lampaui batas kemampuanmu dan raih hadiah!</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-5">
        {['all', 'my'].map(t => (
          <button key={t} onClick={() => setActiveTab(t)}
            className={`px-5 py-2 rounded-2xl font-bold text-sm transition-all ${
              activeTab === t ? 'bg-primary-500 text-white shadow-md' : 'bg-white text-gray-500 hover:bg-primary-50'
            }`}>
            {t === 'all' ? <><svg className="w-4 h-4 inline mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" /></svg> Semua Tantangan</> : <><svg className="w-4 h-4 inline mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg> Tantangan Saya</>}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-center py-16"><div className="text-5xl animate-float"><svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg></div></div>
      ) : activeTab === 'all' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {challenges.map(c => {
            const userStatus = c.user_status
            return (
              <div key={c.id} className="card card-hover">
                <div className="flex items-start justify-between mb-3">
                  <span className="text-4xl">{CHALLENGE_ICONS[c.challenge_type] ? CHALLENGE_ICONS[c.challenge_type]() : <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" /></svg>}</span>
                  <div className="text-right">
                    <div className="flex items-center gap-1 justify-end">
                      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" /></svg>
                      <span className="text-xs font-bold text-lemon-500"> {c.reward_coins}</span>
                    </div>
                    <div className="flex items-center gap-1 justify-end">
                      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                      <span className="text-xs font-bold text-lavender-500"> {c.reward_xp} XP</span>
                    </div>
                  </div>
                </div>
                <h3 className="font-bold text-gray-800 mb-1">{c.title}</h3>
                <p className="text-sm text-gray-500 mb-3">{c.description}</p>
                <div className="flex items-center justify-between mb-4">
                  <span className="badge bg-sky-100 text-sky-600"><svg className="w-3 h-3 inline mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg> {c.duration_days} days</span>
                  {userStatus && (
                    <span className={`badge capitalize ${
                      userStatus.status === 'active' ? 'bg-primary-100 text-primary-600' :
                      userStatus.status === 'completed' ? 'bg-mint-100 text-mint-600' : 'bg-red-100 text-red-500'
                    }`}>{userStatus.status}</span>
                  )}
                </div>

                {!userStatus ? (
                  <button onClick={() => handleJoin(c.id)} className="btn-primary w-full text-sm py-2">
                    <svg className="w-4 h-4 inline mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg> Join Challenge
                  </button>
                ) : userStatus.status === 'active' ? (
                  <button onClick={() => handleComplete(userStatus.id)} className="btn-primary w-full text-sm py-2 bg-mint-500 hover:bg-mint-600">
                    <svg className="w-4 h-4 inline mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg> Mark Complete
                  </button>
                ) : (
                  <div className="text-center text-sm font-bold text-mint-600"><svg className="w-4 h-4 inline mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" /></svg> Completed!</div>
                )}
              </div>
            )
          })}
        </div>
      ) : (
        <div>
          {myChallenges.length === 0 ? (
            <div className="card text-center py-16">
              <div className="text-6xl mb-4"><svg className="w-16 h-16" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg></div>
              <h3 className="font-display text-xl text-gray-700 mb-2">Tidak ada tantangan!</h3>
              <p className="text-gray-400 mb-4">Bergabunglah dengan tantangan untuk mendorong kebiasaan penyimpananmu</p>
              <button onClick={() => setActiveTab('all')} className="btn-primary inline-flex">Jelajahi Tantangan</button>
            </div>
          ) : (
            <div className="space-y-3">
              {myChallenges.map(c => (
                <div key={c.id} className="card flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{CHALLENGE_ICONS[c.challenge_type] ? CHALLENGE_ICONS[c.challenge_type]() : <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" /></svg>}</span>
                      <h3 className="font-bold text-gray-800">{c.title}</h3>
                    </div>
                    <p className="text-xs text-gray-400 mt-1">Bergabung: {new Date(c.joined_at).toLocaleDateString('id-ID')}</p>
                    {c.completed_at && <p className="text-xs text-mint-600 font-bold">✅ Selesai: {new Date(c.completed_at).toLocaleDateString('id-ID')}</p>}
                  </div>
                  <span className={`badge capitalize ${
                    c.status === 'active' ? 'bg-primary-100 text-primary-600' :
                    c.status === 'completed' ? 'bg-mint-100 text-mint-600' : 'bg-red-100 text-red-500'
                  }`}>{c.status}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
