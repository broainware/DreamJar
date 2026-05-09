import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../utils/api'
import toast from 'react-hot-toast'
import { getCategoryEmoji } from '../utils/helpers'

const CATEGORIES = ['gadget', 'travel', 'education', 'emergency', 'wedding', 'custom']

export default function CreateGoalPage() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [dragOver, setDragOver] = useState(false)
  const [form, setForm] = useState({
    title: '', target_amount: '', deadline: '', category: 'custom',
    motivation_note: '', wishlist_image: ''
  })

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleDrop = (e) => {
    e.preventDefault()
    setDragOver(false)
    const file = e.dataTransfer.files[0]
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader()
      reader.onload = (ev) => setForm({ ...form, wishlist_image: ev.target.result })
      reader.readAsDataURL(file)
    }
  }

  const handleFileInput = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (ev) => setForm({ ...form, wishlist_image: ev.target.result })
      reader.readAsDataURL(file)
    }
  }

  // Deadline warning
  const today = new Date()
  const deadlineDate = form.deadline ? new Date(form.deadline) : null
  const daysToDeadline = deadlineDate ? Math.ceil((deadlineDate - today) / (1000 * 60 * 60 * 24)) : null
  const dailyNeeded = daysToDeadline && form.target_amount
    ? Math.ceil(Number(form.target_amount) / daysToDeadline) : null
  const isAggressive = daysToDeadline && daysToDeadline < 30

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await api.post('/goals', form)
      toast.success('Goal created! 🎯 Let\'s go!')
      navigate(`/goals/${res.data.goal.id}`)
    } catch (err) {
      toast.error(err.response?.data?.message || 'Gagal membuat goal')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="page-wrapper animate-fade-in">
      <div className="mb-6">
        <h1 className="font-display text-3xl text-gray-800"><svg className="w-8 h-8 inline mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" /></svg> Buat Goal Baru</h1>
        <p className="text-gray-500 text-sm mt-1">Untuk apa kamu menabung?</p>
      </div>

      <div className="max-w-2xl">
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Category Selector */}
          <div className="card">
            <label className="label text-base mb-3"><svg className="w-5 h-5 inline mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" /></svg> Kategori</label>
            <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
              {CATEGORIES.map(cat => (
                <button
                  key={cat} type="button"
                  onClick={() => setForm({ ...form, category: cat })}
                  className={`flex flex-col items-center gap-1 p-3 rounded-2xl border-2 transition-all ${
                    form.category === cat
                      ? 'border-primary-400 bg-primary-50 shadow-md'
                      : 'border-gray-200 hover:border-primary-200 bg-white'
                  }`}
                >
                  <span className="text-2xl">{getCategoryEmoji(cat)}</span>
                  <span className="text-xs font-bold text-gray-600 capitalize">{cat}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="card space-y-4">
            <div>
              <label className="label"><svg className="w-4 h-4 inline mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg> Goal Kamu</label>
              <input name="title" className="input-field" placeholder="e.g. New iPhone, Trip to Bali..."
                value={form.title} onChange={handleChange} required />
            </div>

            <div>
              <label className="label"><svg className="w-4 h-4 inline mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" /></svg> Target Amount (Rp)</label>
              <input name="target_amount" type="number" min="1000" className="input-field"
                placeholder="e.g. 5000000" value={form.target_amount} onChange={handleChange} required />
            </div>

            <div>
              <label className="label"><svg className="w-4 h-4 inline mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg> Deadline</label>
              <input name="deadline" type="date" className="input-field"
                min={new Date().toISOString().split('T')[0]}
                value={form.deadline} onChange={handleChange} required />
              {isAggressive && (
                <p className="mt-2 text-xs text-orange-500 font-bold bg-orange-50 p-2 rounded-xl">
                  ⚠️ Target mungkin sulit dicapai. Tabungan harian yang dibutuhkan: Rp{dailyNeeded?.toLocaleString('id-ID')}
                </p>
              )}
              {dailyNeeded && !isAggressive && (
                <p className="mt-2 text-xs text-primary-500 font-bold bg-primary-50 p-2 rounded-xl">
                  💡 Tabung Rp{dailyNeeded?.toLocaleString('id-ID')} per hari untuk mencapai goal kamu!
                </p>
              )}
            </div>

            <div>
              <label className="label"><svg className="w-4 h-4 inline mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg> Catatan Motivasi</label>
              <textarea name="motivation_note" className="input-field resize-none" rows={3}
                placeholder="Mengapa goal ini penting bagi kamu?"
                value={form.motivation_note} onChange={handleChange} />
            </div>
          </div>

          {/* Wishlist Image - Drag & Drop */}
          <div className="card">
            <label className="label"><svg className="w-4 h-4 inline mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg> Gambar Wishlist (optional)</label>
            <div
              onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-2xl p-6 text-center transition-all cursor-pointer ${
                dragOver ? 'border-primary-400 bg-primary-50' : 'border-gray-200 hover:border-primary-300'
              }`}
              onClick={() => document.getElementById('wishlistFile').click()}
            >
              {form.wishlist_image ? (
                <div>
                  <img src={form.wishlist_image} alt="Wishlist" className="w-full max-h-48 object-cover rounded-xl mb-2" />
                  <button type="button" className="text-xs text-red-400 font-bold" onClick={(e) => { e.stopPropagation(); setForm({ ...form, wishlist_image: '' }) }}>
                    Hapus gambar ✕
                  </button>
                </div>
              ) : (
                <div>
                    <div className="text-4xl mb-2"><svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg></div>
                  <p className="font-bold text-gray-500 text-sm">Drag & drop or click to upload</p>
                  <p className="text-xs text-gray-400 mt-1">PNG, JPG, GIF supported</p>
                </div>
              )}
            </div>
            <input id="wishlistFile" type="file" accept="image/*" className="hidden" onChange={handleFileInput} />
            {/* Or URL input */}
            <div className="mt-3">
              <input name="wishlist_image" className="input-field text-sm" placeholder="Or paste image URL here..."
                value={form.wishlist_image.startsWith('data:') ? '' : form.wishlist_image}
                onChange={(e) => setForm({ ...form, wishlist_image: e.target.value })} />
            </div>
          </div>

          <div className="flex gap-3">
            <button type="button" onClick={() => navigate(-1)} className="btn-secondary flex-1">Batal</button>
            <button type="submit" disabled={loading} className="btn-primary flex-1">
              {loading ? '⏳ Membuat...' : <><svg className="w-4 h-4 inline mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg> Buat Goal</>}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
