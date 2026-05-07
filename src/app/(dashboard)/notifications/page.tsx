import { createClient } from '@/lib/supabase/server'
import { formatDate, cn } from '@/lib/utils'
import { Bell, CheckCircle2, XCircle, RefreshCw, Search } from 'lucide-react'
import { ResendButton } from './resend-button'

export const dynamic = 'force-dynamic'

export default async function NotificationsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; company?: string }>
}) {
  const params = await searchParams
  const supabase = await createClient()

  let query = supabase
    .from('notification_logs')
    .select('*, service:services(name, company_id, company:companies(name)), contact:contacts(name, email)')
    .order('sent_at', { ascending: false })
    .limit(100)

  if (params.status) {
    query = query.eq('status', params.status)
  }

  const { data: logs } = await query

  const sentCount = (logs || []).filter((l: any) => l.status === 'sent').length
  const failedCount = (logs || []).filter((l: any) => l.status === 'failed').length

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Notifications</h1>
        <p className="text-sm text-slate-500 mt-1">View all notification events and message history.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 flex items-center gap-3">
          <div className="p-2.5 bg-blue-50 dark:bg-blue-950/30 rounded-xl">
            <Bell className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <p className="text-2xl font-bold text-slate-900 dark:text-white">{(logs || []).length}</p>
            <p className="text-xs text-slate-500">Total Notifications</p>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 flex items-center gap-3">
          <div className="p-2.5 bg-emerald-50 dark:bg-emerald-950/30 rounded-xl">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
          </div>
          <div>
            <p className="text-2xl font-bold text-slate-900 dark:text-white">{sentCount}</p>
            <p className="text-xs text-slate-500">Successfully Sent</p>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 flex items-center gap-3">
          <div className="p-2.5 bg-red-50 dark:bg-red-950/30 rounded-xl">
            <XCircle className="w-5 h-5 text-red-600" />
          </div>
          <div>
            <p className="text-2xl font-bold text-slate-900 dark:text-white">{failedCount}</p>
            <p className="text-xs text-slate-500">Failed</p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4">
        <form className="flex gap-3">
          <select
            name="status"
            defaultValue={params.status}
            className="px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
          >
            <option value="">All Statuses</option>
            <option value="sent">Sent</option>
            <option value="failed">Failed</option>
          </select>
          <button type="submit" className="px-4 py-2.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-sm font-medium rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
            Filter
          </button>
        </form>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden">
        {(!logs || logs.length === 0) ? (
          <div className="p-12 text-center">
            <Bell className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-sm font-medium text-slate-900 dark:text-white mb-1">No notifications yet</h3>
            <p className="text-sm text-slate-500">Notifications will appear here when alerts are sent.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800">
                  <th className="text-left text-xs font-semibold text-slate-500 uppercase px-5 py-3">Date Sent</th>
                  <th className="text-left text-xs font-semibold text-slate-500 uppercase px-5 py-3">Company</th>
                  <th className="text-left text-xs font-semibold text-slate-500 uppercase px-5 py-3">Service</th>
                  <th className="text-left text-xs font-semibold text-slate-500 uppercase px-5 py-3">Contact</th>
                  <th className="text-center text-xs font-semibold text-slate-500 uppercase px-5 py-3">Channel</th>
                  <th className="text-center text-xs font-semibold text-slate-500 uppercase px-5 py-3">Days Before</th>
                  <th className="text-center text-xs font-semibold text-slate-500 uppercase px-5 py-3">Status</th>
                  <th className="text-center text-xs font-semibold text-slate-500 uppercase px-5 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {logs.map((log: any) => (
                  <tr key={log.id} className="border-b border-slate-50 dark:border-slate-800/50 table-row-hover">
                    <td className="px-5 py-3 text-sm text-slate-600 dark:text-slate-300">{formatDate(log.sent_at)}</td>
                    <td className="px-5 py-3 text-sm text-slate-900 dark:text-white font-medium">{log.service?.company?.name || '—'}</td>
                    <td className="px-5 py-3 text-sm text-slate-600 dark:text-slate-300">{log.service?.name || '—'}</td>
                    <td className="px-5 py-3 text-sm text-slate-600 dark:text-slate-300">{log.contact?.name || '—'}</td>
                    <td className="px-5 py-3 text-center">
                      <span className="inline-flex items-center px-2 py-0.5 bg-blue-50 text-blue-700 text-xs rounded-full font-medium">
                        {log.channel || 'Email'}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-center text-sm text-slate-600 dark:text-slate-300">{log.days_before || '—'}d</td>
                    <td className="px-5 py-3 text-center">
                      <span className={cn(
                        'inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium',
                        log.status === 'sent'
                          ? 'bg-emerald-100 text-emerald-700'
                          : 'bg-red-100 text-red-700'
                      )}>
                        {log.status === 'sent' ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                        {log.status}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-center">
                      {log.status === 'failed' && (
                        <ResendButton logId={log.id} serviceId={log.service_id} />
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
