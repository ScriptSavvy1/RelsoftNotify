'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function createService(formData: FormData) {
  const supabase = await createClient()

  const notifyDaysRaw = formData.getAll('notify_days')
  const notifyDays = notifyDaysRaw.map(d => parseInt(d as string)).filter(n => !isNaN(n))

  const data = {
    company_id: formData.get('company_id') as string,
    name: formData.get('name') as string,
    description: formData.get('description') as string || null,
    category: formData.get('category') as string || null,
    expiry_date: formData.get('expiry_date') as string,
    notify_days: notifyDays.length > 0 ? notifyDays : [30, 14, 7, 1],
    notes: formData.get('notes') as string || null,
    status: 'active',
  }

  if (!data.name || !data.expiry_date || !data.company_id) {
    return { error: 'Service name, company, and expiry date are required' }
  }

  const { error } = await supabase.from('services').insert(data)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/services')
  revalidatePath('/dashboard')
  revalidatePath(`/companies/${data.company_id}`)
  redirect('/services')
}

export async function updateService(id: string, formData: FormData) {
  const supabase = await createClient()

  const notifyDaysRaw = formData.getAll('notify_days')
  const notifyDays = notifyDaysRaw.map(d => parseInt(d as string)).filter(n => !isNaN(n))

  const data = {
    name: formData.get('name') as string,
    description: formData.get('description') as string || null,
    category: formData.get('category') as string || null,
    expiry_date: formData.get('expiry_date') as string,
    status: formData.get('status') as string || 'active',
    notify_days: notifyDays.length > 0 ? notifyDays : [30, 14, 7, 1],
    notes: formData.get('notes') as string || null,
  }

  if (!data.name || !data.expiry_date) {
    return { error: 'Service name and expiry date are required' }
  }

  const { error } = await supabase
    .from('services')
    .update(data)
    .eq('id', id)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/services')
  revalidatePath('/dashboard')
  redirect('/services')
}

export async function deleteService(id: string) {
  const supabase = await createClient()

  const { error } = await supabase
    .from('services')
    .delete()
    .eq('id', id)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/services')
  revalidatePath('/dashboard')
  return { success: true }
}
