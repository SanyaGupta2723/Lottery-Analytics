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

  useEffect(() => {
    const fetchStats = async () => {
      const supabase = createClient()

      try {
        setLoading(true)

        const { data: results, error } = await supabase
          .from('results')
          .select('*')
          .eq('lottery_id', lotteryId)

        if (error) throw error

        const totalDraws = results?.length || 0

        const frequencyMap: Record<number, number> = {}

        results?.forEach((row) => {
          row.winning_numbers.forEach((num: number) => {
            frequencyMap[num] = (frequencyMap[num] || 0) + 1
          })
        })

        let mostCommonNumber = '-'
        let maxFrequency = 0

        Object.entries(frequencyMap).forEach(([num, freq]) => {
          if (freq > maxFrequency) {
            maxFrequency = freq
            mostCommonNumber = num
          }
        })

        const sortedResults = [...(results || [])].sort(
          (a, b) =>
            new Date(b.draw_date).getTime() -
            new Date(a.draw_date).getTime()
        )

        const lastDrawDate =
          sortedResults[0]?.draw_date
            ? new Date(sortedResults[0].draw_date).toLocaleDateString()
            : 'N/A'

        setStats({
          totalDraws,
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
  }, [lotteryId])

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