'use client'

import React, { ReactNode } from 'react'
import { Monitor, Smartphone, Tablet } from 'lucide-react'
import Button from '@/components/ui/Button'

interface EditorPreviewShellProps {
  children: ReactNode
  device?: 'mobile' | 'tablet' | 'desktop'
  onDeviceChange?: (device: 'mobile' | 'tablet' | 'desktop') => void
}

export default function EditorPreviewShell({
  children,
  device = 'mobile',
  onDeviceChange,
}: EditorPreviewShellProps) {
  return (
    <div className="flex flex-col h-full bg-slate-50">
      {/* Device toolbar */}
      <div className="flex items-center justify-center gap-2 py-3 px-4 bg-white border-b border-slate-200/80">
        <Button
          type="button"
          variant={device === 'mobile' ? 'secondary' : 'ghost'}
          size="icon"
          onClick={() => onDeviceChange?.('mobile')}
          title="Mobile view"
        >
          <Smartphone className="w-4 h-4" />
        </Button>
        <Button
          type="button"
          variant={device === 'tablet' ? 'secondary' : 'ghost'}
          size="icon"
          onClick={() => onDeviceChange?.('tablet')}
          title="Tablet view"
        >
          <Tablet className="w-4 h-4" />
        </Button>
        <Button
          type="button"
          variant={device === 'desktop' ? 'secondary' : 'ghost'}
          size="icon"
          onClick={() => onDeviceChange?.('desktop')}
          title="Desktop view"
        >
          <Monitor className="w-4 h-4" />
        </Button>
      </div>

      {/* Preview container */}
      <div className="flex-1 overflow-auto p-4 flex items-center justify-center">
        <div
          className={`transition-all duration-300 ${
            device === 'mobile'
              ? 'w-[375px] max-w-full'
              : device === 'tablet'
              ? 'w-[768px] max-w-full'
              : 'w-full max-w-[1280px]'
          }`}
        >
          {children}
        </div>
      </div>
    </div>
  )
}
