'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { Save, SendHorizonal } from 'lucide-react'

export function SettingsForm({ settings }: { settings: Record<string, string> }) {
  const [saving, setSaving] = useState(false)
  const [testing, setTesting] = useState(false)

  async function handleSave(formData: FormData) {
    setSaving(true)
    try {
      const res = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          notification_days: formData.get('notification_days'),
          admin_email: formData.get('admin_email'),
        }),
      })
      if (res.ok) toast.success('Settings saved')
      else toast.error('Failed to save')
    } catch { toast.error('Failed to save') }
    setSaving(false)
  }

  async function handleTestEmail() {
    setTesting(true)
    try {
      const res = await fetch('/api/notifications/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ test: true }),
      })
      const data = await res.json()
      if (res.ok) toast.success(data.message || 'Test email sent!')
      else toast.error(data.error || 'Failed to send test email')
    } catch { toast.error('Failed to send test email') }
    setTesting(false)
  }

  return (
    <div className="space-y-6">
      {/* Global Notification Settings */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-1">Global Notification Settings</h2>
        <p className="text-sm text-slate-500 mb-5">Configure system-wide parameters for all outgoing communications.</p>

        <form action={handleSave} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
              Default Notification Days
            </label>
            <input
              name="notification_days"
              defaultValue={settings.notification_days || '30,14,7,1'}
              placeholder="30,14,7,1"
              className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
            <p className="text-xs text-slate-500 mt-1">Comma-separated days before expiry</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
              Admin Email Address
            </label>
            <input
              name="admin_email"
              type="email"
              defaultValue={settings.admin_email || ''}
              placeholder="admin@relsoft.com"
              className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
              Resend From Email
            </label>
            <input
              disabled
              value={'onboarding@resend.dev (free tier)'}
              className="w-full px-4 py-2.5 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-500 cursor-not-allowed"
            />
            <p className="text-xs text-slate-500 mt-1">Managed via environment variables</p>
          </div>

          <div className="flex gap-3 justify-between pt-2">
            <button
              type="button"
              onClick={handleTestEmail}
              disabled={testing}
              className="inline-flex items-center gap-2 px-4 py-2.5 border border-slate-200 dark:border-slate-700 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl transition-colors disabled:opacity-50"
            >
              <SendHorizonal className="w-4 h-4" />
              {testing ? 'Sending...' : 'Send Test Email'}
            </button>
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-brand-600 hover:bg-brand-700 text-white text-sm font-medium rounded-xl shadow-lg shadow-brand-600/25 transition-all disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              {saving ? 'Saving...' : 'Save Settings'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
