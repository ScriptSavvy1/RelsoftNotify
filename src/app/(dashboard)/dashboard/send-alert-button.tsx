'use client'

import { MoreHorizontal } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'

export function SendAlertButton({ serviceId, serviceName }: { serviceId: string; serviceName: string }) {
  const [sending, setSending] = useState(false)

  async function handleSend() {
    setSending(true)
    try {
      const res = await fetch('/api/notifications/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ serviceId }),
      })
      const data = await res.json()
      if (res.ok) {
        toast.success(`Alert sent for "${serviceName}"`)
      } else {
        toast.error(data.error || 'Failed to send alert')
      }
    } catch {
      toast.error('Failed to send alert')
    } finally {
      setSending(false)
    }
  }

  return (
    <button
      onClick={handleSend}
      disabled={sending}
      className="p-1.5 text-slate-400 hover:text-brand-600 hover:bg-brand-50 rounded-lg transition-colors disabled:opacity-50"
      title="Send Alert Now"
    >
      {sending ? (
        <div className="w-4 h-4 border-2 border-brand-400/30 border-t-brand-600 rounded-full animate-spin" />
      ) : (
        <MoreHorizontal className="w-4 h-4" />
      )}
    </button>
  )
}
