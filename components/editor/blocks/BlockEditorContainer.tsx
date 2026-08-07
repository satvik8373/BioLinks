'use client'

import React from 'react'
import Select from '@/components/ui/Select'
import Textarea from '@/components/ui/Textarea'
import Label from '@/components/ui/Label'

// ─── Re-export atoms so block editors can import from one place ───────────────
export { Select as BlockSelect, Textarea as BlockTextarea }

// ─── BlockFieldLabel — thin wrapper around Label atom ────────────────────────
export function BlockFieldLabel({ label, hint }: { label: string; hint?: string }) {
  return <Label hint={hint}>{label}</Label>
}

// ─── BlockEditorContainer ─────────────────────────────────────────────────────
interface BlockEditorContainerProps {
  title?: string
  description?: string
  actionLink?: { text: string; href?: string; onClick?: () => void }
  children: React.ReactNode
}

export function BlockEditorContainer({
  title,
  description,
  actionLink,
  children,
}: BlockEditorContainerProps) {
  return (
    <div className="w-full font-sans space-y-4 text-slate-900 text-left pt-1">
      {(title || description) && (
        <div className="space-y-1">
          {title && (
            <h3 className="text-sm font-bold text-slate-900">{title}</h3>
          )}
          {description && (
            <p className="text-xs text-slate-500 font-medium leading-relaxed">
              {description}
            </p>
          )}
          {actionLink && (
            <a
              href={actionLink.href || '#'}
              onClick={(e) => {
                if (actionLink.onClick) { e.preventDefault(); actionLink.onClick() }
              }}
              className="text-xs font-bold text-brand-600 hover:text-brand-700 hover:underline inline-block mt-0.5 transition-colors"
            >
              {actionLink.text}
            </a>
          )}
        </div>
      )}
      {children}
    </div>
  )
}

// ─── BlockRadioOption ─────────────────────────────────────────────────────────
interface BlockRadioOptionProps {
  selected: boolean
  onClick: () => void
  title: string
  subtitle?: string
  name?: string
}

export function BlockRadioOption({ selected, onClick, title, subtitle, name }: BlockRadioOptionProps) {
  return (
    <label onClick={onClick} className="flex items-center gap-3 cursor-pointer group py-1 select-none">
      <input
        type="radio"
        name={name}
        checked={selected}
        onChange={onClick}
        className="w-4 h-4 accent-brand-600 border-2 border-slate-300 focus:ring-2 focus:ring-brand-500/30 cursor-pointer"
      />
      <div className="flex-1 min-w-0">
        <span className={`text-sm ${selected ? 'font-bold text-slate-900' : 'font-medium text-slate-600'}`}>
          {title}
        </span>
        {subtitle && <p className="text-xs text-slate-400 font-medium mt-0.5">{subtitle}</p>}
      </div>
    </label>
  )
}
