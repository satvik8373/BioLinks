import './globals.css'
import type { Metadata } from 'next'
import { Plus_Jakarta_Sans, Inter } from 'next/font/google'
import ConditionalNavigation from '@/components/layout/ConditionalNavigation'
import ConditionalFooter from '@/components/layout/ConditionalFooter'
import { ThemeProvider } from '@/contexts/ThemeContext'

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-jakarta',
  display: 'swap',
})

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-inter',
  display: 'swap',
})

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
    <html lang="en" className={`${jakarta.variable} ${inter.variable}`}>
      <body className="font-grotesk antialiased">
        <ThemeProvider>
          <ConditionalNavigation />
          {children}
          <ConditionalFooter />
        </ThemeProvider>
      </body>
    </html>
  )
}