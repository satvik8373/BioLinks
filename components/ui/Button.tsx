import { ButtonHTMLAttributes, ReactNode } from 'react'
import { clsx } from 'clsx'
import { Loader2 } from 'lucide-react'

/**
 * Shared button primitives for the entire editor UI.
 *
 * Variants
 *   primary   — purple fill  (Add Link, Set Thumbnail, submit actions)
 *   secondary — slate fill   (Cancel, Add link, neutral CTAs)
 *   outline   — white border (Choose from Library, secondary dashed CTAs)
 *   ghost     — transparent  (icon-only utility buttons: close, edit, drag)
 *   danger    — red fill     (delete / destructive actions)
 *
 * Sizes
 *   xs        — px-3 py-1.5 text-xs   (small inline actions)
 *   sm        — px-4 py-2   text-xs   (toolbar buttons)
 *   md        — px-5 py-2.5 text-sm   (default)
 *   lg        — px-7 py-3.5 text-sm   (full-width primary CTAs)
 *   icon      — w-8 h-8 p-0           (square icon-only buttons)
 *   icon-lg   — w-9 h-9 p-0           (larger icon-only buttons)
 *
 * Shape
 *   rounded   — rounded-2xl (default card-style)
 *   pill      — rounded-full (primary/secondary pill CTAs)
 *
 * Extra props
 *   fullWidth — w-full (stretch to container)
 *   isLoading — show spinner, disable interaction
 */

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'
export type ButtonSize = 'xs' | 'sm' | 'md' | 'lg' | 'icon' | 'icon-lg'
export type ButtonShape = 'rounded' | 'pill'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
  shape?: ButtonShape
  fullWidth?: boolean
  isLoading?: boolean
  children: ReactNode
}

const VARIANT_CLASSES: Record<ButtonVariant, string> = {
  primary:
    'bg-[#7800ff] hover:bg-[#6800e0] text-white font-extrabold shadow-md hover:shadow-lg ' +
    'hover:-translate-y-0.5 active:scale-[0.98] focus:ring-2 focus:ring-purple-500/40',
  secondary:
    'bg-white text-slate-700 font-bold border border-slate-200/80 shadow-sm ' +
    'hover:bg-slate-50 active:scale-[0.98] focus:ring-2 focus:ring-slate-300/60',
  outline:
    'bg-slate-50/50 text-slate-800 font-extrabold border-2 border-dashed border-slate-300 ' +
    'hover:border-purple-500 hover:bg-purple-50/30 active:scale-[0.98]',
  ghost:
    'bg-transparent text-slate-500 font-semibold ' +
    'hover:bg-slate-100 hover:text-slate-900 active:scale-[0.98]',
  danger:
    'bg-transparent text-rose-500 font-semibold ' +
    'hover:bg-rose-50 hover:text-rose-600 active:scale-[0.98]',
}

const SIZE_CLASSES: Record<ButtonSize, string> = {
  xs:       'px-3 py-1.5 text-xs',
  sm:       'px-4 py-2 text-xs',
  md:       'px-5 py-2.5 text-sm',
  lg:       'px-6 py-3.5 text-sm',
  icon:     'w-8 h-8 p-0',
  'icon-lg': 'w-9 h-9 p-0',
}

const SHAPE_CLASSES: Record<ButtonShape, string> = {
  rounded: 'rounded-2xl',
  pill:    'rounded-full',
}

export default function Button({
  variant = 'primary',
  size = 'md',
  shape = 'rounded',
  fullWidth = false,
  isLoading = false,
  className,
  children,
  disabled,
  ...props
}: ButtonProps) {
  const isIconOnly = size === 'icon' || size === 'icon-lg'

  return (
    <button
      disabled={disabled || isLoading}
      className={clsx(
        // Base
        'inline-flex items-center justify-center gap-2 cursor-pointer',
        'transition-all duration-200',
        'disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none',
        'focus:outline-none',
        // Variant
        VARIANT_CLASSES[variant],
        // Size
        SIZE_CLASSES[size],
        // Shape — icon sizes use their own rounding
        isIconOnly ? 'rounded-xl' : SHAPE_CLASSES[shape],
        // Width
        fullWidth && 'w-full',
        className,
      )}
      {...props}
    >
      {isLoading && <Loader2 className="w-4 h-4 animate-spin flex-shrink-0" />}
      {children}
    </button>
  )
}
