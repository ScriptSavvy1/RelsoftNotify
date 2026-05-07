'use client'

import { toast } from 'sonner'
import { Download } from 'lucide-react'

export function ExportCSVButton({ services }: { services: any[] }) {
  function handleExport() {
    if (services.length === 0) {
      toast.error('No data to export')
      return
    }

    const headers = ['Service Name', 'Company', 'Category', 'Expiry Date', 'Status', 'Notify Days']
    const rows = services.map(s => [
      s.name,
      s.company?.name || '',
      s.category || '',
      s.expiry_date,
      s.status,
      (s.notify_days || []).join(';'),
    ])

    const csv = [headers, ...rows].map(row => row.map(cell => `"${cell}"`).join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `relsoft-services-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    URL.revokeObjectURL(url)
    toast.success('CSV exported successfully')
  }

  return (
    <button
      onClick={handleExport}
      className="inline-flex items-center gap-1.5 px-3 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
    >
      <Download className="w-4 h-4" />
      Export CSV
    </button>
  )
}
