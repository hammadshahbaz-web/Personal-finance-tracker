"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, Plus, Edit } from "lucide-react"
import { useCreateTransactionMutation, useUpdateTransactionMutation } from "@/lib/features/transactions/transactionsApi"
import type { Transaction } from "@/lib/mock-data"

interface TransactionFormProps {
  editingTransaction?: Transaction | null
  onSuccess?: () => void
  onCancel?: () => void
}

const categories: Record<"income" | "expense", string[]> = {
  income: ["Salary", "Freelance", "Investment", "Business", "Gift", "Other Income"],
  expense: [
    "Housing",
    "Food",
    "Transportation",
    "Utilities",
    "Healthcare",
    "Entertainment",
    "Shopping",
    "Other Expense",
  ],
}

export function TransactionForm({ editingTransaction, onSuccess, onCancel }: TransactionFormProps) {
  const [type, setType] = useState<"income" | "expense">("income")
  const [amount, setAmount] = useState("")
  const [description, setDescription] = useState("")
  const [category, setCategory] = useState("")
  const [date, setDate] = useState("")
  const [errors, setErrors] = useState<Record<string, string>>({})

  const [createTransaction, { isLoading: isCreating }] = useCreateTransactionMutation()
  const [updateTransaction, { isLoading: isUpdating }] = useUpdateTransactionMutation()

  const isLoading = isCreating || isUpdating
  const isEditing = !!editingTransaction

  // Populate form when editing
  useEffect(() => {
    if (editingTransaction) {
      const normalizedType: "income" | "expense" =
        typeof editingTransaction.type === "string" && editingTransaction.type.toLowerCase() === "expense"
          ? "expense"
          : "income"

      setType(normalizedType)
      setAmount(editingTransaction.amount.toString())
      setDescription(editingTransaction.description)
      setCategory(editingTransaction.category)
      setDate(editingTransaction.date)
    }
  }, [editingTransaction])

  // Reset category when type changes
  useEffect(() => {
    setCategory("")
  }, [type])

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!type) newErrors.type = "Transaction type is required"
    if (!amount || Number.parseFloat(amount) <= 0) newErrors.amount = "Amount must be greater than 0"
    if (!description.trim()) newErrors.description = "Description is required"
    if (!category) newErrors.category = "Category is required"
    if (!date) newErrors.date = "Date is required"

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const resetForm = () => {
    setType("income")
    setAmount("")
    setDescription("")
    setCategory("")
    setDate("")
    setErrors({})
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    const transactionData = {
      type,
      amount: Number.parseFloat(amount),
      description: description.trim(),
      category,
      date,
    }

    try {
      if (isEditing && editingTransaction) {
        await updateTransaction({
          id: editingTransaction.id,
          ...transactionData,
        }).unwrap()
      } else {
        await createTransaction(transactionData).unwrap()
      }

      resetForm()
      onSuccess?.()
    } catch (error) {
      console.error("Transaction operation failed:", error)
    }
  }

  const handleCancel = () => {
    resetForm()
    onCancel?.()
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {isEditing ? <Edit className="h-5 w-5" /> : <Plus className="h-5 w-5" />}
          {isEditing ? "Edit Transaction" : "Add New Transaction"}
        </CardTitle>
        <CardDescription>
          {isEditing ? "Update the transaction details below" : "Enter the details for your new transaction"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Transaction Type */}
            <div className="space-y-2">
              <Label htmlFor="type">Type</Label>
              <Select value={type} onValueChange={(value: "income" | "expense") => setType(value)}>
                <SelectTrigger className={errors.type ? "border-destructive" : ""}>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="income">Income</SelectItem>
                  <SelectItem value="expense">Expense</SelectItem>
                </SelectContent>
              </Select>
              {errors.type && <p className="text-sm text-destructive">{errors.type}</p>}
            </div>

            {/* Amount */}
            <div className="space-y-2">
              <Label htmlFor="amount">Amount</Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                min="0"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className={errors.amount ? "border-destructive" : ""}
              />
              {errors.amount && <p className="text-sm text-destructive">{errors.amount}</p>}
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Enter transaction description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className={errors.description ? "border-destructive" : ""}
              rows={3}
            />
            {errors.description && <p className="text-sm text-destructive">{errors.description}</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Category */}
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger className={errors.category ? "border-destructive" : ""}>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {(categories[type] ?? []).map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.category && <p className="text-sm text-destructive">{errors.category}</p>}
            </div>

            {/* Date */}
            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className={errors.date ? "border-destructive" : ""}
              />
              {errors.date && <p className="text-sm text-destructive">{errors.date}</p>}
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex items-center gap-2 pt-4">
            <Button type="submit" disabled={isLoading} className="flex-1">
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {isEditing ? "Updating..." : "Adding..."}
                </>
              ) : (
                <>{isEditing ? "Update Transaction" : "Add Transaction"}</>
              )}
            </Button>
            {isEditing && (
              <Button type="button" variant="outline" onClick={handleCancel} disabled={isLoading}>
                Cancel
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  )
}