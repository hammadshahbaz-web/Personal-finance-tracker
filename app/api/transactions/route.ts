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

      // Find user by email from token
      const user = mockDatabase.users.findByEmail(decoded.email)
      return user?.id || null
    }
  } catch (error) {
    console.error("Token parsing error:", error)
  }

  return null
}

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization")
    const userId = getUserIdFromToken(authHeader)

    if (!userId) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 })
    }

    const transactions = mockDatabase.transactions.findByUserId(userId)

    return NextResponse.json({
      success: true,
      data: transactions,
    })
  } catch (error) {
    console.error("Get transactions error:", error)
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization")
    const userId = getUserIdFromToken(authHeader)

    if (!userId) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { type, amount, description, category, date } = body

    if (!type || !amount || !description || !category || !date) {
      return NextResponse.json({ success: false, message: "All fields are required" }, { status: 400 })
    }

    if (type !== "income" && type !== "expense") {
      return NextResponse.json({ success: false, message: "Type must be 'income' or 'expense'" }, { status: 400 })
    }

    if (amount <= 0) {
      return NextResponse.json({ success: false, message: "Amount must be greater than 0" }, { status: 400 })
    }

    const transaction = mockDatabase.transactions.create({
      userId,
      type,
      amount: Number.parseFloat(amount),
      description,
      category,
      date,
    })

    return NextResponse.json({
      success: true,
      data: transaction,
    })
  } catch (error) {
    console.error("Create transaction error:", error)
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 })
  }
}
