import { InputHTMLAttributes, forwardRef, ReactNode } from 'react'
import { clsx } from 'clsx'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  hint?: string
  icon?: ReactNode
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, icon, className, ...props }, ref) => {
    return (
      <div className="w-full text-left">
        {label && (
          <label className="block text-xs font-bold mb-1.5 text-slate-800 uppercase tracking-wider">
            {label}
          </label>
        )}
        <div className="relative">
          {icon && (
            <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
              {icon}
            </div>
          )}
          <input
            ref={ref}
            className={clsx(
              'w-full bg-white border border-slate-200 focus:border-purple-600 focus:ring-2 focus:ring-purple-500/20 rounded-2xl px-4 py-3 text-sm text-slate-900 outline-none transition-all placeholder:text-slate-400 font-medium',
              icon && 'pl-10',
              error && '!border-rose-500 !ring-2 !ring-rose-500/20',
              className
            )}
            {...props}
          />
        </div>
        {error && <p className="mt-1.5 text-xs font-bold text-rose-600">{error}</p>}
        {hint && !error && <p className="mt-1.5 text-xs text-slate-500 font-normal">{hint}</p>}
      </div>
    )
  }
)

Input.displayName = 'Input'
export default Input