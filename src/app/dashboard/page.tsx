"use client"

import { useAuthGuard } from "@/hooks/use-auth-guard"
import { useAuthStore } from "@/stores/auth-store"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calculator, User } from "lucide-react"
import Link from "next/link"

export default function DashboardPage() {
  useAuthGuard()
  const { user } = useAuthStore()

  if (!user) return null

  return (
    <div className="container mx-auto px-4 py-6 sm:py-8">
      <div className="space-y-6 sm:space-y-8">
        <div className="space-y-2">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Welcome back, {user.first_name}!</h1>
          <p className="text-sm sm:text-base text-muted-foreground">Track your meals and monitor your calorie intake</p>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Quick Actions</CardTitle>
              <CardDescription className="text-sm">Get started with calorie tracking</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button asChild className="w-full text-sm">
                <Link href="/calories">
                  <Calculator className="mr-2 h-4 w-4" />
                  Look up Calories
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <User className="h-5 w-5" />
                Profile
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-sm font-medium">Name</p>
                <p className="text-sm text-muted-foreground">
                  {user.first_name} {user.last_name}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium">Email</p>
                <p className="text-sm text-muted-foreground break-all">{user.email}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
