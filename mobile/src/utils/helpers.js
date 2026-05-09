export const formatRupiah = (amount) => {
  if (!amount && amount !== 0) return 'Rp0'
  return 'Rp' + Number(amount).toLocaleString('id-ID')
}

export const formatDate = (dateStr) => {
  if (!dateStr) return '-'
  return new Date(dateStr).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
}

export const calcProgress = (saved, target) => {
  if (!target || target === 0) return 0
  return Math.min(Math.round((saved / target) * 100), 100)
}

export const calcDailyNeeded = (target, saved, deadline) => {
  if (!deadline) return 0
  const remaining = target - saved
  if (remaining <= 0) return 0
  const today = new Date()
  const deadlineDate = new Date(deadline)
  const daysLeft = Math.max(Math.ceil((deadlineDate - today) / (1000 * 60 * 60 * 24)), 1)
  return Math.ceil(remaining / daysLeft)
}

export const daysLeft = (deadline) => {
  if (!deadline) return 0
  const today = new Date()
  const deadlineDate = new Date(deadline)
  return Math.ceil((deadlineDate - today) / (1000 * 60 * 60 * 24))
}

export const getCategoryEmoji = (category) => {
  const map = { gadget: '📱', travel: '✈️', education: '📚', emergency: '🆘', wedding: '💍', custom: '⭐' }
  return map[category] || '⭐'
}

export const getPetEmoji = (type, mood) => {
  const pets = {
    cat: { happy: '😸', neutral: '🐱', sad: '😿', sleeping: '😴' },
    bunny: { happy: '🐰', neutral: '🐇', sad: '😢', sleeping: '😴' },
    hamster: { happy: '🐹', neutral: '🐹', sad: '😢', sleeping: '😴' },
    panda: { happy: '🐼', neutral: '🐼', sad: '😢', sleeping: '😴' },
    dinosaur: { happy: '🦕', neutral: '🦕', sad: '😢', sleeping: '😴' },
  }
  return pets[type]?.[mood] || '🐱'
}

export const getPetTypeEmoji = (type) => {
  const map = { cat: '🐱', bunny: '🐰', hamster: '🐹', panda: '🐼', dinosaur: '🦕' }
  return map[type] || '🐱'
}
