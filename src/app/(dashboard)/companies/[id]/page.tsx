import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Building2, Plus, Mail, Phone, Star, ServerCog, Users, Pencil, Trash2 } from 'lucide-react'
import { formatDate, daysUntilExpiry, getDaysBadgeColor, cn } from '@/lib/utils'
import { CompanyTabs } from './company-tabs'

export const dynamic = 'force-dynamic'

export default async function CompanyDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  const { data: company } = await supabase
    .from('companies')
    .select('*')
    .eq('id', id)
    .single()

  if (!company) notFound()

  const { data: services } = await supabase
    .from('services')
    .select('*')
    .eq('company_id', id)
    .order('expiry_date', { ascending: true })

  const { data: contacts } = await supabase
    .from('contacts')
    .select('*')
    .eq('company_id', id)
    .order('is_primary', { ascending: false })

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-slate-500">
        <Link href="/companies" className="hover:text-brand-600 transition-colors flex items-center gap-1">
          <ArrowLeft className="w-3.5 h-3.5" />
          Companies
        </Link>
        <span>/</span>
        <span className="text-slate-900 dark:text-white font-medium">{company.name}</span>
      </div>

      {/* Company Header */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-brand-50 dark:bg-brand-950/30 rounded-2xl flex items-center justify-center">
              <Building2 className="w-7 h-7 text-brand-600" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900 dark:text-white">{company.name}</h1>
              <div className="flex items-center gap-3 mt-1 text-sm text-slate-500">
                {company.industry && <span>{company.industry}</span>}
                {company.phone && (
                  <span className="flex items-center gap-1">
                    <Phone className="w-3 h-3" />
                    {company.phone}
                  </span>
                )}
              </div>
            </div>
          </div>
          <Link
            href={`/companies/${id}/edit`}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl transition-colors"
          >
            <Pencil className="w-3.5 h-3.5" />
            Edit
          </Link>
        </div>
      </div>

      {/* Tabs Content */}
      <CompanyTabs
        companyId={id}
        services={services || []}
        contacts={contacts || []}
      />
    </div>
  )
}
