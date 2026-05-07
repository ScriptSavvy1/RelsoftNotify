import { createClient } from '@/lib/supabase/server'
import { daysUntilExpiry, formatDate, getDaysBadgeColor, getStatusColor, cn } from '@/lib/utils'
import {
  Users,
  ServerCog,
  Clock,
  AlertTriangle,
  Search,
  Filter,
  Download,
  Bell,
  CheckCircle2,
  PlusCircle,
  MoreHorizontal,
  Calendar,
  ArrowRight,
  Building2,
} from 'lucide-react'
import Link from 'next/link'
import { SendAlertButton } from './send-alert-button'

export const dynamic = 'force-dynamic'

async function getDashboardData() {
  const supabase = await createClient()

  // Total companies
  const { count: totalCompanies } = await supabase
    .from('companies')
    .select('*', { count: 'exact', head: true })

  // Total active services
  const { count: activeServices } = await supabase
    .from('services')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'active')

  // Services expiring in 30 days
  const today = new Date().toISOString().split('T')[0]
  const thirtyDaysFromNow = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  const { count: expiringSoon } = await supabase
    .from('services')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'active')
    .gte('expiry_date', today)
    .lte('expiry_date', thirtyDaysFromNow)

  // Expired services
  const { count: expired } = await supabase
    .from('services')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'active')
    .lt('expiry_date', today)

  // Upcoming expirations (next 90 days + recently expired)
  const ninetyDaysFromNow = new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  const { data: upcomingServices } = await supabase
    .from('services')
    .select('*, company:companies(id, name)')
    .eq('status', 'active')
    .gte('expiry_date', thirtyDaysAgo)
    .lte('expiry_date', ninetyDaysFromNow)
    .order('expiry_date', { ascending: true })
    .limit(10)

  // Recent notification logs
  const { data: recentLogs } = await supabase
    .from('notification_logs')
    .select('*, service:services(name, company:companies(name)), contact:contacts(name)')
    .order('sent_at', { ascending: false })
    .limit(5)

  return {
    stats: {
      totalCompanies: totalCompanies || 0,
      activeServices: activeServices || 0,
      expiringSoon: expiringSoon || 0,
      expired: expired || 0,
    },
    upcomingServices: upcomingServices || [],
    recentLogs: recentLogs || [],
  }
}

