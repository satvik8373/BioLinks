'use client'

import React from 'react'
import { LinkItem } from '@/lib/types/link'
import { Download } from 'lucide-react'

interface BlockEditorProps {
  link: LinkItem
  updateLink: (id: string, field: string, value: any) => void
}

export default function FormBlockEditor({ link, updateLink }: BlockEditorProps) {
  const submissions: any[] = (link as any).submissions || []

  const exportCsv = () => {
    if (submissions.length === 0) return
    const headers = ['Date', 'Name', 'Email', 'Phone', 'Rating', 'Message']
    const rows = submissions.map(s => [
      `"${s.date || ''}"`,
      `"${s.name || ''}"`,
      `"${s.email || ''}"`,
      `"${s.phone || ''}"`,
      `"${s.rating || ''}"`,
      `"${(s.message || '').replace(/"/g, '""')}"`
    ])
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n')
    const encodedUri = encodeURI(csvContent)
    const linkEl = document.createElement('a')
    linkEl.setAttribute('href', encodedUri)
    linkEl.setAttribute('download', `leads-${link.id || 'form'}.csv`)
    document.body.appendChild(linkEl)
    linkEl.click()
    document.body.removeChild(linkEl)
  }

  return (
    <div className="space-y-5 text-left">
      <div className="space-y-1">
        <h3 className="text-base font-bold text-gray-900">Form & Lead capture</h3>
        <p className="text-xs text-gray-500">Collect emails, messages, ratings, or waitlist signups.</p>
      </div>

      {/* Preset Selector */}
      <div className="space-y-1">
        <label className="block text-sm font-bold text-gray-900">
          Form Preset
        </label>
        <p className="text-xs text-gray-500 mb-2">Select a pre-built form configuration.</p>
        <div className="grid grid-cols-2 gap-2">
          {[
            { id: 'email-capture', label: 'Email Capture' },
            { id: 'contact',       label: 'Contact Us' },
            { id: 'survey',        label: 'Feedback Survey' },
            { id: 'waitlist',      label: 'Waitlist Signup' },
          ].map(p => {
            const isSel = ((link as any).formType || 'email-capture') === p.id
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => {
                  updateLink(link.id, 'formType', p.id)
                  if (p.id === 'survey') updateLink(link.id, 'formShowRating', true)
                }}
                className={`p-3 rounded-2xl border text-center transition-all cursor-pointer text-xs ${
                  isSel
                    ? 'border-black bg-white text-gray-900 font-extrabold shadow-2xs ring-1 ring-black/5'
                    : 'border-gray-200 text-gray-700 font-semibold bg-gray-50 hover:bg-white hover:border-gray-300'
                }`}
              >
                {p.label}
              </button>
            )
          })}
        </div>
      </div>

      {/* Form Title & Submit Styling */}
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1">
          <label className="block text-sm font-bold text-gray-900">
            Submit Button Label
          </label>
          <input
            type="text"
            value={(link as any).formSubmitText || 'Submit'}
            onChange={e => updateLink(link.id, 'formSubmitText', e.target.value)}
            placeholder="Submit"
            className="w-full bg-gray-50 border border-gray-200/90 rounded-2xl px-4 py-3 text-xs font-semibold text-gray-900 outline-none focus:bg-white focus:ring-2 focus:ring-black transition-all"
          />
        </div>
        <div className="space-y-1">
          <label className="block text-sm font-bold text-gray-900">
            Submit Color
          </label>
          <div className="flex gap-2 items-center">
            <input
              type="color"
              value={(link as any).formSubmitColor || '#000000'}
              onChange={e => updateLink(link.id, 'formSubmitColor', e.target.value)}
              className="w-9 h-9 p-0.5 rounded-xl border border-gray-200 cursor-pointer"
            />
            <input
              type="text"
              value={(link as any).formSubmitColor || '#000000'}
              onChange={e => updateLink(link.id, 'formSubmitColor', e.target.value)}
              className="flex-1 bg-gray-50 border border-gray-200/90 rounded-2xl px-3 py-2.5 text-xs font-mono text-gray-900 outline-none"
            />
          </div>
        </div>
      </div>

      {/* Field Toggles */}
      <div className="space-y-1">
        <label className="block text-sm font-bold text-gray-900">
          Fields to Collect
        </label>
        <p className="text-xs text-gray-500 mb-2">Enable input fields for your form.</p>
        <div className="grid grid-cols-2 gap-2.5 text-xs font-semibold text-gray-800 bg-gray-50 p-3.5 rounded-2xl border border-gray-200/90">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={(link as any).formShowName !== false}
              onChange={e => updateLink(link.id, 'formShowName', e.target.checked)}
              className="rounded text-black focus:ring-black w-4 h-4 cursor-pointer"
            />
            <span>Collect Name</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={!!(link as any).formShowPhone}
              onChange={e => updateLink(link.id, 'formShowPhone', e.target.checked)}
              className="rounded text-black focus:ring-black w-4 h-4 cursor-pointer"
            />
            <span>Collect Phone</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={!!(link as any).formShowMessage}
              onChange={e => updateLink(link.id, 'formShowMessage', e.target.checked)}
              className="rounded text-black focus:ring-black w-4 h-4 cursor-pointer"
            />
            <span>Collect Message</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={!!(link as any).formShowRating}
              onChange={e => updateLink(link.id, 'formShowRating', e.target.checked)}
              className="rounded text-black focus:ring-black w-4 h-4 cursor-pointer"
            />
            <span>Collect Star Rating</span>
          </label>
        </div>
      </div>

      {/* Submissions & Leads Dashboard */}
      <div className="p-4 bg-gray-50 border border-gray-200/90 rounded-2xl space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs font-extrabold text-gray-900 block">Collected Submissions</span>
            <span className="text-[11px] text-gray-500 font-semibold">{submissions.length} lead(s) captured</span>
          </div>
          {submissions.length > 0 && (
            <button
              type="button"
              onClick={exportCsv}
              className="px-3.5 py-2 bg-black hover:bg-gray-800 text-white text-xs font-bold rounded-xl transition-all shadow-2xs flex items-center gap-1.5 cursor-pointer"
            >
              <Download size={13} />
              <span>Export CSV</span>
            </button>
          )}
        </div>

        {submissions.length > 0 ? (
          <div className="max-h-40 overflow-y-auto space-y-1.5 pt-1 pr-1 scrollbar-none">
            {submissions.slice().reverse().map((sub, idx) => (
              <div key={idx} className="p-2.5 bg-white border border-gray-200/80 rounded-xl text-xs space-y-0.5 shadow-2xs">
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-gray-900">{sub.name || 'Anonymous'}</span>
                  <span className="text-[10px] text-gray-400 font-mono">{sub.date || 'Recent'}</span>
                </div>
                <p className="text-purple-700 font-mono text-[11px]">{sub.email}</p>
                {sub.phone && <p className="text-gray-500 text-[10px]">Phone: {sub.phone}</p>}
                {sub.rating && <p className="text-amber-500 text-[10px]">★ {sub.rating}/5 Stars</p>}
                {sub.message && <p className="text-gray-600 text-[11px] italic mt-1 bg-gray-50 p-1.5 rounded-lg">{sub.message}</p>}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-[11px] text-gray-400 italic text-center py-1">No form submissions yet. Leads collected on your live bio link will appear here.</p>
        )}
      </div>
    </div>
  )
}
