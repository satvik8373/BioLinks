import { ReactNode } from 'react'
import { clsx } from 'clsx'

interface CardProps {
  children: ReactNode
  className?: string
  hover?: boolean
  onClick?: () => void
  /** Color accent for top border stripe: primary (brand violet) | secondary (slate) */
  accent?: 'primary' | 'secondary' | 'indigo' | 'rose'
  padding?: 'none' | 'sm' | 'md' | 'lg'
}

const accentColors: Record<string, string> = {
  primary:   'border-t-4 border-t-brand-600',
  indigo:    'border-t-4 border-t-brand-600',
  secondary: 'border-t-4 border-t-slate-800',
  rose:      'border-t-4 border-t-rose-500',
}

const paddings: Record<string, string> = {
  none: '',
  sm:   'p-4',
  md:   'p-6',
  lg:   'p-8',
}

export default function Card({
  children,
  className,
  hover = false,
  onClick,
  accent,
  padding = 'md',
}: CardProps) {
  return (
    <div
      className={clsx(
        'clay-card-flat overflow-hidden',
        hover && 'clay-card cursor-pointer',
        accent && accentColors[accent],
        paddings[padding],
        className
      )}
      onClick={onClick}
    >
      {children}
    </div>
  )
}