import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { EditServiceForm } from './edit-form'

export const dynamic = 'force-dynamic'

export default async function EditServicePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  const { data: service } = await supabase
    .from('services')
    .select('*, company:companies(id, name)')
    .eq('id', id)
    .single()

  if (!service) notFound()

  const { data: companies } = await supabase
    .from('companies')
    .select('id, name')
    .order('name')

  return <EditServiceForm service={service} companies={companies || []} />
}
