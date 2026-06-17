'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import FrequencyChart from '@/components/frequency-chart'
import TrendingNumbers from '@/components/trending-numbers'
import LotterySelector from '@/components/lottery-selector'
import DashboardStats from '@/components/dashboard-stats'
import RecentDraws from '@/components/recent-draws'


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
  <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 p-6">
    
    {/* Hero Section */}
    <div className="relative overflow-hidden rounded-3xl border border-slate-800 bg-slate-900/50 backdrop-blur-xl p-8 mb-6">
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-cyan-500/10" />

      <div className="relative z-10">
        <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-400 via-cyan-400 to-purple-400 bg-clip-text text-transparent">
          Lottery Analytics Dashboard
        </h1>

        <p className="mt-3 text-slate-400 text-lg">
          Real-time lottery insights, trends, statistics and prediction analytics
        </p>
      </div>
    </div>

    {/* Lottery Selector */}
    <div className="rounded-2xl border border-slate-800 bg-slate-900/60 backdrop-blur-xl p-6">
      <LotterySelector
        lotteries={lotteries}
        selectedLottery={selectedLottery}
        onSelectLottery={setSelectedLottery}
        loading={loading}
      />
    </div>

    {selectedLottery && (
      <>
        {/* Stats */}
        <div className="mt-6">
          <DashboardStats lotteryId={selectedLottery} />
        </div>

        {/* Recent Draws */}
        <div className="mt-6 rounded-2xl border border-slate-800 bg-slate-900/60 backdrop-blur-xl p-2">
          <RecentDraws lotteryId={selectedLottery} />
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">

          <div className="lg:col-span-2 rounded-2xl border border-slate-800 bg-slate-900/60 backdrop-blur-xl p-2 hover:border-blue-500 transition-all duration-300">
            <FrequencyChart lotteryId={selectedLottery} />
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 backdrop-blur-xl p-2 hover:border-cyan-500 transition-all duration-300">
            <TrendingNumbers lotteryId={selectedLottery} />
          </div>

        </div>
      </>
    )}
  </div>
)
}
