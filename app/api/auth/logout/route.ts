import { NextResponse } from "next/server"

export async function POST() {
  // For this mock, we just return success
  return NextResponse.json({
    success: true,
    message: "Successfully logged out",
  })
}
