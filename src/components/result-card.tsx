"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { CalorieResponse } from "@/types"
import { Utensils, Target, Calculator, Database } from "lucide-react"

interface ResultCardProps {
  result: CalorieResponse
}

export function ResultCard({ result }: ResultCardProps) {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg sm:text-xl break-words">
          <Utensils className="h-5 w-5 flex-shrink-0" />
          <span className="truncate">{result.dish_name}</span>
        </CardTitle>
        <CardDescription className="flex items-center gap-2 text-xs sm:text-sm">
          <Database className="h-4 w-4 flex-shrink-0" />
          Data from {result.source}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="text-center p-3 sm:p-4 bg-muted rounded-lg">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Target className="h-4 w-4 text-muted-foreground" />
              <span className="text-xs sm:text-sm font-medium text-muted-foreground">Per Serving</span>
            </div>
            <div className="text-xl sm:text-2xl font-bold text-primary">{result.calories_per_serving}</div>
            <div className="text-xs sm:text-sm text-muted-foreground">calories</div>
          </div>

          <div className="text-center p-3 sm:p-4 bg-muted rounded-lg">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Calculator className="h-4 w-4 text-muted-foreground" />
              <span className="text-xs sm:text-sm font-medium text-muted-foreground">Servings</span>
            </div>
            <div className="text-xl sm:text-2xl font-bold text-primary">{result.servings}</div>
            <div className="text-xs sm:text-sm text-muted-foreground">portions</div>
          </div>

          <div className="text-center p-3 sm:p-4 bg-primary/10 rounded-lg border-2 border-primary/20">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Utensils className="h-4 w-4 text-primary" />
              <span className="text-xs sm:text-sm font-medium text-primary">Total Calories</span>
            </div>
            <div className="text-2xl sm:text-3xl font-bold text-primary">{result.total_calories}</div>
            <div className="text-xs sm:text-sm text-primary/80">calories</div>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 justify-center">
          <Badge variant="secondary" className="text-xs">
            {result.calories_per_serving} cal/serving
          </Badge>
          <Badge variant="outline" className="text-xs">
            {result.servings} servings
          </Badge>
          <Badge variant="default" className="text-xs">
            {result.total_calories} total calories
          </Badge>
        </div>
      </CardContent>
    </Card>
  )
}
