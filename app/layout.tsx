import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Bubble Academy',
  description: 'Visualización interactiva de las trazas en una cámara de burbujas',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}

