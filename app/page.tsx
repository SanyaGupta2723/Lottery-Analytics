import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { BarChart3 } from 'lucide-react'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary flex flex-col items-center justify-center px-4">
      <div className="text-center space-y-8 max-w-2xl">
        <div className="flex justify-center">
          <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center">
            <BarChart3 size={32} className="text-primary-foreground" />
          </div>
        </div>

        <div className="space-y-4">
          <h1 className="text-5xl font-bold text-foreground text-balance">
            LottoAnalytics
          </h1>
          <p className="text-xl text-muted-foreground text-balance">
            Professional lottery analytics and number frequency analysis. Discover patterns in historical draws and make data-driven decisions.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/auth/login">
            <Button size="lg" className="w-full sm:w-auto">
              Sign In
            </Button>
          </Link>
          <Link href="/auth/sign-up">
            <Button variant="outline" size="lg" className="w-full sm:w-auto">
              Create Account
            </Button>
          </Link>
        </div>

        <div className="pt-8 border-t border-border">
          <p className="text-sm text-muted-foreground">
            Track lottery drawings • Analyze number frequencies • Identify patterns
          </p>
        </div>
      </div>
    </div>
  )
}
