"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuthStore } from "@/stores/auth-store"

export function useAuthGuard() {
  const { isAuthenticated } = useAuthStore()
  const router = useRouter()

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!isAuthenticated) {
        router.push("/login")
      }
    }, 250)  // 250ms delay to allow Zustand rehydration

    return () => clearTimeout(timer)
  }, [isAuthenticated, router])

  return isAuthenticated
}
