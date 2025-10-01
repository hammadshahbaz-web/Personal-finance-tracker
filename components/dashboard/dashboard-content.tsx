"use client"

import { useState, useMemo, useCallback } from "react"
import { useAppSelector } from "@/lib/hooks"
import { useGetTransactionsQuery } from "@/lib/features/transactions/transactionsApi"
import { LogoutButton } from "@/components/auth/logout-button"
import { FinancialOverview } from "./financial-overview"
import { TransactionFilters, type FilterType } from "./transaction-filters"
import { TransactionList } from "./transaction-list"
import { TransactionForm } from "./transaction-form"
import { DeleteTransactionDialog } from "./delete-transaction-dialog"
import { EditTransactionDialog } from "./edit-transaction-dialog"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Loader2, AlertCircle, Plus } from "lucide-react"
import type { Transaction } from "@/lib/mock-data"
import { SearchInput } from "./search-bar"

export default function DashboardContent() {
  const { user } = useAppSelector((state) => state.auth)
  const [activeFilter, setActiveFilter] = useState<FilterType>("all")
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null)
  const [deletingTransaction, setDeletingTransaction] = useState<Transaction | null>(null)
  const [searchQuery, setSearchQuery] = useState("")


  const { data: transactionsResponse, isLoading, error } = useGetTransactionsQuery()

  if (!user) {
    return null
  }

  const transactions = transactionsResponse?.data || []
  const incomeCount = transactions.filter((t) => t.type === "income").length
  const expenseCount = transactions.filter((t) => t.type === "expense").length

  const initials = user.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()

  const handleAddTransaction = () => {
    // setEditingTransaction(null)
    setShowAddForm(true)
  }

  const handleEditTransaction = (transaction: Transaction) => {
    setEditingTransaction(transaction)
  }

  const handleDeleteTransaction = (transactionId: string) => {
    const transaction = transactions.find((t) => t.id === transactionId)
    if (transaction) {
      setDeletingTransaction(transaction)
    }
  }

  
  const handleSearch = useCallback((value: string) => {
    setSearchQuery(value)
  }, [])


// Filtered + searched transactions (memoized)
  const filteredTransactions = useMemo(() => {
    return transactions
      .filter((t) => {
        if (activeFilter === "all") return true
        return t.type === activeFilter
      })
      .filter((t) =>
        t.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
  }, [transactions, activeFilter, searchQuery])

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h1 className="text-2xl font-bold text-foreground">Personal Finance Tracker</h1>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user.picture || undefined} alt={user.name} />
                  <AvatarFallback>{initials}</AvatarFallback>
                </Avatar>
                <span className="text-sm font-medium text-foreground">{user.name}</span>
              </div>
              <LogoutButton />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="space-y-6">
          {/* Welcome Section */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Welcome back, {user.name.split(" ")[0]}!</CardTitle>
                  <CardDescription>Here's your financial dashboard overview</CardDescription>
                </div>
                <Button onClick={handleAddTransaction} className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  Add Transaction
                </Button>
              </div>
            </CardHeader>
          </Card>

          {/* Loading State */}
          {isLoading && (
            <Card>
              <CardContent className="flex items-center justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary mr-2" />
                <span>Loading your financial data...</span>
              </CardContent>
            </Card>
          )}

          {/* Error State */}
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>Failed to load transactions. Please try refreshing the page.</AlertDescription>
            </Alert>
          )}

          {/* Transaction Form */}
          {showAddForm && (
            <TransactionForm
              // editingTransaction={editingTransaction}
              onSuccess={() => setShowAddForm(false)}   // close add form after success
              onCancel={() => setShowAddForm(false)}   // cancel add form
            />
          )}

          {/* Financial Overview */}
          {!isLoading && !error && (
            <>
              <FinancialOverview transactions={transactions} />

              {/* Transaction Filters */}
              <TransactionFilters
                activeFilter={activeFilter}
                onFilterChange={setActiveFilter}
                incomeCount={incomeCount}
                expenseCount={expenseCount}
                totalCount={transactions.length}
              />

              {/* Search Bar */}
               <SearchInput
                className="mb-4"
                placeholder="Search transactions..."
                onSearch={handleSearch}
              />
              
              {/* Transaction List */}
              <TransactionList 
                transactions={filteredTransactions}
                activeFilter={activeFilter}
                onEdit={handleEditTransaction}
                onDelete={handleDeleteTransaction}
              />
            </>
          )}
        </div>
      </main>

      {/* Delete Confirmation Dialog */}
      <DeleteTransactionDialog
        transaction={deletingTransaction}
        open={!!deletingTransaction}
        onOpenChange={(open) => !open && setDeletingTransaction(null)}
      />
      <EditTransactionDialog
        transaction={editingTransaction}
        open={!!editingTransaction}
        onOpenChange={(open) => !open && setEditingTransaction(null)}
      />

    </div>
  )
}