'use client'

import React from 'react'
import { ArrowLeft, Asterisk, Sparkles } from 'lucide-react'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Toggle from '@/components/ui/Toggle'

interface FooterPanelProps {
  config: any
  updateConfig: (path: string | any[], value?: any) => void
  onBack?: () => void
}

export default function FooterPanel({ config, updateConfig, onBack }: FooterPanelProps) {
  const hideFooterLogo = config.theme?.hideFooterLogo ?? false
  const customFooterText = config.theme?.customFooterText || ''

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3 pb-4 border-b border-slate-200">
        {onBack && (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={onBack}
            title="Back to Appearance"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
        )}
        <div>
          <h2 className="text-lg font-extrabold text-slate-900">Footer Settings</h2>
          <p className="text-xs text-slate-500 font-medium">Customize the branding logo and copyright text at the bottom of your bio page.</p>
        </div>
      </div>

      {/* Hide Branding Logo Toggle */}
      <div className="flex items-center justify-between p-4 bg-slate-50 border border-slate-200/90 rounded-2xl">
        <div className="space-y-0.5">
          <label className="text-sm font-bold text-slate-900 block">Hide Linktree Branding</label>
          <p className="text-xs text-slate-500 font-medium">Remove the small Linktree footer logo from your public profile page.</p>
        </div>
        <Toggle
          checked={hideFooterLogo}
          onChange={(v) => updateConfig('theme.hideFooterLogo', v)}
          variant="dark"
          size="md"
        />
      </div>

      {/* Custom Copyright / Disclaimer Text */}
      <div className="space-y-2 pt-2">
        <Input
          label="Custom Footer Note"
          type="text"
          value={customFooterText}
          onChange={(e) => updateConfig('theme.customFooterText', e.target.value)}
          placeholder="© 2026 My Brand Inc. All rights reserved."
        />
        <p className="text-xs text-slate-500 font-medium">Appears subtle at the very bottom of your bio link page.</p>
      </div>
    </div>
  )
}
