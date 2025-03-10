import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'LU DECOMPOSITION',
  description: 'Created by leev.truong',
  generator: 'leev.truong',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
