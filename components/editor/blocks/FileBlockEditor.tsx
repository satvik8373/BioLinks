'use client'

import React from 'react'
import { LinkItem } from '@/lib/types/link'

interface BlockEditorProps {
  link: LinkItem
  updateLink: (id: string, field: string, value: any) => void
}

export default function FileBlockEditor({ link, updateLink }: BlockEditorProps) {
  return (
    <div className="space-y-5 text-left">
      <div className="space-y-1">
        <h3 className="text-base font-bold text-gray-900">File & Document link</h3>
        <p className="text-xs text-gray-500">Share Google Drive files, Dropbox links, resumes, or PDFs.</p>
      </div>

      <div className="space-y-1">
        <label className="block text-sm font-bold text-gray-900">
          File Title / Button Label
        </label>
        <p className="text-xs text-gray-500 mb-1.5">Text shown on your link button.</p>
        <input
          type="text"
          value={link.text || ''}
          onChange={e => updateLink(link.id, 'text', e.target.value)}
          placeholder="Download My Resume / PDF"
          className="w-full bg-gray-50 border border-gray-200/90 rounded-2xl px-4 py-3.5 text-xs font-semibold text-gray-900 outline-none focus:bg-white focus:ring-2 focus:ring-black transition-all"
        />
      </div>

      <div className="space-y-1">
        <label className="block text-sm font-bold text-gray-900">
          File URL
        </label>
        <p className="text-xs text-gray-500 mb-1.5">Direct Google Drive, Dropbox, or file cloud link.</p>
        <input
          type="url"
          value={link.url || ''}
          onChange={e => updateLink(link.id, 'url', e.target.value)}
          placeholder="https://drive.google.com/file/d/..."
          className="w-full bg-gray-50 border border-gray-200/90 rounded-2xl px-4 py-3.5 text-xs font-mono text-gray-900 outline-none focus:bg-white focus:ring-2 focus:ring-black transition-all"
        />
      </div>
    </div>
  )
}
