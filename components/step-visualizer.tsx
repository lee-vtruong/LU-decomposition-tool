"use client"

import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { MatrixDisplay } from "@/components/matrix-display"

type Matrix = number[][]
type Step = {
  description: string
  A: Matrix
  L: Matrix
  U: Matrix
  currentRow: number
  pivotRow: number
  multiplier: number
  rawMultiplier?: number // Add this field
}

interface StepVisualizerProps {
  step: Step
  stepIndex: number
  totalSteps: number
}

// Improve the decimalToFraction function to handle more cases
function decimalToFraction(decimal: number): string {
  if (decimal === 0) return "0"
  if (decimal === 1) return "1"
  if (decimal === -1) return "-1"

  // Handle negative numbers
  const sign = decimal < 0 ? "-" : ""
  decimal = Math.abs(decimal)

  // Find greatest common divisor
  const findGCD = (a: number, b: number): number => {
    return b === 0 ? a : findGCD(b, a % b)
  }

  // Convert to fraction with a reasonable denominator
  const epsilon = 1.0e-10
  let bestDenom = 1
  let bestError = Math.abs(decimal - Math.round(decimal * bestDenom) / bestDenom)

  // Try denominators up to 100
  for (let denom = 2; denom <= 100; denom++) {
    const numer = Math.round(decimal * denom)
    const error = Math.abs(decimal - numer / denom)

    if (error < bestError) {
      bestError = error
      bestDenom = denom

      // If error is very small, we found a good match
      if (error < epsilon) break
    }
  }

  const bestNumer = Math.round(decimal * bestDenom)

  // Simplify the fraction
  const gcd = findGCD(bestNumer, bestDenom)
  const numerator = bestNumer / gcd
  const denominator = bestDenom / gcd

  // If the fraction is too complex or not a good approximation, revert to decimal
  if (denominator > 20 || bestError > 0.01) {
    return decimal.toFixed(2)
  }

  return denominator === 1 ? sign + numerator.toString() : sign + numerator + "/" + denominator
}

// Update the StepVisualizer component to use the rawMultiplier for fraction display
export function StepVisualizer({ step, stepIndex, totalSteps }: StepVisualizerProps) {
  const progress = Math.round((stepIndex / (totalSteps - 1)) * 100)

  // Use rawMultiplier if available, otherwise use multiplier
  const multiplierValue = step.rawMultiplier !== undefined ? step.rawMultiplier : step.multiplier
  const multiplierFraction = multiplierValue !== 0 ? decimalToFraction(multiplierValue) : "0"

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span>
            Step {stepIndex + 1} of {totalSteps}
          </span>
          <span>{progress}% Complete</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      <div className="p-4 bg-primary/10 rounded-lg">
        <p className="text-lg font-medium">{step.description}</p>
        {step.currentRow >= 0 && step.pivotRow >= 0 && (
          <div className="mt-2 p-2 bg-primary/5 rounded border border-primary/20 font-mono text-center">
            r<sub>{step.currentRow + 1}</sub> → r<sub>{step.currentRow + 1}</sub> - {multiplierFraction} × r
            <sub>{step.pivotRow + 1}</sub>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-4">
          <h3 className="text-lg font-medium mb-3 text-center">Matrix A</h3>
          <MatrixDisplay matrix={step.A} highlightRow={-1} highlightCol={-1} />
        </Card>

        <Card className="p-4">
          <h3 className="text-lg font-medium mb-3 text-center">Lower Triangular (L)</h3>
          <MatrixDisplay
            matrix={step.L}
            highlightRow={step.currentRow}
            highlightCol={step.pivotRow}
            highlightValue={step.multiplier}
            useFractions={true}
          />
        </Card>

        <Card className="p-4">
          <h3 className="text-lg font-medium mb-3 text-center">Upper Triangular (U)</h3>
          <MatrixDisplay matrix={step.U} highlightRow={step.currentRow} highlightCol={-1} useFractions={true} />
        </Card>
      </div>
    </div>
  )
}

