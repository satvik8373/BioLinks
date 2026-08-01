import { ReactNode } from 'react'
import { clsx } from 'clsx'

interface CardProps {
  children: ReactNode
  className?: string
  hover?: boolean
  onClick?: () => void
}

export default function Card({ children, className, hover = false, onClick }: CardProps) {
  return (
    <div
      className={clsx(
        'bg-white border-4 border-neo-black shadow-neo p-6',
        hover && 'hover:shadow-neo-lg hover:-translate-y-1 transition-all duration-150 cursor-pointer',
        onClick && 'active:translate-y-0 active:shadow-neo',
        className
      )}
      onClick={onClick}
    >
      {children}
    </div>
  )
}