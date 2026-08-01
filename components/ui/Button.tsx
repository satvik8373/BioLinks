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
  const base = 'clay-btn font-sans font-bold transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none inline-flex items-center justify-center'

  const variants: Record<string, string> = {
    primary:   'clay-btn-primary',
    secondary: 'clay-btn-secondary',
    outline:   'clay-btn-ghost',
    ghost:     'clay-btn-ghost',
    danger:    'bg-red-600 text-white shadow-[0_4px_12px_rgba(220,38,38,0.3)] hover:bg-red-700',
  }

  const sizes: Record<string, string> = {
    xs: 'px-3 py-1.5 text-xs rounded-lg',
    sm: 'px-3.5 py-2 text-xs rounded-xl',
    md: 'px-5 py-2.5 text-sm rounded-xl',
    lg: 'px-7 py-3 text-base rounded-2xl',
  }

  return (
    <button
      className={clsx(base, variants[variant], sizes[size], className)}
      {...props}
    >
      {children}
    </button>
  )
}