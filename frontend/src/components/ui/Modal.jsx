import { useEffect } from 'react'

// Modal Button Components
export function ModalButton({ children, onClick, variant = 'primary', className = '' }) {
  const getButtonStyles = () => {
    switch (variant) {
      case 'cancel':
        return {
          background: 'transparent',
          border: '1px solid rgba(255, 251, 235, 0.3)',
          color: 'text-text-secondary',
          hover: {
            background: 'rgba(255, 251, 235, 0.08)',
            border: '1px solid rgba(255, 251, 235, 0.4)',
            color: 'text-text-primary'
          },
          shadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
        }
      case 'delete':
      case 'logout':
        return {
          background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.8) 0%, rgba(220, 38, 38, 0.9) 100%)',
          border: '1px solid rgba(239, 68, 68, 0.3)',
          color: '#FEFEFE',
          hover: {
            background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.9) 0%, rgba(220, 38, 38, 1) 100%)',
            transform: 'translateY(-1px)',
            boxShadow: '0 8px 25px rgba(239, 68, 68, 0.4), 0 4px 12px rgba(0, 0, 0, 0.2)'
          },
          shadow: '0 4px 16px rgba(239, 68, 68, 0.3), 0 2px 8px rgba(0, 0, 0, 0.1)'
        }
      default:
        return {
          background: 'linear-gradient(135deg, rgba(132, 204, 22, 0.8) 0%, rgba(101, 163, 13, 0.9) 100%)',
          border: '1px solid rgba(132, 204, 22, 0.3)',
          color: '#FEFEFE',
          hover: {
            background: 'linear-gradient(135deg, rgba(132, 204, 22, 0.9) 0%, rgba(101, 163, 13, 1) 100%)',
            transform: 'translateY(-1px)',
            boxShadow: '0 8px 25px rgba(132, 204, 22, 0.4), 0 4px 12px rgba(0, 0, 0, 0.2)'
          },
          shadow: '0 4px 16px rgba(132, 204, 22, 0.3), 0 2px 8px rgba(0, 0, 0, 0.1)'
        }
    }
  }

  const styles = getButtonStyles()

  return (
    <button
      onClick={onClick}
      className={`px-6 py-3 rounded-2xl font-bold text-sm transition-all duration-200 transform-gpu hover:scale-[1.02] active:scale-[0.98] ${className}`}
      style={{
        background: styles.background,
        border: styles.border,
        color: styles.color,
        boxShadow: styles.shadow
      }}
      onMouseEnter={(e) => {
        if (styles.hover) {
          e.target.style.background = styles.hover.background
          e.target.style.border = styles.hover.border
          e.target.style.color = styles.hover.color
          e.target.style.transform = styles.hover.transform || 'scale(1.02)'
          e.target.style.boxShadow = styles.hover.boxShadow || styles.shadow
        }
      }}
      onMouseLeave={(e) => {
        e.target.style.background = styles.background
        e.target.style.border = styles.border
        e.target.style.color = styles.color
        e.target.style.transform = 'scale(1)'
        e.target.style.boxShadow = styles.shadow
      }}
    >
      {children}
    </button>
  )
}

export default function Modal({ isOpen, onClose, title, description, children, type = 'default' }) {
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

  const getModalStyles = () => {
    switch (type) {
      case 'logout':
        return {
          backdrop: 'rgba(0, 0, 0, 0.6)',
          modal: `
            linear-gradient(145deg,
              rgba(27, 67, 50, 0.95) 0%,
              rgba(54, 83, 20, 0.9) 50%,
              rgba(6, 78, 59, 0.95) 100%
            ),
            linear-gradient(135deg,
              rgba(255, 255, 255, 0.1) 0%,
              rgba(255, 255, 255, 0.05) 50%,
              rgba(255, 255, 255, 0.08) 100%
            )
          `,
          shadow: `
            0 25px 50px rgba(0, 0, 0, 0.4),
            0 10px 25px rgba(0, 0, 0, 0.3),
            inset 0 1px 0 rgba(255, 255, 255, 0.15),
            inset 0 -1px 0 rgba(0, 0, 0, 0.1)
          `,
          border: '1px solid rgba(255, 251, 235, 0.15)'
        }
      case 'delete':
        return {
          backdrop: 'rgba(0, 0, 0, 0.7)',
          modal: `
            linear-gradient(145deg,
              rgba(27, 67, 50, 0.95) 0%,
              rgba(54, 83, 20, 0.9) 50%,
              rgba(6, 78, 59, 0.95) 100%
            ),
            linear-gradient(135deg,
              rgba(255, 255, 255, 0.08) 0%,
              rgba(255, 255, 255, 0.03) 50%,
              rgba(255, 255, 255, 0.06) 100%
            )
          `,
          shadow: `
            0 25px 50px rgba(0, 0, 0, 0.4),
            0 10px 25px rgba(0, 0, 0, 0.3),
            inset 0 1px 0 rgba(255, 255, 255, 0.15),
            inset 0 -1px 0 rgba(0, 0, 0, 0.1)
          `,
          border: '1px solid rgba(255, 251, 235, 0.15)'
        }
      default:
        return {
          backdrop: 'rgba(0, 0, 0, 0.5)',
          modal: `
            linear-gradient(145deg,
              rgba(27, 67, 50, 0.9) 0%,
              rgba(54, 83, 20, 0.85) 50%,
              rgba(6, 78, 59, 0.9) 100%
            ),
            linear-gradient(135deg,
              rgba(255, 255, 255, 0.08) 0%,
              rgba(255, 255, 255, 0.04) 50%,
              rgba(255, 255, 255, 0.06) 100%
            )
          `,
          shadow: `
            0 20px 40px rgba(0, 0, 0, 0.3),
            0 8px 20px rgba(0, 0, 0, 0.2),
            inset 0 1px 0 rgba(255, 255, 255, 0.1),
            inset 0 -1px 0 rgba(0, 0, 0, 0.05)
          `,
          border: '1px solid rgba(255, 251, 235, 0.1)'
        }
    }
  }

  const styles = getModalStyles()

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in"
      style={{
        backgroundColor: styles.backdrop,
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)'
      }}
      onClick={onClose}
    >
      <div
        className="max-w-md w-full rounded-4xl p-8 animate-scale-in transform-gpu"
        style={{
          background: styles.modal,
          backdropFilter: 'blur(20px) saturate(180%)',
          WebkitBackdropFilter: 'blur(20px) saturate(180%)',
          border: styles.border,
          boxShadow: styles.shadow,
          borderRadius: '2rem'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="text-center">
          <h2 className="text-2xl font-display font-bold text-text-primary mb-4 drop-shadow-sm">{title}</h2>
          <p className="text-text-secondary mb-8 leading-relaxed">{description}</p>
          <div className="flex gap-4 justify-center">
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}