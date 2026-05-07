import { createClient } from '@/lib/supabase/server'
import { Sidebar } from '@/components/sidebar'
import { MobileNav } from '@/components/mobile-nav'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* Desktop Sidebar */}
      <Sidebar userEmail={user?.email} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Mobile Navigation */}
        <MobileNav userEmail={user?.email} />

        {/* Page Content */}
        <main className="flex-1 p-4 lg:p-8 max-w-[1400px] w-full mx-auto">
          {children}
        </main>

        {/* Footer */}
        <footer className="border-t border-slate-200 dark:border-slate-800 py-4 px-4 lg:px-8 text-center text-xs text-slate-400">
          © {new Date().getFullYear()} Relsoft LLC. All rights reserved.
        </footer>
      </div>
    </div>
  )
}
