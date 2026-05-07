'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ServerCog, Users, Plus, Mail, Phone, Star, Trash2 } from 'lucide-react'
import { formatDate, daysUntilExpiry, getDaysBadgeColor, cn } from '@/lib/utils'
import { deleteContact, createContact } from '../actions'
import { toast } from 'sonner'
import type { Service, Contact } from '@/types'

interface CompanyTabsProps {
  companyId: string
  services: Service[]
  contacts: Contact[]
}

export function CompanyTabs({ companyId, services, contacts }: CompanyTabsProps) {
  const [activeTab, setActiveTab] = useState<'services' | 'contacts'>('services')
  const [showAddContact, setShowAddContact] = useState(false)

  return (
    <div>
      {/* Tab Buttons */}
      <div className="flex gap-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-1 mb-4 w-fit">
        <button
          onClick={() => setActiveTab('services')}
          className={cn(
            'flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all',
            activeTab === 'services'
              ? 'bg-brand-600 text-white shadow-lg shadow-brand-600/25'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          )}
        >
          <ServerCog className="w-4 h-4" />
          Services ({services.length})
        </button>
        <button
          onClick={() => setActiveTab('contacts')}
          className={cn(
            'flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all',
            activeTab === 'contacts'
              ? 'bg-brand-600 text-white shadow-lg shadow-brand-600/25'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          )}
        >
          <Users className="w-4 h-4" />
          Contacts ({contacts.length})
        </button>
      </div>

      {/* Services Tab */}
      {activeTab === 'services' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden animate-fade-in">
          <div className="flex items-center justify-between p-5 border-b border-slate-100 dark:border-slate-800">
            <h2 className="text-base font-semibold text-slate-900 dark:text-white">Services</h2>
            <Link
              href={`/services/new?company=${companyId}`}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-brand-600 hover:bg-brand-700 text-white text-sm font-medium rounded-lg transition-all"
            >
              <Plus className="w-3.5 h-3.5" />
              Add Service
            </Link>
          </div>

          {services.length === 0 ? (
            <div className="p-12 text-center">
              <ServerCog className="w-10 h-10 text-slate-300 mx-auto mb-2" />
              <p className="text-sm text-slate-500">No services added yet.</p>
            </div>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800">
                  <th className="text-left text-xs font-semibold text-slate-500 uppercase px-5 py-3">Service</th>
                  <th className="text-left text-xs font-semibold text-slate-500 uppercase px-5 py-3">Category</th>
                  <th className="text-left text-xs font-semibold text-slate-500 uppercase px-5 py-3">Expiry Date</th>
                  <th className="text-center text-xs font-semibold text-slate-500 uppercase px-5 py-3">Days Left</th>
                  <th className="text-center text-xs font-semibold text-slate-500 uppercase px-5 py-3">Status</th>
                  <th className="text-center text-xs font-semibold text-slate-500 uppercase px-5 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {services.map((service) => {
                  const days = daysUntilExpiry(service.expiry_date)
                  return (
                    <tr key={service.id} className="border-b border-slate-50 dark:border-slate-800/50 table-row-hover">
                      <td className="px-5 py-3 text-sm font-medium text-slate-900 dark:text-white">{service.name}</td>
                      <td className="px-5 py-3 text-sm text-slate-500">{service.category || '—'}</td>
                      <td className="px-5 py-3 text-sm text-slate-600 dark:text-slate-300">{formatDate(service.expiry_date)}</td>
                      <td className="px-5 py-3 text-center">
                        <span className={cn('inline-flex px-2.5 py-1 rounded-full text-xs font-bold', getDaysBadgeColor(days))}>
                          {days <= 0 ? `${Math.abs(days)}d ago` : `${days}d`}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-center">
                        <span className={cn(
                          'inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium border',
                          service.status === 'active' ? 'bg-emerald-100 text-emerald-700 border-emerald-200' :
                          service.status === 'renewed' ? 'bg-blue-100 text-blue-700 border-blue-200' :
                          'bg-red-100 text-red-700 border-red-200'
                        )}>
                          {service.status}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-center">
                        <Link href={`/services/${service.id}/edit`} className="text-xs text-brand-600 hover:text-brand-700 font-medium">
                          Edit
                        </Link>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* Contacts Tab */}
      {activeTab === 'contacts' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden animate-fade-in">
          <div className="flex items-center justify-between p-5 border-b border-slate-100 dark:border-slate-800">
            <h2 className="text-base font-semibold text-slate-900 dark:text-white">Contacts</h2>
            <button
              onClick={() => setShowAddContact(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-brand-600 hover:bg-brand-700 text-white text-sm font-medium rounded-lg transition-all"
            >
              <Plus className="w-3.5 h-3.5" />
              Add Contact
            </button>
          </div>

          {contacts.length === 0 ? (
            <div className="p-12 text-center">
              <Users className="w-10 h-10 text-slate-300 mx-auto mb-2" />
              <p className="text-sm text-slate-500">No contacts added yet.</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {contacts.map((contact) => (
                <div key={contact.id} className="flex items-center justify-between px-5 py-4 table-row-hover">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center">
                      <span className="text-sm font-semibold text-slate-500">
                        {contact.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium text-slate-900 dark:text-white">{contact.name}</p>
                        {contact.is_primary && (
                          <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 bg-amber-100 text-amber-700 text-xs font-medium rounded-full">
                            <Star className="w-3 h-3" />
                            Primary
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-3 mt-0.5 text-xs text-slate-500">
                        {contact.role && <span>{contact.role}</span>}
                        <span className="flex items-center gap-1"><Mail className="w-3 h-3" />{contact.email}</span>
                        {contact.phone && <span className="flex items-center gap-1"><Phone className="w-3 h-3" />{contact.phone}</span>}
                      </div>
                    </div>
                  </div>
                  <DeleteContactButton contactId={contact.id} companyId={companyId} contactName={contact.name} />
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Add Contact Modal */}
      {showAddContact && (
        <AddContactModal companyId={companyId} onClose={() => setShowAddContact(false)} />
      )}
    </div>
  )
}

function DeleteContactButton({ contactId, companyId, contactName }: { contactId: string; companyId: string; contactName: string }) {
  const [deleting, setDeleting] = useState(false)

  async function handleDelete() {
    if (!confirm(`Delete contact "${contactName}"?`)) return
    setDeleting(true)
    const result = await deleteContact(contactId, companyId)
    if (result?.error) {
      toast.error(result.error)
    } else {
      toast.success('Contact deleted')
    }
    setDeleting(false)
  }

  return (
    <button onClick={handleDelete} disabled={deleting} className="p-2 text-slate-400 hover:text-red-500 transition-colors">
      <Trash2 className="w-4 h-4" />
    </button>
  )
}

function AddContactModal({ companyId, onClose }: { companyId: string; onClose: () => void }) {
  const [saving, setSaving] = useState(false)

  async function handleSubmit(formData: FormData) {
    setSaving(true)
    const result = await createContact(companyId, formData)
    if (result?.error) {
      toast.error(result.error)
      setSaving(false)
    } else {
      toast.success('Contact added')
      onClose()
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4" onClick={onClose}>
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl max-w-md w-full p-6 animate-fade-in" onClick={(e) => e.stopPropagation()}>
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-1">Add Contact</h3>
        <p className="text-sm text-slate-500 mb-5">Add a new contact person for this company.</p>

        <form action={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Full Name *</label>
            <input name="name" required className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500" placeholder="John Doe" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Email *</label>
            <input name="email" type="email" required className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500" placeholder="john@company.com" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Phone</label>
              <input name="phone" className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Role</label>
              <input name="role" className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500" placeholder="IT Manager" />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <input type="checkbox" id="is_primary" name="is_primary" className="w-4 h-4 rounded border-slate-300 text-brand-600 focus:ring-brand-500" />
            <label htmlFor="is_primary" className="text-sm text-slate-700 dark:text-slate-300">Set as primary contact</label>
          </div>

          <div className="flex gap-3 justify-end pt-2">
            <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 rounded-xl transition-colors">Cancel</button>
            <button type="submit" disabled={saving} className="px-6 py-2 bg-brand-600 hover:bg-brand-700 text-white text-sm font-medium rounded-xl transition-all disabled:opacity-50">
              {saving ? 'Saving...' : 'Add Contact'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
