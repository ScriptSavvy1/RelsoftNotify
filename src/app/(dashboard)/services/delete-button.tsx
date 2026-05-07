'use client'

import { useState } from 'react'
import { deleteService } from './actions'
import { toast } from 'sonner'

export function DeleteServiceButton({ serviceId, serviceName }: { serviceId: string; serviceName: string }) {
  const [deleting, setDeleting] = useState(false)

  async function handleDelete() {
    if (!confirm(`Delete service "${serviceName}"? This cannot be undone.`)) return
    setDeleting(true)
    const result = await deleteService(serviceId)
    if (result?.error) {
      toast.error(result.error)
    } else {
      toast.success(`"${serviceName}" deleted`)
    }
    setDeleting(false)
  }

  return (
    <button
      onClick={handleDelete}
      disabled={deleting}
      className="px-2.5 py-1 text-xs font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
    >
      {deleting ? '...' : 'Delete'}
    </button>
  )
}
