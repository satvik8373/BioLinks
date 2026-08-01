import { ButtonHTMLAttributes, ReactNode } from 'react'
import { clsx } from 'clsx'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  children: ReactNode
}

export default function Button({ 
  variant = 'primary', 
  size = 'md', 
  className, 
  children, 
  ...props 
}: ButtonProps) {
  const baseClasses = 'font-bold border-4 border-neo-black transition-all duration-150 active:translate-y-0'
  
  const variants = {
    primary: 'bg-neo-yellow text-neo-black shadow-neo hover:shadow-neo-lg hover:-translate-y-1',
    secondary: 'bg-neo-pink text-neo-black shadow-neo hover:shadow-neo-lg hover:-translate-y-1',
    outline: 'bg-transparent text-neo-black shadow-neo hover:shadow-neo-lg hover:-translate-y-1',
    danger: 'bg-red-500 text-white shadow-neo hover:shadow-neo-lg hover:-translate-y-1'
  }
  
  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg'
  }
  
  return (
    <button
      className={clsx(
        baseClasses,
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {children}
    </button>
  )
}