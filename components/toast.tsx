"use client"

import type React from "react"

import { useState } from "react"
import { CheckCircle, XCircle, Info, AlertTriangle } from "lucide-react"

interface Toast {
  id: string
  type: "success" | "error" | "info" | "warning"
  title: string
  message?: string
  duration?: number
}

interface ToastContextType {
  showToast: (toast: Omit<Toast, "id">) => void
}

let toastContext: ToastContextType | null = null

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const showToast = (toast: Omit<Toast, "id">) => {
    const id = Math.random().toString(36).substring(2, 9)
    const newToast = { ...toast, id, duration: toast.duration || 5000 }

    setToasts((prev) => [...prev, newToast])

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
    }, newToast.duration)
  }

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }

  toastContext = { showToast }

  return (
    <>
      {children}
      <div className="fixed top-4 right-4 z-50 space-y-2">
        {toasts.map((toast) => (
          <ToastComponent key={toast.id} toast={toast} onRemove={removeToast} />
        ))}
      </div>
    </>
  )
}

function ToastComponent({ toast, onRemove }: { toast: Toast; onRemove: (id: string) => void }) {
  const icons = {
    success: CheckCircle,
    error: XCircle,
    info: Info,
    warning: AlertTriangle,
  }

  const colors = {
    success: "bg-green-600 border-green-500",
    error: "bg-red-600 border-red-500",
    info: "bg-blue-600 border-blue-500",
    warning: "bg-yellow-600 border-yellow-500",
  }

  const Icon = icons[toast.type]

  return (
    <div
      className={`${colors[toast.type]} border-2 rounded-lg p-4 text-white shadow-lg max-w-sm animate-in slide-in-from-right`}
    >
      <div className="flex items-start space-x-3">
        <Icon className="h-5 w-5 flex-shrink-0 mt-0.5" />
        <div className="flex-1">
          <h4 className="font-bold">{toast.title}</h4>
          {toast.message && <p className="text-sm opacity-90 mt-1">{toast.message}</p>}
        </div>
        <button onClick={() => onRemove(toast.id)} className="text-white/70 hover:text-white">
          <XCircle className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}

export function useToast() {
  if (!toastContext) {
    throw new Error("useToast deve ser usado dentro de ToastProvider")
  }
  return toastContext
}
