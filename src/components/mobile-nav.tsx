'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import {
  Menu,
  X,
  LayoutDashboard,
  Building2,
  ServerCog,
  Bell,
  Settings,
  LogOut,
} from 'lucide-react'
import { logout } from '@/app/login/actions'

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/companies', label: 'Companies', icon: Building2 },
  { href: '/services', label: 'Services', icon: ServerCog },
  { href: '/notifications', label: 'Notifications', icon: Bell },
  { href: '/settings', label: 'Settings', icon: Settings },
]

export function MobileNav({ userEmail }: { userEmail?: string }) {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()

  return (
    <>
      {/* Mobile Header */}
      <header className="lg:hidden flex items-center justify-between h-14 px-4 bg-sidebar border-b border-white/10 sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-brand-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-xs">RS</span>
          </div>
          <span className="text-white font-bold">Relsoft Notify</span>
        </div>
        <button
          onClick={() => setOpen(!open)}
          className="text-white p-1.5 hover:bg-sidebar-hover rounded-lg transition-colors"
        >
          {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </header>

      {/* Mobile Menu Overlay */}
      {open && (
        <div className="lg:hidden fixed inset-0 z-40 bg-black/50" onClick={() => setOpen(false)}>
          <div
            className="absolute left-0 top-14 bottom-0 w-[280px] bg-sidebar animate-slide-in-left flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <nav className="flex-1 px-3 py-4 space-y-1">
              {navItems.map((item) => {
                const isActive = pathname.startsWith(item.href)
                const Icon = item.icon
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className={cn(
                      'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all',
                      isActive
                        ? 'bg-brand-600 text-white'
                        : 'text-sidebar-text hover:bg-sidebar-hover hover:text-white'
                    )}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{item.label}</span>
                  </Link>
                )
              })}
            </nav>

            <div className="border-t border-white/10 p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-9 h-9 bg-brand-500/20 rounded-full flex items-center justify-center">
                  <span className="text-brand-400 text-sm font-semibold">
                    {userEmail?.charAt(0).toUpperCase() || 'A'}
                  </span>
                </div>
                <div>
                  <p className="text-sm font-medium text-white">{userEmail || 'Admin'}</p>
                  <p className="text-xs text-sidebar-text">Administrator</p>
                </div>
              </div>
              <form action={logout}>
                <button
                  type="submit"
                  className="flex items-center gap-2 text-sm text-sidebar-text hover:text-red-400 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
