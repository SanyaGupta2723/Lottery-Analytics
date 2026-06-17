'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import FrequencyChart from '@/components/frequency-chart'
import TrendingNumbers from '@/components/trending-numbers'
import LotterySelector from '@/components/lottery-selector'
import DashboardStats from '@/components/dashboard-stats'

export default function DashboardPage() {
  const [selectedLottery, setSelectedLottery] = useState<string | null>(null)
  const [lotteries, setLotteries] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    const fetchLotteries = async () => {
      try {
        const { data, error } = await supabase
          .from('lotteries')
          .select('*')
          .order('name')

        if (error) throw error
        setLotteries(data || [])
        if (data && data.length > 0) {
          setSelectedLottery(data[0].id)
        }
      } catch (error) {
        console.error('Error fetching lotteries:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchLotteries()
  }, [])

  return (
    <div className="space-y-6 p-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-foreground">Lottery Analytics</h1>
        <p className="text-muted-foreground">
          Analyze lottery patterns and number frequencies across multiple lotteries
        </p>
      </div>

      <LotterySelector
        lotteries={lotteries}
        selectedLottery={selectedLottery}
        onSelectLottery={setSelectedLottery}
        loading={loading}
      />

      {selectedLottery && (
        <>
          <DashboardStats lotteryId={selectedLottery} />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <FrequencyChart lotteryId={selectedLottery} />
            </div>
            <div>
              <TrendingNumbers lotteryId={selectedLottery} />
            </div>
          </div>
        </>
      )}
    </div>
  )
}
