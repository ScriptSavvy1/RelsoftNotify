export interface Company {
  id: string
  name: string
  industry: string | null
  phone: string | null
  address: string | null
  notes: string | null
  created_at: string
  updated_at: string
  services?: Service[]
  contacts?: Contact[]
  service_count?: number
  contact_count?: number
}

export interface Service {
  id: string
  company_id: string
  name: string
  description: string | null
  category: string | null
  expiry_date: string
  status: 'active' | 'expired' | 'renewed'
  notify_days: number[]
  notes: string | null
  created_at: string
  updated_at: string
  company?: Company
}

export interface Contact {
  id: string
  company_id: string
  name: string
  email: string
  phone: string | null
  role: string | null
  is_primary: boolean
  created_at: string
  company?: Company
}

export interface NotificationLog {
  id: string
  service_id: string
  contact_id: string | null
  days_before: number
  channel: string
  status: 'sent' | 'failed'
  sent_at: string
  error_message: string | null
  service?: Service
  contact?: Contact
}

export interface Setting {
  id: string
  key: string
  value: string
  description: string | null
  updated_at: string
}

export interface DashboardStats {
  totalCompanies: number
  activeServices: number
  expiringSoon: number
  expired: number
}

export const INDUSTRIES = [
  'Technology',
  'Finance',
  'Healthcare',
  'Legal',
  'Government',
  'Education',
  'Other',
] as const

export const SERVICE_CATEGORIES = [
  'Software License',
  'Domain',
  'SSL Certificate',
  'Insurance',
  'Contract',
  'Subscription',
  'Permit',
  'Other',
] as const

export const NOTIFICATION_DAYS_OPTIONS = [
  { value: 90, label: '90 Days Out' },
  { value: 60, label: '60 Days Out' },
  { value: 30, label: '30 Days Out' },
  { value: 14, label: '14 Days Out' },
  { value: 7, label: '7 Days Out' },
  { value: 1, label: '1 Day Out' },
] as const
