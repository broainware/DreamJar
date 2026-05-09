import { useEffect, useState } from 'react'
import api from '../utils/api'
import { getPetEmoji, getPetTypeEmoji, getMoodColor } from '../utils/helpers'
import toast from 'react-hot-toast'
import { useAuth } from '../context/AuthContext'

const PET_TYPES = ['cat', 'bunny', 'hamster', 'panda', 'dinosaur']
const PET_NAMES_SUGGESTIONS = ['Buddy', 'Mochi', 'Coco', 'Pudding', 'Boba', 'Tofu', 'Luna', 'Kiwi']

const PET_ACCESSORIES = [
  { key: 'party_hat', name: 'Party Hat', type: 'hat', emoji: '🎩', cost: 50 },
  { key: 'sunglasses', name: 'Sunglasses', type: 'glasses', emoji: '🕶️', cost: 40 },
  { key: 'bow_tie', name: 'Bow Tie', type: 'collar', emoji: '🎀', cost: 30 },
  { key: 'ball', name: 'Toy Ball', type: 'toy', emoji: '⚽', cost: 20 },
  { key: 'crown', name: 'Crown', type: 'hat', emoji: '👑', cost: 100 },
  { key: 'star_collar', name: 'Star Collar', type: 'collar', emoji: '⭐', cost: 35 },
  { key: 'cozy_bed', name: 'Cozy Bed', type: 'bed_decoration', emoji: '🛏️', cost: 80 },
]

