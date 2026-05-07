import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

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
    // TODO: SendGrid integration
    return NextResponse.json({ message: 'SendGrid not configured yet. Test email would be sent.' })
  }

  const { serviceId } = body
  if (!serviceId) {
    return NextResponse.json({ error: 'serviceId is required' }, { status: 400 })
  }

  // Get service with company and contacts
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
  for (const contact of contacts) {
    try {
      // TODO: SendGrid integration
      console.log(`[MANUAL ALERT] Email to ${contact.email} for ${service.name}`)

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
    }
  }

  return NextResponse.json({ message: `Alert sent to ${sentCount} contacts`, sent: sentCount })
}