export default async function DashboardPage() {
  const { stats, upcomingServices, recentLogs } = await getDashboardData()

  const metricCards = [
    {
      title: 'TOTAL CLIENTS',
      value: stats.totalCompanies,
      icon: Users,
      color: 'text-brand-600',
      bgColor: 'bg-brand-50 dark:bg-brand-950/30',
      borderColor: 'border-brand-100 dark:border-brand-900/30',
    },
    {
      title: 'ACTIVE SERVICES',
      value: stats.activeServices,
      icon: ServerCog,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50 dark:bg-emerald-950/30',
      borderColor: 'border-emerald-100 dark:border-emerald-900/30',
    },
    {
      title: 'EXPIRING SOON (30D)',
      value: stats.expiringSoon,
      icon: Clock,
      color: 'text-amber-600',
      bgColor: 'bg-amber-50 dark:bg-amber-950/30',
      borderColor: 'border-amber-100 dark:border-amber-900/30',
    },
    {
      title: 'EXPIRED',
      value: stats.expired,
      icon: AlertTriangle,
      color: 'text-red-600',
      bgColor: 'bg-red-50 dark:bg-red-950/30',
      borderColor: 'border-red-100 dark:border-red-900/30',
    },
  ]

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Dashboard</h1>
        </div>
        <Link
          href="/services/new"
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-brand-600 hover:bg-brand-700 text-white text-sm font-medium rounded-xl shadow-lg shadow-brand-600/25 transition-all"
        >
          <Bell className="w-4 h-4" />
          New Alert
        </Link>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 stagger-children">
        {metricCards.map((card) => {
          const Icon = card.icon
          return (
            <div
              key={card.title}
              className={cn(
                'bg-white dark:bg-slate-900 border rounded-2xl p-5 card-hover',
                card.borderColor
              )}
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-semibold tracking-wider text-slate-500 dark:text-slate-400 uppercase">
                    {card.title}
                  </p>
                  <p className="text-3xl font-bold text-slate-900 dark:text-white mt-2">
                    {card.value}
                  </p>
                </div>
                <div className={cn('p-2.5 rounded-xl', card.bgColor)}>
                  <Icon className={cn('w-5 h-5', card.color)} />
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-[1fr_320px] gap-6">
        {/* Upcoming Expirations Table */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden">
          <div className="p-5 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                  Upcoming Expiries
                </h2>
                <p className="text-sm text-slate-500 mt-0.5">
                  Review services expiring within the next 30 days.
                </p>
              </div>
              <div className="flex gap-2">
                <button className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                  <Filter className="w-3.5 h-3.5" />
                  Filters
                </button>
                <button className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                  <Download className="w-3.5 h-3.5" />
                  Export
                </button>
              </div>
            </div>
          </div>

          {upcomingServices.length === 0 ? (
            <div className="p-12 text-center">
              <ServerCog className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
              <h3 className="text-sm font-medium text-slate-900 dark:text-white mb-1">No upcoming expirations</h3>
              <p className="text-sm text-slate-500">All services are in good standing.</p>
              <Link
                href="/services/new"
                className="inline-flex items-center gap-1.5 mt-4 text-sm text-brand-600 hover:text-brand-700 font-medium"
              >
                <PlusCircle className="w-4 h-4" />
                Add a Service
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-100 dark:border-slate-800">
                    <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-5 py-3">Company</th>
                    <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-5 py-3">Service</th>
                    <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-5 py-3">Expiry Date</th>
                    <th className="text-center text-xs font-semibold text-slate-500 uppercase tracking-wider px-5 py-3">Days Left</th>
                    <th className="text-center text-xs font-semibold text-slate-500 uppercase tracking-wider px-5 py-3">Status</th>
                    <th className="text-center text-xs font-semibold text-slate-500 uppercase tracking-wider px-5 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {upcomingServices.map((service: any) => {
                    const days = daysUntilExpiry(service.expiry_date)
                    const status = days <= 0 ? 'Expired' : days <= 7 ? 'Critical' : days <= 30 ? 'Expiring' : 'Active'
                    return (
                      <tr key={service.id} className="border-b border-slate-50 dark:border-slate-800/50 table-row-hover">
                        <td className="px-5 py-3.5">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center">
                              <Building2 className="w-4 h-4 text-slate-500" />
                            </div>
                            <span className="text-sm font-medium text-slate-900 dark:text-white">
                              {service.company?.name || 'N/A'}
                            </span>
                          </div>
                        </td>
                        <td className="px-5 py-3.5 text-sm text-slate-600 dark:text-slate-300">
                          {service.name}
                        </td>
                        <td className="px-5 py-3.5 text-sm text-slate-600 dark:text-slate-300">
                          {formatDate(service.expiry_date)}
                        </td>
                        <td className="px-5 py-3.5 text-center">
                          <span className={cn(
                            'inline-flex items-center justify-center px-2.5 py-1 rounded-full text-xs font-bold min-w-[40px]',
                            getDaysBadgeColor(days)
                          )}>
                            {days <= 0 ? `${Math.abs(days)}d ago` : `${days}d`}
                          </span>
                        </td>
                        <td className="px-5 py-3.5 text-center">
                          <span className={cn(
                            'inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium border',
                            days <= 0 ? 'bg-red-100 text-red-700 border-red-200' :
                            days <= 7 ? 'bg-red-100 text-red-700 border-red-200' :
                            days <= 30 ? 'bg-amber-100 text-amber-700 border-amber-200' :
                            'bg-emerald-100 text-emerald-700 border-emerald-200'
                          )}>
                            <span className={cn(
                              'w-1.5 h-1.5 rounded-full',
                              days <= 0 ? 'bg-red-500' :
                              days <= 7 ? 'bg-red-500' :
                              days <= 30 ? 'bg-amber-500' :
                              'bg-emerald-500'
                            )} />
                            {status}
                          </span>
                        </td>
                        <td className="px-5 py-3.5 text-center">
                          <SendAlertButton serviceId={service.id} serviceName={service.name} />
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Timeline Panel */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-4">
              <Calendar className="w-4 h-4 text-slate-500" />
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Timeline (14 Days)</h3>
            </div>
            {upcomingServices.length === 0 ? (
              <p className="text-sm text-slate-500">No upcoming events.</p>
            ) : (
              <div className="space-y-4">
                {upcomingServices.slice(0, 5).map((service: any) => {
                  const days = daysUntilExpiry(service.expiry_date)
                  return (
                    <div key={service.id} className="flex gap-3">
                      <div className="flex flex-col items-center">
                        <div className={cn(
                          'w-2.5 h-2.5 rounded-full mt-1.5',
                          days <= 0 ? 'bg-red-500' :
                          days <= 7 ? 'bg-red-500' :
                          days <= 14 ? 'bg-amber-500' :
                          'bg-blue-500'
                        )} />
                        <div className="w-px h-full bg-slate-200 dark:bg-slate-700 mt-1" />
                      </div>
                      <div className="pb-4">
                        <p className="text-xs font-semibold text-slate-500 uppercase">
                          {formatDate(service.expiry_date)}
                        </p>
                        <p className="text-sm font-medium text-slate-900 dark:text-white">
                          {service.company?.name || 'Unknown'}
                        </p>
                        <p className="text-xs text-slate-500">{service.category || service.name}</p>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
            <Link
              href="/services"
              className="flex items-center gap-1 mt-2 text-sm text-brand-600 hover:text-brand-700 font-medium"
            >
              View Full Schedule
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Recent Activity */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-4">Recent Activity</h3>
            {recentLogs.length === 0 ? (
              <p className="text-sm text-slate-500">No recent activity yet.</p>
            ) : (
              <div className="space-y-3">
                {recentLogs.map((log: any) => (
                  <div key={log.id} className="flex items-start gap-3">
                    <div className={cn(
                      'w-7 h-7 rounded-full flex items-center justify-center shrink-0 mt-0.5',
                      log.status === 'sent' ? 'bg-emerald-100 text-emerald-600' : 'bg-red-100 text-red-600'
                    )}>
                      {log.status === 'sent' ? (
                        <CheckCircle2 className="w-3.5 h-3.5" />
                      ) : (
                        <AlertTriangle className="w-3.5 h-3.5" />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm text-slate-700 dark:text-slate-300">
                        {log.status === 'sent' ? 'Notification sent' : 'Notification failed'} for{' '}
                        <span className="font-medium text-slate-900 dark:text-white">
                          {log.service?.name || 'Unknown Service'}
                        </span>
                      </p>
                      <p className="text-xs text-slate-400 mt-0.5">
                        {formatDate(log.sent_at)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
