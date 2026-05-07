import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { sendExpiryNotification } from '@/lib/email/resend'
import { formatDate } from '@/lib/utils'

export async function POST(request: Request) {
  // Verify cron secret
  const cronSecret = request.headers.get('x-cron-secret')
  if (cronSecret !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  // Get all active services with their companies
  const { data: services } = await supabase
    .from('services')
    .select('*, company:companies(name)')
    .eq('status', 'active')

  if (!services || services.length === 0) {
    return NextResponse.json({ message: 'No active services', sent: 0 })
  }

  let sentCount = 0
  let failedCount = 0

  for (const service of services) {
    const expiryDate = new Date(service.expiry_date)
    expiryDate.setHours(0, 0, 0, 0)
    const daysUntil = Math.ceil((expiryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
    const notifyDays: number[] = service.notify_days || [30, 14, 7, 1]

    if (!notifyDays.includes(daysUntil)) continue

    // Check if already sent for this threshold
    const { data: existing } = await supabase
      .from('notification_logs')
      .select('id')
      .eq('service_id', service.id)
      .eq('days_before', daysUntil)
      .eq('status', 'sent')
      .limit(1)

    if (existing && existing.length > 0) continue

    // Get contacts for this company
    const { data: contacts } = await supabase
      .from('contacts')
      .select('*')
      .eq('company_id', service.company_id)

    if (!contacts || contacts.length === 0) continue

    for (const contact of contacts) {
      try {
        await sendExpiryNotification({
          to: contact.email,
          contactName: contact.name,
          companyName: (service as any).company?.name || 'Unknown Company',
          serviceName: service.name,
          serviceCategory: service.category || '',
          expiryDate: formatDate(service.expiry_date),
          daysLeft: daysUntil,
        })

        await supabase.from('notification_logs').insert({
          service_id: service.id,
          contact_id: contact.id,
          days_before: daysUntil,
          channel: 'email',
          status: 'sent',
        })
        sentCount++
      } catch (err: any) {
        console.error(`Failed to send to ${contact.email}:`, err.message)
        await supabase.from('notification_logs').insert({
          service_id: service.id,
          contact_id: contact.id,
          days_before: daysUntil,
          channel: 'email',
          status: 'failed',
          error_message: err.message || 'Unknown error',
        })
        failedCount++
      }
    }
  }

  return NextResponse.json({
    message: 'Notification check complete',
    sent: sentCount,
    failed: failedCount,
  })
}
