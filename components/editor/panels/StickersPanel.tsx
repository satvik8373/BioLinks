'use client'

import React from 'react'
import {
  ArrowLeft, Check, ShieldCheck, Sparkles, Award, Trash2,
  ArrowDownRight, MousePointer, Pointer, Hand, CornerDownRight,
  Navigation, TrendingDown, Heart, Gem, Flower2, Music, Sun,
  BookOpen, Gift, ShoppingBag, Flame, Zap, Star, Smile, Crown,
  Compass
} from 'lucide-react'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Toggle from '@/components/ui/Toggle'
import Badge from '@/components/ui/Badge'

export interface StickerItem {
  id: string
  name: string
  category: string
  emoji?: string
  iconComponent?: React.FC<{ className?: string }>
  instanceId?: string
  x?: number
  y?: number
  scale?: number
  rotation?: number
}

interface StickersPanelProps {
  config: any
  updateConfig: (path: string | any[], value?: any) => void
  onBack?: () => void
}

// ─── Clean React Icon Component Renderers ────────────────────────────────────
const ArrowSilver = () => (
  <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-slate-100 via-slate-300 to-slate-500 p-1.5 flex items-center justify-center shadow-xs border border-slate-200">
    <ArrowDownRight className="w-6 h-6 text-slate-900 stroke-[3]" />
  </div>
)

const ArrowPink = () => (
  <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-pink-300 via-pink-400 to-rose-600 p-1.5 flex items-center justify-center shadow-xs border border-pink-200">
    <ArrowDownRight className="w-6 h-6 text-white stroke-[3]" />
  </div>
)

const ArrowHolo = () => (
  <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-sky-400 via-purple-500 to-pink-500 p-1.5 flex items-center justify-center shadow-xs border border-purple-200">
    <Navigation className="w-6 h-6 text-white fill-white" />
  </div>
)

const ArrowIridescent = () => (
  <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-emerald-400 via-teal-500 to-blue-600 p-1.5 flex items-center justify-center shadow-xs border border-teal-200">
    <ArrowDownRight className="w-6 h-6 text-white stroke-[3]" />
  </div>
)

const ArrowPixelCursor = () => (
  <div className="w-9 h-9 rounded-2xl bg-slate-900 p-1.5 flex items-center justify-center shadow-xs border border-slate-700">
    <MousePointer className="w-6 h-6 text-white fill-white" />
  </div>
)

const ArrowPixelHand = () => (
  <div className="w-9 h-9 rounded-2xl bg-white p-1.5 flex items-center justify-center shadow-xs border border-slate-300">
    <Pointer className="w-6 h-6 text-slate-900 fill-slate-900" />
  </div>
)

const ArrowVintageHand = () => (
  <div className="w-9 h-9 rounded-2xl bg-amber-50 p-1.5 flex items-center justify-center shadow-xs border border-amber-200">
    <Hand className="w-6 h-6 text-amber-900" />
  </div>
)

const ArrowLine = () => (
  <div className="w-9 h-9 rounded-2xl bg-slate-100 p-1.5 flex items-center justify-center shadow-xs border border-slate-300">
    <CornerDownRight className="w-6 h-6 text-slate-900 stroke-[3]" />
  </div>
)

const ArrowSpray = () => (
  <div className="w-9 h-9 rounded-2xl bg-purple-100 p-1.5 flex items-center justify-center shadow-xs border border-purple-300">
    <TrendingDown className="w-6 h-6 text-purple-700 stroke-[3]" />
  </div>
)

const ArrowSwirl = () => (
  <div className="w-9 h-9 rounded-2xl bg-emerald-100 p-1.5 flex items-center justify-center shadow-xs border border-emerald-300">
    <Compass className="w-6 h-6 text-emerald-700 stroke-[2.5]" />
  </div>
)

const ArrowLime = () => (
  <div className="w-9 h-9 rounded-2xl bg-lime-400 p-1.5 flex items-center justify-center shadow-xs border border-lime-500">
    <ArrowDownRight className="w-6 h-6 text-slate-900 stroke-[3]" />
  </div>
)

const Arrow3DEmerald = () => (
  <div className="w-9 h-9 rounded-2xl bg-emerald-600 p-1.5 flex items-center justify-center shadow-xs border border-emerald-700">
    <ArrowDownRight className="w-6 h-6 text-white stroke-[3]" />
  </div>
)

