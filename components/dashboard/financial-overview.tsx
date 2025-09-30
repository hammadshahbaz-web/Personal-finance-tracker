"use client"

import { useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, TrendingDown, DollarSign } from "lucide-react"
import type { Transaction } from "@/lib/mock-data"

interface FinancialOverviewProps {
  transactions: Transaction[]
}

export function FinancialOverview({ transactions }: FinancialOverviewProps) {
  const calculations = useMemo(() => {
    const totalIncome = transactions.filter((t) => t.type === "income").reduce((sum, t) => sum + t.amount, 0)

    const totalExpenses = transactions.filter((t) => t.type === "expense").reduce((sum, t) => sum + t.amount, 0)

    const currentBalance = totalIncome - totalExpenses

    return {
      totalIncome,
      totalExpenses,
      currentBalance,
    }
  }, [transactions])

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount)
  }

  return (
    <div className="grid gap-4 md:grid-cols-3">
      {/* Total Income */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Income</CardTitle>
          <TrendingUp className="h-4 w-4 text-green-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600">{formatCurrency(calculations.totalIncome)}</div>
          <p className="text-xs text-muted-foreground">
            {transactions.filter((t) => t.type === "income").length} transactions
          </p>
        </CardContent>
      </Card>

      {/* Total Expenses */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
          <TrendingDown className="h-4 w-4 text-red-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-red-600">{formatCurrency(calculations.totalExpenses)}</div>
          <p className="text-xs text-muted-foreground">
            {transactions.filter((t) => t.type === "expense").length} transactions
          </p>
        </CardContent>
      </Card>

      {/* Current Balance */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Current Balance</CardTitle>
          <DollarSign className="h-4 w-4 text-primary" />
        </CardHeader>
        <CardContent>
          <div className={`text-2xl font-bold ${calculations.currentBalance >= 0 ? "text-green-600" : "text-red-600"}`}>
            {formatCurrency(calculations.currentBalance)}
          </div>
          <div className="flex items-center gap-2 mt-1">
            <Badge variant={calculations.currentBalance >= 0 ? "default" : "destructive"}>
              {calculations.currentBalance >= 0 ? "Positive" : "Negative"}
            </Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
