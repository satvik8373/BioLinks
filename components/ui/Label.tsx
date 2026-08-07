import { LabelHTMLAttributes, ReactNode } from 'react'
import { clsx } from 'clsx'

interface LabelProps extends LabelHTMLAttributes<HTMLLabelElement> {
  children: ReactNode
  hint?: string
  required?: boolean
}

export default function Label({ children, hint, required, className, ...props }: LabelProps) {
  return (
    <div className="space-y-0.5 mb-1.5">
      <label
        className={clsx(
          'block text-xs font-bold text-slate-800 uppercase tracking-wider',
          className
        )}
        {...props}
      >
        {children}
        {required && <span className="text-rose-500 ml-0.5">*</span>}
      </label>
      {hint && (
        <p className="text-xs text-slate-500 font-normal normal-case tracking-normal">{hint}</p>
      )}
    </div>
  )
}
