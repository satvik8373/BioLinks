import { TextareaHTMLAttributes, forwardRef, useId } from 'react'
import { clsx } from 'clsx'

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
  hint?: string
  counter?: boolean
  maxLength?: number
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, hint, counter, maxLength, className, value, id, ...props }, ref) => {
    const generatedId = useId()
    const textareaId = id || generatedId

    return (
      <div className="w-full text-left">
        {label && (
          <label htmlFor={textareaId} className="block text-xs font-bold mb-1.5 text-slate-800 uppercase tracking-wider cursor-pointer">
            {label}
          </label>
        )}
        <div className="relative">
          <textarea
            id={textareaId}
            ref={ref}
          value={value}
          maxLength={maxLength}
          className={clsx(
            'w-full bg-white border border-slate-200 focus:border-brand-600 focus:ring-2 focus:ring-brand-500/20 rounded-2xl px-4 py-3 text-sm text-slate-900 outline-none transition-all font-medium placeholder:text-slate-400 resize-none',
            counter && maxLength && 'pb-7',
            error && '!border-rose-500 !ring-2 !ring-rose-500/20',
            className
          )}
          {...props}
        />
        {counter && maxLength && (
          <span className="absolute bottom-2.5 right-4 text-xs font-semibold text-slate-400 pointer-events-none select-none">
            {String(value ?? '').length}/{maxLength}
          </span>
        )}
      </div>
      {error && <p className="mt-1.5 text-xs font-bold text-rose-600">{error}</p>}
      {hint && !error && <p className="mt-1.5 text-xs text-slate-500 font-normal">{hint}</p>}
    </div>
    )
  }
)

Textarea.displayName = 'Textarea'
export default Textarea
