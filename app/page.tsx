"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAppSelector } from "@/lib/hooks"
import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowRight, DollarSign, TrendingUp, PieChart } from "lucide-react"

export default function HomePage() {
  const router = useRouter()
  const { isAuthenticated } = useAppSelector((state) => state.auth)

  useEffect(() => {
    if (isAuthenticated) {
      router.push("/dashboard")
    }
  }, [isAuthenticated, router])

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">Personal Finance Tracker</h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Take control of your finances with our easy-to-use income and expense tracking system
          </p>
          <Button size="lg" onClick={() => router.push("/login")} className="text-lg px-8 py-3">
            Get Started
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <Card>
            <CardHeader>
              <DollarSign className="h-12 w-12 text-primary mb-4" />
              <CardTitle>Track Income & Expenses</CardTitle>
              <CardDescription>
                Easily log your income and expenses to get a clear picture of your financial health
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <TrendingUp className="h-12 w-12 text-primary mb-4" />
              <CardTitle>Real-time Balance</CardTitle>
              <CardDescription>
                See your current balance calculated automatically from your income and expenses
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <PieChart className="h-12 w-12 text-primary mb-4" />
              <CardTitle>Smart Filtering</CardTitle>
              <CardDescription>
                Filter and categorize your transactions to better understand your spending patterns
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </div>
    </div>
  )
}
