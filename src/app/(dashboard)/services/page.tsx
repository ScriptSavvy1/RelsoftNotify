import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { ServerCog, Plus, Search, Download, Filter } from 'lucide-react'
import { formatDate, daysUntilExpiry, getDaysBadgeColor, cn } from '@/lib/utils'
import { ExportCSVButton } from './export-csv'
import { DeleteServiceButton } from './delete-button'

export const dynamic = 'force-dynamic'

export default async function ServicesPage({
  searchParams,
}: {
  searchParams: Promise<{ company?: string; category?: string; status?: string }>
}) {
  const params = await searchParams
  const supabase = await createClient()

  let query = supabase
    .from('services')
    .select('*, company:companies(id, name)')
    .order('expiry_date', { ascending: true })

  if (params.company) {
    query = query.eq('company_id', params.company)
  }
  if (params.category) {
    query = query.eq('category', params.category)
  }
  if (params.status) {
    query = query.eq('status', params.status)
  }

  const { data: services } = await query

  const { data: companies } = await supabase
    .from('companies')
    .select('id, name')
    .order('name')

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-slate-500">Dashboard / Services</p>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Services</h1>
        </div>
        <Link
          href="/services/new"
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-brand-600 hover:bg-brand-700 text-white text-sm font-medium rounded-xl shadow-lg shadow-brand-600/25 transition-all"
        >
          <Plus className="w-4 h-4" />
          Add Service
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4">
        <form className="flex flex-wrap gap-3">
          <select
            name="company"
            defaultValue={params.company}
            className="px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
          >
            <option value="">All Companies</option>
            {(companies || []).map((c: any) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
          <select
            name="category"
            defaultValue={params.category}
            className="px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
          >
            <option value="">All Categories</option>
            {['Software License','Domain','SSL Certificate','Insurance','Contract','Subscription','Permit','Other'].map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
          <select
            name="status"
            defaultValue={params.status}
            className="px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
          >
            <option value="">All Statuses</option>
            <option value="active">Active</option>
            <option value="expired">Expired</option>
            <option value="renewed">Renewed</option>
          </select>
          <button type="submit" className="px-4 py-2.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-sm font-medium rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
            <Filter className="w-4 h-4" />
          </button>
          <div className="flex-1" />
          <ExportCSVButton services={services || []} />
        </form>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden">
        {(!services || services.length === 0) ? (
          <div className="p-12 text-center">
            <ServerCog className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-sm font-medium text-slate-900 dark:text-white mb-1">No services found</h3>
            <p className="text-sm text-slate-500">Add your first service to start tracking expiry dates.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800">
                  <th className="text-left text-xs font-semibold text-slate-500 uppercase px-5 py-3">Service</th>
                  <th className="text-left text-xs font-semibold text-slate-500 uppercase px-5 py-3">Company</th>
                  <th className="text-left text-xs font-semibold text-slate-500 uppercase px-5 py-3">Category</th>
                  <th className="text-left text-xs font-semibold text-slate-500 uppercase px-5 py-3">Expiry Date</th>
                  <th className="text-center text-xs font-semibold text-slate-500 uppercase px-5 py-3">Days Left</th>
                  <th className="text-center text-xs font-semibold text-slate-500 uppercase px-5 py-3">Status</th>
                  <th className="text-center text-xs font-semibold text-slate-500 uppercase px-5 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {services.map((service: any) => {
                  const days = daysUntilExpiry(service.expiry_date)
                  return (
                    <tr key={service.id} className="border-b border-slate-50 dark:border-slate-800/50 table-row-hover">
                      <td className="px-5 py-3.5 text-sm font-medium text-slate-900 dark:text-white">{service.name}</td>
                      <td className="px-5 py-3.5 text-sm text-slate-600 dark:text-slate-300">
                        <Link href={`/companies/${service.company?.id}`} className="hover:text-brand-600 transition-colors">
                          {service.company?.name || 'N/A'}
                        </Link>
                      </td>
                      <td className="px-5 py-3.5 text-sm text-slate-500">{service.category || '—'}</td>
                      <td className="px-5 py-3.5 text-sm text-slate-600 dark:text-slate-300">{formatDate(service.expiry_date)}</td>
                      <td className="px-5 py-3.5 text-center">
                        <span className={cn('inline-flex px-2.5 py-1 rounded-full text-xs font-bold', getDaysBadgeColor(days))}>
                          {days <= 0 ? `${Math.abs(days)}d ago` : `${days}d`}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-center">
                        <span className={cn(
                          'inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium border',
                          service.status === 'active' ? 'bg-emerald-100 text-emerald-700 border-emerald-200' :
                          service.status === 'renewed' ? 'bg-blue-100 text-blue-700 border-blue-200' :
                          'bg-red-100 text-red-700 border-red-200'
                        )}>
                          {service.status}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <Link href={`/services/${service.id}/edit`} className="px-2.5 py-1 text-xs font-medium text-brand-600 hover:bg-brand-50 rounded-lg transition-colors">Edit</Link>
                          <DeleteServiceButton serviceId={service.id} serviceName={service.name} />
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
