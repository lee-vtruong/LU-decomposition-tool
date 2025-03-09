"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ThemeToggle } from "@/components/theme-toggle"
import { MatrixInput } from "@/components/matrix-input"
import { StepVisualizer } from "@/components/step-visualizer"
import { ResultDisplay } from "@/components/result-display"

type Matrix = number[][]
type Step = {
  description: string
  A: Matrix
  L: Matrix
  U: Matrix
  currentRow: number
  pivotRow: number
  multiplier: number
  rawMultiplier: number
}

export function LUDecompositionTool() {
  const [matrixSize, setMatrixSize] = useState(3)
  const [matrix, setMatrix] = useState<Matrix>([])
  const [steps, setSteps] = useState<Step[]>([])
  const [currentStepIndex, setCurrentStepIndex] = useState(-1)
  const [L, setL] = useState<Matrix>([])
  const [U, setU] = useState<Matrix>([])
  const [isDecomposing, setIsDecomposing] = useState(false)
  const [activeTab, setActiveTab] = useState("input")

  // Initialize matrix with zeros
  useEffect(() => {
    const newMatrix = Array(matrixSize)
      .fill(0)
      .map(() => Array(matrixSize).fill(0))
    setMatrix(newMatrix)
  }, [matrixSize])

  const handleMatrixChange = (newMatrix: Matrix) => {
    setMatrix(newMatrix)
  }

  const createIdentityMatrix = (size: number): Matrix => {
    return Array(size)
      .fill(0)
      .map((_, i) =>
        Array(size)
          .fill(0)
          .map((_, j) => (i === j ? 1 : 0)),
      )
  }

  const deepCopyMatrix = (mat: Matrix): Matrix => {
    return mat.map((row) => [...row])
  }

  // Modify the performLUDecomposition function to correctly calculate and store multipliers
  const performLUDecomposition = () => {
    if (matrix.length === 0) return

    setIsDecomposing(true)
    setActiveTab("visualization")

    const n = matrix.length
    const stepsArray: Step[] = []

    // Initialize L as identity matrix and U as a copy of A
    const lMatrix = createIdentityMatrix(n)
    const uMatrix = deepCopyMatrix(matrix)

    // Initial state
    stepsArray.push({
      description: "Initial state of matrices A, L, and U",
      A: deepCopyMatrix(matrix),
      L: deepCopyMatrix(lMatrix),
      U: deepCopyMatrix(uMatrix),
      currentRow: -1,
      pivotRow: -1,
      multiplier: 0,
      rawMultiplier: 0, // Store the raw value for fraction display
    })

    // Perform Gaussian elimination
    for (let k = 0; k < n; k++) {
      for (let i = k + 1; i < n; i++) {
        if (uMatrix[k][k] === 0) {
          // Skip if pivot is zero (would need pivoting in a robust implementation)
          continue
        }

        // Calculate the multiplier as the ratio of elements in U
        const multiplier = uMatrix[i][k] / uMatrix[k][k]
        const rawMultiplier = uMatrix[i][k] / uMatrix[k][k] // Store raw value for fraction display

        // Store the multiplier in L
        lMatrix[i][k] = multiplier

        // Create a copy for this step before modification
        const currentU = deepCopyMatrix(uMatrix)
        const currentL = deepCopyMatrix(lMatrix)

        // Add step before row operation
        stepsArray.push({
          description: `Step ${stepsArray.length + 1}: Computing multiplier`,
          A: deepCopyMatrix(matrix),
          L: currentL,
          U: currentU,
          currentRow: i,
          pivotRow: k,
          multiplier: multiplier,
          rawMultiplier: rawMultiplier, // Store raw value for fraction display
        })

        // Perform row operation
        for (let j = k; j < n; j++) {
          uMatrix[i][j] = uMatrix[i][j] - multiplier * uMatrix[k][j]
        }

        // Add step after row operation
        stepsArray.push({
          description: `Step ${stepsArray.length + 1}: Applying row operation`,
          A: deepCopyMatrix(matrix),
          L: deepCopyMatrix(lMatrix),
          U: deepCopyMatrix(uMatrix),
          currentRow: i,
          pivotRow: k,
          multiplier: multiplier,
          rawMultiplier: rawMultiplier, // Store raw value for fraction display
        })
      }
    }

    // Final result
    stepsArray.push({
      description: "Final result of LU decomposition",
      A: deepCopyMatrix(matrix),
      L: deepCopyMatrix(lMatrix),
      U: deepCopyMatrix(uMatrix),
      currentRow: -1,
      pivotRow: -1,
      multiplier: 0,
      rawMultiplier: 0,
    })

    setSteps(stepsArray)
    setL(lMatrix)
    setU(uMatrix)
    setCurrentStepIndex(0)
    setIsDecomposing(false)
  }

  const nextStep = () => {
    if (currentStepIndex < steps.length - 1) {
      setCurrentStepIndex(currentStepIndex + 1)
    }
  }

  const prevStep = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(currentStepIndex - 1)
    }
  }

  const resetDecomposition = () => {
    setSteps([])
    setCurrentStepIndex(-1)
    setActiveTab("input")
  }

  const currentStep = steps[currentStepIndex]

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Matrix LU Decomposition</h2>
        <ThemeToggle />
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="input">Matrix Input</TabsTrigger>
          <TabsTrigger value="visualization" disabled={steps.length === 0}>
            Visualization
          </TabsTrigger>
          <TabsTrigger value="result" disabled={steps.length === 0}>
            Result
          </TabsTrigger>
        </TabsList>

        <TabsContent value="input" className="mt-4">
          <Card>
            <CardContent className="pt-6">
              <MatrixInput
                size={matrixSize}
                onSizeChange={setMatrixSize}
                matrix={matrix}
                onMatrixChange={handleMatrixChange}
              />

              <div className="mt-6 flex justify-end">
                <Button onClick={performLUDecomposition} disabled={isDecomposing}>
                  Decompose Matrix
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="visualization" className="mt-4">
          <Card>
            <CardContent className="pt-6">
              {currentStep && (
                <StepVisualizer step={currentStep} stepIndex={currentStepIndex} totalSteps={steps.length} />
              )}

              <div className="mt-6 flex justify-between">
                <Button variant="outline" onClick={prevStep} disabled={currentStepIndex <= 0}>
                  Previous Step
                </Button>

                <Button variant="outline" onClick={resetDecomposition}>
                  Reset
                </Button>

                <Button onClick={nextStep} disabled={currentStepIndex >= steps.length - 1}>
                  Next Step
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="result" className="mt-4">
          <Card>
            <CardContent className="pt-6">
              {steps.length > 0 && <ResultDisplay originalMatrix={matrix} lMatrix={L} uMatrix={U} />}

              <div className="mt-6 flex justify-end">
                <Button variant="outline" onClick={resetDecomposition}>
                  Start New Decomposition
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

