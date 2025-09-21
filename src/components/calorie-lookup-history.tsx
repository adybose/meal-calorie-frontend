"use client"

import { useCalorieLookupStore } from "@/stores/calorie-lookup-store"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { History, Trash2, Utensils, Dumbbell, Droplet, Wheat } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import type { Nutrient } from "@/types"

function getCalories(nutrients: Nutrient[] | undefined): number {
  const energyNutrient = nutrients?.find(n => n.name === 'Energy' && n.unit === 'kcal')
  return energyNutrient ? Math.round(energyNutrient.value) : 0
}

function getNutrientValue(nutrients: Nutrient[] | undefined, name: string): number {
  const nut = nutrients?.find(n => n.name === name);
  return nut ? Math.round(nut.value * 100) / 100 : 0;
}

export function CalorieLookupHistory() {
  const { history, clearHistory } = useCalorieLookupStore()

  if (history.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
            <History className="h-5 w-5" />
            Calorie Lookup History
          </CardTitle>
          <CardDescription className="text-sm">Your recent calorie lookups will appear here</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <Utensils className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p className="text-sm sm:text-base">No dishes searched yet</p>
            <p className="text-xs sm:text-sm">Start by looking up a dish!</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0 pb-4">
        <div>
          <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
            <History className="h-5 w-5" />
            Calorie History
          </CardTitle>
          <CardDescription className="text-sm">{history.length} recent searches</CardDescription>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={clearHistory}
          className="text-destructive hover:text-destructive text-xs sm:text-sm bg-transparent"
        >
          <Trash2 className="h-4 w-4 mr-2" />
          Clear
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-3 sm:space-y-4 max-h-96 overflow-y-auto">
          {history.map((meal) => {
            const totalCalories = getCalories(meal.computed_total_nutrients || meal.total_nutrients)
            const measurement = meal.mode === 'servings'
              ? `${meal.amount || 0} serving${(meal.amount || 0) !== 1 ? 's' : ''} (${((meal.amount || 0) * parseFloat(meal.serving_size || '0')).toFixed(0)}g)`
              : `${meal.amount || 0}g`
            const protein = getNutrientValue(meal.computed_total_nutrients || meal.total_nutrients, 'Protein')
            const fat = getNutrientValue(meal.computed_total_nutrients || meal.total_nutrients, 'Total lipid (fat)')
            const carbs = getNutrientValue(meal.computed_total_nutrients || meal.total_nutrients, 'Carbohydrate, by difference')

            return (
              <div
                key={meal.id}
                className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="flex-1 min-w-0 pr-4">
                  <div>
                    <div className="font-medium truncate text-sm sm:text-base">{meal.dish_name}</div>
                    <div className="text-sm font-normal text-muted-foreground">{meal.selected_food}</div>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">{measurement}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {formatDistanceToNow(meal.timestamp, { addSuffix: true })}
                  </p>
                </div>
                <div className="text-right flex-shrink-0">
                  <div className="font-semibold text-primary text-sm sm:text-base">{totalCalories}</div>
                  <div className="text-xs text-muted-foreground">calories</div>
                  <div className="flex flex-wrap justify-end gap-1 mt-2">
                    <Badge variant="outline" className="flex items-center gap-1 text-xs border-primary">
                      <Dumbbell className="h-3 w-3" /> {protein}g
                    </Badge>
                    <Badge variant="outline" className="flex items-center gap-1 text-xs border-primary">
                      <Droplet className="h-3 w-3" /> {fat}g
                    </Badge>
                    <Badge variant="outline" className="flex items-center gap-1 text-xs border-primary">
                      <Wheat className="h-3 w-3" /> {carbs}g
                    </Badge>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
