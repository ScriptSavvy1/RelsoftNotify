import { createClient } from '@/lib/supabase/server'
import { NewServiceForm } from './new-form'

export const dynamic = 'force-dynamic'

export default async function NewServicePage({
  searchParams,
}: {
  searchParams: Promise<{ company?: string }>
}) {
  const params = await searchParams
  const supabase = await createClient()

  const { data: companies } = await supabase
    .from('companies')
    .select('id, name')
    .order('name')

  return <NewServiceForm companies={companies || []} preselectedCompany={params.company} />
}
