'use client'

import React from 'react'
import { LinkItem } from '@/lib/types/link'

interface BlockEditorProps {
  link: LinkItem
  updateLink: (id: string, field: string, value: any) => void
}

export default function VideoBlockEditor({ link, updateLink }: BlockEditorProps) {
  return (
    <div className="space-y-5 text-left">
      <div className="space-y-1">
        <h3 className="text-base font-bold text-gray-900">Video embed</h3>
        <p className="text-xs text-gray-500">Embed YouTube, TikTok, or Vimeo videos on your linktree.</p>
      </div>

      <div className="space-y-1">
        <label className="block text-sm font-bold text-gray-900">
          Video URL
        </label>
        <p className="text-xs text-gray-500 mb-1.5">Paste YouTube link, video shorts, or channel URL.</p>
        <input
          type="url"
          value={link.url || ''}
          onChange={e => updateLink(link.id, 'url', e.target.value)}
          placeholder="https://youtube.com/watch?v=... or TikTok / Vimeo link"
          className="w-full bg-gray-50 border border-gray-200/90 rounded-2xl px-4 py-3.5 text-xs font-mono text-gray-900 outline-none focus:bg-white focus:ring-2 focus:ring-black transition-all"
        />
      </div>

      <div className="space-y-1">
        <label className="block text-sm font-bold text-gray-900">
          Click Behavior
        </label>
        <p className="text-xs text-gray-500 mb-1.5">Choose how visitors interact with your video.</p>
        <select
          value={link.videoClickOption || 'display_video'}
          onChange={e => updateLink(link.id, 'videoClickOption', e.target.value)}
          className="w-full bg-gray-50 border border-gray-200/90 rounded-2xl px-4 py-3.5 text-xs font-semibold text-gray-900 outline-none focus:bg-white focus:ring-2 focus:ring-black cursor-pointer transition-all"
        >
          <option value="display_video">Play video directly on page</option>
          <option value="open_youtube">Open video in YouTube / TikTok app</option>
          <option value="display_latest">Auto-fetch & play channel's latest video</option>
        </select>
      </div>

      <div className="space-y-1">
        <label className="block text-sm font-bold text-gray-900">
          Video Subtext (Optional)
        </label>
        <p className="text-xs text-gray-500 mb-1.5">Short caption displayed under your video display.</p>
        <textarea
          rows={2}
          value={link.description || ''}
          onChange={e => updateLink(link.id, 'description', e.target.value)}
          placeholder="What is this video about?"
          className="w-full bg-gray-50 border border-gray-200/90 rounded-2xl px-4 py-3 text-xs text-gray-900 outline-none focus:bg-white focus:ring-2 focus:ring-black transition-all"
        />
      </div>
    </div>
  )
}
