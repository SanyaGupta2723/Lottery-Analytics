'use client'

import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { Button } from './ui/button'
import { BarChart3, LogOut } from 'lucide-react'

export default function DashboardNav() {
  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    window.location.href = '/'
  }

  return (
    <nav className="bg-card border-b border-border px-6 py-4 flex items-center justify-between">
      <Link href="/dashboard" className="flex items-center gap-2">
        <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
          <BarChart3 size={24} className="text-primary-foreground" />
        </div>
        <span className="text-xl font-bold text-foreground">LottoAnalytics</span>
      </Link>

      <div className="flex items-center gap-4">
        <Link href="/dashboard">
          <Button variant="ghost">Dashboard</Button>
        </Link>
        <Button
          onClick={handleLogout}
          variant="outline"
          size="sm"
          className="flex items-center gap-2"
        >
          <LogOut size={16} />
          Sign Out
        </Button>
      </div>
    </nav>
  )
}
