'use client'

import React, { useState, useRef, useEffect } from 'react'
import { RotateCw, Trash2, X, MousePointer, Pointer, ArrowDownRight, Sparkles } from 'lucide-react'

export interface PlacedSticker {
  instanceId: string
  id: string
  name: string
  category?: string
  emoji?: string
  imageUrl?: string
  svg?: string
  x: number // percentage 0-100
  y: number // percentage 0-100
  scale: number // multiplier e.g. 1.0
  rotation: number // degrees e.g. 0-360
}

interface StickerCanvasLayerProps {
  stickers?: PlacedSticker[]
  onUpdateStickers?: (stickers: PlacedSticker[]) => void
  editable?: boolean
}

const EMPTY_STICKERS: PlacedSticker[] = []

export default function StickerCanvasLayer({
  stickers = EMPTY_STICKERS,
  onUpdateStickers,
  editable = true,
}: StickerCanvasLayerProps) {
  const [localStickers, setLocalStickers] = useState<PlacedSticker[]>(stickers)
  const [prevStickers, setPrevStickers] = useState<PlacedSticker[]>(stickers)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const localStickersRef = useRef(localStickers)
  localStickersRef.current = localStickers

  if (stickers !== prevStickers) {
    setPrevStickers(stickers)
    setLocalStickers(stickers)
  }

  const draggingRef = useRef<{
    instanceId: string
    type: 'move' | 'scale' | 'rotate'
    startX: number
    startY: number
    initialStickerX: number
    initialStickerY: number
    initialScale: number
    initialRotation: number
    latestStickers: PlacedSticker[]
  } | null>(null)

  useEffect(() => {
    const handlePointerMove = (e: MouseEvent | TouchEvent) => {
      if (!draggingRef.current || !containerRef.current) return

      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY
      const rect = containerRef.current.getBoundingClientRect()

      const { instanceId, type, startX, startY, initialStickerX, initialStickerY, initialScale, initialRotation } = draggingRef.current

      let updatedFields: Partial<PlacedSticker> | null = null

      if (type === 'move') {
        const deltaXPercent = ((clientX - startX) / rect.width) * 100
        const deltaYPercent = ((clientY - startY) / rect.height) * 100

        const newX = Math.max(2, Math.min(98, initialStickerX + deltaXPercent))
        const newY = Math.max(2, Math.min(98, initialStickerY + deltaYPercent))
        updatedFields = { x: newX, y: newY }
      } else if (type === 'scale') {
        const deltaX = clientX - startX
        const scaleChange = deltaX / 80
        const newScale = Math.max(0.3, Math.min(4.0, initialScale + scaleChange))
        updatedFields = { scale: newScale }
      } else if (type === 'rotate') {
        const deltaX = clientX - startX
        const newRot = Math.round((initialRotation + deltaX * 2) % 360)
        updatedFields = { rotation: newRot }
      }

      if (updatedFields) {
        const next = localStickersRef.current.map((st) =>
          st.instanceId === instanceId ? { ...st, ...updatedFields } : st
        )
        draggingRef.current.latestStickers = next
        setLocalStickers(next)
      }
    }

    const handlePointerUp = () => {
      if (draggingRef.current && onUpdateStickers) {
        onUpdateStickers(draggingRef.current.latestStickers)
      }
      draggingRef.current = null
    }

    window.addEventListener('mousemove', handlePointerMove)
    window.addEventListener('mouseup', handlePointerUp)
    window.addEventListener('touchmove', handlePointerMove, { passive: false })
    window.addEventListener('touchend', handlePointerUp)

    return () => {
      window.removeEventListener('mousemove', handlePointerMove)
      window.removeEventListener('mouseup', handlePointerUp)
      window.removeEventListener('touchmove', handlePointerMove)
      window.removeEventListener('touchend', handlePointerUp)
    }
  }, [onUpdateStickers])

  if (!localStickers || localStickers.length === 0) return null

  const handleStartDrag = (
    e: React.MouseEvent | React.TouchEvent,
    st: PlacedSticker,
    type: 'move' | 'scale' | 'rotate'
  ) => {
    e.stopPropagation()
    if (!editable) return

    setSelectedId(st.instanceId)
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY

    draggingRef.current = {
      instanceId: st.instanceId,
      type,
      startX: clientX,
      startY: clientY,
      initialStickerX: st.x ?? 50,
      initialStickerY: st.y ?? 30,
      initialScale: st.scale ?? 1.0,
      initialRotation: st.rotation ?? 0,
      latestStickers: localStickers,
    }
  }

  const handleDelete = (e: React.MouseEvent, instanceId: string) => {
    e.stopPropagation()
    const updated = localStickers.filter((st) => st.instanceId !== instanceId)
    setLocalStickers(updated)
    if (onUpdateStickers) onUpdateStickers(updated)
    if (selectedId === instanceId) setSelectedId(null)
  }

  const handleRotateClick = (e: React.MouseEvent, instanceId: string) => {
    e.stopPropagation()
    const updated = localStickers.map((st) =>
      st.instanceId === instanceId ? { ...st, rotation: ((st.rotation || 0) + 15) % 360 } : st
    )
    setLocalStickers(updated)
    if (onUpdateStickers) onUpdateStickers(updated)
  }

  return (
    <div
      ref={containerRef}
      onClick={(e) => {
        if (e.target === containerRef.current) {
          setSelectedId(null)
        }
      }}
      className="absolute inset-0 pointer-events-none z-30 overflow-hidden"
    >
      {localStickers.map((st) => {
        const isSelected = editable && selectedId === st.instanceId
        const isArrow = st.id && st.id.startsWith('arrow-')
        const posX = st.x ?? 50
        const posY = st.y ?? 30
        const scale = st.scale ?? 1.0
        const rotation = st.rotation ?? 0

        return (
          <div
            key={st.instanceId || st.id}
            onMouseDown={(e) => handleStartDrag(e, st, 'move')}
            onTouchStart={(e) => handleStartDrag(e, st, 'move')}
            style={{
              left: `${posX}%`,
              top: `${posY}%`,
              transform: `translate(-50%, -50%) rotate(${rotation}deg) scale(${scale})`,
            }}
            className={`absolute cursor-grab active:cursor-grabbing select-none transition-shadow pointer-events-auto ${
              isSelected ? 'z-40' : 'z-30'
            }`}
          >
            {/* Pink Bounding Box Frame matching official Linktree editor UI */}
            <div
              className={`relative p-2 rounded-2xl flex items-center justify-center transition-all ${
                isSelected
                  ? 'border-2 border-pink-500 bg-pink-500/10 ring-4 ring-pink-500/20'
                  : 'hover:border-2 hover:border-pink-400/60'
              }`}
            >
              {/* Top Rotate Control Handle */}
              {isSelected && (
                <div className="absolute -top-10 left-1/2 -translate-x-1/2 flex flex-col items-center z-50">
                  <button
                    type="button"
                    onClick={(e) => handleRotateClick(e, st.instanceId)}
                    onMouseDown={(e) => handleStartDrag(e, st, 'rotate')}
                    onTouchStart={(e) => handleStartDrag(e, st, 'rotate')}
                    className="w-8 h-8 rounded-full bg-white border border-slate-200 text-slate-800 shadow-xl flex items-center justify-center cursor-grab active:cursor-grabbing hover:bg-slate-50 hover:scale-110 transition-transform"
                    title="Rotate Sticker (+15° or Drag)"
                  >
                    <RotateCw className="w-4 h-4 text-slate-700" />
                  </button>
                  <div className="w-0.5 h-2 bg-pink-500" />
                </div>
              )}

              {/* Top-Right X Cancel / Remove Handle */}
              {isSelected && (
                <button
                  type="button"
                  onClick={(e) => handleDelete(e, st.instanceId)}
                  className="absolute -top-3 -right-3 w-6 h-6 rounded-full bg-white border-2 border-pink-500 text-slate-800 shadow-md flex items-center justify-center cursor-pointer hover:bg-rose-50 hover:scale-110 transition-transform z-50"
                  title="Remove Sticker"
                >
                  <X className="w-3.5 h-3.5 text-slate-900" strokeWidth={3} />
                </button>
              )}

              {/* Bottom Delete Control Handle */}
              {isSelected && (
                <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center z-50">
                  <div className="w-0.5 h-2 bg-pink-500" />
                  <button
                    type="button"
                    onClick={(e) => handleDelete(e, st.instanceId)}
                    className="w-9 h-9 rounded-full bg-white border border-slate-200 text-rose-500 shadow-xl flex items-center justify-center cursor-pointer hover:bg-rose-50 hover:scale-110 transition-transform"
                    title="Delete Sticker"
                  >
                    <Trash2 className="w-4 h-4 text-rose-500" />
                  </button>
                </div>
              )}

              {/* Corner Resize Handles */}
              {isSelected && (
                <>
                  <div
                    onMouseDown={(e) => handleStartDrag(e, st, 'scale')}
                    onTouchStart={(e) => handleStartDrag(e, st, 'scale')}
                    className="absolute -top-1.5 -left-1.5 w-3.5 h-3.5 bg-white border-2 border-pink-500 rounded-xs shadow-md cursor-nwse-resize"
                  />
                  <div
                    onMouseDown={(e) => handleStartDrag(e, st, 'scale')}
                    onTouchStart={(e) => handleStartDrag(e, st, 'scale')}
                    className="absolute -top-1.5 -right-1.5 w-3.5 h-3.5 bg-white border-2 border-pink-500 rounded-xs shadow-md cursor-nesw-resize"
                  />
                  <div
                    onMouseDown={(e) => handleStartDrag(e, st, 'scale')}
                    onTouchStart={(e) => handleStartDrag(e, st, 'scale')}
                    className="absolute -bottom-1.5 -left-1.5 w-3.5 h-3.5 bg-white border-2 border-pink-500 rounded-xs shadow-md cursor-nesw-resize"
                  />
                  <div
                    onMouseDown={(e) => handleStartDrag(e, st, 'scale')}
                    onTouchStart={(e) => handleStartDrag(e, st, 'scale')}
                    className="absolute -bottom-1.5 -right-1.5 w-3.5 h-3.5 bg-white border-2 border-pink-500 rounded-xs shadow-md cursor-nwse-resize"
                  />
                </>
              )}

              {/* Inner Sticker Content */}
              {isArrow ? (
                <div className="w-12 h-12 rounded-2xl bg-slate-900/90 text-white border border-white/30 p-2 flex items-center justify-center shadow-lg backdrop-blur-xs">
                  {st.id.includes('cursor') ? (
                    <MousePointer className="w-7 h-7 text-white fill-white" />
                  ) : st.id.includes('hand') ? (
                    <Pointer className="w-7 h-7 text-white fill-white" />
                  ) : (
                    <ArrowDownRight className="w-7 h-7 text-white stroke-[3]" />
                  )}
                </div>
              ) : st.emoji ? (
                <span className="text-4xl drop-shadow-md select-none">{st.emoji}</span>
              ) : st.imageUrl ? (
                <img src={st.imageUrl} alt={st.name} className="w-14 h-14 object-contain" />
              ) : (
                <Sparkles className="w-9 h-9 text-amber-400" />
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
