"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MatrixDisplay } from "@/components/matrix-display"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { CheckCircle, XCircle } from "lucide-react"

type Matrix = number[][]

type ResultDisplayProps = {
  originalMatrix: Matrix
  lMatrix: Matrix
  uMatrix: Matrix
}

export function ResultDisplay({ originalMatrix, lMatrix, uMatrix }: ResultDisplayProps) {
  const [productMatrix, setProductMatrix] = useState<Matrix>([])
  const [isCorrect, setIsCorrect] = useState<boolean>(false)

  useEffect(() => {
    if (lMatrix.length > 0 && uMatrix.length > 0) {
      const product = multiplyMatrices(lMatrix, uMatrix)
      setProductMatrix(product)

      // Check if L×U equals the original matrix A
      setIsCorrect(isMatrixEqual(product, originalMatrix))
    }
  }, [lMatrix, uMatrix, originalMatrix])

  const multiplyMatrices = (matA: Matrix, matB: Matrix): Matrix => {
    const rowsA = matA.length
    const colsA = matA[0].length
    const colsB = matB[0].length

    const result: Matrix = Array(rowsA)
      .fill(0)
      .map(() => Array(colsB).fill(0))

    for (let i = 0; i < rowsA; i++) {
      for (let j = 0; j < colsB; j++) {
        for (let k = 0; k < colsA; k++) {
          result[i][j] += matA[i][k] * matB[k][j]
        }
        // Round to fix floating point errors
        result[i][j] = Math.round(result[i][j] * 1000) / 1000
      }
    }

    return result
  }

  const isMatrixEqual = (matA: Matrix, matB: Matrix): boolean => {
    if (matA.length !== matB.length || matA[0].length !== matB[0].length) {
      return false
    }

    const epsilon = 0.001 // Tolerance for floating point comparison

    for (let i = 0; i < matA.length; i++) {
      for (let j = 0; j < matA[0].length; j++) {
        if (Math.abs(matA[i][j] - matB[i][j]) > epsilon) {
          return false
        }
      }
    }

    return true
  }

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold">LU Decomposition Result</h3>

      <Alert variant={isCorrect ? "default" : "destructive"}>
        {isCorrect ? <CheckCircle className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
        <AlertTitle>Verification</AlertTitle>
        <AlertDescription>
          {isCorrect ? "The decomposition is correct! A = L × U" : "The decomposition has some errors. A ≠ L × U"}
        </AlertDescription>
      </Alert>

      <Tabs defaultValue="matrices" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="matrices">Matrices</TabsTrigger>
          <TabsTrigger value="verification">Verification</TabsTrigger>
        </TabsList>

        <TabsContent value="matrices" className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="p-4">
              <h4 className="text-lg font-medium mb-3 text-center">Lower Triangular (L)</h4>
              <MatrixDisplay matrix={lMatrix} />
            </Card>

            <Card className="p-4">
              <h4 className="text-lg font-medium mb-3 text-center">Upper Triangular (U)</h4>
              <MatrixDisplay matrix={uMatrix} />
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="verification" className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="p-4">
              <h4 className="text-lg font-medium mb-3 text-center">Original Matrix (A)</h4>
              <MatrixDisplay matrix={originalMatrix} />
            </Card>

            <Card className="p-4">
              <h4 className="text-lg font-medium mb-3 text-center">Product L × U</h4>
              <MatrixDisplay matrix={productMatrix} />
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      <div className="p-4 bg-muted/30 rounded-lg">
        <h4 className="text-lg font-medium mb-2">About LU Decomposition</h4>
        <p className="text-sm text-muted-foreground">
          LU decomposition factors a matrix as the product of a lower triangular matrix L and an upper triangular matrix
          U. This decomposition is useful for solving linear systems, calculating determinants, and inverting matrices.
        </p>
      </div>
    </div>
  )
}

