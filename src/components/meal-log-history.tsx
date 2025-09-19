"use client"

import { useMealLogStore } from "@/stores/meal-log-store"
import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ChevronDown, History, Trash2, Utensils } from "lucide-react"
import { formatDistanceToNow, format, isToday, isYesterday } from "date-fns"

export function MealLogHistory() {
  const { history, clearHistory } = useMealLogStore()

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
            const totalCalories = group.meals.reduce((sum, meal) => sum + meal.total_calories, 0)
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
                    <div className="flex items-center justify-between w-full">
                      <div className="space-y-1">
                        <h3 className="text-lg font-semibold">{dayLabel}</h3>
                        <p className="text-sm text-muted-foreground">{fullDate}</p>
                      </div>
                      <div className="text-right space-y-1">
                        <p className="text-sm font-medium">{totalMeals} meals</p>
                        <p className="text-sm font-medium">{totalCalories.toLocaleString()} cal</p>
                      </div>
                      <ChevronDown className={`h-5 w-5 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                    </div>
                  </Button>
                  {isExpanded && (
                    <CardContent className="p-0 pt-4 border-t">
                      <div className="space-y-3 p-4">
                        {group.meals
                          .sort((a, b) => b.timestamp - a.timestamp)
                          .map((meal) => (
                            <div
                              key={meal.id}
                              className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                            >
                              <div className="flex-1 min-w-0 pr-4">
                                <h4 className="font-medium truncate text-sm sm:text-base">{meal.dish_name}</h4>
                                <div className="flex flex-wrap items-center gap-2 mt-1">
                                  <Badge variant="secondary" className="text-xs">
                                    {meal.servings} serving{meal.servings !== 1 ? "s" : ""}
                                  </Badge>
                                  <Badge variant="outline" className="text-xs">
                                    {meal.total_calories} cal
                                  </Badge>
                                </div>
                                <p className="text-xs text-muted-foreground mt-1">
                                  {formatDistanceToNow(meal.timestamp, { addSuffix: true })}
                                </p>
                              </div>
                              <div className="text-right flex-shrink-0">
                                <div className="font-semibold text-primary text-sm sm:text-base">
                                  {meal.total_calories}
                                </div>
                                <div className="text-xs text-muted-foreground">calories</div>
                              </div>
                            </div>
                          ))}
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