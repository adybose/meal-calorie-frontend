"use client"

import { useMealLogStore } from "@/stores/meal-log-store"
import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ChevronDown, History, Trash2, Utensils, Dumbbell, Droplet, Wheat } from "lucide-react"
import { formatDistanceToNow, format, isToday, isYesterday } from "date-fns"
import type { Nutrient } from "@/types"

function getCalories(nutrients: Nutrient[] | undefined): number {
  const energyNutrient = nutrients?.find(n => n.name === 'Energy' && n.unit === 'kcal')
  return energyNutrient ? Math.round(energyNutrient.value) : 0
}

function getNutrientValue(nutrients: Nutrient[] | undefined, name: string): number {
  const nut = nutrients?.find(n => n.name === name);
  return nut ? Math.round(nut.value * 100) / 100 : 0;
}

export function MealLogHistory() {
  const { history, clearHistory } = useMealLogStore()

  // Group by date
  const groups = history.reduce((acc, meal) => {
    const date = new Date(meal.timestamp)
    const dateKey = format(date, 'yyyy-MM-dd')
    if (!acc[dateKey]) {
      acc[dateKey] = {
        date,
        meals: []
      }
    }
    acc[dateKey].meals.push(meal)
    return acc
  }, {} as Record<string, { date: Date; meals: typeof history }>)

  const sortedGroups = Object.values(groups).sort((a, b) => b.date.getTime() - a.date.getTime())

  const [expanded, setExpanded] = useState(new Set(sortedGroups.map(g => format(g.date, 'yyyy-MM-dd'))))

  if (history.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
            <History className="h-5 w-5" />
            Meal Log History
          </CardTitle>
          <CardDescription className="text-sm">Your recent meal logs will appear here</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <Utensils className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p className="text-sm sm:text-base">No meals logged yet</p>
            <p className="text-xs sm:text-sm">Start by logging a meal!</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  const toggleGroup = (dateKey: string) => {
    setExpanded(prev => {
      const newSet = new Set(prev)
      if (newSet.has(dateKey)) {
        newSet.delete(dateKey)
      } else {
        newSet.add(dateKey)
      }
      return newSet
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <History className="h-5 w-5" />
          Meal Log History
        </h2>
        <Button
          variant="outline"
          size="sm"
          onClick={clearHistory}
          className="text-destructive hover:text-destructive"
        >
          <Trash2 className="h-4 w-4 mr-2" />
          Clear All
        </Button>
      </div>

      {sortedGroups.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          <Utensils className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p className="text-sm sm:text-base">No meals logged yet</p>
          <p className="text-xs sm:text-sm">Start by logging a meal!</p>
        </div>
      ) : (
        <div className="relative space-y-6">
          {sortedGroups.map((group, index) => {
            const dateKey = format(group.date, 'yyyy-MM-dd')
            const isExpanded = expanded.has(dateKey)
            const totalMeals = group.meals.length
            const totalCalories = group.meals.reduce((sum, meal) => sum + getCalories(meal.computed_total_nutrients || meal.total_nutrients), 0)
            const totalProtein = group.meals.reduce((sum, meal) => sum + getNutrientValue(meal.computed_total_nutrients || meal.total_nutrients, 'Protein'), 0)
            const totalFat = group.meals.reduce((sum, meal) => sum + getNutrientValue(meal.computed_total_nutrients || meal.total_nutrients, 'Total lipid (fat)'), 0)
            const totalCarbs = group.meals.reduce((sum, meal) => sum + getNutrientValue(meal.computed_total_nutrients || meal.total_nutrients, 'Carbohydrate, by difference'), 0)
            const dayLabel = isToday(group.date) ? 'Today' : isYesterday(group.date) ? 'Yesterday' : format(group.date, 'MMM d, yyyy')
            const fullDate = format(group.date, 'EEEE, MMMM d, yyyy')

            return (
              <div key={dateKey} className="relative">
                <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-muted" style={{ top: '20px', height: 'calc(100% - 20px)' }} />
                <div className="absolute left-3.5 top-4 w-2 h-2 bg-primary rounded-full" />
                <Card className="ml-8">
                  <Button
                    variant="ghost"
                    className="w-full justify-between p-6 text-left h-auto"
                    onClick={() => toggleGroup(dateKey)}
                  >
                    <div className="flex items-center w-full">
                      <div className="space-y-1">
                        <h3 className="text-lg font-semibold">{dayLabel}</h3>
                        <p className="text-sm text-muted-foreground">{fullDate}</p>
                      </div>
                      <div className="ml-auto flex items-center gap-4">
                        <div className="text-right space-y-1">
                          <p className="text-sm font-medium">{totalMeals} meals</p>
                          <p className="text-base font-medium text-primary">{totalCalories.toLocaleString()} calories</p>
                          <div className="flex flex-wrap justify-end gap-1">
                            <Badge variant="outline" className="flex items-center gap-1 text-xs border-primary w-fit">
                              <Dumbbell className="h-3 w-3" /> {Math.round(totalProtein)}g
                            </Badge>
                            <Badge variant="outline" className="flex items-center gap-1 text-xs border-primary w-fit">
                              <Droplet className="h-3 w-3" /> {Math.round(totalFat)}g
                            </Badge>
                            <Badge variant="outline" className="flex items-center gap-1 text-xs border-primary w-fit">
                              <Wheat className="h-3 w-3" /> {Math.round(totalCarbs)}g
                            </Badge>
                          </div>
                        </div>
                        <ChevronDown className={`h-5 w-5 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                      </div>
                    </div>
                  </Button>
                  {isExpanded && (
                    <CardContent className="p-0 pt-4 border-t">
                      <div className="space-y-3 p-4">
                        {group.meals
                           .sort((a, b) => b.timestamp - a.timestamp)
                           .map((meal) => {
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
                                   <div className="font-semibold text-primary text-sm sm:text-base">{totalCalories} kcal</div>
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
                  )}
                </Card>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}