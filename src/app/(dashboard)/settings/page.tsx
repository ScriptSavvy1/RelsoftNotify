import { createClient } from '@/lib/supabase/server'
import { SettingsForm } from './settings-form'
import { Bell, Clock, Shield } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function SettingsPage() {
  const supabase = await createClient()

  const { data: settings } = await supabase
    .from('settings')
    .select('*')

  const settingsMap: Record<string, string> = {}
  ;(settings || []).forEach((s: any) => {
    settingsMap[s.key] = s.value
  })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Settings</h1>
        <p className="text-sm text-slate-500 mt-1">Configure system-wide notification defaults and preferences.</p>
      </div>

      {/* Notification Defaults Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 stagger-children">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 text-center card-hover">
          <div className="inline-flex p-2.5 bg-blue-50 dark:bg-blue-950/30 rounded-xl mb-3">
            <Bell className="w-5 h-5 text-blue-600" />
          </div>
          <p className="text-xs text-slate-500 uppercase font-semibold mb-1">Primary Warning</p>
          <p className="text-3xl font-bold text-slate-900 dark:text-white">30</p>
          <p className="text-xs text-slate-500">Days before expiry</p>
        </div>
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 text-center card-hover">
          <div className="inline-flex p-2.5 bg-amber-50 dark:bg-amber-950/30 rounded-xl mb-3">
            <Clock className="w-5 h-5 text-amber-600" />
          </div>
          <p className="text-xs text-slate-500 uppercase font-semibold mb-1">Final Warning</p>
          <p className="text-3xl font-bold text-slate-900 dark:text-white">7</p>
          <p className="text-xs text-slate-500">Days before expiry</p>
        </div>
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 text-center card-hover">
          <div className="inline-flex p-2.5 bg-red-50 dark:bg-red-950/30 rounded-xl mb-3">
            <Shield className="w-5 h-5 text-red-600" />
          </div>
          <p className="text-xs text-slate-500 uppercase font-semibold mb-1">Grace Period</p>
          <p className="text-3xl font-bold text-slate-900 dark:text-white">5</p>
          <p className="text-xs text-slate-500">Days post-expiry</p>
        </div>
      </div>

      {/* Settings Form */}
      <SettingsForm settings={settingsMap} />
    </div>
  )
}
