'use client'

import { useState, useEffect } from 'react'

type ToastType = 'success' | 'error' | 'info' | 'warning'

interface ToastMessage {
  id: number
  message: string
  type: ToastType
}

let toastId = 0

// Create a global toast function
const toastQueue: ToastMessage[] = []
let toastListeners: ((toast: ToastMessage) => void)[] = []

export const toast = (message: string, type: ToastType = 'info') => {
  const id = ++toastId
  const newToast: ToastMessage = { id, message, type }
  toastQueue.push(newToast)
  
  // Notify all listeners
  toastListeners.forEach(listener => listener(newToast))
  
  // Auto-remove after 5 seconds
  setTimeout(() => {
    const index = toastQueue.findIndex(t => t.id === id)
    if (index > -1) {
      toastQueue.splice(index, 1)
      toastListeners.forEach(listener => listener({ ...newToast, message: '' }))
    }
  }, 5000)
}

export const useToasts = () => {
  const [toasts, setToasts] = useState<ToastMessage[]>([])

  useEffect(() => {
    const listener = (newToast: ToastMessage) => {
      if (newToast.message) {
        setToasts(prev => [...prev, newToast])
      } else {
        // Remove toast
        setToasts(prev => prev.filter(t => t.id !== newToast.id))
      }
    }
    
    toastListeners.push(listener)
    
    return () => {
      toastListeners = toastListeners.filter(l => l !== listener)
    }
  }, [])

  const dismiss = (id: number) => {
    toastQueue.splice(toastQueue.findIndex(t => t.id === id), 1)
    setToasts(prev => prev.filter(t => t.id !== id))
  }

  return { toasts, dismiss }
}

const ToastComponent = ({ toasts, dismiss }: { toasts: ToastMessage[], dismiss: (id: number) => void }) => {
  const getToastStyles = (type: ToastType) => {
    switch (type) {
      case 'success':
        return 'bg-green-500 text-white'
      case 'error':
        return 'bg-red-500 text-white'
      case 'warning':
        return 'bg-yellow-500 text-black'
      case 'info':
        return 'bg-blue-500 text-white'
      default:
        return 'bg-gray-500 text-white'
    }
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 space-y-2">
      {toasts.map(toast => (
        <div
          key={toast.id}
          className={`rounded-lg p-4 shadow-lg ${getToastStyles(toast.type)} animate-slide-in-right`}
        >
          <div className="flex items-center justify-between">
            <span>{toast.message}</span>
            <button
              onClick={() => dismiss(toast.id)}
              className="ml-4 text-white/70 hover:text-white"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}

export const ToastProvider = ({ children }: { children: React.ReactNode }) => {
  const { toasts, dismiss } = useToasts()
  
  return (
    <>
      {children}
      <ToastComponent toasts={toasts} dismiss={dismiss} />
    </>
  )
}
