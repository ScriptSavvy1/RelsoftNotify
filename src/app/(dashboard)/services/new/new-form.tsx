'use client'

import { createService } from '../actions'
import { SERVICE_CATEGORIES, NOTIFICATION_DAYS_OPTIONS } from '@/types'
import { toast } from 'sonner'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

interface Props {
  companies: { id: string; name: string }[]
  preselectedCompany?: string
}

export function NewServiceForm({ companies, preselectedCompany }: Props) {
  async function handleSubmit(formData: FormData) {
    const result = await createService(formData)
    if (result?.error) {
      toast.error(result.error)
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-2 text-sm text-slate-500">
        <Link href="/services" className="hover:text-brand-600 transition-colors flex items-center gap-1">
          <ArrowLeft className="w-3.5 h-3.5" />
          Services
        </Link>
        <span>/</span>
        <span className="text-slate-900 dark:text-white font-medium">Add Service</span>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6">
        <h1 className="text-xl font-semibold text-slate-900 dark:text-white mb-1">Add New Service</h1>
        <p className="text-sm text-slate-500 mb-6">Configure a new service subscription for client monitoring.</p>

        <form action={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="company_id" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Company *</label>
              <select id="company_id" name="company_id" required defaultValue={preselectedCompany || ''} className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500">
                <option value="">Select company</option>
                {companies.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div>
              <label htmlFor="expiry_date" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Expiry Date *</label>
              <input id="expiry_date" name="expiry_date" type="date" required className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500" />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Service Name *</label>
              <input id="name" name="name" required placeholder="e.g. AWS Production EC2" className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500" />
            </div>
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Service Type</label>
              <select id="category" name="category" className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500">
                <option value="">Select type</option>
                {SERVICE_CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Notification Cadence</label>
            <p className="text-xs text-slate-500 mb-3">Select when to trigger automated alerts.</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {NOTIFICATION_DAYS_OPTIONS.map(opt => (
                <label key={opt.value} className="flex items-center gap-2 px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl cursor-pointer hover:border-brand-300 transition-colors">
                  <input
                    type="checkbox"
                    name="notify_days"
                    value={opt.value}
                    defaultChecked={opt.value === 30 || opt.value === 7}
                    className="w-4 h-4 rounded border-slate-300 text-brand-600 focus:ring-brand-500"
                  />
                  <span className="text-sm text-slate-700 dark:text-slate-300">{opt.label}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label htmlFor="notes" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Internal Notes</label>
            <textarea id="notes" name="notes" rows={3} placeholder="Documentation links, account IDs, etc." className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 resize-none" />
          </div>

          <div className="flex gap-3 justify-end pt-2">
            <Link href="/services" className="px-4 py-2.5 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors">Cancel</Link>
            <button type="submit" className="px-6 py-2.5 bg-brand-600 hover:bg-brand-700 text-white text-sm font-medium rounded-xl shadow-lg shadow-brand-600/25 transition-all">Save Service</button>
          </div>
        </form>
      </div>
    </div>
  )
}
