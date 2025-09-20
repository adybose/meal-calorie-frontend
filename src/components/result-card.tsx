"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { CalorieResponse, Nutrient } from "@/types"
import { Utensils, Target, Calculator, Database, Scale, ChevronDown, Flame, Dumbbell, Droplet, Wheat } from "lucide-react"
import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

interface ResultCardProps {
  result: CalorieResponse
}

function getCalories(nutrients: Nutrient[] | undefined): number {
  const energyNutrient = nutrients?.find(n => n.name === 'Energy' && n.unit === 'kcal')
  return energyNutrient ? Math.round(energyNutrient.value) : 0
}

function getNutrientValue(nutrients: Nutrient[] | undefined, name: string): number {
  const nut = nutrients?.find(n => n.name === name);
  return nut ? Math.round(nut.value * 100) / 100 : 0;
}


export function ResultCard({ result }: ResultCardProps) {
  const totalCalories = getCalories(result.computed_total_nutrients || result.total_nutrients)
  const perServingCalories = getCalories(result.per_serving_nutrients)
  const per100gCalories = getCalories(result.per_100g_nutrients)
  const modeText = result.mode ? `${result.amount} ${result.mode}` : `${result.total_servings} servings`
  const [expandedCard, setExpandedCard] = useState<number | null>(null)

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
              <div className="text-xs font-medium text-muted-foreground mb-2">Per 100g</div>
              <div className="flex flex-col items-center gap-2">
                <div className="flex items-center gap-1 text-orange-500 font-semibold text-lg px-4 py-2">
                  <Flame className="h-4 w-4" /> Energy: {per100gCalories} kcal
                </div>
                <Badge variant="outline" className="flex items-center gap-1 border-primary">
                  <Dumbbell className="h-3 w-3" /> Protein: {getNutrientValue(result.per_100g_nutrients, 'Protein')}g
                </Badge>
                <Badge variant="outline" className="flex items-center gap-1 border-primary">
                  <Droplet className="h-3 w-3" /> Fat: {getNutrientValue(result.per_100g_nutrients, 'Total lipid (fat)')}g
                </Badge>
                <Badge variant="outline" className="flex items-center gap-1 border-primary">
                  <Wheat className="h-3 w-3" /> Carbs: {getNutrientValue(result.per_100g_nutrients, 'Carbohydrate, by difference')}g
                </Badge>
              </div>
              <button onClick={() => setExpandedCard(0)} className="mt-2 flex items-center justify-center text-xs text-primary hover:underline">
                <ChevronDown className="h-3 w-3 mr-1" /> Expand
              </button>
            </div>
            <div className="text-center p-3 bg-muted rounded-lg">
              <div className="text-xs font-medium text-muted-foreground mb-2">Per Serving</div>
              <div className="flex flex-col items-center gap-2">
                <div className="flex items-center gap-1 text-orange-500 font-semibold text-lg px-4 py-2">
                  <Flame className="h-4 w-4" /> Energy: {perServingCalories} kcal
                </div>
                <Badge variant="outline" className="flex items-center gap-1 border-primary">
                  <Dumbbell className="h-3 w-3" /> Protein: {getNutrientValue(result.per_serving_nutrients, 'Protein')}g
                </Badge>
                <Badge variant="outline" className="flex items-center gap-1 border-primary">
                  <Droplet className="h-3 w-3" /> Fat: {getNutrientValue(result.per_serving_nutrients, 'Total lipid (fat)')}g
                </Badge>
                <Badge variant="outline" className="flex items-center gap-1 border-primary">
                  <Wheat className="h-3 w-3" /> Carbs: {getNutrientValue(result.per_serving_nutrients, 'Carbohydrate, by difference')}g
                </Badge>
              </div>
              <button onClick={() => setExpandedCard(1)} className="mt-2 flex items-center justify-center text-xs text-primary hover:underline">
                <ChevronDown className="h-3 w-3 mr-1" /> Expand
              </button>
            </div>
            <div className="text-center p-3 bg-primary/10 rounded-lg border-2 border-primary/20">
              <div className="text-xs font-medium text-primary mb-2">Total</div>
              <div className="flex flex-col items-center gap-2">
                <div className="flex items-center gap-1 text-orange-500 font-semibold text-lg px-4 py-2">
                  <Flame className="h-4 w-4" /> Energy: {totalCalories} kcal
                </div>
                <Badge variant="outline" className="flex items-center gap-1 border-primary">
                  <Dumbbell className="h-3 w-3" /> Protein: {getNutrientValue(result.computed_total_nutrients || result.total_nutrients, 'Protein')}g
                </Badge>
                <Badge variant="outline" className="flex items-center gap-1 border-primary">
                  <Droplet className="h-3 w-3" /> Fat: {getNutrientValue(result.computed_total_nutrients || result.total_nutrients, 'Total lipid (fat)')}g
                </Badge>
                <Badge variant="outline" className="flex items-center gap-1 border-primary">
                  <Wheat className="h-3 w-3" /> Carbs: {getNutrientValue(result.computed_total_nutrients || result.total_nutrients, 'Carbohydrate, by difference')}g
                </Badge>
              </div>
              <button onClick={() => setExpandedCard(2)} className="mt-2 flex items-center justify-center text-xs text-primary hover:underline">
                <ChevronDown className="h-3 w-3 mr-1" /> Expand
              </button>
            </div>
          </div>
        </CardContent>
      </Card>

      {expandedCard !== null && (
        <Dialog open={expandedCard !== null} onOpenChange={() => setExpandedCard(null)}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>
                {expandedCard === 0 ? 'Per 100g Nutrients' : expandedCard === 1 ? 'Per Serving Nutrients' : 'Total Nutrients'}
              </DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {(expandedCard === 0 ? result.per_100g_nutrients : expandedCard === 1 ? result.per_serving_nutrients : result.computed_total_nutrients || result.total_nutrients)?.map((nut, index) => (
                <div key={nut.id || index} className="text-center p-2 border rounded-lg">
                  <div className="text-base font-bold text-primary">{nut.value} {nut.unit}</div>
                  <div className="text-[10px] text-muted-foreground mt-1">{nut.name}</div>
                </div>
              ))}
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
