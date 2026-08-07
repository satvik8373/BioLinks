'use client'

import React from 'react'
import { Download } from 'lucide-react'
import { LinkItem } from '@/lib/types/link'
import {
  BlockEditorContainer,
  BlockFieldLabel,
} from './BlockEditorContainer'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'

interface BlockEditorProps {
  link: LinkItem
  updateLink: (id: string, field: string, value: any) => void
}

const FORM_PRESETS = [
  { id: 'email-capture', label: 'Email Capture' },
  { id: 'contact',       label: 'Contact Us' },
  { id: 'survey',        label: 'Feedback Survey' },
  { id: 'waitlist',      label: 'Waitlist Signup' },
] as const

const FIELD_TOGGLES = [
  { key: 'formShowName',    label: 'Collect Name',        defaultOn: true },
  { key: 'formShowPhone',   label: 'Collect Phone',       defaultOn: false },
  { key: 'formShowMessage', label: 'Collect Message',     defaultOn: false },
  { key: 'formShowRating',  label: 'Collect Star Rating', defaultOn: false },
] as const

export default function FormBlockEditor({ link, updateLink }: BlockEditorProps) {
  const submissions: any[] = (link as any).submissions || []
  const formType = (link as any).formType || 'email-capture'

  const exportCsv = () => {
    if (submissions.length === 0) return
    const headers = ['Date', 'Name', 'Email', 'Phone', 'Rating', 'Message']
    const rows = submissions.map((s) => [
      `"${s.date || ''}"`,
      `"${s.name || ''}"`,
      `"${s.email || ''}"`,
      `"${s.phone || ''}"`,
      `"${s.rating || ''}"`,
      `"${(s.message || '').replace(/"/g, '""')}"`,
    ])
    const csv =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((r) => r.join(','))].join('\n')
    const a = document.createElement('a')
    a.setAttribute('href', encodeURI(csv))
    a.setAttribute('download', `leads-${link.id || 'form'}.csv`)
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
  }

  return (
    <BlockEditorContainer
      title="Form & lead capture"
      description="Collect emails, messages, ratings, or waitlist signups."
    >
      <div className="space-y-5">
        {/* Preset selector */}
        <div>
          <BlockFieldLabel
            label="Form Preset"
            hint="Select a pre-built form configuration."
          />
          <div className="grid grid-cols-2 gap-2">
            {FORM_PRESETS.map((p) => {
              const isSelected = formType === p.id
              return (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => {
                    updateLink(link.id, 'formType', p.id)
                    if (p.id === 'survey') updateLink(link.id, 'formShowRating', true)
                  }}
                  className={`p-3 rounded-2xl border text-center text-xs transition-all cursor-pointer ${
                    isSelected
                      ? 'border-brand-600 bg-brand-50 text-brand-900 font-extrabold ring-1 ring-brand-500/20'
                      : 'border-slate-200 text-slate-700 font-semibold bg-white hover:bg-slate-50 hover:border-slate-300'
                  }`}
                >
                  {p.label}
                </button>
              )
            })}
          </div>
        </div>

        {/* Submit label & colour row */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <BlockFieldLabel label="Submit Button Label" />
            <Input
              type="text"
              value={(link as any).formSubmitText || 'Submit'}
              onChange={(e) => updateLink(link.id, 'formSubmitText', e.target.value)}
              placeholder="Submit"
            />
          </div>

          <div>
            <BlockFieldLabel label="Submit Button Color" />
            <div className="flex gap-2 items-center">
              <input
                type="color"
                value={(link as any).formSubmitColor || '#7C3AED'}
                onChange={(e) => updateLink(link.id, 'formSubmitColor', e.target.value)}
                className="w-10 h-10 p-0.5 rounded-xl border border-slate-200 cursor-pointer flex-shrink-0"
              />
              <Input
                type="text"
                value={(link as any).formSubmitColor || '#7C3AED'}
                onChange={(e) => updateLink(link.id, 'formSubmitColor', e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Field toggles */}
        <div>
          <BlockFieldLabel
            label="Fields to Collect"
            hint="Enable input fields for your form."
          />
          <div className="grid grid-cols-2 gap-2.5 bg-slate-50 border border-slate-200 rounded-2xl p-3.5">
            {FIELD_TOGGLES.map(({ key, label, defaultOn }) => (
              <label key={key} className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={
                    (link as any)[key] !== undefined
                      ? !!(link as any)[key]
                      : defaultOn
                  }
                  onChange={(e) => updateLink(link.id, key, e.target.checked)}
                  className="w-4 h-4 rounded accent-brand-600 cursor-pointer"
                />
                <span className="text-xs font-semibold text-slate-800">{label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Submissions dashboard */}
        <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-extrabold text-slate-900 block">
                Collected Submissions
              </span>
              <span className="text-[11px] text-slate-500 font-medium">
                {submissions.length} lead{submissions.length !== 1 ? 's' : ''} captured
              </span>
            </div>
            {submissions.length > 0 && (
              <Button variant="secondary" size="xs" onClick={exportCsv}>
                <Download size={12} />
                Export CSV
              </Button>
            )}
          </div>

          {submissions.length > 0 ? (
            <div className="max-h-40 overflow-y-auto space-y-1.5 pt-1 scrollbar-none">
              {submissions
                .slice()
                .reverse()
                .map((sub, idx) => (
                  <div
                    key={idx}
                    className="p-2.5 bg-white border border-slate-200/80 rounded-xl text-xs space-y-0.5 shadow-clay-sm"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-extrabold text-slate-900">
                        {sub.name || 'Anonymous'}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">
                        {sub.date || 'Recent'}
                      </span>
                    </div>
                    <p className="text-brand-600 font-mono text-[11px]">{sub.email}</p>
                    {sub.phone && (
                      <p className="text-slate-500 text-[10px]">Phone: {sub.phone}</p>
                    )}
                    {sub.rating && (
                      <p className="text-amber-500 text-[10px]">★ {sub.rating}/5</p>
                    )}
                    {sub.message && (
                      <p className="text-slate-600 text-[11px] italic mt-1 bg-slate-50 p-1.5 rounded-lg">
                        {sub.message}
                      </p>
                    )}
                  </div>
                ))}
            </div>
          ) : (
            <p className="text-[11px] text-slate-400 italic text-center py-1">
              No submissions yet. Leads collected on your live bio link will appear here.
            </p>
          )}
        </div>
      </div>
    </BlockEditorContainer>
  )
}