const ARROW_STICKERS: StickerItem[] = [
  { id: 'arrow-balloon-silver', name: 'Silver Balloon Arrow', category: 'This way!', iconComponent: ArrowSilver },
  { id: 'arrow-pink-3d', name: 'Pink 3D Arrow', category: 'This way!', iconComponent: ArrowPink },
  { id: 'arrow-holo-3d', name: 'Holographic Arrow', category: 'This way!', iconComponent: ArrowHolo },
  { id: 'arrow-iridescent', name: 'Iridescent Arrow', category: 'This way!', iconComponent: ArrowIridescent },
  { id: 'arrow-pixel-cursor', name: 'Pixel Cursor', category: 'This way!', iconComponent: ArrowPixelCursor },
  { id: 'arrow-pixel-hand', name: 'Pixel Hand', category: 'This way!', iconComponent: ArrowPixelHand },
  { id: 'arrow-vintage-hand', name: 'Vintage Hand', category: 'This way!', iconComponent: ArrowVintageHand },
  { id: 'arrow-line', name: 'Arrow Line', category: 'This way!', iconComponent: ArrowLine },
  { id: 'arrow-spray', name: 'Spraypaint Arrow', category: 'This way!', iconComponent: ArrowSpray },
  { id: 'arrow-swirl', name: 'Green Swirl Arrow', category: 'This way!', iconComponent: ArrowSwirl },
  { id: 'arrow-lime', name: 'Lime Yellow Arrow', category: 'This way!', iconComponent: ArrowLime },
  { id: 'arrow-3d-emerald', name: 'Green 3D Arrow', category: 'This way!', iconComponent: Arrow3DEmerald },
]

const COLLAB_STICKERS: StickerItem[] = [
  { id: 'collab-ribbon', name: 'Lace Ribbon', category: 'Olivia Rodrigo Collab', emoji: '🎀' },
  { id: 'collab-lipstick', name: 'Red Lipstick', category: 'Olivia Rodrigo Collab', emoji: '💄' },
  { id: 'collab-mirror', name: 'Gold Vintage Mirror', category: 'Olivia Rodrigo Collab', emoji: '🪞' },
  { id: 'collab-plant', name: 'Potted Plant', category: 'Olivia Rodrigo Collab', emoji: '🪴' },
  { id: 'collab-mules', name: 'Pink Mules', category: 'Olivia Rodrigo Collab', emoji: '👠' },
  { id: 'collab-guitar', name: 'Electric Guitar', category: 'Olivia Rodrigo Collab', emoji: '🎸' },
  { id: 'collab-vase', name: 'Daisy Vase', category: 'Olivia Rodrigo Collab', emoji: '🌼' },
  { id: 'collab-books', name: 'Book Stack', category: 'Olivia Rodrigo Collab', emoji: '📚' },
  { id: 'collab-perfume', name: 'Perfume Bottle', category: 'Olivia Rodrigo Collab', emoji: '🧪' },
  { id: 'collab-handbag', name: 'Vintage Handbag', category: 'Olivia Rodrigo Collab', emoji: '👜' },
]

const EMOJI_STICKERS: StickerItem[] = [
  { id: 'emoji-sparkles', name: 'Sparkles', category: 'Emojis & Reactions', emoji: '✨' },
  { id: 'emoji-fire', name: 'Fire', category: 'Emojis & Reactions', emoji: '🔥' },
  { id: 'emoji-heart', name: 'Pink Heart', category: 'Emojis & Reactions', emoji: '💕' },
  { id: 'emoji-rainbow', name: 'Rainbow', category: 'Emojis & Reactions', emoji: '🌈' },
  { id: 'emoji-star', name: 'Glowing Star', category: 'Emojis & Reactions', emoji: '⭐' },
  { id: 'emoji-crown', name: 'Crown', category: 'Emojis & Reactions', emoji: '👑' },
  { id: 'emoji-peace', name: 'Peace Hand', category: 'Emojis & Reactions', emoji: '✌️' },
]

const OFFICIAL_BADGES = [
  { id: 'verified', label: 'Verified Checkmark', icon: ShieldCheck, color: 'text-blue-500 bg-blue-50 border-blue-200' },
  { id: 'pro', label: 'PRO Creator Badge', icon: Sparkles, color: 'text-purple-600 bg-purple-50 border-purple-200' },
  { id: 'featured', label: 'Featured Badge', icon: Award, color: 'text-amber-600 bg-amber-50 border-amber-200' },
]

