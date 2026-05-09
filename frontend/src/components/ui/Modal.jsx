import { useEffect } from 'react'

export default function Modal({ isOpen, onClose, title, description, children }) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <div className="modal-backdrop animate-fade-in" onClick={onClose}>
      <div className="modal-content animate-scale-in" onClick={(e) => e.stopPropagation()}>
        <div className="text-center">
          <h2 className="text-2xl font-display font-bold text-charcoal-800 mb-3">{title}</h2>
          <p className="text-charcoal-600 mb-6">{description}</p>
          <div className="flex gap-3 justify-center">
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}