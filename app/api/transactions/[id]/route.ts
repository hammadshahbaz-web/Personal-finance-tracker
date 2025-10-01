import { type NextRequest, NextResponse } from "next/server"
import { mockDatabase } from "@/lib/mock-data"

function getUserIdFromToken(authHeader: string | null): string | null {
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return null
  }

  try {
    const token = authHeader.substring(7)
    if (token.startsWith("mock_access_token_")) {
      const payload = token.replace("mock_access_token_", "")
      const decoded = JSON.parse(Buffer.from(payload, "base64").toString())

      const user = mockDatabase.users.findByEmail(decoded.email)
      return user?.id || null
    }
  } catch (error) {
    console.error("Token parsing error:", error)
  }

  return null
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const authHeader = request.headers.get("authorization")
    const userId = getUserIdFromToken(authHeader)

    if (!userId) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { type, amount, description, category, date, picture} = body

    const existingTransactions = mockDatabase.transactions.findByUserId(userId)
    const transaction = existingTransactions.find((txn) => txn.id === params.id)

    if (!transaction) {
      return NextResponse.json({ success: false, message: "Transaction not found" }, { status: 404 })
    }

    const updatedTransaction = mockDatabase.transactions.update(params.id, {
      type,
      amount: Number.parseFloat(amount),
      description,
      category,
      date,
      picture,  
    })

    return NextResponse.json({
      success: true,
      data: updatedTransaction,
    })
  } catch (error) {
    console.error("Update transaction error:", error)
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const authHeader = request.headers.get("authorization")
    const userId = getUserIdFromToken(authHeader)

    if (!userId) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 })
    }

    const existingTransactions = mockDatabase.transactions.findByUserId(userId)
    const transaction = existingTransactions.find((txn) => txn.id === params.id)

    if (!transaction) {
      return NextResponse.json({ success: false, message: "Transaction not found" }, { status: 404 })
    }

    const deletedTransaction = mockDatabase.transactions.delete(params.id)

    return NextResponse.json({
      success: true,
      data: deletedTransaction,
    })
  } catch (error) {
    console.error("Delete transaction error:", error)
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 })
  }
}
