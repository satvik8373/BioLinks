'use client'

import { useState } from 'react'
import { Save, RotateCcw, Loader2, AlertCircle } from 'lucide-react'
import { useDraftStore } from '@/lib/stores/useDraftStore'
import Button from '@/components/ui/Button'

export default function UnsavedChangesBar() {
  const isDirty        = useDraftStore(s => s.isDirty)
  const isSaving       = useDraftStore(s => s.isSaving)
  const saveError      = useDraftStore(s => s.saveError)
  const lastSavedAt    = useDraftStore(s => s.lastSavedAt)
  const saveDraftNow   = useDraftStore(s => s.saveDraftNow)
  const discardChanges = useDraftStore(s => s.discardChanges)

  const [discardConfirm, setDiscardConfirm] = useState(false)

  if (!isDirty && !saveError) return null

  const handleDiscard = () => {
    if (!discardConfirm) {
      setDiscardConfirm(true)
      setTimeout(() => setDiscardConfirm(false), 3000)
      return
    }
    discardChanges()
    setDiscardConfirm(false)
  }

  return (
    <div className="sticky top-0 z-50 w-full">
      <div className={`w-full px-4 py-2.5 flex items-center justify-between gap-3 transition-colors ${
        saveError ? 'bg-rose-50 border-b border-rose-200' : 'bg-amber-50 border-b border-amber-200'
      }`}>

        {/* Status text */}
        <div className="flex items-center gap-2 min-w-0">
          {saveError ? (
            <>
              <AlertCircle className="w-4 h-4 text-rose-500 flex-shrink-0" />
              <span className="text-xs font-semibold text-rose-700 truncate">{saveError}</span>
            </>
          ) : (
            <>
              <span className="w-2 h-2 rounded-full bg-amber-400 flex-shrink-0 animate-pulse" />
              <span className="text-xs font-semibold text-amber-800">
                Unsaved changes
                {lastSavedAt && (
                  <span className="font-normal text-amber-600 ml-1.5">· last saved {lastSavedAt}</span>
                )}
              </span>
            </>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <Button
            type="button"
            variant={discardConfirm ? 'danger' : 'secondary'}
            size="xs"
            disabled={isSaving}
            onClick={handleDiscard}
          >
            <RotateCcw className="w-3.5 h-3.5" />
            {discardConfirm ? 'Tap again to confirm' : 'Discard'}
          </Button>

          <Button
            type="button"
            variant="primary"
            size="xs"
            shape="pill"
            disabled={isSaving}
            isLoading={isSaving}
            onClick={() => saveDraftNow()}
          >
            {!isSaving && <Save className="w-3.5 h-3.5" />}
            {isSaving ? 'Saving…' : 'Save'}
          </Button>
        </div>
      </div>
    </div>
  )
}
