import { LUDecompositionTool } from "@/components/lu-decomposition-tool"

export default function Home() {
  return (
    <main className="min-h-screen p-4 md:p-8 lg:p-12">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold text-center mb-6">LU Decomposition Visualizer</h1>
        <p className="text-center mb-8 text-muted-foreground">
          Visualize the step-by-step process of LU decomposition using elementary row operations
        </p>

        <LUDecompositionTool />

        <footer className="mt-16 pt-6 border-t text-center text-sm text-muted-foreground">
          <p>Created by leev.truong</p>
        </footer>
      </div>
    </main>
  )
}

