"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Calculator, Search, TrendingUp } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useAuthStore } from "@/stores/auth-store"

export default function HomePage() {
  const { isAuthenticated, isHydrating } = useAuthStore()
  const router = useRouter()

  const handleLogMeal = () => {
    if (isAuthenticated) {
      router.push("/dashboard")
    } else {
      router.push("/login?redirect=/dashboard")
    }
  }

  const handleLookupCalories = () => {
    if (isAuthenticated) {
      router.push("/calories")
    } else {
      router.push("/login?redirect=/calories")
    }
  }

  return (
    <div className="min-h-screen">
      <main className="container mx-auto px-4 py-16">
        <div className="text-center space-y-8 mb-16">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight">Track Your Meal Calories</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Discover the calorie content of your favorite dishes with our powerful meal tracking tool powered by USDA
            nutrition data.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" onClick={handleLogMeal}>
              Log a Meal
            </Button>
            <Button size="lg" variant="outline" onClick={handleLookupCalories}>
              Lookup Calories
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <Card className="text-center">
            <CardHeader>
              <Search className="h-12 w-12 mx-auto text-primary mb-4" />
              <CardTitle>Easy Search</CardTitle>
              <CardDescription>Simply enter any dish name and get instant calorie information</CardDescription>
            </CardHeader>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <Calculator className="h-12 w-12 mx-auto text-primary mb-4" />
              <CardTitle>Accurate Data</CardTitle>
              <CardDescription>Powered by USDA FoodData Central for reliable nutrition information</CardDescription>
            </CardHeader>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <TrendingUp className="h-12 w-12 mx-auto text-primary mb-4" />
              <CardTitle>Track Progress</CardTitle>
              <CardDescription>Monitor your meal history and calorie intake over time</CardDescription>
            </CardHeader>
          </Card>
        </div>

        <Card className="max-w-4xl mx-auto">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">How It Works</CardTitle>
            <CardDescription>Get started in three simple steps</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center space-y-4">
                <div className="w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center mx-auto font-bold text-lg">
                  1
                </div>
                <h3 className="font-semibold">Create Account</h3>
                <p className="text-sm text-muted-foreground">Sign up with your email to get started</p>
              </div>

              <div className="text-center space-y-4">
                <div className="w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center mx-auto font-bold text-lg">
                  2
                </div>
                <h3 className="font-semibold">Search Dishes</h3>
                <p className="text-sm text-muted-foreground">Enter dish names and serving sizes</p>
              </div>

              <div className="text-center space-y-4">
                <div className="w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center mx-auto font-bold text-lg">
                  3
                </div>
                <h3 className="font-semibold">Track Calories</h3>
                <p className="text-sm text-muted-foreground">View detailed calorie breakdowns and history</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}

