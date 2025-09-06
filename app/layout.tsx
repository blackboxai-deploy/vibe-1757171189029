import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Stratos - AI-Powered Talent Discovery',
  description: 'Find the perfect developers using intelligent GitHub analysis and semantic matching',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  )
}