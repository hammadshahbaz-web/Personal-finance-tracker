"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAppSelector, useAppDispatch } from "@/lib/hooks"
import { setCredentials } from "@/lib/features/auth/authSlice"
import { Card, CardContent } from "@/components/ui/card"
import { Loader2 } from "lucide-react"

interface ProtectedRouteProps {
  children: React.ReactNode
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const router = useRouter()
  const dispatch = useAppDispatch()
  const { isAuthenticated, token, user } = useAppSelector((state) => state.auth)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const checkAuth = () => {
      // Check if we have stored auth data in localStorage

      console.log("asdasd=============")
      const storedToken = localStorage.getItem("finance_tracker_token")
      const storedRefreshToken = localStorage.getItem("finance_tracker_refresh_token")
      const storedUser = localStorage.getItem("finance_tracker_user")

      if (storedToken && storedRefreshToken && storedUser) {
        try {
          const parsedUser = JSON.parse(storedUser)

          // Restore auth state from localStorage
          dispatch(
            setCredentials({
              user: parsedUser,
              access_token: storedToken,
              refresh_token: storedRefreshToken,
            }),
          )
          setIsLoading(false)
          return
        } catch (error) {
          console.error("Error parsing stored user data:", error)
          // Clear invalid data
          localStorage.removeItem("finance_tracker_token")
          localStorage.removeItem("finance_tracker_refresh_token")
          localStorage.removeItem("finance_tracker_user")
        }
      }

      // If no valid stored auth, redirect to login
      if (!isAuthenticated) {
        router.push("/login")
        return
      }

      setIsLoading(false)
    }

    checkAuth()
  }, [isAuthenticated, dispatch, router])

  // Store auth data in localStorage when user logs in
  useEffect(() => {
    if (isAuthenticated && token && user) {
      localStorage.setItem("finance_tracker_token", token)
      localStorage.setItem("finance_tracker_refresh_token", token) // In real app, use refresh token
      localStorage.setItem("finance_tracker_user", JSON.stringify(user))
    }
  }, [isAuthenticated, token, user])

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Card className="w-full max-w-md">
          <CardContent className="flex flex-col items-center justify-center p-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
            <p className="text-muted-foreground">Checking authentication...</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  // If not authenticated, don't render children (redirect will happen)
  if (!isAuthenticated) {
    return null
  }

  // Render protected content
  return <>{children}</>
}
