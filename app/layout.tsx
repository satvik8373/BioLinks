import './globals.css'
import type { Metadata } from 'next'
import ConditionalNavigation from '@/components/layout/ConditionalNavigation'

export const metadata: Metadata = {
  title: 'BioLink Creator - Create Beautiful Bio Links',
  description: 'Create beautiful bio links with customizable themes. Choose from minimal, vibrant, professional, and creative designs.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="font-grotesk antialiased">
        <ConditionalNavigation />
        {children}
      </body>
    </html>
  )
}