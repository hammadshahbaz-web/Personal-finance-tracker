"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { useAppDispatch } from "@/lib/hooks"
import { logout } from "@/lib/features/auth/authSlice"
import { useLogoutMutation } from "@/lib/features/auth/authApi"
import { LogOut, Loader2 } from "lucide-react"

interface LogoutButtonProps {
  variant?: "default" | "ghost" | "outline"
  size?: "default" | "sm" | "lg"
  showIcon?: boolean
}

export function LogoutButton({ variant = "ghost", size = "default", showIcon = true }: LogoutButtonProps) {
  const router = useRouter()
  const dispatch = useAppDispatch()
  const [logoutMutation, { isLoading }] = useLogoutMutation()

  const handleLogout = async () => {
    try {
      // Call logout API (optional for mock)
      await logoutMutation().unwrap()
    } catch (error) {
      console.error("Logout API error:", error)
      // Continue with logout even if API fails
    } finally {
      // Clear Redux state
      dispatch(logout())

      // Clear localStorage
      localStorage.removeItem("finance_tracker_token")
      localStorage.removeItem("finance_tracker_refresh_token")
      localStorage.removeItem("finance_tracker_user")

      // Redirect to login
      router.push("/login")
    }
  }

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleLogout}
      disabled={isLoading}
      className="flex items-center gap-2"
    >
      {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : showIcon && <LogOut className="h-4 w-4" />}
      {isLoading ? "Signing out..." : "Sign Out"}
    </Button>
  )
}
