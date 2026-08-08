'use client'

import React from 'react'
import { clsx } from 'clsx'

export interface ToggleProps {
  checked: boolean
  onChange: (checked: boolean) => void
  disabled?: boolean
  size?: 'sm' | 'md'
  variant?: 'dark' | 'brand'
  className?: string
  label?: string
  title?: string
}

export function Toggle({
  checked,
  onChange,
  disabled = false,
  size = 'md',
  variant = 'dark',
  className,
  label,
  title,
}: ToggleProps) {
  const trackSize = size === 'sm' ? 'w-9 h-5' : 'w-11 h-6'
  const thumbSize = size === 'sm' ? 'w-3.5 h-3.5' : 'w-5 h-5'
  const thumbTranslate = size === 'sm'
    ? (checked ? 'translate-x-4' : 'translate-x-0.5')
    : (checked ? 'translate-x-5' : 'translate-x-0.5')

  const activeBg = variant === 'brand' ? 'bg-brand-600' : 'bg-slate-900'

  return (
    <label
      className={clsx(
        'inline-flex items-center gap-2 cursor-pointer select-none flex-shrink-0',
        disabled && 'opacity-50 cursor-not-allowed',
        className
      )}
      title={title || (checked ? 'Enabled' : 'Disabled')}
    >
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={(e) => {
          e.stopPropagation()
          if (!disabled) onChange(!checked)
        }}
        className={clsx(
          trackSize,
          'rounded-full relative p-0.5 border-0 outline-none transition-colors duration-200 focus:ring-2 focus:ring-slate-500/30 cursor-pointer flex items-center flex-shrink-0',
          checked ? activeBg : 'bg-slate-200'
        )}
      >
        <span
          className={clsx(
            thumbSize,
            thumbTranslate,
            'block rounded-full bg-white shadow-sm transition-transform duration-200 pointer-events-none'
          )}
        />
      </button>
      {label && (
        <span className="text-sm font-semibold text-slate-700">{label}</span>
      )}
    </label>
  )
}

export const Switch = Toggle
export default Toggle
