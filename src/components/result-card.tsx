"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { CalorieResponse, Nutrient } from "@/types"
import { Utensils, Target, Calculator, Database, Scale } from "lucide-react"

interface ResultCardProps {
  result: CalorieResponse
}

function getCalories(nutrients: Nutrient[] | undefined): number {
  const energyNutrient = nutrients?.find(n => n.name === 'Energy' && n.unit === 'kcal')
  return energyNutrient ? Math.round(energyNutrient.value) : 0
}

function NutrientsSection({ title, nutrients, icon: Icon, className = "" }: {
  title: string
  nutrients: Nutrient[] | undefined
  icon: React.ComponentType<{ className?: string }>
  className?: string
}) {
  if (!nutrients || nutrients.length === 0) return null

  const calories = getCalories(nutrients)

  return (
    <Card className={className}>
      <CardHeader className="flex flex-row items-center space-y-0 pb-2">
        <Icon className="h-4 w-4 mr-2" />
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {calories > 0 && (
          <Badge variant="secondary" className="ml-auto">
            {calories} kcal
          </Badge>
        )}
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-sm">
          {nutrients.map((nut, index) => (
            <div key={nut.id || index} className="flex justify-between p-2 bg-muted/50 rounded">
              <span className="font-medium truncate">{nut.name}</span>
              <span className="font-semibold">{nut.value} {nut.unit}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

export function ResultCard({ result }: ResultCardProps) {
  const totalCalories = getCalories(result.computed_total_nutrients || result.total_nutrients)
  const perServingCalories = getCalories(result.per_serving_nutrients)
  const per100gCalories = getCalories(result.per_100g_nutrients)
  const modeText = result.mode ? `${result.amount} ${result.mode}` : `${result.total_servings} servings`

  return (
    <div className="space-y-4">
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg sm:text-xl break-words">
            <Utensils className="h-5 w-5 flex-shrink-0" />
            <div>
              <div className="truncate">{result.dish_name}</div>
              <div className="text-sm font-normal text-muted-foreground">{result.selected_food}</div>
            </div>
          </CardTitle>
          <CardDescription className="space-y-1">
            <div className="flex items-center gap-2 text-xs">
              <Database className="h-3 w-3" />
              USDA FDC ID: {result.fdc_id}
            </div>
            <div className="flex items-center gap-2 text-xs">
              <Scale className="h-3 w-3" />
              Serving: {result.serving_size} | {result.household_serving_text}
            </div>
            <div className="text-xs text-muted-foreground">
              Requested: {modeText}
            </div>
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="text-center p-3 bg-muted rounded-lg">
              <div className="text-xs font-medium text-muted-foreground">Per 100g</div>
              <div className="text-xl font-bold text-primary">{per100gCalories}</div>
              <div className="text-xs text-muted-foreground">kcal</div>
            </div>
            <div className="text-center p-3 bg-muted rounded-lg">
              <div className="text-xs font-medium text-muted-foreground">Per Serving</div>
              <div className="text-xl font-bold text-primary">{perServingCalories}</div>
              <div className="text-xs text-muted-foreground">kcal</div>
            </div>
            <div className="text-center p-3 bg-primary/10 rounded-lg border-2 border-primary/20">
              <div className="text-xs font-medium text-primary">Total</div>
              <div className="text-2xl font-bold text-primary">{totalCalories}</div>
              <div className="text-xs text-primary/80">kcal</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <NutrientsSection
          title="Per 100g"
          nutrients={result.per_100g_nutrients}
          icon={Target}
        />
        <NutrientsSection
          title={`Per Serving (${result.serving_size})`}
          nutrients={result.per_serving_nutrients}
          icon={Utensils}
        />
        <NutrientsSection
          title={`Total for ${modeText}`}
          nutrients={result.computed_total_nutrients || result.total_nutrients}
          icon={Calculator}
          className="lg:col-span-3"
        />
      </div>
    </div>
  )
}
