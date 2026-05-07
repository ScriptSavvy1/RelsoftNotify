'use client'

import { updateCompany } from '../../actions'
import { INDUSTRIES } from '@/types'
import { toast } from 'sonner'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import type { Company } from '@/types'

export function EditCompanyForm({ company }: { company: Company }) {
  async function handleSubmit(formData: FormData) {
    const result = await updateCompany(company.id, formData)
    if (result?.error) {
      toast.error(result.error)
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-2 text-sm text-slate-500">
        <Link href={`/companies/${company.id}`} className="hover:text-brand-600 transition-colors flex items-center gap-1">
          <ArrowLeft className="w-3.5 h-3.5" />
          {company.name}
        </Link>
        <span>/</span>
        <span className="text-slate-900 dark:text-white font-medium">Edit</span>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6">
        <h1 className="text-xl font-semibold text-slate-900 dark:text-white mb-1">Edit Company</h1>
        <p className="text-sm text-slate-500 mb-6">Update company information.</p>

        <form action={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Company Name *</label>
            <input id="name" name="name" required defaultValue={company.name} className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500" />
          </div>
          <div>
            <label htmlFor="industry" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Industry</label>
            <select id="industry" name="industry" defaultValue={company.industry || ''} className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500">
              <option value="">Select industry</option>
              {INDUSTRIES.map((ind) => <option key={ind} value={ind}>{ind}</option>)}
            </select>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Phone</label>
              <input id="phone" name="phone" defaultValue={company.phone || ''} className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500" />
            </div>
            <div>
              <label htmlFor="address" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Address</label>
              <input id="address" name="address" defaultValue={company.address || ''} className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500" />
            </div>
          </div>
          <div>
            <label htmlFor="notes" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Notes</label>
            <textarea id="notes" name="notes" rows={3} defaultValue={company.notes || ''} className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 resize-none" />
          </div>
          <div className="flex gap-3 justify-end pt-2">
            <Link href={`/companies/${company.id}`} className="px-4 py-2.5 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors">Cancel</Link>
            <button type="submit" className="px-6 py-2.5 bg-brand-600 hover:bg-brand-700 text-white text-sm font-medium rounded-xl shadow-lg shadow-brand-600/25 transition-all">Save Changes</button>
          </div>
        </form>
      </div>
    </div>
  )
}
