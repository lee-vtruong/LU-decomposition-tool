"use client"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

type MatrixInputProps = {
  size: number
  onSizeChange: (size: number) => void
  matrix: number[][]
  onMatrixChange: (matrix: number[][]) => void
}

export function MatrixInput({ size, onSizeChange, matrix, onMatrixChange }: MatrixInputProps) {
  const handleSizeChange = (value: string) => {
    const newSize = Number.parseInt(value)
    onSizeChange(newSize)
  }

  const handleCellChange = (rowIndex: number, colIndex: number, value: string) => {
    const newValue = value === "" ? 0 : Number.parseFloat(value)

    if (isNaN(newValue)) return

    const newMatrix = [...matrix]
    if (!newMatrix[rowIndex]) {
      newMatrix[rowIndex] = []
    }
    newMatrix[rowIndex][colIndex] = newValue
    onMatrixChange(newMatrix)
  }

  const generateRandomMatrix = () => {
    const newMatrix = Array(size)
      .fill(0)
      .map(() =>
        Array(size)
          .fill(0)
          .map(() => Math.floor(Math.random() * 10) - 3),
      )
    onMatrixChange(newMatrix)
  }

  const generateExampleMatrix = () => {
    let newMatrix

    if (size === 2) {
      newMatrix = [
        [4, 3],
        [6, 3],
      ]
    } else if (size === 3) {
      newMatrix = [
        [2, -1, 0],
        [-1, 2, -1],
        [0, -1, 2],
      ]
    } else if (size === 4) {
      newMatrix = [
        [4, -1, 0, 0],
        [-1, 4, -1, 0],
        [0, -1, 4, -1],
        [0, 0, -1, 4],
      ]
    } else {
      // For other sizes, generate a tridiagonal matrix
      newMatrix = Array(size)
        .fill(0)
        .map((_, i) =>
          Array(size)
            .fill(0)
            .map((_, j) => {
              if (i === j) return 4
              if (Math.abs(i - j) === 1) return -1
              return 0
            }),
        )
    }

    onMatrixChange(newMatrix)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-end">
        <div className="space-y-2">
          <Label htmlFor="matrix-size">Matrix Size</Label>
          <Select value={size.toString()} onValueChange={handleSizeChange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select size" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="2">2 × 2</SelectItem>
              <SelectItem value="3">3 × 3</SelectItem>
              <SelectItem value="4">4 × 4</SelectItem>
              <SelectItem value="5">5 × 5</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" onClick={generateExampleMatrix}>
            Use Example Matrix
          </Button>
          <Button variant="outline" onClick={generateRandomMatrix}>
            Random Matrix
          </Button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <div className="inline-block min-w-full align-middle">
          <div className="p-4 bg-muted/30 rounded-lg">
            <div className="grid grid-cols-1 gap-6">
              <div>
                <h3 className="text-lg font-medium mb-3">Matrix A</h3>
                <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${size}, minmax(60px, 1fr))` }}>
                  {Array(size)
                    .fill(0)
                    .map((_, rowIndex) =>
                      Array(size)
                        .fill(0)
                        .map((_, colIndex) => (
                          <Input
                            key={`${rowIndex}-${colIndex}`}
                            type="text"
                            value={matrix[rowIndex]?.[colIndex] || 0}
                            onChange={(e) => handleCellChange(rowIndex, colIndex, e.target.value)}
                            className="text-center w-full"
                            aria-label={`Matrix element at row ${rowIndex + 1}, column ${colIndex + 1}`}
                          />
                        )),
                    )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

