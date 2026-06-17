'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { TrendingUp } from 'lucide-react'
import { Skeleton } from './ui/skeleton'

interface TrendingNumbersProps {
  lotteryId: string
}

interface NumberData {
  number: number
  frequency: number
  last_drawn_date: string | null
}

export default function TrendingNumbers({ lotteryId }: TrendingNumbersProps) {
  const [numbers, setNumbers] = useState<NumberData[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    const fetchTrendingNumbers = async () => {
  try {
    const { data: results, error } = await supabase
      .from('results')
      .select('winning_numbers, draw_date')
      .eq('lottery_id', lotteryId)

    if (error) throw error

    const frequencyMap: Record<number, NumberData> = {}

    results?.forEach((row) => {
      row.winning_numbers.forEach((num: number) => {
        if (!frequencyMap[num]) {
          frequencyMap[num] = {
            number: num,
            frequency: 0,
            last_drawn_date: row.draw_date,
          }
        }

        frequencyMap[num].frequency++

        if (
          new Date(row.draw_date) >
          new Date(frequencyMap[num].last_drawn_date || '')
        ) {
          frequencyMap[num].last_drawn_date = row.draw_date
        }
      })
    })

    const topNumbers = Object.values(frequencyMap)
      .sort((a, b) => b.frequency - a.frequency)
      .slice(0, 10)

    setNumbers(topNumbers)
  } catch (error) {
    console.error('Error fetching trending numbers:', error)
  } finally {
    setLoading(false)
  }
}

    if (lotteryId) {
      fetchTrendingNumbers()
    }
  }, [lotteryId, supabase])

  if (loading) {
    return (
      <div className="space-y-3 p-6 bg-card rounded-lg border border-border">
        <Skeleton className="h-8 w-40" />
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} className="h-12 w-full" />
        ))}
      </div>
    )
  }

  return (
    <div className="p-6 bg-card rounded-lg border border-border">
      <div className="flex items-center gap-2 mb-6">
        <TrendingUp size={24} className="text-primary" />
        <h2 className="text-2xl font-semibold text-foreground">
          Trending Numbers
        </h2>
      </div>

      {numbers.length > 0 ? (
        <div className="space-y-3">
          {numbers.map((item) => (
            <div
              key={item.number}
              className="flex items-center justify-between p-4 rounded-lg bg-secondary hover:bg-secondary/80 transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center">
                  <span className="text-xl font-bold text-primary-foreground">
                    {item.number}
                  </span>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Drawn</p>
                  <p className="text-lg font-semibold text-foreground">
                    {item.frequency} times
                  </p>
                </div>
              </div>
              {item.last_drawn_date && (
                <p className="text-xs text-muted-foreground">
                  Last: {new Date(item.last_drawn_date).toLocaleDateString()}
                </p>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="flex items-center justify-center h-40 text-muted-foreground">
          No data available
        </div>
      )}
    </div>
  )
}
