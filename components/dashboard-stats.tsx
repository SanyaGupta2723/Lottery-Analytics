'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import StatCard from '@/components/stat-card'
import { Calendar, Hash, BarChart3 } from 'lucide-react'

interface DashboardStatsProps {
  lotteryId: string
}

export default function DashboardStats({ lotteryId }: DashboardStatsProps) {
  const [stats, setStats] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true)
        
        // Fetch total draws
        const { count: drawCount } = await supabase
          .from('draws')
          .select('*', { count: 'exact', head: true })
          .eq('lottery_id', lotteryId)

        // Fetch most common number
        const { data: topNumbers } = await supabase
          .from('number_frequencies')
          .select('number, frequency')
          .eq('lottery_id', lotteryId)
          .order('frequency', { ascending: false })
          .limit(1)

        // Fetch last draw date
        const { data: lastDraws } = await supabase
          .from('draws')
          .select('draw_date')
          .eq('lottery_id', lotteryId)
          .order('draw_date', { ascending: false })
          .limit(1)

        const mostCommonNumber = topNumbers?.[0]?.number || '-'
        const lastDrawDate = lastDraws?.[0]?.draw_date
          ? new Date(lastDraws[0].draw_date).toLocaleDateString()
          : 'N/A'

        setStats({
          totalDraws: drawCount || 0,
          mostCommonNumber,
          lastDrawDate,
        })
      } catch (error) {
        console.error('Error fetching stats:', error)
      } finally {
        setLoading(false)
      }
    }

    if (lotteryId) {
      fetchStats()
    }
  }, [lotteryId, supabase])

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 animate-pulse">
        <div className="h-24 bg-card rounded-lg" />
        <div className="h-24 bg-card rounded-lg" />
        <div className="h-24 bg-card rounded-lg" />
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <StatCard
        title="Total Draws"
        value={stats?.totalDraws || 0}
        description="Historical draws analyzed"
        icon={<BarChart3 size={20} />}
      />
      <StatCard
        title="Most Common Number"
        value={`#${stats?.mostCommonNumber}`}
        description="Most frequently drawn"
        icon={<Hash size={20} />}
      />
      <StatCard
        title="Last Draw Date"
        value={stats?.lastDrawDate || 'N/A'}
        description="Most recent draw"
        icon={<Calendar size={20} />}
      />
    </div>
  )
}
