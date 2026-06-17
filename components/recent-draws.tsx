'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

interface Props {
  lotteryId: string
}

export default function RecentDraws({ lotteryId }: Props) {
  const [draws, setDraws] = useState<any[]>([])

  useEffect(() => {
    const fetchDraws = async () => {
      const supabase = createClient()

      const { data } = await supabase
        .from('results')
        .select('*')
        .eq('lottery_id', lotteryId)
        .order('draw_date', { ascending: false })
        .limit(10)

      setDraws(data || [])
    }

    if (lotteryId) {
      fetchDraws()
    }
  }, [lotteryId])

  return (
    <div className="p-6 rounded-xl border">
      <h2 className="text-2xl font-bold mb-4">
        Recent Draws
      </h2>

      <div className="space-y-3">
        {draws.map((draw) => (
          <div
            key={draw.id}
            className="flex justify-between items-center p-3 border rounded-lg"
          >
            <div>
              {new Date(draw.draw_date).toLocaleDateString()}
            </div>

            <div className="flex gap-2">
              {draw.winning_numbers.map((num: number) => (
                <span
                  key={num}
                  className="w-8 h-8 rounded-full border flex items-center justify-center"
                >
                  {num}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}