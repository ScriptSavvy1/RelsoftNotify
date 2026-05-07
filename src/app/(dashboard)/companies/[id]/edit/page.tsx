import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { EditCompanyForm } from './edit-form'

export const dynamic = 'force-dynamic'

export default async function EditCompanyPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  const { data: company } = await supabase
    .from('companies')
    .select('*')
    .eq('id', id)
    .single()

  if (!company) notFound()

  return <EditCompanyForm company={company} />
}
