'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { Skeleton } from './ui/skeleton'

interface FrequencyChartProps {
  lotteryId: string
}

interface FrequencyData {
  number: number
  frequency: number
}

export default function FrequencyChart({ lotteryId }: FrequencyChartProps) {
  const [data, setData] = useState<FrequencyData[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
const fetchFrequencies = async () => {
  try {
    const { data: results, error } = await supabase
      .from('results')
      .select('winning_numbers')
      .eq('lottery_id', lotteryId)

    if (error) throw error

    const frequencyMap: Record<number, number> = {}

    results?.forEach((row) => {
      row.winning_numbers.forEach((num: number) => {
        frequencyMap[num] = (frequencyMap[num] || 0) + 1
      })
    })

    const chartData = Object.entries(frequencyMap)
      .map(([number, frequency]) => ({
        number: Number(number),
        frequency,
      }))
      .sort((a, b) => b.frequency - a.frequency)
      .slice(0, 20)

    setData(chartData)
  } catch (error) {
    console.error('Error fetching frequencies:', error)
  } finally {
    setLoading(false)
  }
}

    if (lotteryId) {
      fetchFrequencies()
    }
  }, [lotteryId, supabase])

  if (loading) {
    return (
      <div className="space-y-4 p-6 bg-card rounded-lg border border-border">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-80 w-full" />
      </div>
    )
  }

  return (
    <div className="p-6 bg-card rounded-lg border border-border">
      <h2 className="text-2xl font-semibold text-foreground mb-6">
        Top 20 Most Frequent Numbers
      </h2>
      {data.length > 0 ? (
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="number" stroke="hsl(var(--muted-foreground))" />
            <YAxis stroke="hsl(var(--muted-foreground))" />
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
              }}
            />
            <Bar dataKey="frequency" fill="hsl(var(--primary))" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      ) : (
        <div className="flex items-center justify-center h-80 text-muted-foreground">
          No frequency data available
        </div>
      )}
    </div>
  )
}
