import { ButtonHTMLAttributes, ReactNode } from 'react'
import { clsx } from 'clsx'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'
  size?: 'xs' | 'sm' | 'md' | 'lg'
  children: ReactNode
}

export default function Button({
  variant = 'primary',
  size = 'md',
  className,
  children,
  ...props
}: ButtonProps) {
  const base = 'clay-btn font-sans font-bold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none inline-flex items-center justify-center'

  const variants: Record<string, string> = {
    primary:   'clay-btn-primary',
    secondary: 'clay-btn-secondary',
    outline:   'clay-btn-ghost',
    ghost:     'clay-btn-ghost',
    danger:    'bg-gradient-to-br from-red-600 to-red-700 text-white hover:from-red-700 hover:to-red-800',
  }

  const sizes: Record<string, string> = {
    xs: 'px-3 py-1.5 text-xs rounded-xl',
    sm: 'px-4 py-2 text-xs rounded-2xl',
    md: 'px-5 py-2.5 text-sm rounded-2xl',
    lg: 'px-7 py-3 text-base rounded-2xl',
  }

  // Add danger button shadow
  const dangerShadow = variant === 'danger' ? {
    boxShadow: '0 2px 8px rgba(220, 38, 38, 0.25), 0 1px 3px rgba(220, 38, 38, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.2)'
  } : {}

  return (
    <button
      className={clsx(base, variants[variant], sizes[size], className)}
      style={dangerShadow}
      {...props}
    >
      {children}
    </button>
  )
}