export default function StickersPanel({ config, updateConfig, onBack }: StickersPanelProps) {
  const selectedStickers: StickerItem[] = config.stickers || []
  const showBadge = config.profile?.showBadge ?? false
  const badgeType = config.profile?.badgeType || 'verified'
  const customBadgeText = config.profile?.badgeText || ''

  const isStickerSelected = (id: string) => selectedStickers.some((s) => s.id === id)

  const toggleSticker = (sticker: StickerItem) => {
    if (isStickerSelected(sticker.id)) {
      const filtered = selectedStickers.filter((s) => s.id !== sticker.id)
      updateConfig('stickers', filtered)
    } else {
      const newInstance: StickerItem = {
        instanceId: `stk_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        id: sticker.id,
        name: sticker.name,
        category: sticker.category,
        emoji: sticker.emoji,
        x: 48 + (selectedStickers.length * 6) % 20,
        y: 35 + (selectedStickers.length * 8) % 25,
        scale: 1.0,
        rotation: 0,
      }
      updateConfig('stickers', [...selectedStickers, newInstance])
    }
  }

  const handleClearAll = () => {
    updateConfig('stickers', [])
  }

  return (
    <div className="space-y-6">
      {/* Back Header Bar */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-200">
        <div className="flex items-center gap-3">
          {onBack && (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={onBack}
              title="Back to Appearance"
            >
              <ArrowLeft className="w-4 h-4 text-slate-700" />
            </Button>
          )}
          <h2 className="text-xl font-extrabold text-slate-900">Stickers</h2>
        </div>

        {selectedStickers.length > 0 && (
          <Button
            type="button"
            variant="ghost"
            size="xs"
            onClick={handleClearAll}
            className="text-slate-400 hover:text-slate-700 text-xs font-semibold"
          >
            Clear all
          </Button>
        )}
      </div>

      {/* Official Profile Header Badge / Verification Stamp */}
      <div className="space-y-3 p-4 bg-slate-50 border border-slate-200/90 rounded-2xl">
        <div className="flex items-center justify-between">
          <div>
            <label className="text-sm font-extrabold text-slate-900 block">Header Verification Badge</label>
            <p className="text-xs text-slate-500 font-medium">Display an official badge next to your handle.</p>
          </div>
          <Toggle
            checked={showBadge}
            onChange={(v) => updateConfig('profile.showBadge', v)}
            variant="dark"
            size="md"
          />
        </div>

        {showBadge && (
          <div className="space-y-3 pt-3 border-t border-slate-200/80 animate-fadeIn">
            <div className="grid grid-cols-3 gap-2.5">
              {OFFICIAL_BADGES.map((b) => {
                const IconComp = b.icon
                const isSelected = badgeType === b.id
                return (
                  <button
                    key={b.id}
                    type="button"
                    onClick={() => updateConfig('profile.badgeType', b.id)}
                    className={`p-3 rounded-2xl border-2 transition-all cursor-pointer flex flex-col items-center gap-1.5 relative ${
                      isSelected ? 'border-slate-900 bg-white shadow-xs' : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    {isSelected && (
                      <div className="absolute top-2 right-2 w-4 h-4 bg-slate-900 rounded-full flex items-center justify-center">
                        <Check className="w-2.5 h-2.5 text-white" strokeWidth={3} />
                      </div>
                    )}
                    <div className={`w-7 h-7 rounded-xl border flex items-center justify-center ${b.color}`}>
                      <IconComp className="w-3.5 h-3.5" />
                    </div>
                    <span className="text-[11px] font-bold text-slate-900">{b.label}</span>
                  </button>
                )
              })}
            </div>

            <Input
              label="Custom Badge Text (optional)"
              type="text"
              value={customBadgeText}
              onChange={(e) => updateConfig('profile.badgeText', e.target.value)}
              placeholder="e.g. Official Partner"
            />
          </div>
        )}
      </div>

      {/* Active Placed Canvas Stickers */}
      {selectedStickers.length > 0 && (
        <div className="space-y-3 p-4 bg-purple-50/60 border border-purple-200/80 rounded-2xl animate-fadeIn">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-purple-900 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-purple-600" /> Active Canvas Stickers ({selectedStickers.length})
            </label>
            <span className="text-[11px] font-semibold text-purple-600">Drag to move on preview</span>
          </div>

          <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
            {selectedStickers.map((st: any, idx: number) => (
              <div
                key={st.instanceId || st.id || idx}
                className="flex items-center justify-between p-2.5 bg-white border border-purple-100 rounded-xl shadow-2xs text-xs"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <span className="text-lg">{st.emoji || '🏹'}</span>
                  <span className="font-extrabold text-slate-800 truncate">{st.name || 'Sticker'}</span>
                </div>
                <div className="flex items-center gap-1 flex-shrink-0">
                  <Button
                    type="button"
                    variant="ghost"
                    size="xs"
                    onClick={() => {
                      const updated = selectedStickers.map((s) =>
                        (s.instanceId || s.id) === (st.instanceId || st.id)
                          ? { ...s, rotation: ((s.rotation || 0) + 15) % 360 }
                          : s
                      )
                      updateConfig('stickers', updated)
                    }}
                    title="Rotate +15°"
                  >
                    ↻
                  </Button>
                  <Button
                    type="button"
                    variant="danger"
                    size="icon"
                    onClick={() => {
                      const updated = selectedStickers.filter(
                        (s) => (s.instanceId || s.id) !== (st.instanceId || st.id)
                      )
                      updateConfig('stickers', updated)
                    }}
                    title="Remove"
                  >
                    <Trash2 className="w-3.5 h-3.5 text-rose-500" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Section 1: "This way!" (Arrows) */}
      <div className="space-y-3">
        <label className="text-sm font-extrabold text-slate-900 block">This way!</label>
        <div className="grid grid-cols-4 sm:grid-cols-6 gap-3">
          {ARROW_STICKERS.map((st) => {
            const selected = isStickerSelected(st.id)
            const IconComp = st.iconComponent
            return (
              <button
                key={st.id}
                type="button"
                onClick={() => toggleSticker(st)}
                title={st.name}
                className={`w-full aspect-square rounded-2xl border-2 p-2 flex items-center justify-center transition-all cursor-pointer relative group ${
                  selected
                    ? 'border-slate-900 bg-slate-100 shadow-sm scale-105'
                    : 'border-slate-200/80 bg-slate-50 hover:border-slate-300 hover:bg-white hover:scale-105'
                }`}
              >
                {selected && (
                  <div className="absolute top-1 right-1 w-4 h-4 bg-slate-900 rounded-full flex items-center justify-center z-10">
                    <Check className="w-2.5 h-2.5 text-white" strokeWidth={3} />
                  </div>
                )}
                {IconComp && <IconComp />}
              </button>
            )
          })}
        </div>
      </div>

      {/* Section 2: Olivia Rodrigo Collab (Limited edition) */}
      <div className="space-y-3 pt-2 border-t border-slate-200/80">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-extrabold text-slate-900">you seem pretty sad for a girl so in love</h3>
            <p className="text-xs text-slate-500 font-medium">Created in collaboration with Olivia Rodrigo</p>
          </div>
          <Badge variant="warning">Limited edition</Badge>
        </div>

        <div className="grid grid-cols-4 sm:grid-cols-5 gap-3">
          {COLLAB_STICKERS.map((st) => {
            const selected = isStickerSelected(st.id)
            return (
              <button
                key={st.id}
                type="button"
                onClick={() => toggleSticker(st)}
                title={st.name}
                className={`w-full aspect-square rounded-2xl border-2 p-2 flex flex-col items-center justify-center transition-all cursor-pointer relative group ${
                  selected
                    ? 'border-slate-900 bg-slate-100 shadow-sm scale-105'
                    : 'border-slate-200/80 bg-slate-50 hover:border-slate-300 hover:bg-white hover:scale-105'
                }`}
              >
                {selected && (
                  <div className="absolute top-1 right-1 w-4 h-4 bg-slate-900 rounded-full flex items-center justify-center z-10">
                    <Check className="w-2.5 h-2.5 text-white" strokeWidth={3} />
                  </div>
                )}
                <span className="text-3xl group-hover:scale-110 transition-transform">{st.emoji}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Section 3: Emojis & Reactions */}
      <div className="space-y-3 pt-2 border-t border-slate-200/80">
        <label className="text-sm font-extrabold text-slate-900 block">Emojis & Reactions</label>
        <div className="grid grid-cols-4 sm:grid-cols-8 gap-2.5">
          {EMOJI_STICKERS.map((st) => {
            const selected = isStickerSelected(st.id)
            return (
              <button
                key={st.id}
                type="button"
                onClick={() => toggleSticker(st)}
                title={st.name}
                className={`w-full aspect-square rounded-2xl border-2 flex items-center justify-center transition-all cursor-pointer relative group ${
                  selected
                    ? 'border-slate-900 bg-slate-100 shadow-sm scale-105'
                    : 'border-slate-200/80 bg-slate-50 hover:border-slate-300 hover:bg-white hover:scale-105'
                }`}
              >
                {selected && (
                  <div className="absolute top-1 right-1 w-4 h-4 bg-slate-900 rounded-full flex items-center justify-center z-10">
                    <Check className="w-2.5 h-2.5 text-white" strokeWidth={3} />
                  </div>
                )}
                <span className="text-2xl group-hover:scale-110 transition-transform">{st.emoji}</span>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
