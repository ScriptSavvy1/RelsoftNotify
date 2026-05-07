import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { sendExpiryNotification } from '@/lib/email/resend'
import { formatDate } from '@/lib/utils'

export async function POST(request: Request) {
  const supabase = await createClient()

  // Verify user is authenticated
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json()

  // Test email mode
  if (body.test) {
    try {
      await sendExpiryNotification({
        to: 'abdirahman.relsoft@gmail.com',
        contactName: 'Test User',
        companyName: 'Test Company',
        serviceName: 'Test Service',
        serviceCategory: 'Software License',
        expiryDate: formatDate(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)),
        daysLeft: 7,
      })
      return NextResponse.json({ message: 'Test email sent successfully!' })
    } catch (err: any) {
      return NextResponse.json({ error: err.message || 'Failed to send test email' }, { status: 500 })
    }
  }

  const { serviceId } = body
  if (!serviceId) {
    return NextResponse.json({ error: 'serviceId is required' }, { status: 400 })
  }

  // Get service with company
  const { data: service } = await supabase
    .from('services')
    .select('*, company:companies(name)')
    .eq('id', serviceId)
    .single()

  if (!service) {
    return NextResponse.json({ error: 'Service not found' }, { status: 404 })
  }

  const { data: contacts } = await supabase
    .from('contacts')
    .select('*')
    .eq('company_id', service.company_id)

  if (!contacts || contacts.length === 0) {
    return NextResponse.json({ error: 'No contacts found for this company' }, { status: 400 })
  }

  const today = new Date()
  const expiryDate = new Date(service.expiry_date)
  const daysUntil = Math.ceil((expiryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))

  let sentCount = 0
  let failedCount = 0

  for (const contact of contacts) {
    try {
      await sendExpiryNotification({
        to: contact.email,
        contactName: contact.name,
        companyName: (service as any).company?.name || 'Unknown',
        serviceName: service.name,
        serviceCategory: service.category || '',
        expiryDate: formatDate(service.expiry_date),
        daysLeft: daysUntil,
      })

      await supabase.from('notification_logs').insert({
        service_id: serviceId,
        contact_id: contact.id,
        days_before: daysUntil,
        channel: 'email',
        status: 'sent',
      })
      sentCount++
    } catch (err: any) {
      await supabase.from('notification_logs').insert({
        service_id: serviceId,
        contact_id: contact.id,
        days_before: daysUntil,
        channel: 'email',
        status: 'failed',
        error_message: err.message,
      })
      failedCount++
    }
  }

  return NextResponse.json({
    message: `Alert sent to ${sentCount} contact${sentCount !== 1 ? 's' : ''}`,
    sent: sentCount,
    failed: failedCount,
  })
}
