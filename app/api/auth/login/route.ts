import { type NextRequest, NextResponse } from "next/server"
import { mockDatabase } from "@/lib/mock-data"

function generateMockToken(user: any, type: "access" | "refresh") {
  const payload = {
    email: user.email,
    token_type: type,
    iss: "finance-tracker-api",
    aud: "finance-tracker-clients",
    iat: Math.floor(Date.now() / 1000),
    nbf: Math.floor(Date.now() / 1000),
    exp:
      type === "access"
        ? Math.floor(Date.now() / 1000) + 60 * 60 // 1 hour
        : Math.floor(Date.now() / 1000) + 7 * 24 * 60 * 60, // 7 days
    jti: Math.random().toString(36).substr(2, 32),
  }

  // In a real app, you'd use a proper JWT library
  return `mock_${type}_token_${Buffer.from(JSON.stringify(payload)).toString("base64")}`
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password } = body
    console.log("email", email, "password: ", password)

    const user = mockDatabase.users.findByEmail(email)

    if (!user) {
      return NextResponse.json(
        { success: false, message: "Invalid credentials" },
        { status: 401 },
      )
    }

    if (password !== "password123") {
      return NextResponse.json(
        { success: false, message: "Invalid credentials" },
        { status: 401 },
      )
    }

    const accessToken = generateMockToken(user, "access")
    const refreshToken = generateMockToken(user, "refresh")

    return NextResponse.json({
      success: true,
      message: "User successfully verified",
      data: {
        access_token: accessToken,
        refresh_token: refreshToken,
        user: user,
      },
    })
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 },
    )
  }
}
