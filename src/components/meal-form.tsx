"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { calorieSchema, type CalorieFormData } from "@/lib/validations"
import { apiClient } from "@/lib/api"
import type { CalorieResponse } from "@/types"
import { Loader2, Search } from "lucide-react"

interface MealFormProps {
  onResult: (result: CalorieResponse) => void
}

export function MealForm({ onResult }: MealFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CalorieFormData>({
    resolver: zodResolver(calorieSchema),
    defaultValues: {
      servings: 1,
    },
  })

  const onSubmit = async (data: CalorieFormData) => {
    setIsLoading(true)
    try {
      const result = await apiClient.getCalories(data)
      onResult(result)
      toast({
        title: "Success!",
        description: `Found calorie information for ${result.dish_name}`,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to get calorie information",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
          <Search className="h-5 w-5" />
          Calorie Lookup
        </CardTitle>
        <CardDescription className="text-sm">
          Enter a dish name and number of servings to get calorie information
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="dish_name" className="text-sm font-medium">
              Dish Name
            </Label>
            <Input
              id="dish_name"
              {...register("dish_name")}
              placeholder="e.g., chicken biryani, pasta alfredo"
              className="w-full text-sm"
            />
            {errors.dish_name && <p className="text-xs text-destructive">{errors.dish_name.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="servings" className="text-sm font-medium">
              Number of Servings
            </Label>
            <Input
              id="servings"
              type="number"
              step="0.1"
              min="0.1"
              max="50"
              {...register("servings", { valueAsNumber: true })}
              placeholder="1"
              className="w-full text-sm"
            />
            {errors.servings && <p className="text-xs text-destructive">{errors.servings.message}</p>}
          </div>

          <Button type="submit" className="w-full text-sm" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isLoading ? "Searching..." : "Get Calories"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
