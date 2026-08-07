'use client'

import React, { useState, useRef, useEffect } from 'react'
import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragStartEvent,
  DragOverlay,
  PointerSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
  UniqueIdentifier,
  useDroppable,
  closestCenter,
  pointerWithin,
  rectIntersection,
  CollisionDetection,
} from '@dnd-kit/core'
import {
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import {
  Plus, Search, Sparkles, FolderPlus, Archive,
  ChevronRight, Layout, Pencil, MoreHorizontal,
  Trash2, Ungroup, GripVertical, ArrowLeft, X, Check,
  Share2, Globe, User, BarChart2,
} from 'lucide-react'
import {
  InstagramIcon, TikTokIcon, WhatsAppIcon, YouTubeIcon, TwitterIcon,
  SpotifyIcon, GitHubIcon, LinkedInIcon, DiscordIcon, EmailIcon
} from '@/components/icons/ServiceIcons'
import { LinkItem, formatSocialUrl } from '@/lib/types/link'
import LinkItemCard from './LinkItemCard'

interface SocialPlatformSpec {
  id: string
  name: string
  IconComponent: any
  placeholder: string
  example: string
  prefixUrl: string
}

const QUICK_SOCIAL_PLATFORMS: SocialPlatformSpec[] = [
  { id: 'instagram', name: 'Instagram', IconComponent: InstagramIcon, placeholder: 'Enter Instagram Username*', example: 'Example: @instagramusername', prefixUrl: 'https://instagram.com/' },
  { id: 'tiktok', name: 'TikTok', IconComponent: TikTokIcon, placeholder: 'Enter TikTok Username*', example: 'Example: @tiktokusername', prefixUrl: 'https://tiktok.com/@' },
  { id: 'whatsapp', name: 'WhatsApp', IconComponent: WhatsAppIcon, placeholder: 'Enter Phone Number*', example: 'Example: +1234567890', prefixUrl: 'https://wa.me/' },
  { id: 'email', name: 'Email', IconComponent: EmailIcon, placeholder: 'Enter Email Address*', example: 'Example: name@email.com', prefixUrl: 'mailto:' },
  { id: 'youtube', name: 'YouTube', IconComponent: YouTubeIcon, placeholder: 'Enter YouTube Handle*', example: 'Example: @youtubechannel', prefixUrl: 'https://youtube.com/' },
  { id: 'twitter', name: 'Twitter / X', IconComponent: TwitterIcon, placeholder: 'Enter Twitter Username*', example: 'Example: @twitterhandle', prefixUrl: 'https://x.com/' },
  { id: 'spotify', name: 'Spotify', IconComponent: SpotifyIcon, placeholder: 'Enter Artist or Playlist URL*', example: 'Example: https://open.spotify.com/...', prefixUrl: '' },
  { id: 'github', name: 'GitHub', IconComponent: GitHubIcon, placeholder: 'Enter GitHub Username*', example: 'Example: username', prefixUrl: 'https://github.com/' },
  { id: 'linkedin', name: 'LinkedIn', IconComponent: LinkedInIcon, placeholder: 'Enter LinkedIn Profile*', example: 'Example: in/username', prefixUrl: 'https://linkedin.com/' },
]

function AddSocialIconModal({
  platform,
  onClose,
  onBack,
  onAdd,
}: {
  platform: SocialPlatformSpec
  onClose: () => void
  onBack: () => void
  onAdd: (url: string, platformId: string) => void
}) {
  const [usernameInput, setUsernameInput] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!usernameInput.trim()) return

    const raw = usernameInput.trim().replace(/^@/, '')
    const finalUrl = platform.prefixUrl ? (raw.startsWith('http') ? raw : `${platform.prefixUrl}${raw}`) : raw
    onAdd(finalUrl, platform.id)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
      <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl relative border border-slate-100 space-y-5 animate-scale-up">
        {/* Title Bar: ← Add [Platform] icon ✕ */}
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={onBack}
            className="w-8 h-8 rounded-full flex items-center justify-center text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 stroke-[2.5]" />
          </button>
          <h3 className="text-base font-extrabold text-slate-900">Add {platform.name} icon</h3>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4 stroke-[2.5]" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 pt-1">
          {/* Input field box */}
          <div className="space-y-1.5">
            <div className="bg-slate-50 border border-slate-200/90 rounded-2xl p-3.5 focus-within:border-slate-900 focus-within:bg-white transition-all">
              <input
                type="text"
                autoFocus
                value={usernameInput}
                onChange={(e) => setUsernameInput(e.target.value)}
                placeholder={platform.placeholder}
                className="w-full bg-transparent text-sm font-semibold text-slate-900 outline-none placeholder:text-slate-400"
              />
            </div>
            <p className="text-[11px] font-medium text-slate-500 px-1">{platform.example}</p>
          </div>

          {/* Action button */}
          <button
            type="submit"
            disabled={!usernameInput.trim()}
            className="w-full py-3.5 rounded-full text-sm font-extrabold transition-all shadow-sm active:scale-98 disabled:opacity-40 disabled:cursor-not-allowed bg-slate-900 hover:bg-black text-white cursor-pointer"
          >
            Add
          </button>
        </form>
      </div>
    </div>
  )
}