export default function PetPage() {
  const { refreshUser } = useAuth()
  const [pet, setPet] = useState(null)
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [action, setAction] = useState(null)
  const [petAction, setPetAction] = useState(null) // 'feeding', 'playing', 'sleeping'
  const [setupMode, setSetupMode] = useState(false)
  const [setupForm, setSetupForm] = useState({ name: 'Buddy', type: 'cat' })
  const [activeTab, setActiveTab] = useState('pet')

  const fetchData = async () => {
    try {
      const [petRes, userRes] = await Promise.all([api.get('/pets'), api.get('/auth/me')])
      setPet(petRes.data.pet)
      setUser(userRes.data.user)
    } catch { /* no pet yet */ }
    finally { setLoading(false) }
  }

  useEffect(() => { fetchData() }, [])

  const doAction = async (endpoint, successMsg, animKey) => {
    setAction(animKey)
    try {
      const res = await api.post(`/pets/${endpoint}`)
      toast.success(res.data.message || successMsg)
      fetchData()
      refreshUser()
      setTimeout(() => setAction(null), 1500)
    } catch (err) {
      toast.error(err.response?.data?.message || 'Aksi gagal')
      setAction(null)
    }
  }

  const handleSetup = async (e) => {
    e.preventDefault()
    try {
      await api.post('/pets/setup', setupForm)
      toast.success(`${setupForm.name} is ready! 🐾`)
      setSetupMode(false)
      fetchData()
    } catch { toast.error('Gagal menyiapkan pet') }
  }

  if (loading) return (
    <div className="page-wrapper flex items-center justify-center min-h-[60vh]">
      <div className="text-center"><div className="text-5xl animate-float">🐾</div></div>
    </div>
  )

  if (setupMode || !pet) {
    return (
      <div className="page-wrapper animate-fade-in">
        <div className="max-w-lg mx-auto">
          <div className="text-center mb-8">
            <div className="text-6xl animate-float inline-block mb-4">🐾</div>
            <h1 className="font-display text-3xl text-primary-600">Ganti Petmu!</h1>
            <p className="text-gray-500 mt-2">Pilih pet favoritmu! ✨</p>
          </div>

          <div className="card">
            <form onSubmit={handleSetup} className="space-y-5">
              <div>
                <label className="label text-base">🐾 Pilih Petmu</label>
                <div className="grid grid-cols-5 gap-3 mt-2">
                  {PET_TYPES.map(type => (
                    <button key={type} type="button"
                      onClick={() => setSetupForm({ ...setupForm, type })}
                      className={`flex flex-col items-center gap-2 p-3 rounded-2xl border-2 transition-all ${
                        setupForm.type === type ? 'border-primary-400 bg-primary-50 shadow-lg scale-105' : 'border-gray-200 hover:border-primary-200'
                      }`}>
                      <span className="text-3xl">{getPetTypeEmoji(type)}</span>
                      <span className="text-xs font-bold text-gray-600 capitalize">{type}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="label">✏️ Nama Pet</label>
                <input className="input-field" value={setupForm.name}
                  onChange={e => setSetupForm({ ...setupForm, name: e.target.value })} required />
                <div className="flex flex-wrap gap-2 mt-2">
                  {PET_NAMES_SUGGESTIONS.map(n => (
                    <button key={n} type="button"
                      onClick={() => setSetupForm({ ...setupForm, name: n })}
                      className="text-xs bg-sky-100 hover:bg-primary-100 text-primary-600 font-bold px-3 py-1 rounded-full transition-all">
                      {n}
                    </button>
                  ))}
                </div>
              </div>

              <div className="text-center py-4">
                <div className="text-7xl animate-bounce-slow inline-block">{getPetTypeEmoji(setupForm.type)}</div>
                <p className="font-display text-xl text-primary-600 mt-2">{setupForm.name}</p>
              </div>

              <button type="submit" className="btn-primary w-full text-base py-3">
                🚀 Let's Go!
              </button>
            </form>
          </div>
        </div>
      </div>
    )
  }

  const petEmoji = getPetEmoji(pet.type, pet.mood)

  return (
    <div className="page-wrapper animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-3xl text-gray-800">🐾 {pet.name}'s Room</h1>
          <p className="text-gray-500 text-sm mt-1">Jaga kompanion virtualmu!</p>
        </div>
        <div className="flex items-center gap-2 bg-lemon-100 rounded-2xl px-4 py-2">
          <span>🪙</span>
          <span className="font-bold text-lemon-500">{user?.coins || 0} coins</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-5">
        {['pet', 'shop'].map(t => (
          <button key={t} onClick={() => setActiveTab(t)}
            className={`px-5 py-2 rounded-2xl font-bold text-sm capitalize transition-all ${
              activeTab === t ? 'bg-primary-500 text-white shadow-md' : 'bg-white text-gray-500 hover:bg-primary-50'
            }`}>
            {t === 'pet' ? '🐾 My Pet' : '🛍️ Shop'}
          </button>
        ))}
      </div>

      {activeTab === 'pet' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Pet Display */}
          <div className="card bg-gradient-to-br from-sky-50 to-primary-50 text-center">
            <div className={`text-8xl inline-block mb-4 ${
              action === 'feed' ? 'pet-eating' : action === 'play' ? 'pet-happy' : 'pet-idle'
            }`}>
              {petEmoji}
            </div>
            <h2 className="font-display text-2xl text-primary-600">{pet.name}</h2>
            <div className="flex items-center justify-center gap-2 mt-1 mb-4">
              <span className="badge bg-lavender-100 text-lavender-500 capitalize">
                Lv.{pet.level} {pet.type}
              </span>
              <span className="badge" style={{ background: getMoodColor(pet.mood) + '20', color: getMoodColor(pet.mood) }}>
                {pet.mood}
              </span>
            </div>

            {/* XP Bar */}
            <div className="mb-4">
              <div className="flex justify-between text-xs font-bold text-gray-400 mb-1">
                <span>XP</span><span>{pet.xp} / {pet.level * 100}</span>
              </div>
              <div className="progress-bar h-2">
                <div className="progress-fill h-2 rounded-full"
                  style={{ width: `${Math.min((pet.xp / (pet.level * 100)) * 100, 100)}%`, background: '#8B5CF6' }} />
              </div>
            </div>

            {/* Stats */}
            <div className="space-y-3 text-left">
              {[
                { label: '🍖 Hunger', value: pet.hunger, color: '#F59E0B' },
                { label: '😊 Happiness', value: pet.happiness, color: '#10B981' },
                { label: '⚡ Energy', value: pet.energy, color: '#3B82F6' },
              ].map(s => (
                <div key={s.label}>
                  <div className="flex justify-between text-xs font-bold text-gray-500 mb-1">
                    <span>{s.label}</span><span>{s.value}%</span>
                  </div>
                  <div className="progress-bar h-2.5">
                    <div className="progress-fill h-2.5 rounded-full transition-all duration-700"
                      style={{ width: `${s.value}%`, background: s.color }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-4">
            <div className="card">
              <h3 className="font-display text-lg text-gray-800 mb-4">🎮 Interact</h3>
              <div className="space-y-3">
                <button
                  onClick={() => doAction('feed', 'Pet fed!', 'feed')}
                  className="w-full btn-primary bg-amber-400 hover:bg-amber-500 py-4 text-base"
                  disabled={action !== null}
                >
                  <span className="text-2xl">🍖</span>
                  Makan (10 🪙)
                </button>
                <button
                  onClick={() => doAction('play', 'Played!', 'play')}
                  className="w-full btn-primary bg-mint-500 hover:bg-mint-600 py-4 text-base"
                  disabled={action !== null}
                >
                  <span className="text-2xl">🎾</span>
                  Bermain
                </button>
                <button
                  onClick={() => doAction('sleep', 'Pet sleeping!', 'sleep')}
                  className="w-full btn-secondary py-4 text-base"
                  disabled={action !== null}
                >
                  <span className="text-2xl">💤</span>
                  Tidur
                </button>
              </div>
            </div>

            <div className="card bg-sky-50">
              <h3 className="font-display text-lg text-gray-800 mb-2">💡 Tips</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex gap-2"><span>💰</span><span>Simpan uang untuk mendapatkan koin makanan untuk petmu!</span></li>
                <li className="flex gap-2"><span>🔥</span><span>Teruskan streak penyimpananmu untuk menjaga petmu bahagia!</span></li>
                <li className="flex gap-2"><span>🏆</span><span>Lengkapi tujuan untuk membuka aksesori pet!</span></li>
              </ul>
            </div>

            <button onClick={() => setSetupMode(true)} className="btn-secondary w-full text-sm">
              🔄 Ganti Pet
            </button>
          </div>
        </div>
      )}

      {activeTab === 'shop' && (
        <div>
          <div className="mb-4 flex items-center gap-2 bg-lemon-100 rounded-2xl px-4 py-3 w-fit">
            <span className="text-xl">🪙</span>
            <span className="font-bold text-lemon-600">Your coins: {user?.coins || 0}</span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {PET_ACCESSORIES.map(item => (
              <div key={item.key} className="card card-hover text-center">
                <div className="text-5xl mb-3 animate-float">{item.emoji}</div>
                <h3 className="font-bold text-gray-800 text-sm">{item.name}</h3>
                <p className="text-xs text-gray-400 capitalize mb-3">{item.type}</p>
                <div className="flex items-center justify-center gap-1 bg-lemon-100 rounded-full px-3 py-1 mb-3">
                  <span className="text-xs">🪙</span>
                  <span className="text-xs font-bold text-lemon-600">{item.cost}</span>
                </div>
                <button className="btn-primary w-full text-xs py-2">Buy</button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
