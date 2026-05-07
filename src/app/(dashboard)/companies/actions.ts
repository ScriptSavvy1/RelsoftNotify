'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function createCompany(formData: FormData) {
  const supabase = await createClient()

  const data = {
    name: formData.get('name') as string,
    industry: formData.get('industry') as string || null,
    phone: formData.get('phone') as string || null,
    address: formData.get('address') as string || null,
    notes: formData.get('notes') as string || null,
  }

  if (!data.name) {
    return { error: 'Company name is required' }
  }

  const { data: company, error } = await supabase
    .from('companies')
    .insert(data)
    .select()
    .single()

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/companies')
  redirect(`/companies/${company.id}`)
}

export async function updateCompany(id: string, formData: FormData) {
  const supabase = await createClient()

  const data = {
    name: formData.get('name') as string,
    industry: formData.get('industry') as string || null,
    phone: formData.get('phone') as string || null,
    address: formData.get('address') as string || null,
    notes: formData.get('notes') as string || null,
  }

  if (!data.name) {
    return { error: 'Company name is required' }
  }

  const { error } = await supabase
    .from('companies')
    .update(data)
    .eq('id', id)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/companies')
  revalidatePath(`/companies/${id}`)
  redirect(`/companies/${id}`)
}

export async function deleteCompany(id: string) {
  const supabase = await createClient()

  const { error } = await supabase
    .from('companies')
    .delete()
    .eq('id', id)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/companies')
  redirect('/companies')
}

// ---- Contact Actions ----

export async function createContact(companyId: string, formData: FormData) {
  const supabase = await createClient()

  const isPrimary = formData.get('is_primary') === 'on'

  // If setting as primary, unset others first
  if (isPrimary) {
    await supabase
      .from('contacts')
      .update({ is_primary: false })
      .eq('company_id', companyId)
  }

  const data = {
    company_id: companyId,
    name: formData.get('name') as string,
    email: formData.get('email') as string,
    phone: formData.get('phone') as string || null,
    role: formData.get('role') as string || null,
    is_primary: isPrimary,
  }

  if (!data.name || !data.email) {
    return { error: 'Name and email are required' }
  }

  const { error } = await supabase.from('contacts').insert(data)

  if (error) {
    return { error: error.message }
  }

  revalidatePath(`/companies/${companyId}`)
  return { success: true }
}

export async function updateContact(contactId: string, companyId: string, formData: FormData) {
  const supabase = await createClient()

  const isPrimary = formData.get('is_primary') === 'on'

  if (isPrimary) {
    await supabase
      .from('contacts')
      .update({ is_primary: false })
      .eq('company_id', companyId)
  }

  const data = {
    name: formData.get('name') as string,
    email: formData.get('email') as string,
    phone: formData.get('phone') as string || null,
    role: formData.get('role') as string || null,
    is_primary: isPrimary,
  }

  const { error } = await supabase
    .from('contacts')
    .update(data)
    .eq('id', contactId)

  if (error) {
    return { error: error.message }
  }

  revalidatePath(`/companies/${companyId}`)
  return { success: true }
}

export async function deleteContact(contactId: string, companyId: string) {
  const supabase = await createClient()

  const { error } = await supabase
    .from('contacts')
    .delete()
    .eq('id', contactId)

  if (error) {
    return { error: error.message }
  }

  revalidatePath(`/companies/${companyId}`)
  return { success: true }
}
