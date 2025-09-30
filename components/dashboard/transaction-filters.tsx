"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, TrendingDown, List } from "lucide-react"

export type FilterType = "all" | "income" | "expense"

interface TransactionFiltersProps {
  activeFilter: FilterType
  onFilterChange: (filter: FilterType) => void
  incomeCount: number
  expenseCount: number
  totalCount: number
}

export function TransactionFilters({
  activeFilter,
  onFilterChange,
  incomeCount,
  expenseCount,
  totalCount,
}: TransactionFiltersProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Filter Transactions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2">
          <Button
            variant={activeFilter === "all" ? "default" : "outline"}
            onClick={() => onFilterChange("all")}
            className="flex items-center gap-2"
          >
            <List className="h-4 w-4" />
            All Transactions
            <Badge variant="secondary">{totalCount}</Badge>
          </Button>

          <Button
            variant={activeFilter === "income" ? "default" : "outline"}
            onClick={() => onFilterChange("income")}
            className="flex items-center gap-2"
          >
            <TrendingUp className="h-4 w-4" />
            Income
            <Badge variant="secondary">{incomeCount}</Badge>
          </Button>

          <Button
            variant={activeFilter === "expense" ? "default" : "outline"}
            onClick={() => onFilterChange("expense")}
            className="flex items-center gap-2"
          >
            <TrendingDown className="h-4 w-4" />
            Expenses
            <Badge variant="secondary">{expenseCount}</Badge>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
