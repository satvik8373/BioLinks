import { SelectHTMLAttributes, forwardRef } from 'react'
import { clsx } from 'clsx'

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  error?: string
  hint?: string
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, hint, className, children, ...props }, ref) => (
    <div className="w-full text-left">
      {label && (
        <label className="block text-xs font-bold mb-1.5 text-slate-800 uppercase tracking-wider">
          {label}
        </label>
      )}
      <select
        ref={ref}
        className={clsx(
          'w-full bg-white border border-slate-200 focus:border-brand-600 focus:ring-2 focus:ring-brand-500/20 rounded-2xl px-4 py-3 text-sm text-slate-900 outline-none transition-all font-medium cursor-pointer appearance-none',
          error && '!border-rose-500 !ring-2 !ring-rose-500/20',
          className
        )}
        {...props}
      >
        {children}
      </select>
      {error && <p className="mt-1.5 text-xs font-bold text-rose-600">{error}</p>}
      {hint && !error && <p className="mt-1.5 text-xs text-slate-500 font-normal">{hint}</p>}
    </div>
  )
)

Select.displayName = 'Select'
export default Select
