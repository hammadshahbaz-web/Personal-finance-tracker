"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Trash2, Edit, Calendar, Tag } from "lucide-react"
import type { Transaction } from "@/lib/mock-data"
import type { FilterType } from "./transaction-filters"

interface TransactionListProps {
  transactions: Transaction[]
  activeFilter: FilterType
  onEdit?: (transaction: Transaction) => void
  onDelete?: (transactionId: string) => void
}

export function TransactionList({ transactions, activeFilter, onEdit, onDelete }: TransactionListProps) {
  const filteredTransactions = transactions.filter((transaction) => {
    if (activeFilter === "all") return true
    return transaction.type === activeFilter
  })

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  if (filteredTransactions.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <p>No transactions found for the selected filter.</p>
            <p className="text-sm mt-2">Add your first transaction to get started!</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Transactions</span>
          <Badge variant="outline">{filteredTransactions.length} items</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {filteredTransactions
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
            .map((transaction) => (
              <div
                key={transaction.id}
                className={`p-4 rounded-lg border-l-4 ${
                  transaction.type === "income"
                    ? "border-l-green-500 bg-green-50 /* dark:bg-green-950/20*/"
                    : "border-l-red-500 bg-red-50 dark:bg-red-950/20"
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="font-semibold text-foreground">{transaction.description}</h4>
                      <Badge
                        variant={transaction.type === "income" ? "default" : "destructive"}
                        className={
                          transaction.type === "income"
                            ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
                            : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100"
                        }
                      >
                        {transaction.type}
                      </Badge>
                    </div>

                    <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {formatDate(transaction.date)}
                      </div>
                      <div className="flex items-center gap-1">
                        <Tag className="h-3 w-3" />
                        {transaction.category}
                      </div>
                    </div>

                    <div
                      className={`text-xl font-bold ${
                        transaction.type === "income" ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {transaction.type === "income" ? "+" : "-"}
                      {formatCurrency(transaction.amount)}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 ml-4">
                    {onEdit && (
                      <Button variant="ghost" size="sm" onClick={() => onEdit(transaction)} className="h-8 w-8 p-0">
                        <Edit className="h-4 w-4" />
                      </Button>
                    )}
                    {onDelete && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onDelete(transaction.id)}
                        className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
        </div>
      </CardContent>
    </Card>
  )
}
