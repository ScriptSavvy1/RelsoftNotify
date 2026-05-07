'use client'

import { updateService } from '../../actions'
import { SERVICE_CATEGORIES, NOTIFICATION_DAYS_OPTIONS } from '@/types'
import { toast } from 'sonner'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

interface Props {
  service: any
  companies: { id: string; name: string }[]
}

export function EditServiceForm({ service, companies }: Props) {
  async function handleSubmit(formData: FormData) {
    const result = await updateService(service.id, formData)
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
        <span className="text-slate-900 dark:text-white font-medium">Edit: {service.name}</span>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6">
        <h1 className="text-xl font-semibold text-slate-900 dark:text-white mb-1">Edit Service</h1>
        <p className="text-sm text-slate-500 mb-6">Update service details and notification settings.</p>

        <form action={handleSubmit} className="space-y-5">
          <input type="hidden" name="company_id" value={service.company_id} />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Service Name *</label>
              <input id="name" name="name" required defaultValue={service.name} className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500" />
            </div>
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Category</label>
              <select id="category" name="category" defaultValue={service.category || ''} className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500">
                <option value="">Select type</option>
                {SERVICE_CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="expiry_date" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Expiry Date *</label>
              <input id="expiry_date" name="expiry_date" type="date" required defaultValue={service.expiry_date} className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500" />
            </div>
            <div>
              <label htmlFor="status" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Status</label>
              <select id="status" name="status" defaultValue={service.status} className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500">
                <option value="active">Active</option>
                <option value="expired">Expired</option>
                <option value="renewed">Renewed</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Notification Cadence</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {NOTIFICATION_DAYS_OPTIONS.map(opt => (
                <label key={opt.value} className="flex items-center gap-2 px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl cursor-pointer hover:border-brand-300 transition-colors">
                  <input type="checkbox" name="notify_days" value={opt.value} defaultChecked={(service.notify_days || []).includes(opt.value)} className="w-4 h-4 rounded border-slate-300 text-brand-600 focus:ring-brand-500" />
                  <span className="text-sm text-slate-700 dark:text-slate-300">{opt.label}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label htmlFor="notes" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Notes</label>
            <textarea id="notes" name="notes" rows={3} defaultValue={service.notes || ''} className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 resize-none" />
          </div>

          <div className="flex gap-3 justify-end pt-2">
            <Link href="/services" className="px-4 py-2.5 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors">Cancel</Link>
            <button type="submit" className="px-6 py-2.5 bg-brand-600 hover:bg-brand-700 text-white text-sm font-medium rounded-xl shadow-lg shadow-brand-600/25 transition-all">Save Changes</button>
          </div>
        </form>
      </div>
    </div>
  )
}
