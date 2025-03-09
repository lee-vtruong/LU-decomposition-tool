"use client"

type MatrixDisplayProps = {
  matrix: number[][]
  highlightRow?: number
  highlightCol?: number
  highlightValue?: number
  className?: string
  useFractions?: boolean
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

export function MatrixDisplay({
  matrix,
  highlightRow = -1,
  highlightCol = -1,
  highlightValue,
  className = "",
  useFractions = false,
}: MatrixDisplayProps) {
  if (!matrix || matrix.length === 0) {
    return <div className="text-center text-muted-foreground">No matrix data</div>
  }

  const rows = matrix.length
  const cols = matrix[0].length

  const formatValue = (value: number): string => {
    if (useFractions) {
      return decimalToFraction(value)
    }
    return value.toFixed(2)
  }

  return (
    <div className={`flex justify-center ${className}`}>
      <div className="flex items-center">
        <div className="text-2xl mr-2">[</div>
        <div className="grid" style={{ gridTemplateColumns: `repeat(${cols}, minmax(40px, auto))` }}>
          {matrix.map((row, rowIndex) =>
            row.map((value, colIndex) => {
              const isHighlighted = rowIndex === highlightRow || colIndex === highlightCol
              const isSpecificHighlight = rowIndex === highlightRow && colIndex === highlightCol

              return (
                <div
                  key={`${rowIndex}-${colIndex}`}
                  className={`
                    p-2 text-center min-w-[40px]
                    ${isHighlighted ? "bg-primary/20" : ""}
                    ${isSpecificHighlight ? "bg-primary/40 font-bold" : ""}
                  `}
                >
                  {isSpecificHighlight && highlightValue !== undefined
                    ? formatValue(highlightValue)
                    : formatValue(value)}
                </div>
              )
            }),
          )}
        </div>
        <div className="text-2xl ml-2">]</div>
      </div>
    </div>
  )
}

