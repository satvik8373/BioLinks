import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Bio Link',
  description: 'View bio link',
}

export default function CardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      {/* Clean layout - no navigation, no footer, just the card */}
      {children}
    </>
  )
}
