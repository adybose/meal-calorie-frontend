'use client'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { useAuthStore } from '@/stores/authStore'

export default function Home() {
  const router = useRouter()
  const { token } = useAuthStore()

  useEffect(() => {
    if (token) {
      router.push('/dashboard')
    } else {
      router.push('/login')
    }
  }, [token, router])

  return <div className="flex min-h-screen items-center justify-center">Loading...</div>
}
