import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: string | Date): string {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

export function daysUntilExpiry(expiryDate: string | Date): number {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const expiry = new Date(expiryDate)
  expiry.setHours(0, 0, 0, 0)
  const diff = expiry.getTime() - today.getTime()
  return Math.ceil(diff / (1000 * 60 * 60 * 24))
}

export function getExpiryStatus(daysLeft: number): 'expired' | 'critical' | 'warning' | 'safe' {
  if (daysLeft <= 0) return 'expired'
  if (daysLeft <= 7) return 'critical'
  if (daysLeft <= 30) return 'warning'
  return 'safe'
}

export function getStatusColor(status: string): string {
  switch (status) {
    case 'expired': return 'bg-red-100 text-red-700 border-red-200'
    case 'critical': return 'bg-red-100 text-red-700 border-red-200'
    case 'warning': return 'bg-amber-100 text-amber-700 border-amber-200'
    case 'safe': return 'bg-emerald-100 text-emerald-700 border-emerald-200'
    case 'active': return 'bg-emerald-100 text-emerald-700 border-emerald-200'
    case 'renewed': return 'bg-blue-100 text-blue-700 border-blue-200'
    default: return 'bg-gray-100 text-gray-700 border-gray-200'
  }
}

export function getDaysBadgeColor(daysLeft: number): string {
  if (daysLeft <= 0) return 'bg-red-500 text-white'
  if (daysLeft <= 7) return 'bg-red-500 text-white'
  if (daysLeft <= 14) return 'bg-amber-500 text-white'
  if (daysLeft <= 30) return 'bg-yellow-500 text-white'
  return 'bg-emerald-500 text-white'
}
