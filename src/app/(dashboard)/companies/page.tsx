import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { Building2, Plus, Search, MoreHorizontal } from 'lucide-react'
import { formatDate, cn } from '@/lib/utils'
import { DeleteCompanyButton } from './delete-button'

export const dynamic = 'force-dynamic'

export default async function CompaniesPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string }>
}) {
  const params = await searchParams
  const supabase = await createClient()

  let query = supabase
    .from('companies')
    .select('*, services:services(count), contacts:contacts(count)')
    .order('created_at', { ascending: false })

  if (params.search) {
    query = query.ilike('name', `%${params.search}%`)
  }

  const { data: companies } = await query

  // Get next expiry for each company
  const companiesWithExpiry = await Promise.all(
    (companies || []).map(async (company: any) => {
      const { data: nextService } = await supabase
        .from('services')
        .select('expiry_date')
        .eq('company_id', company.id)
        .eq('status', 'active')
        .order('expiry_date', { ascending: true })
        .limit(1)
        .single()

      return {
        ...company,
        serviceCount: company.services?.[0]?.count || 0,
        contactCount: company.contacts?.[0]?.count || 0,
        nextExpiry: nextService?.expiry_date || null,
      }
    })
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">Companies</h1>
        <Link
          href="/companies/new"
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-brand-600 hover:bg-brand-700 text-white text-sm font-medium rounded-xl shadow-lg shadow-brand-600/25 transition-all w-full sm:w-auto"
        >
          <Plus className="w-4 h-4" />
          Add Company
        </Link>
      </div>

      {/* Search & Filters */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4">
        <form className="flex gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              name="search"
              defaultValue={params.search}
              placeholder="Search by company name or ID..."
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-sm font-medium rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
          >
            Search
          </button>
        </form>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden">
        {companiesWithExpiry.length === 0 ? (
          <div className="p-12 text-center">
            <Building2 className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
            <h3 className="text-sm font-medium text-slate-900 dark:text-white mb-1">No companies yet</h3>
            <p className="text-sm text-slate-500">Get started by adding your first client company.</p>
            <Link
              href="/companies/new"
              className="inline-flex items-center gap-1.5 mt-4 text-sm text-brand-600 hover:text-brand-700 font-medium"
            >
              <Plus className="w-4 h-4" />
              Add Company
            </Link>
          </div>
        ) : (
          <>
            {/* Mobile Card View */}
            <div className="sm:hidden divide-y divide-slate-100 dark:divide-slate-800">
              {companiesWithExpiry.map((company: any) => (
                <Link key={company.id} href={`/companies/${company.id}`} className="flex items-center justify-between p-4 active:bg-slate-50 dark:active:bg-slate-800">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-brand-50 dark:bg-brand-950/30 rounded-full flex items-center justify-center">
                      <Building2 className="w-4 h-4 text-brand-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-900 dark:text-white">{company.name}</p>
                      <p className="text-xs text-slate-500">{company.industry || 'No industry'} · {company.serviceCount} services</p>
                    </div>
                  </div>
                  <span className={cn(
                    'inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border shrink-0',
                    company.serviceCount > 0 ? 'bg-emerald-100 text-emerald-700 border-emerald-200' : 'bg-slate-100 text-slate-600 border-slate-200'
                  )}>
                    {company.serviceCount > 0 ? 'Active' : 'Empty'}
                  </span>
                </Link>
              ))}
            </div>

            {/* Desktop Table View */}
            <div className="hidden sm:block overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-100 dark:border-slate-800">
                    <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-5 py-3">Company</th>
                    <th className="text-center text-xs font-semibold text-slate-500 uppercase tracking-wider px-5 py-3">Services</th>
                    <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-5 py-3">Next Expiry</th>
                    <th className="text-center text-xs font-semibold text-slate-500 uppercase tracking-wider px-5 py-3">Status</th>
                    <th className="text-center text-xs font-semibold text-slate-500 uppercase tracking-wider px-5 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {companiesWithExpiry.map((company: any) => {
                    const hasExpiredServices = company.nextExpiry && new Date(company.nextExpiry) < new Date()
                    return (
                      <tr key={company.id} className="border-b border-slate-50 dark:border-slate-800/50 table-row-hover">
                        <td className="px-5 py-3.5">
                          <Link href={`/companies/${company.id}`} className="flex items-center gap-3 group">
                            <div className="w-9 h-9 bg-brand-50 dark:bg-brand-950/30 rounded-full flex items-center justify-center">
                              <Building2 className="w-4 h-4 text-brand-600" />
                            </div>
                            <div>
                              <p className="text-sm font-medium text-slate-900 dark:text-white group-hover:text-brand-600 transition-colors">{company.name}</p>
                              {company.industry && <p className="text-xs text-slate-500">{company.industry}</p>}
                            </div>
                          </Link>
                        </td>
                        <td className="px-5 py-3.5 text-center text-sm font-medium text-slate-700 dark:text-slate-300">{company.serviceCount}</td>
                        <td className="px-5 py-3.5">
                          {company.nextExpiry ? (
                            <span className={cn('text-sm', hasExpiredServices ? 'text-red-600 font-medium' : 'text-slate-600 dark:text-slate-300')}>{formatDate(company.nextExpiry)}</span>
                          ) : <span className="text-sm text-slate-400">—</span>}
                        </td>
                        <td className="px-5 py-3.5 text-center">
                          <span className={cn('inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium border', company.serviceCount > 0 ? 'bg-emerald-100 text-emerald-700 border-emerald-200' : 'bg-slate-100 text-slate-600 border-slate-200')}>
                            {company.serviceCount > 0 ? 'Active' : 'No Services'}
                          </span>
                        </td>
                        <td className="px-5 py-3.5 text-center">
                          <div className="flex items-center justify-center gap-1">
                            <Link href={`/companies/${company.id}`} className="px-2.5 py-1 text-xs font-medium text-brand-600 hover:bg-brand-50 rounded-lg transition-colors">View</Link>
                            <Link href={`/companies/${company.id}/edit`} className="px-2.5 py-1 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">Edit</Link>
                            <DeleteCompanyButton companyId={company.id} companyName={company.name} />
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
            <div className="px-4 sm:px-5 py-3 border-t border-slate-100 dark:border-slate-800 text-xs sm:text-sm text-slate-500">
              Showing <span className="font-medium text-slate-700 dark:text-slate-300">{companiesWithExpiry.length}</span> companies
            </div>
          </>
        )}
      </div>
    </div>
  )
}
