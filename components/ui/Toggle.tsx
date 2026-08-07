'use client'

import { clsx } from 'clsx'

interface ToggleProps {
  checked: boolean
  onChange: (checked: boolean) => void
  disabled?: boolean
  size?: 'sm' | 'md'
  className?: string
  label?: string
}

export default function Toggle({
  checked,
  onChange,
  disabled = false,
  size = 'md',
  className,
  label,
}: ToggleProps) {
  const trackSize = size === 'sm' ? 'w-9 h-5' : 'w-11 h-6'
  const thumbSize = size === 'sm' ? 'w-3.5 h-3.5' : 'w-4.5 h-4.5'
  const thumbTranslate = size === 'sm'
    ? (checked ? 'translate-x-4' : 'translate-x-0.5')
    : (checked ? 'translate-x-5' : 'translate-x-0.5')

  return (
    <label className={clsx('inline-flex items-center gap-2 cursor-pointer select-none', disabled && 'opacity-50 cursor-not-allowed', className)}>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => !disabled && onChange(!checked)}
        className={clsx(
          trackSize,
          'rounded-full relative p-0 border-0 outline-none transition-colors duration-200 focus:ring-2 focus:ring-brand-500/30',
          checked ? 'bg-brand-600' : 'bg-slate-200'
        )}
      >
        <span
          className={clsx(
            thumbSize,
            thumbTranslate,
            'block rounded-full bg-white shadow-sm transition-transform duration-200'
          )}
        />
      </button>
      {label && (
        <span className="text-sm font-semibold text-slate-700">{label}</span>
      )}
    </label>
  )
}
