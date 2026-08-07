import { ReactNode } from 'react'
import { clsx } from 'clsx'

interface BadgeProps {
  children: ReactNode
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'info' | 'pro'
  size?: 'sm' | 'md'
  className?: string
  dot?: boolean
}

const variants: Record<string, string> = {
  default:  'bg-slate-100 text-slate-700 border-slate-200',
  primary:  'bg-brand-50 text-brand-700 border-brand-200',
  success:  'bg-emerald-50 text-emerald-700 border-emerald-200',
  warning:  'bg-amber-50 text-amber-700 border-amber-200',
  danger:   'bg-rose-50 text-rose-700 border-rose-200',
  info:     'bg-sky-50 text-sky-700 border-sky-200',
  pro:      'bg-gradient-to-r from-amber-400 to-orange-500 text-white border-transparent',
}

const dotColors: Record<string, string> = {
  default:  'bg-slate-400',
  primary:  'bg-brand-500',
  success:  'bg-emerald-500',
  warning:  'bg-amber-500',
  danger:   'bg-rose-500',
  info:     'bg-sky-500',
  pro:      'bg-white',
}

export default function Badge({
  children,
  variant = 'default',
  size = 'sm',
  className,
  dot = false,
}: BadgeProps) {
  return (
    <span
      className={clsx(
        'inline-flex items-center gap-1.5 font-bold border rounded-full',
        size === 'sm' ? 'text-[10px] px-2 py-0.5' : 'text-xs px-2.5 py-1',
        variants[variant],
        className
      )}
    >
      {dot && (
        <span className={clsx('w-1.5 h-1.5 rounded-full flex-shrink-0', dotColors[variant])} />
      )}
      {children}
    </span>
  )
}
