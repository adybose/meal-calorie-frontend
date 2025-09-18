"use client"

import { useMealStore } from "@/stores/meal-store"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { History, Trash2, Utensils } from "lucide-react"
import { formatDistanceToNow } from "date-fns"

export function CalorieLookupHistory() {
  const { history, clearHistory } = useMealStore()

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
            Calorie Lookup History
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
          {history.map((meal) => (
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
                <div className="font-semibold text-primary text-sm sm:text-base">{meal.total_calories}</div>
                <div className="text-xs text-muted-foreground">calories</div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
