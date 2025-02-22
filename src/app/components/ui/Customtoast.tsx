import React, { useEffect, useState } from 'react'

type ToastType = 'success' | 'error' | 'warning' | 'info'

interface ToastProps {
  type: ToastType
  title: string
  description: string
  duration?: number
  onClose: () => void
}

const Toast: React.FC<ToastProps> = ({
  type,
  title,
  description,
  duration = 3000,
  onClose
}) => {
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false)
      onClose()
    }, duration)

    return () => clearTimeout(timer)
  }, [duration, onClose])

  if (!visible) return null

  const toastStyles = {
    success: {
      bg: 'bg-gradient-to-r from-[#003D14] to-[#0B1936]',
      icon: '✔️',
      color: '#66C285',
      textShadow: '0 0 5px #009933, 0 0 10px #009933, 0 0 15px #009933',
      iconBg: 'bg-[#0B0B0B33]'
    },
    error: {
      bg: 'bg-gradient-to-r from-[#750000] to-[#0B1936]',
      icon: '❌',
      color: '#EF6666',
      textShadow: '0 0 5px #E50000, 0 0 10px #E50000, 0 0 15px #E50000',
      iconBg: 'bg-[#0B0B0B33]'
    },
    warning: {
      bg: 'bg-gradient-to-r from-[#665200] to-[#0B1936]',
      icon: '⚠️',
      color: '#FFD633',
      textShadow: '0 0 5px #CCA300, 0 0 10px #CCA300, 0 0 15px #CCA300',
      iconBg: 'bg-[#0B0B0B33]'
    },
    info: {
      bg: 'bg-gradient-to-r from-[#16326D] to-[#0B1936]',
      icon: 'ℹ️',
      color: '#A4B2CF',
      textShadow: '0 0 5px #768BB8, 0 0 10px #768BB8, 0 0 15px #768BB8',
      iconBg: 'bg-[#0B0B0B33]'
    }
  }

  return (
    <div
      className={`flex w-96 max-w-sm items-center rounded-lg p-4 text-white shadow-lg ${toastStyles[type].bg} transition-opacity duration-300`}>
      <div
        className={`mr-4 flex h-10 w-10 items-center justify-center rounded-lg text-xl ${toastStyles[type].iconBg}`}>
        <span className="text-black">{toastStyles[type].icon}</span>
      </div>
      <div className="flex-1">
        <h4
          className="font-teachers text-lg font-semibold"
          style={{
            color: toastStyles[type].color,
            textShadow: toastStyles[type].textShadow
          }}>
          {title}
        </h4>
        <p className="text-sm font-thin opacity-90">{description}</p>
      </div>
      <button
        onClick={() => setVisible(false)}
        className="ml-4 text-lg text-white hover:opacity-80">
        ✖️
      </button>
    </div>
  )
}

export default Toast
