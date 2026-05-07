'use client'

import { useState } from 'react'
import { RefreshCw } from 'lucide-react'
import { toast } from 'sonner'

export function ResendButton({ logId, serviceId }: { logId: string; serviceId: string }) {
  const [sending, setSending] = useState(false)

  async function handleResend() {
    setSending(true)
    try {
      const res = await fetch('/api/notifications/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ serviceId }),
      })
      if (res.ok) {
        toast.success('Notification resent')
      } else {
        toast.error('Failed to resend')
      }
    } catch {
      toast.error('Failed to resend')
    } finally {
      setSending(false)
    }
  }

  return (
    <button
      onClick={handleResend}
      disabled={sending}
      className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-brand-600 hover:bg-brand-50 rounded-lg transition-colors disabled:opacity-50"
    >
      <RefreshCw className={cn('w-3 h-3', sending && 'animate-spin')} />
      Resend
    </button>
  )
}

function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(' ')
}
