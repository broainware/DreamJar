import { useEffect, useState } from 'react'
import api from '../utils/api'
import { formatRupiah, formatDate } from '../utils/helpers'
import toast from 'react-hot-toast'

export default function ArchivePage() {
  const [archives, setArchives] = useState([])
  const [achievements, setAchievements] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('archives')

  useEffect(() => {
    Promise.all([api.get('/archives'), api.get('/archives/achievements')])
      .then(([aRes, achRes]) => {
        setArchives(aRes.data.archives)
        setAchievements(achRes.data.achievements)
      })
      .catch(() => toast.error('Failed to load'))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="page-wrapper animate-fade-in">
      <div className="mb-6">
        <h1 className="font-display text-3xl text-gray-800"><svg className="w-8 h-8 inline mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" /></svg> Arsip</h1>
        <p className="text-gray-500 text-sm mt-1">Riwayat perjalanan penyimpanan Anda</p>
      </div>

      <div className="flex gap-2 mb-5">
        {['archives', 'achievements'].map(t => (
          <button key={t} onClick={() => setActiveTab(t)}
            className={`px-5 py-2 rounded-2xl font-bold text-sm capitalize transition-all ${
              activeTab === t ? 'bg-primary-500 text-white shadow-md' : 'bg-white text-gray-500 hover:bg-primary-50'
            }`}>
            {t === 'archives' ? <><svg className="w-4 h-4 inline mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5a2 2 0 012-2h4a2 2 0 012 2v2H8V5z" /></svg> Riwayat Goal</> : <><svg className="w-4 h-4 inline mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" /></svg> Prestasi</>}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-center py-16"><div className="text-5xl animate-float"><svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" /></svg></div></div>
      ) : activeTab === 'archives' ? (
        archives.length === 0 ? (
          <div className="card text-center py-16">
            <div className="text-6xl mb-4"><svg className="w-16 h-16" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5a2 2 0 012-2h4a2 2 0 012 2v2H8V5z" /></svg></div>
            <h3 className="font-display text-xl text-gray-700">Tidak ada goal yang diarsipkan</h3>
            <p className="text-gray-400 mt-2">Selesaikan atau lewatkan goal untuk melihatnya di sini</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {archives.map(a => (
              <div key={a.id} className={`card border-2 ${a.status === 'completed' ? 'border-mint-100' : 'border-red-100'}`}>
                <div className="flex items-start justify-between mb-3">
                  <span className={`badge ${a.status === 'completed' ? 'bg-mint-100 text-mint-600' : 'bg-red-100 text-red-500'} capitalize`}>
                    {a.status === 'completed' ? <svg className="w-3 h-3 inline mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg> : <svg className="w-3 h-3 inline mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>} {a.status}
                  </span>
                  {a.completion_date && <span className="text-xs text-gray-400">{formatDate(a.completion_date)}</span>}
                </div>

                {a.achievement_photo && (
                  <img src={a.achievement_photo} alt={a.title} className="w-full h-32 object-cover rounded-2xl mb-3" />
                )}

                <h3 className="font-bold text-gray-800 mb-2">{a.title}</h3>

                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Target:</span>
                    <span className="font-bold">{formatRupiah(a.target_amount)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Saved:</span>
                    <span className={`font-bold ${a.status === 'completed' ? 'text-mint-600' : 'text-gray-600'}`}>{formatRupiah(a.saved_amount)}</span>
                  </div>
                  {a.status === 'missed' && (
                    <div className="flex justify-between">
                      <span className="text-gray-500">Gap:</span>
                      <span className="font-bold text-red-500">{formatRupiah(a.target_amount - a.saved_amount)}</span>
                    </div>
                  )}
                </div>

                {a.reflection_note && (
                  <p className="mt-3 text-xs text-gray-500 italic bg-gray-50 rounded-xl p-2">
                    <svg className="w-3 h-3 inline mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg> "{a.reflection_note}"
                  </p>
                )}
              </div>
            ))}
          </div>
        )
      ) : (
        achievements.length === 0 ? (
          <div className="card text-center py-16">
            <div className="text-6xl mb-4"><svg className="w-16 h-16" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" /></svg></div>
            <h3 className="font-display text-xl text-gray-700">Belum ada prestasi</h3>
            <p className="text-gray-400 mt-2">Selesaikan goal penyimpanan untuk mendapatkan lencana!</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {achievements.map(a => (
              <div key={a.id} className="card text-center card-hover">
                <div className="text-5xl mb-3">{a.badge_icon}</div>
                <h3 className="font-bold text-gray-800 text-sm">{a.title}</h3>
                <p className="text-xs text-gray-500 mt-1">{a.description}</p>
                <p className="text-xs text-primary-400 mt-2 font-bold"><svg className="w-3 h-3 inline mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" /></svg> {formatDate(a.earned_at)}</p>
              </div>
            ))}
          </div>
        )
      )}
    </div>
  )
}
