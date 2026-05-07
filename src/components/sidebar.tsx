'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import {
  LayoutDashboard,
  Building2,
  ServerCog,
  Bell,
  Settings,
  LogOut,
  ChevronLeft,
} from 'lucide-react'
import { logout } from '@/app/login/actions'
import { useState } from 'react'

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/companies', label: 'Companies', icon: Building2 },
  { href: '/services', label: 'Services', icon: ServerCog },
  { href: '/notifications', label: 'Notifications', icon: Bell },
  { href: '/settings', label: 'Settings', icon: Settings },
]

interface SidebarProps {
  userEmail?: string
}

export function Sidebar({ userEmail }: SidebarProps) {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)

  return (
    <aside
      className={cn(
        'hidden lg:flex flex-col bg-sidebar text-sidebar-text h-screen sticky top-0 transition-all duration-300 ease-in-out',
        collapsed ? 'w-[72px]' : 'w-[260px]'
      )}
    >
      {/* Header */}
      <div className={cn(
        'flex items-center h-16 px-4 border-b border-white/10',
        collapsed ? 'justify-center' : 'gap-3'
      )}>
        <div className="w-9 h-9 bg-brand-600 rounded-lg flex items-center justify-center shrink-0 shadow-lg shadow-brand-600/30">
          <img
            src="/logo.svg"
            alt="RS"
            className="w-6 h-6 object-contain"
            onError={(e) => {
              const target = e.target as HTMLImageElement
              target.style.display = 'none'
              target.parentElement!.innerHTML = '<span class="text-white font-bold text-sm">RS</span>'
            }}
          />
        </div>
        {!collapsed && (
          <div className="animate-fade-in">
            <h1 className="text-white font-bold text-lg leading-tight">Relsoft Notify</h1>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname.startsWith(item.href)
          const Icon = item.icon
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200',
                isActive
                  ? 'bg-brand-600 text-white shadow-lg shadow-brand-600/25'
                  : 'text-sidebar-text hover:bg-sidebar-hover hover:text-white',
                collapsed && 'justify-center px-2'
              )}
              title={collapsed ? item.label : undefined}
            >
              <Icon className="w-5 h-5 shrink-0" />
              {!collapsed && <span>{item.label}</span>}
            </Link>
          )
        })}
      </nav>

      {/* Collapse Toggle */}
      <div className="px-3 pb-2">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="flex items-center justify-center w-full py-2 text-sidebar-text hover:text-white hover:bg-sidebar-hover rounded-xl transition-all"
        >
          <ChevronLeft className={cn('w-4 h-4 transition-transform', collapsed && 'rotate-180')} />
        </button>
      </div>

      {/* User Profile & Logout */}
      <div className={cn(
        'border-t border-white/10 p-4',
        collapsed ? 'flex flex-col items-center gap-2' : ''
      )}>
        {!collapsed && (
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 bg-brand-500/20 rounded-full flex items-center justify-center">
              <span className="text-brand-400 text-sm font-semibold">
                {userEmail?.charAt(0).toUpperCase() || 'A'}
              </span>
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium text-white truncate">
                {userEmail || 'Admin'}
              </p>
              <p className="text-xs text-sidebar-text">Administrator</p>
            </div>
          </div>
        )}
        <form action={logout}>
          <button
            type="submit"
            className={cn(
              'flex items-center gap-2 text-sm text-sidebar-text hover:text-red-400 transition-colors',
              collapsed && 'justify-center'
            )}
          >
            <LogOut className="w-4 h-4" />
            {!collapsed && <span>Logout</span>}
          </button>
        </form>
      </div>
    </aside>
  )
}