/* ── Add Social Icon Search Modal (Matching Linktree Screenshot 1) ── */
function AddSocialIconSearchModal({
  onClose,
  onBack,
  onSelectPlatform,
}: {
  onClose: () => void
  onBack: () => void
  onSelectPlatform: (platform: SocialPlatformSpec) => void
}) {
  const [searchQuery, setSearchQuery] = useState('')

  const filteredPlatforms = searchQuery.trim()
    ? QUICK_SOCIAL_PLATFORMS.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.id.includes(searchQuery.toLowerCase()))
    : QUICK_SOCIAL_PLATFORMS

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
      <div className="bg-white rounded-[28px] p-6 max-w-md w-full shadow-2xl relative border border-slate-100 space-y-4 animate-scale-up max-h-[85vh] flex flex-col">
        {/* Header: < Add social icon X */}
        <div className="flex items-center justify-between flex-shrink-0">
          <button
            type="button"
            onClick={onBack}
            className="w-8 h-8 rounded-full flex items-center justify-center text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 stroke-[2.5]" />
          </button>
          <h3 className="text-base font-extrabold text-slate-900">Add social icon</h3>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4 stroke-[2.5]" />
          </button>
        </div>

        {/* Search Bar (Rounded pill bg-slate-100) */}
        <div className="bg-slate-100/90 rounded-2xl px-3.5 py-2.5 flex items-center gap-2.5 border border-slate-200/50 flex-shrink-0">
          <Search size={16} className="text-slate-500 flex-shrink-0" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search"
            className="w-full bg-transparent text-sm font-semibold text-slate-800 outline-none placeholder:text-slate-400"
            autoFocus
          />
        </div>

        {/* Platform items list */}
        <div className="overflow-y-auto space-y-1 flex-1 pr-1 scrollbar-none">
          {filteredPlatforms.map((platform) => {
            const IconComp = platform.IconComponent
            return (
              <button
                key={platform.id}
                type="button"
                onClick={() => onSelectPlatform(platform)}
                className="w-full flex items-center justify-between p-3 rounded-2xl hover:bg-slate-100/80 transition-all cursor-pointer group text-left"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200/80 flex items-center justify-center text-slate-800 group-hover:bg-white group-hover:shadow-2xs transition-all">
                    <IconComp size={16} />
                  </div>
                  <span className="text-sm font-extrabold text-slate-900">{platform.name}</span>
                </div>
                <ChevronRight size={16} className="text-slate-400 group-hover:text-slate-800 transition-colors" />
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}

/* ── Social Icons Management Modal (Matching Linktree Screenshot 4) ── */
function SocialIconsManagementModal({
  onClose,
  activeSocialList,
  socialIconPosition = 'top',
  onUpdateSocialLink,
  onRemoveSocialLink,
  onUpdateSocialPosition,
  onOpenAddModal,
  onRemoveLink,
}: {
  onClose: () => void
  activeSocialList: { platform: string; url: string; linkId?: string }[]
  socialIconPosition?: 'top' | 'bottom'
  onUpdateSocialLink?: (platformId: string, url: string) => void
  onRemoveSocialLink?: (platformId: string) => void
  onUpdateSocialPosition?: (position: 'top' | 'bottom') => void
  onOpenAddModal: () => void
  onRemoveLink?: (id: string) => void
}) {
  const [editingPlatform, setEditingPlatform] = useState<string | null>(null)
  const [editUrlInput, setEditUrlInput] = useState('')

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
      <div className="bg-white rounded-[28px] p-6 max-w-md w-full shadow-2xl relative border border-slate-100 space-y-5 animate-scale-up max-h-[88vh] flex flex-col">
        {/* Header: Social icons X */}
        <div className="flex items-center justify-between flex-shrink-0">
          <div />
          <h3 className="text-base font-extrabold text-slate-900">Social icons</h3>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4 stroke-[2.5]" />
          </button>
        </div>

        <div className="overflow-y-auto space-y-5 flex-1 pr-1 scrollbar-none">
          {/* Section: Show visitors where to find you */}
          <div className="space-y-1">
            <h4 className="text-sm font-extrabold text-slate-900">Show visitors where to find you</h4>
            <p className="text-xs font-medium text-slate-500 leading-relaxed">
              Add your social profiles, email and more as linked icons on your Linktree.
            </p>
          </div>

          {/* Connected Social Items */}
          {activeSocialList.length > 0 ? (
            <div className="space-y-2.5">
              {activeSocialList.map(({ platform, url, linkId }) => {
                const spec = QUICK_SOCIAL_PLATFORMS.find(p => p.id === platform)
                const IconComp = spec?.IconComponent || Globe
                const isEditing = editingPlatform === platform

                return (
                  <div key={platform} className="bg-slate-50 border border-slate-200/80 rounded-2xl p-3.5 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-900 shadow-2xs">
                          <IconComp size={16} />
                        </div>
                        <span className="text-sm font-extrabold text-slate-900 capitalize">
                          {spec?.name || platform}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            setEditingPlatform(isEditing ? null : platform)
                            setEditUrlInput(url)
                          }}
                          className="w-7 h-7 rounded-full flex items-center justify-center text-slate-500 hover:text-slate-900 hover:bg-slate-200/80 transition-colors cursor-pointer"
                          title="Edit link"
                        >
                          <Pencil size={13} />
                        </button>

                        <button
                          type="button"
                          onClick={() => onRemoveSocialLink?.(platform)}
                          className="w-7 h-7 rounded-full flex items-center justify-center text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                          title="Delete social icon"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>

                    {isEditing && (
                      <div className="pt-2 border-t border-slate-200/60 flex items-center gap-2">
                        <input
                          type="text"
                          value={editUrlInput}
                          onChange={(e) => setEditUrlInput(e.target.value)}
                          onBlur={() => {
                            if (editUrlInput.trim()) {
                              const formatted = formatSocialUrl(platform, editUrlInput.trim())
                              onUpdateSocialLink?.(platform, formatted)
                            }
                          }}
                          placeholder={`Enter ${platform} handle or URL`}
                          className="flex-1 bg-white border border-slate-300 rounded-xl px-3 py-1.5 text-xs font-semibold text-slate-800 outline-none focus:border-slate-900"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            if (editUrlInput.trim()) {
                              const formatted = formatSocialUrl(platform, editUrlInput.trim())
                              onUpdateSocialLink?.(platform, formatted)
                            }
                            setEditingPlatform(null)
                          }}
                          className="px-3 py-1.5 text-xs font-extrabold bg-slate-900 text-white rounded-xl hover:bg-slate-800 transition-all cursor-pointer"
                        >
                          Save
                        </button>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="p-4 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200">
              <p className="text-xs font-medium text-slate-400">No social icons added yet</p>
            </div>
          )}

          {/* Position Selector (Screenshot 4) */}
          <div className="space-y-2.5 pt-2 border-t border-slate-100">
            <div>
              <h4 className="text-xs font-extrabold text-slate-900">Social icon position</h4>
              <p className="text-[11px] font-medium text-slate-400 mt-0.5">Display icons at the top or bottom of your profile</p>
            </div>

            <div className="space-y-2">
              <label className="flex items-center gap-3 p-2.5 rounded-xl border border-slate-200/80 cursor-pointer hover:bg-slate-50 transition-colors">
                <input
                  type="radio"
                  name="socialPos"
                  checked={(socialIconPosition || 'top') === 'top'}
                  onChange={() => onUpdateSocialPosition?.('top')}
                  className="w-4 h-4 text-brand-600 accent-purple-600 focus:ring-brand-500 cursor-pointer"
                />
                <span className="text-xs font-extrabold text-slate-800">Top</span>
              </label>

              <label className="flex items-center gap-3 p-2.5 rounded-xl border border-slate-200/80 cursor-pointer hover:bg-slate-50 transition-colors">
                <input
                  type="radio"
                  name="socialPos"
                  checked={socialIconPosition === 'bottom'}
                  onChange={() => onUpdateSocialPosition?.('bottom')}
                  className="w-4 h-4 text-brand-600 accent-purple-600 focus:ring-brand-500 cursor-pointer"
                />
                <span className="text-xs font-extrabold text-slate-800">Bottom</span>
              </label>
            </div>
          </div>
        </div>

        {/* Footer Buttons (Screenshot 4) */}
        <div className="flex items-center justify-between gap-3 pt-3 border-t border-slate-100 flex-shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 text-xs font-extrabold text-slate-700 bg-white border border-slate-200 rounded-full hover:bg-slate-50 transition-all cursor-pointer flex items-center gap-1.5"
          >
            <BarChart2 size={13} className="text-slate-500" />
            <span>See insights</span>
          </button>

          <button
            type="button"
            onClick={onOpenAddModal}
            className="px-5 py-2.5 text-xs font-extrabold text-white bg-brand-600 rounded-full hover:bg-brand-700 active:scale-95 transition-all cursor-pointer shadow-md flex items-center gap-1.5"
            style={{ backgroundColor: '#7C3AED' }}
          >
            <Plus size={14} className="stroke-[3]" />
            <span>Add social icon</span>
          </button>
        </div>
      </div>
    </div>
  )
}

const ROOT_ZONE_ID = '__root__'

const LAYOUT_OPTIONS = [
  {
    id: 'stack',
    label: 'Stack',
    description: 'Display links in a compact list.',
    SvgIcon: (props: any) => (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <rect x="4" y="6" width="16" height="4.5" rx="1.5" />
        <rect x="4" y="13.5" width="16" height="4.5" rx="1.5" />
      </svg>
    )
  },
  {
    id: 'grid',
    label: 'Grid',
    description: 'Display links in a 2-column grid.',
    SvgIcon: (props: any) => (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <rect x="4" y="4" width="7" height="7" rx="1.5" />
        <rect x="13" y="4" width="7" height="7" rx="1.5" />
        <rect x="4" y="13" width="7" height="7" rx="1.5" />
        <rect x="13" y="13" width="7" height="7" rx="1.5" />
      </svg>
    )
  },
  {
    id: 'carousel',
    label: 'Carousel',
    description: 'Display links in a horizontal scrollable carousel.',
    SvgIcon: (props: any) => (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <rect x="7" y="4" width="10" height="16" rx="1.5" />
        <path d="M3 8v8" />
        <path d="M21 8v8" />
      </svg>
    )
  },
  {
    id: 'showcase',
    label: 'Showcase',
    description: 'Display the first link as a large hero card.',
    SvgIcon: (props: any) => (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <rect x="4" y="4" width="16" height="16" rx="2" />
        <path d="M14 10l4-4" />
        <path d="M18 10V6h-4" />
      </svg>
    )
  }
]

/* ─────────────────────────────────────────
   Custom Collision Detection Strategy
   Prioritizes pointerWithin so dropping onto
   collection boxes or root zone works reliably
───────────────────────────────────────── */
const customCollisionDetection: CollisionDetection = (args) => {
  // 1. First check pointerWithin
  const pointerCollisions = pointerWithin(args)
  if (pointerCollisions.length > 0) {
    const rootHit = pointerCollisions.find(c => c.id === ROOT_ZONE_ID)
    if (rootHit) return [rootHit]

    const linkHit = pointerCollisions.find(c => c.data?.droppableContainer?.data?.current?.type === 'link')
    if (linkHit) return [linkHit]

    return pointerCollisions
  }

  // 2. Fallback to rectIntersection
  const rectCollisions = rectIntersection(args)
  if (rectCollisions.length > 0) {
    const rootHit = rectCollisions.find(c => c.id === ROOT_ZONE_ID)
    if (rootHit) return [rootHit]

    const linkHit = rectCollisions.find(c => c.data?.droppableContainer?.data?.current?.type === 'link')
    if (linkHit) return [linkHit]

    return rectCollisions
  }

  // 3. Final fallback to closestCenter
  return closestCenter(args)
}

/* ─────────────────────────────────────────
   Thin line shown above a card while hovering
───────────────────────────────────────── */
function DropLine({ visible }: { visible: boolean }) {
  return (
    <div
      className={`h-0.5 rounded-full mx-3 transition-all duration-100 ${
        visible ? 'bg-brand-500 opacity-100 mb-2' : 'opacity-0 mb-0 h-0'
      }`}
    />
  )
}

/* ─────────────────────────────────────────
   Sortable link card wrapper
───────────────────────────────────────── */
function SortableLinkCard({
  link,
  index,
  isExpanded,
  isDragActive,
  onToggleExpand,
  onUpdateLink,
  onRemoveLink,
  onToggleVisibility,
  onTogglePin,
}: {
  link: LinkItem
  index: number
  isExpanded: boolean
  isDragActive: boolean
  onToggleExpand: () => void
  onUpdateLink: (l: LinkItem) => void
  onRemoveLink: (id: string) => void
  onToggleVisibility: (id: string) => void
  onTogglePin: (l: LinkItem) => void
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging, isOver } = useSortable({
    id: link.id,
    data: { type: 'link', link },
  })

  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
    >
      <DropLine visible={isOver && !isDragging && isDragActive} />

      <div style={{ opacity: isDragging ? 0 : 1 }}>
        <LinkItemCard
          link={link}
          index={index}
          isExpanded={isExpanded}
          onToggleExpand={onToggleExpand}
          onUpdate={onUpdateLink}
          onRemove={() => onRemoveLink(link.id)}
          onToggleVisibility={() => onToggleVisibility(link.id)}
          onTogglePin={() => onTogglePin(link)}
          draggableProps={{}}
          dragHandleProps={{ ...attributes, ...listeners }}
        />
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────
   Slim "drop outside" zone — useDroppable
───────────────────────────────────────── */
function RootDropZone({ show }: { show: boolean }) {
  const { setNodeRef, isOver } = useDroppable({ id: ROOT_ZONE_ID })
  if (!show) return null
  return (
    <div
      ref={setNodeRef}
      className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border border-dashed text-xs font-medium transition-all duration-150 ${
        isOver
          ? 'border-brand-400 bg-brand-50 text-brand-700 ring-2 ring-brand-400/20'
          : 'border-slate-300 bg-transparent text-slate-400'
      }`}
    >
      <div className={`w-full h-px rounded-full transition-colors ${isOver ? 'bg-brand-400' : 'bg-slate-300'}`} />
      <span className="whitespace-nowrap shrink-0">Remove from collection</span>
      <div className={`w-full h-px rounded-full transition-colors ${isOver ? 'bg-brand-400' : 'bg-slate-300'}`} />
    </div>
  )
}

/* ─────────────────────────────────────────
   Collection sortable container
───────────────────────────────────────── */
function SortableCollectionContainer({
  header,
  groupLinks,
  allLinks,
  selectedLinkId,
  isDragActive,
  onUpdateLink,
  onRemoveLink,
  onRemoveCollection,
  onToggleVisibility,
  onTogglePin,
  onOpenAddModal,
  setSelectedLinkId,
}: {
  header: LinkItem
  groupLinks: LinkItem[]
  allLinks: LinkItem[]
  selectedLinkId: string | null
  isDragActive: boolean
  onUpdateLink: (l: LinkItem) => void
  onRemoveLink: (id: string) => void
  onRemoveCollection: (id: string) => void
  onToggleVisibility: (id: string) => void
  onTogglePin: (l: LinkItem) => void
  onOpenAddModal: (targetGroupId?: string) => void
  setSelectedLinkId: (id: string | null) => void
}) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [showLayoutSelector, setShowLayoutSelector] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  const selectedLayout = header.collectionLayout || 'stack'

  const { attributes, listeners, setNodeRef, transform, transition, isDragging, isOver } = useSortable({
    id: header.id,
    data: { type: 'collection', header },
  })

  useEffect(() => {
    if (!menuOpen) return
    const fn = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuOpen(false)
    }
    document.addEventListener('mousedown', fn)
    return () => document.removeEventListener('mousedown', fn)
  }, [menuOpen])

  function handleUngroup() {
    groupLinks.forEach(l => onUpdateLink({ ...l, groupId: undefined }))
    onRemoveCollection(header.id)
    setMenuOpen(false)
  }

  function handleDelete() {
    if (window.confirm(`Delete "${header.groupTitle || header.text || 'collection'}" and all its links?`)) {
      groupLinks.forEach(l => onRemoveLink(l.id))
      onRemoveCollection(header.id)
    }
    setMenuOpen(false)
  }

  const isTargetedByDrag = isOver && !isDragging && isDragActive

  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
    >
      <DropLine visible={isTargetedByDrag && groupLinks.length > 0} />

      <div
        style={{ opacity: isDragging ? 0 : 1 }}
        className={`rounded-[28px] p-5 space-y-4 border transition-all duration-150 ${
          isTargetedByDrag
            ? 'bg-brand-50/70 border-brand-400 ring-2 ring-brand-400/20'
            : 'bg-[#f6f6f4] border-slate-200 hover:border-slate-300'
        }`}
      >
        {/* Header row */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 shrink-0">
            {/* Grip Handle */}
            <div
              {...attributes}
              {...listeners}
              className="cursor-grab active:cursor-grabbing text-slate-400 hover:text-slate-600 p-1 hover:bg-slate-200/50 rounded-md transition-colors flex-shrink-0 touch-none"
              title="Drag to reorder collection"
            >
              <GripVertical className="w-4 h-4" />
            </div>

            {/* Layout button */}
            <button
              type="button"
              onClick={() => setShowLayoutSelector(v => !v)}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
                showLayoutSelector
                  ? 'bg-brand-600 text-white shadow-sm ring-2 ring-brand-600/30'
                  : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 shadow-2xs'
              }`}
            >
              <Layout className="w-3.5 h-3.5" />
              <span>Layout</span>
            </button>
          </div>

          {/* Centered Title */}
          <div className="flex items-center justify-center gap-1.5 font-bold text-sm text-slate-900 min-w-0 flex-1 text-center">
            <span className="truncate">{header.groupTitle || header.text || 'Add collection title'}</span>
            <button
              type="button"
              onClick={() => {
                const t = prompt('Collection name:', header.groupTitle || header.text || '')
                if (t !== null) onUpdateLink({ ...header, groupTitle: t, text: t })
              }}
              className="text-slate-400 hover:text-brand-600 p-0.5 rounded flex-shrink-0"
            >
              <Pencil className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-1.5">
            <button onClick={() => onOpenAddModal(header.id)} className="p-1.5 text-slate-500 hover:text-brand-600 hover:bg-white rounded-full transition-colors" title="Add link">
              <Plus className="w-4 h-4" />
            </button>

            {/* 3-dot menu */}
            <div ref={menuRef} className="relative">
              <button
                onClick={() => setMenuOpen(v => !v)}
                className={`p-1.5 rounded-full transition-colors ${menuOpen ? 'bg-slate-100 text-slate-900' : 'text-slate-500 hover:text-slate-800 hover:bg-white'}`}
              >
                <MoreHorizontal className="w-4 h-4" />
              </button>
              {menuOpen && (
                <div className="absolute right-0 top-full mt-1.5 w-44 bg-white rounded-2xl shadow-xl border border-slate-100 py-1.5 z-50 overflow-hidden">
                  <button onClick={handleUngroup} className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors text-left">
                    <Ungroup className="w-4 h-4 text-slate-500 flex-shrink-0" />
                    <span>Ungroup</span>
                  </button>
                  <div className="mx-3 border-t border-slate-100" />
                  <button onClick={handleDelete} className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors text-left">
                    <Trash2 className="w-4 h-4 flex-shrink-0" />
                    <span>Delete</span>
                  </button>
                </div>
              )}
            </div>

            <button
              onClick={() => onToggleVisibility(header.id)}
              className={`w-11 h-6 rounded-full transition-colors relative flex items-center px-0.5 ${header.isVisible ? 'bg-emerald-600' : 'bg-slate-300'}`}
            >
              <div className={`w-5 h-5 rounded-full bg-white shadow-sm transform transition-transform ${header.isVisible ? 'translate-x-5' : 'translate-x-0'}`} />
            </button>
          </div>
        </div>

        {/* Layout Options Selector */}
        {showLayoutSelector && (
          <div className="bg-white rounded-[24px] p-5 border border-slate-100 shadow-xs space-y-4 animate-fadeIn">
            <h4 className="text-sm font-bold text-slate-900">Display as</h4>

            {/* 4 Tile Options */}
            <div className="flex items-center gap-3">
              {LAYOUT_OPTIONS.map((opt) => {
                const isSelected = selectedLayout === opt.id
                const IconComponent = opt.SvgIcon
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => onUpdateLink({ ...header, collectionLayout: opt.id as any })}
                    className="flex flex-col items-center gap-2 text-center cursor-pointer group"
                  >
                    <div
                      className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-all ${
                        isSelected
                          ? 'border-2 border-black bg-slate-100/60 shadow-xs scale-[1.02]'
                          : 'border border-transparent bg-slate-100/80 hover:bg-slate-200/70'
                      }`}
                    >
                      <IconComponent className={`w-6 h-6 ${isSelected ? 'text-slate-900' : 'text-slate-600'}`} />
                    </div>
                    <span className={`text-xs ${isSelected ? 'text-slate-900 font-bold' : 'text-slate-500 font-semibold'}`}>
                      {opt.label}
                    </span>
                  </button>
                )
              })}
            </div>

            {/* Description Divider & Text */}
            <div className="pt-3 border-t border-slate-100">
              <p className="text-xs font-medium text-slate-500">
                {LAYOUT_OPTIONS.find(o => o.id === selectedLayout)?.description}
              </p>
            </div>
          </div>
        )}

        {/* Inner links */}
        {groupLinks.length === 0 ? (
          <div className={`text-center py-8 px-4 space-y-3 rounded-2xl border transition-all duration-150 ${
            isTargetedByDrag
              ? 'bg-brand-100/60 border-2 border-dashed border-brand-400'
              : 'border-transparent'
          }`}>
            <p className={`text-sm font-medium ${isTargetedByDrag ? 'text-brand-900 font-semibold' : 'text-slate-500'}`}>
              {isTargetedByDrag ? 'Drop link here to add into collection' : 'Add a link or drag one into this collection.'}
            </p>
            <button onClick={() => onOpenAddModal(header.id)} className="px-5 py-2 bg-white border border-slate-300 hover:border-slate-400 text-slate-800 font-semibold text-xs rounded-full transition-all">
              Add link
            </button>
          </div>
        ) : (
          <SortableContext items={groupLinks.map(l => l.id)} strategy={verticalListSortingStrategy}>
            <div className="space-y-3 w-full">
              {groupLinks.map((gLink) => {
                const realIdx = allLinks.findIndex(l => l.id === gLink.id)
                return (
                  <div key={gLink.id} className="w-full">
                    <SortableLinkCard
                      link={gLink}
                      index={realIdx}
                      isExpanded={selectedLinkId === gLink.id}
                      isDragActive={isDragActive}
                      onToggleExpand={() => setSelectedLinkId(selectedLinkId === gLink.id ? null : gLink.id)}
                      onUpdateLink={onUpdateLink}
                      onRemoveLink={onRemoveLink}
                      onToggleVisibility={onToggleVisibility}
                      onTogglePin={onTogglePin}
                    />
                  </div>
                )
              })}
            </div>
          </SortableContext>
        )}
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────
   Main LinkListEditor
───────────────────────────────────────── */
interface LinkListEditorProps {
  links: LinkItem[]
  socialLinks?: Record<string, string>
  socialIconPosition?: 'top' | 'bottom'
  profile?: { avatar: string; title: string; bio: string; handle?: string }
  selectedLinkId: string | null
  setSelectedLinkId: (id: string | null) => void
  onOpenAddModal: (targetGroupId?: string) => void
  onAddCollection?: () => void
  onUpdateLink: (updatedLink: LinkItem) => void
  onRemoveLink: (id: string) => void
  onToggleVisibility: (id: string) => void
  onReorderLinks: (fromIndex: number, toIndex: number) => void
  onSetLinks?: (links: LinkItem[]) => void
  onUpdateSocialLink?: (platformId: string, url: string) => void
  onRemoveSocialLink?: (platformId: string) => void
  onUpdateSocialPosition?: (position: 'top' | 'bottom') => void
  onUpdateProfile?: (field: 'title' | 'bio' | 'avatar', value: string) => void
}

export default function LinkListEditor({
  links,
  socialLinks,
  socialIconPosition = 'top',
  profile,
  selectedLinkId,
  setSelectedLinkId,
  onOpenAddModal,
  onAddCollection,
  onUpdateLink,
  onRemoveLink,
  onToggleVisibility,
  onReorderLinks,
  onSetLinks,
  onUpdateSocialLink,
  onRemoveSocialLink,
  onUpdateSocialPosition,
  onUpdateProfile,
}: LinkListEditorProps) {
  const [filterQuery, setFilterQuery] = useState('')
  const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null)
  const [activeSocialModal, setActiveSocialModal] = useState<SocialPlatformSpec | null>(null)
  const [isSocialManagementOpen, setIsSocialManagementOpen] = useState(false)
  const [isAddSocialSearchOpen, setIsAddSocialSearchOpen] = useState(false)
  const [isEditingTitle, setIsEditingTitle] = useState(false)
  const [isEditingBio, setIsEditingBio] = useState(false)

  const handleAddSocialLink = (url: string, platformId: string) => {
    if (onUpdateSocialLink) {
      onUpdateSocialLink(platformId, url)
    }
  }

  const activeSocialList: { platform: string; url: string }[] = []
  if (socialLinks) {
    Object.entries(socialLinks).forEach(([platform, url]) => {
      if (url && url.trim()) {
        activeSocialList.push({ platform: platform.toLowerCase(), url: url.trim() })
      }
    })
  }

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  )

  const activeItem = activeId ? (links.find(l => l.id === activeId) ?? null) : null
  const showRootZone = !!(activeItem && activeItem.groupId && !activeItem.isGroupHeader)

  const standardLinks = links

  const filteredLinks = filterQuery.trim()
    ? standardLinks.filter(l =>
        l.text.toLowerCase().includes(filterQuery.toLowerCase()) ||
        l.type.toLowerCase().includes(filterQuery.toLowerCase()) ||
        (l.url && l.url.toLowerCase().includes(filterQuery.toLowerCase()))
      )
    : standardLinks

  const topLevelIds = filteredLinks
    .filter(l => l.isGroupHeader || !l.groupId)
    .map(l => l.id)

  function handleDragStart({ active }: DragStartEvent) {
    setActiveId(active.id)
  }

  function handleDragOver({ active, over }: DragOverEvent) {
    if (!over) return
    if (over.id === ROOT_ZONE_ID) {
      const activeLink = links.find(l => l.id === active.id)
      if (activeLink?.groupId && !activeLink.isGroupHeader) {
        onUpdateLink({ ...activeLink, groupId: undefined })
      }
    }
  }

  function handleDragEnd({ active, over }: DragEndEvent) {
    setActiveId(null)
    if (!over) return

    const fromIndex = links.findIndex(l => l.id === active.id)
    if (fromIndex === -1) return

    const activeLink = links[fromIndex]
    let newLinks = [...links]
    let updatedActiveLink = { ...activeLink }
    let hasChanged = false

    if (over.id === ROOT_ZONE_ID) {
      if (activeLink.groupId && !activeLink.isGroupHeader) {
        updatedActiveLink.groupId = undefined
        hasChanged = true
      }
    } else if (active.id !== over.id) {
      const overIndex = links.findIndex(l => l.id === over.id)
      if (overIndex !== -1) {
        const overLink = links[overIndex]

        if (!activeLink.isGroupHeader) {
          if (overLink.isGroupHeader) {
            // Dropped onto collection header -> join collection
            if (activeLink.groupId !== overLink.id) {
              updatedActiveLink.groupId = overLink.id
              hasChanged = true
            }
          } else if (overLink.groupId) {
            // Dropped onto a link inside collection -> join that collection
            if (activeLink.groupId !== overLink.groupId) {
              updatedActiveLink.groupId = overLink.groupId
              hasChanged = true
            }
          } else if (activeLink.groupId) {
            // Dropped onto a standalone link -> become standalone
            updatedActiveLink.groupId = undefined
            hasChanged = true
          }
        }
      }
    }

    newLinks[fromIndex] = updatedActiveLink

    if (over.id !== ROOT_ZONE_ID && active.id !== over.id) {
      const toIndex = links.findIndex(l => l.id === over.id)
      if (toIndex !== -1 && fromIndex !== toIndex) {
        const [moved] = newLinks.splice(fromIndex, 1)
        newLinks.splice(toIndex, 0, moved)
        hasChanged = true
      }
    }

    if (hasChanged) {
      if (onSetLinks) {
        onSetLinks(newLinks)
      } else {
        onUpdateLink(updatedActiveLink)
        if (over.id !== ROOT_ZONE_ID && active.id !== over.id) {
          const toIndex = links.findIndex(l => l.id === over.id)
          if (toIndex !== -1 && fromIndex !== toIndex) {
            onReorderLinks(fromIndex, toIndex)
          }
        }
      }
    }
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={customCollisionDetection}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
      onDragCancel={() => setActiveId(null)}
    >
      <div className="space-y-5">
        {/* ── Linktree Top Profile Header & Social Icons (Exact Screenshot 2 & 3 Match) ── */}
        <div className="flex items-center gap-4 py-3 px-1 border-b border-slate-100/80 mb-2">
          {/* Avatar Circle (Click to upload avatar) */}
          <div className="relative w-16 h-16 rounded-full bg-slate-200 border border-slate-300 flex items-center justify-center overflow-hidden flex-shrink-0 shadow-2xs group cursor-pointer">
            {profile?.avatar ? (
              <img src={profile.avatar} alt="Avatar" className="w-full h-full object-cover" />
            ) : (
              <User size={36} className="text-slate-400" />
            )}
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
              <Pencil size={14} />
            </div>
            <input
              type="file"
              accept="image/*"
              className="absolute inset-0 opacity-0 cursor-pointer"
              title="Click to upload profile picture"
              onChange={(e) => {
                const file = e.target.files?.[0]
                if (file && onUpdateProfile) {
                  const reader = new FileReader()
                  reader.onload = (ev) => {
                    if (ev.target?.result) onUpdateProfile('avatar', ev.target.result as string)
                  }
                  reader.readAsDataURL(file)
                }
              }}
            />
          </div>

          <div className="space-y-0.5 flex-1 min-w-0">
            {/* Title (Inline Edit) */}
            {isEditingTitle ? (
              <input
                type="text"
                autoFocus
                defaultValue={profile?.title || 'satvikpatel8373'}
                onBlur={(e) => {
                  const val = e.target.value.trim()
                  if (val && onUpdateProfile) onUpdateProfile('title', val)
                  setIsEditingTitle(false)
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    const val = (e.target as HTMLInputElement).value.trim()
                    if (val && onUpdateProfile) onUpdateProfile('title', val)
                    setIsEditingTitle(false)
                  }
                }}
                className="text-base font-extrabold text-slate-900 bg-slate-100 px-2 py-0.5 rounded-lg outline-none border border-slate-300 w-full"
              />
            ) : (
              <div
                onClick={() => setIsEditingTitle(true)}
                className="group flex items-center gap-1.5 cursor-pointer hover:bg-slate-100/80 px-1 py-0.5 rounded-lg -ml-1 transition-all"
                title="Click to edit title"
              >
                <h3 className="text-base font-extrabold text-slate-900 leading-snug truncate">
                  {profile?.title || profile?.handle || 'satvikpatel8373'}
                </h3>
                <Pencil size={12} className="text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
              </div>
            )}

            {/* Bio (Inline Edit) */}
            {isEditingBio ? (
              <input
                type="text"
                autoFocus
                defaultValue={profile?.bio || ''}
                placeholder="Add bio"
                onBlur={(e) => {
                  if (onUpdateProfile) onUpdateProfile('bio', e.target.value.trim())
                  setIsEditingBio(false)
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    if (onUpdateProfile) onUpdateProfile('bio', (e.target as HTMLInputElement).value.trim())
                    setIsEditingBio(false)
                  }
                }}
                className="text-xs font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-lg outline-none border border-slate-300 w-full"
              />
            ) : (
              <div
                onClick={() => setIsEditingBio(true)}
                className="group flex items-center gap-1.5 cursor-pointer hover:bg-slate-100/80 px-1 py-0.5 rounded-lg -ml-1 transition-all"
                title="Click to edit bio"
              >
                <p className={`text-xs font-semibold ${profile?.bio ? 'text-slate-500' : 'text-slate-400 italic'}`}>
                  {profile?.bio || 'Add bio'}
                </p>
                <Pencil size={11} className="text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
              </div>
            )}

            {/* Added Social Icons Row + Small Pencil Button (Screenshot 2 & 3) */}
            <div className="flex items-center gap-2 pt-1.5 flex-wrap">
              {activeSocialList.map(({ platform }) => {
                const spec = QUICK_SOCIAL_PLATFORMS.find(p => p.id === platform)
                const IconComp = spec?.IconComponent || Globe
                return (
                  <button
                    key={platform}
                    type="button"
                    onClick={() => setIsSocialManagementOpen(true)}
                    className="w-7 h-7 rounded-full bg-slate-100 border border-slate-200/90 text-slate-800 flex items-center justify-center hover:bg-slate-200 transition-all cursor-pointer"
                    title={platform}
                  >
                    <IconComp size={14} />
                  </button>
                )
              })}

              {/* Edit Pencil Button */}
              <button
                type="button"
                onClick={() => setIsSocialManagementOpen(true)}
                className="w-7 h-7 rounded-full bg-slate-100 border border-slate-200/90 text-slate-600 flex items-center justify-center hover:bg-slate-200 hover:text-slate-900 transition-all cursor-pointer"
                title="Manage social icons"
              >
                <Pencil size={13} />
              </button>
            </div>
          </div>
        </div>

        {/* Top action bar */}
        <div className="flex items-center justify-between pt-1">
          <button
            onClick={onAddCollection}
            className="px-3.5 py-1.5 text-slate-700 font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer"
            style={{ background: '#FFFFFF', borderRadius: '12px', border: '1.5px solid rgba(148,163,184,0.35)', boxShadow: 'inset 0 1.5px 0 rgba(255,255,255,0.95), inset 0 -2px 0 rgba(148,163,184,0.10), 0 3px 0 rgba(148,163,184,0.25), 0 4px 10px -2px rgba(15,23,42,0.06)' }}
          >
            <FolderPlus className="w-3.5 h-3.5 text-brand-500" />
            <span>Add collection</span>
          </button>
          <button type="button" className="text-[11px] font-bold text-slate-400 hover:text-slate-600 flex items-center gap-1 transition-colors cursor-pointer">
            <Archive className="w-3 h-3" />
            <span>View archive</span>
            <ChevronRight className="w-3 h-3" />
          </button>
        </div>

        {/* Add Link CTA */}
        <button
          onClick={() => onOpenAddModal()}
          className="w-full py-4 clay-add-btn flex items-center justify-center gap-3 group"
        >
          <div className="w-8 h-8 rounded-2xl flex items-center justify-center transition-all"
            style={{ background: 'linear-gradient(135deg, #7C3AED, #6366F1)', boxShadow: 'inset 0 1.5px 0 rgba(255,255,255,0.25), 0 3px 0 #4F46E5, 0 5px 14px rgba(124,58,237,0.35)' }}>
            <Plus className="w-4 h-4 text-white" />
          </div>
          <span className="text-sm font-extrabold text-slate-700 tracking-tight group-hover:text-brand-700 transition-colors">Add Link or Feature</span>
        </button>

        {/* Search */}
        {links.length > 3 && (
          <div className="relative flex items-center">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 pointer-events-none" />
            <input
              type="text"
              value={filterQuery}
              onChange={e => setFilterQuery(e.target.value)}
              placeholder="Search your links..."
              className="w-full bg-white border border-slate-200 focus:border-brand-400 rounded-xl pl-9 pr-3 py-1.5 text-xs text-slate-700 outline-none transition-all"
            />
          </div>
        )}

        {/* Root drop zone */}
        <RootDropZone show={showRootZone} />

        {/* Links list */}
        <SortableContext items={topLevelIds} strategy={verticalListSortingStrategy}>
          <div className="space-y-3">
            {filteredLinks.length === 0 && (
              <div className="text-center py-14 clay-card-flat rounded-3xl flex flex-col items-center p-8">
                <div className="w-14 h-14 rounded-3xl flex items-center justify-center mx-auto mb-4"
                  style={{ background: 'linear-gradient(135deg, rgba(124,58,237,0.12), rgba(99,102,241,0.08))', border: '1.5px solid rgba(124,58,237,0.15)', boxShadow: 'inset 0 2px 0 rgba(255,255,255,0.8), 0 3px 0 rgba(124,58,237,0.12), 0 5px 16px rgba(124,58,237,0.10)' }}>
                  <Sparkles className="w-6 h-6 text-brand-500" />
                </div>
                <h3 className="text-sm font-extrabold text-slate-800 tracking-tight">No links added yet</h3>
                <p className="text-[11px] text-slate-400 mt-1.5 max-w-xs mx-auto font-medium">
                  Click "Add Link or Feature" above or create a collection.
                </p>
                <button onClick={() => onOpenAddModal()} className="mt-5 px-5 py-2.5 text-white text-xs font-extrabold tracking-tight"
                  style={{ background: 'linear-gradient(135deg, #7C3AED, #6366F1)', borderRadius: '12px', boxShadow: 'inset 0 1.5px 0 rgba(255,255,255,0.25), 0 3px 0 #4F46E5, 0 6px 16px rgba(124,58,237,0.30)' }}>
                  Add First Link
                </button>
              </div>
            )}

            {filteredLinks.map((link, index) => {
              if (link.isGroupHeader) {
                const groupLinks = links.filter(l => l.groupId === link.id && !l.isGroupHeader)
                return (
                  <SortableCollectionContainer
                    key={link.id}
                    header={link}
                    groupLinks={groupLinks}
                    allLinks={links}
                    selectedLinkId={selectedLinkId}
                    isDragActive={!!activeId}
                    onUpdateLink={onUpdateLink}
                    onRemoveLink={onRemoveLink}
                    onRemoveCollection={onRemoveLink}
                    onToggleVisibility={onToggleVisibility}
                    onTogglePin={l => onUpdateLink({ ...l, isPinned: !l.isPinned })}
                    onOpenAddModal={onOpenAddModal}
                    setSelectedLinkId={setSelectedLinkId}
                  />
                )
              }

              if (link.groupId && !link.isGroupHeader) return null

              return (
                <SortableLinkCard
                  key={link.id}
                  link={link}
                  index={index}
                  isExpanded={selectedLinkId === link.id}
                  isDragActive={!!activeId}
                  onToggleExpand={() => setSelectedLinkId(selectedLinkId === link.id ? null : link.id)}
                  onUpdateLink={onUpdateLink}
                  onRemoveLink={onRemoveLink}
                  onToggleVisibility={onToggleVisibility}
                  onTogglePin={l => onUpdateLink({ ...l, isPinned: !l.isPinned })}
                />
              )
            })}
          </div>
        </SortableContext>

        {/* Drag overlay */}
        <DragOverlay dropAnimation={{ duration: 150, easing: 'ease' }}>
          {activeItem && (
            <div className="shadow-xl rounded-3xl border border-brand-200 bg-white pointer-events-none" style={{ opacity: 0.9 }}>
              <LinkItemCard
                link={activeItem}
                index={0}
                isExpanded={false}
                onToggleExpand={() => {}}
                onUpdate={() => {}}
                onRemove={() => {}}
                onToggleVisibility={() => {}}
              />
            </div>
          )}
        </DragOverlay>

        {/* Footer */}
        <div className="pt-6" style={{ borderTop: '1.5px solid rgba(148,163,184,0.2)' }}>
          <div className="clay-card-flat p-4 flex items-center justify-between">
            <div className="space-y-0.5">
              <p className="text-[10px] font-extrabold tracking-widest" style={{ color: '#94A3B8' }}>LINKTREE FOOTER</p>
              <div className="flex items-center gap-1.5">
                <span className="text-sm font-extrabold text-slate-900">Linktree</span>
                <span className="text-emerald-500">✳</span>
              </div>
            </div>
            <button type="button" className="w-11 h-6 rounded-full relative flex items-center px-0.5 clay-toggle" style={{ background: 'linear-gradient(135deg, #10B981, #059669)' }}>
              <div className="w-5 h-5 rounded-full bg-white transform translate-x-5 transition-transform clay-toggle-thumb" />
            </button>
          </div>
        </div>

        {/* ── Social Icons Management Modal (Screenshot 4) ── */}
        {isSocialManagementOpen && (
          <SocialIconsManagementModal
            onClose={() => setIsSocialManagementOpen(false)}
            activeSocialList={activeSocialList}
            socialIconPosition={socialIconPosition}
            onUpdateSocialLink={onUpdateSocialLink}
            onRemoveSocialLink={onRemoveSocialLink}
            onRemoveLink={onRemoveLink}
            onUpdateSocialPosition={onUpdateSocialPosition}
            onOpenAddModal={() => {
              setIsSocialManagementOpen(false)
              setIsAddSocialSearchOpen(true)
            }}
          />
        )}

        {/* ── Add Social Icon Search Modal (Screenshot 1) ── */}
        {isAddSocialSearchOpen && (
          <AddSocialIconSearchModal
            onClose={() => setIsAddSocialSearchOpen(false)}
            onBack={() => {
              setIsAddSocialSearchOpen(false)
              setIsSocialManagementOpen(true)
            }}
            onSelectPlatform={(platform) => {
              setIsAddSocialSearchOpen(false)
              setActiveSocialModal(platform)
            }}
          />
        )}

        {/* ── Add Social Icon Modal (Handle Input) ── */}
        {activeSocialModal && (
          <AddSocialIconModal
            platform={activeSocialModal}
            onClose={() => setActiveSocialModal(null)}
            onBack={() => {
              setActiveSocialModal(null)
              setIsAddSocialSearchOpen(true)
            }}
            onAdd={(url, platformId) => {
              handleAddSocialLink(url, platformId)
              setActiveSocialModal(null)
              setIsSocialManagementOpen(true)
            }}
          />
        )}
      </div>
    </DndContext>
  )
}
