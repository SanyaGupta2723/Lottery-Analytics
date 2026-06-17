'use client'

import { Button } from './ui/button'
import { Skeleton } from './ui/skeleton'

interface Lottery {
  id: string
  name: string
  country: string
  draw_frequency: string
}

interface LotterySelectorProps {
  lotteries: Lottery[]
  selectedLottery: string | null
  onSelectLottery: (id: string) => void
  loading?: boolean
}

export default function LotterySelector({
  lotteries,
  selectedLottery,
  onSelectLottery,
  loading = false,
}: LotterySelectorProps) {
  if (loading) {
    return (
      <div className="flex flex-wrap gap-3">
        {[...Array(3)].map((_, i) => (
          <Skeleton key={i} className="h-12 w-32" />
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-foreground">Select Lottery</label>
      <div className="flex flex-wrap gap-3">
        {lotteries.map((lottery) => (
          <Button
            key={lottery.id}
            onClick={() => onSelectLottery(lottery.id)}
            variant={selectedLottery === lottery.id ? 'default' : 'outline'}
            className="font-medium"
          >
            {lottery.name}
          </Button>
        ))}
      </div>
      {lotteries.length > 0 && selectedLottery && (
        <p className="text-sm text-muted-foreground mt-4">
          {lotteries.find((l) => l.id === selectedLottery)?.country} •{' '}
          {lotteries.find((l) => l.id === selectedLottery)?.draw_frequency}
        </p>
      )}
    </div>
  )
}
