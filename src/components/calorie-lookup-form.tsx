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
import type { CalorieRequest, CalorieResponse, Nutrient } from "@/types"
import { Loader2, Search } from "lucide-react"

interface CalorieFormProps {
  onResult: (result: CalorieResponse) => void
}

export function CalorieLookupForm({ onResult }: CalorieFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm<CalorieFormData>({
    resolver: zodResolver(calorieSchema),
    defaultValues: {
      dish_name: "",
      mode: "servings",
      amount: 1,
    },
  })

  const selectedMode = watch("mode")

  const onSubmit = async (data: CalorieFormData) => {
    setIsLoading(true)
    try {
      const apiRequest: CalorieRequest = {
        dish_name: data.dish_name,
        servings: data.amount,
        mode: data.mode,
      }
      let result = await apiClient.getCalories(apiRequest)

      const extendedResult: CalorieResponse = {
        ...result,
        mode: data.mode,
        amount: data.amount,
      }

      onResult(extendedResult)
      toast({
        title: "Success!",
        description: `Found calorie information for ${data.dish_name} (${data.amount} ${data.mode})`,
        variant: "success",
      })
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to get calorie information"
      const isDishNotFound = errorMessage === "Dish not found"
      toast({
        title: "Error",
        description: errorMessage.replace(/\b\w/g, l => l.toUpperCase()),
        variant: isDishNotFound ? "warning" : "destructive",
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
            <Label className="text-sm font-medium">Measurement Mode</Label>
            <div className="flex items-center space-x-2">
              <div className="flex items-center space-x-2">
                <input
                  id="mode-servings"
                  type="radio"
                  value="servings"
                  {...register("mode")}
                  className="w-4 h-4 text-primary focus:ring-primary"
                />
                <Label htmlFor="mode-servings" className="text-sm font-medium cursor-pointer">
                  Servings
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  id="mode-grams"
                  type="radio"
                  value="grams"
                  {...register("mode")}
                  className="w-4 h-4 text-primary focus:ring-primary"
                />
                <Label htmlFor="mode-grams" className="text-sm font-medium cursor-pointer">
                  Grams
                </Label>
              </div>
            </div>
            {errors.mode && <p className="text-xs text-destructive">{errors.mode.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="amount" className="text-sm font-medium">
              {selectedMode === "servings" ? "Number of Servings" : "Number of Grams"}
            </Label>
            <Input
              id="amount"
              type="number"
              step="0.1"
              min="0.1"
              max={selectedMode === "servings" ? 50 : 1000}
              {...register("amount", { valueAsNumber: true })}
              placeholder={selectedMode === "servings" ? "1" : "100"}
              className="w-full text-sm"
            />
            {errors.amount && <p className="text-xs text-destructive">{errors.amount.message}</p>}
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
