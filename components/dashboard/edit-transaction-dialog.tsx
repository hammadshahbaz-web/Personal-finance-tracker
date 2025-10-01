"use client"

import React, { useState, useEffect, useCallback, useMemo } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Loader2 } from "lucide-react"
import { useUpdateTransactionMutation } from "@/lib/features/transactions/transactionsApi"
import type { Transaction } from "@/lib/mock-data"

interface EditTransactionDialogProps {
  transaction: Transaction | null
  open: boolean
  onOpenChange: (open: boolean) => void
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

function EditTransactionDialogComponent({
  transaction,
  open,
  onOpenChange,
}: EditTransactionDialogProps) {
  const [type, setType] = useState<"income" | "expense">("income")
  const [amount, setAmount] = useState("")
  const [description, setDescription] = useState("")
  const [category, setCategory] = useState("")
  const [date, setDate] = useState("")
  const [picture, setPicture] = useState("")
  const [errors, setErrors] = useState<Record<string, string>>({})

  const [updateTransaction, { isLoading }] = useUpdateTransactionMutation()

  // Memoized categories
  const typeCategories = useMemo(() => categories[type], [type])

  // Populate form when transaction changes
  useEffect(() => {
    if (transaction) {
      setType(transaction.type as "income" | "expense")
      setAmount(String(transaction.amount))
      setDescription(transaction.description)
      setCategory(transaction.category)
      setDate(transaction.date)
      setPicture(transaction.picture ?? "")
      setErrors({})
    }
  }, [transaction])

  // Validation
  const validateForm = useCallback(() => {
    const newErrors: Record<string, string> = {}

    if (!type) newErrors.type = "Transaction type is required"
    if (!amount || Number.parseFloat(amount) <= 0) newErrors.amount = "Amount must be greater than 0"
    if (!description.trim()) newErrors.description = "Description is required"
    if (!category) newErrors.category = "Category is required"
    if (!date) newErrors.date = "Date is required"

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }, [type, amount, description, category, date])

  // Reset form
  const resetForm = useCallback(() => {
    if (transaction) {
      setType(transaction.type as "income" | "expense")
      setAmount(String(transaction.amount))
      setDescription(transaction.description)
      setCategory(transaction.category)
      setDate(transaction.date)
      setPicture(transaction.picture ?? "")
    }
    setErrors({})
  }, [transaction])

  // Submit handler
  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault()
      if (!transaction) return
      if (!validateForm()) return

      try {
        await updateTransaction({
          id: transaction.id,
          type,
          amount: Number.parseFloat(amount),
          description: description.trim(),
          category,
          date,
          picture: picture.trim() || null,
        }).unwrap()

        onOpenChange(false)
      } catch (error) {
        console.error("Update Transaction failed:", error)
      }
    },
    [transaction, type, amount, description, category, date, picture, updateTransaction, validateForm, onOpenChange]
  )

  const handleCancel = useCallback(() => {
    resetForm()
    onOpenChange(false)
  }, [resetForm, onOpenChange])

  if (!transaction) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Edit Transaction</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Type */}
            <div className="space-y-2">
              <Label htmlFor="type">Type</Label>
              <Select value={type} onValueChange={(v: "income" | "expense") => setType(v)}>
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
                  {typeCategories.map((cat) => (
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

            {/* Picture */}
          <div className="space-y-2">
            <Label htmlFor="picture">Picture (optional)</Label>
            <Input
              id="picture"
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0]
                if (file) {
                  const reader = new FileReader()
                  reader.onloadend = () => {
                    setPicture(reader.result as string) // stores base64 string
                  }
                  reader.readAsDataURL(file)
                }
              }}
            />

            {/* Preview if picture selected */}
            {picture && (
              <div className="mt-2">
                <img
                  src={picture}
                  alt="Preview"
                  className="max-h-32 rounded border"
                />
              </div>
            )}
          </div>

          </div>

          <DialogFooter className="flex items-center gap-2 pt-4">
            <Button type="button" variant="outline" onClick={handleCancel} disabled={isLoading}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>Save Changes</>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export const EditTransactionDialog = React.memo(EditTransactionDialogComponent)
