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
  Trash2, Ungroup, GripVertical,
} from 'lucide-react'
import { LinkItem } from '@/lib/types/link'
import LinkItemCard from './LinkItemCard'

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
        visible ? 'bg-violet-500 opacity-100 mb-2' : 'opacity-0 mb-0 h-0'
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
          ? 'border-purple-400 bg-purple-50 text-purple-700 ring-2 ring-purple-400/20'
          : 'border-gray-300 bg-transparent text-gray-400'
      }`}
    >
      <div className={`w-full h-px rounded-full transition-colors ${isOver ? 'bg-purple-400' : 'bg-gray-300'}`} />
      <span className="whitespace-nowrap shrink-0">Remove from collection</span>
      <div className={`w-full h-px rounded-full transition-colors ${isOver ? 'bg-purple-400' : 'bg-gray-300'}`} />
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
            ? 'bg-purple-50/70 border-purple-400 ring-2 ring-purple-400/20'
            : 'bg-[#f6f6f4] border-gray-200 hover:border-gray-300'
        }`}
      >
        {/* Header row */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 shrink-0">
            {/* Grip Handle */}
            <div
              {...attributes}
              {...listeners}
              className="cursor-grab active:cursor-grabbing text-gray-400 hover:text-gray-600 p-1 hover:bg-gray-200/50 rounded-md transition-colors flex-shrink-0 touch-none"
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
                  ? 'bg-purple-600 text-white shadow-sm ring-2 ring-purple-600/30'
                  : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 shadow-2xs'
              }`}
            >
              <Layout className="w-3.5 h-3.5" />
              <span>Layout</span>
            </button>
          </div>

          {/* Centered Title */}
          <div className="flex items-center justify-center gap-1.5 font-bold text-sm text-gray-900 min-w-0 flex-1 text-center">
            <span className="truncate">{header.groupTitle || header.text || 'Add collection title'}</span>
            <button
              type="button"
              onClick={() => {
                const t = prompt('Collection name:', header.groupTitle || header.text || '')
                if (t !== null) onUpdateLink({ ...header, groupTitle: t, text: t })
              }}
              className="text-gray-400 hover:text-purple-600 p-0.5 rounded flex-shrink-0"
            >
              <Pencil className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-1.5">
            <button onClick={() => onOpenAddModal(header.id)} className="p-1.5 text-gray-500 hover:text-purple-600 hover:bg-white rounded-full transition-colors" title="Add link">
              <Plus className="w-4 h-4" />
            </button>

            {/* 3-dot menu */}
            <div ref={menuRef} className="relative">
              <button
                onClick={() => setMenuOpen(v => !v)}
                className={`p-1.5 rounded-full transition-colors ${menuOpen ? 'bg-gray-100 text-gray-900' : 'text-gray-500 hover:text-gray-800 hover:bg-white'}`}
              >
                <MoreHorizontal className="w-4 h-4" />
              </button>
              {menuOpen && (
                <div className="absolute right-0 top-full mt-1.5 w-44 bg-white rounded-2xl shadow-xl border border-gray-100 py-1.5 z-50 overflow-hidden">
                  <button onClick={handleUngroup} className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors text-left">
                    <Ungroup className="w-4 h-4 text-gray-500 flex-shrink-0" />
                    <span>Ungroup</span>
                  </button>
                  <div className="mx-3 border-t border-gray-100" />
                  <button onClick={handleDelete} className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors text-left">
                    <Trash2 className="w-4 h-4 flex-shrink-0" />
                    <span>Delete</span>
                  </button>
                </div>
              )}
            </div>

            <button
              onClick={() => onToggleVisibility(header.id)}
              className={`w-11 h-6 rounded-full transition-colors relative flex items-center px-0.5 ${header.isVisible ? 'bg-emerald-600' : 'bg-gray-300'}`}
            >
              <div className={`w-5 h-5 rounded-full bg-white shadow-sm transform transition-transform ${header.isVisible ? 'translate-x-5' : 'translate-x-0'}`} />
            </button>
          </div>
        </div>

        {/* Layout Options Selector */}
        {showLayoutSelector && (
          <div className="bg-white rounded-[24px] p-5 border border-gray-100 shadow-xs space-y-4 animate-fadeIn">
            <h4 className="text-sm font-bold text-gray-900">Display as</h4>

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
                          ? 'border-2 border-black bg-gray-100/60 shadow-xs scale-[1.02]'
                          : 'border border-transparent bg-gray-100/80 hover:bg-gray-200/70'
                      }`}
                    >
                      <IconComponent className={`w-6 h-6 ${isSelected ? 'text-gray-900' : 'text-gray-600'}`} />
                    </div>
                    <span className={`text-xs ${isSelected ? 'text-gray-900 font-bold' : 'text-gray-500 font-semibold'}`}>
                      {opt.label}
                    </span>
                  </button>
                )
              })}
            </div>

            {/* Description Divider & Text */}
            <div className="pt-3 border-t border-gray-100">
              <p className="text-xs font-medium text-gray-500">
                {LAYOUT_OPTIONS.find(o => o.id === selectedLayout)?.description}
              </p>
            </div>
          </div>
        )}

        {/* Inner links */}
        {groupLinks.length === 0 ? (
          <div className={`text-center py-8 px-4 space-y-3 rounded-2xl border transition-all duration-150 ${
            isTargetedByDrag
              ? 'bg-purple-100/60 border-2 border-dashed border-purple-400'
              : 'border-transparent'
          }`}>
            <p className={`text-sm font-medium ${isTargetedByDrag ? 'text-purple-900 font-semibold' : 'text-gray-500'}`}>
              {isTargetedByDrag ? 'Drop link here to add into collection' : 'Add a link or drag one into this collection.'}
            </p>
            <button onClick={() => onOpenAddModal(header.id)} className="px-5 py-2 bg-white border border-gray-300 hover:border-gray-400 text-gray-800 font-semibold text-xs rounded-full transition-all">
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
  selectedLinkId: string | null
  setSelectedLinkId: (id: string | null) => void
  onOpenAddModal: (targetGroupId?: string) => void
  onAddCollection?: () => void
  onUpdateLink: (updatedLink: LinkItem) => void
  onRemoveLink: (id: string) => void
  onToggleVisibility: (id: string) => void
  onReorderLinks: (fromIndex: number, toIndex: number) => void
  onSetLinks?: (links: LinkItem[]) => void
}

export default function LinkListEditor({
  links,
  selectedLinkId,
  setSelectedLinkId,
  onOpenAddModal,
  onAddCollection,
  onUpdateLink,
  onRemoveLink,
  onToggleVisibility,
  onReorderLinks,
  onSetLinks,
}: LinkListEditorProps) {
  const [filterQuery, setFilterQuery] = useState('')
  const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null)

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  )

  const activeItem = activeId ? (links.find(l => l.id === activeId) ?? null) : null
  const showRootZone = !!(activeItem && activeItem.groupId && !activeItem.isGroupHeader)

  const filteredLinks = filterQuery.trim()
    ? links.filter(l =>
        l.text.toLowerCase().includes(filterQuery.toLowerCase()) ||
        l.type.toLowerCase().includes(filterQuery.toLowerCase()) ||
        (l.url && l.url.toLowerCase().includes(filterQuery.toLowerCase()))
      )
    : links

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
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">Links & Content</h2>
            <p className="text-[11px] text-slate-400 mt-0.5 font-medium">Add, customize and arrange features on your bio page</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-extrabold px-2.5 py-1.5 rounded-xl"
              style={{ background: 'linear-gradient(135deg, rgba(124,58,237,0.10), rgba(99,102,241,0.08))', color: '#7C3AED', border: '1.5px solid rgba(124,58,237,0.15)', boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.8), 0 2px 0 rgba(124,58,237,0.10)' }}>
              {links.filter(l => l.isVisible).length} Active
            </span>
            {selectedLinkId && (
              <button onClick={() => setSelectedLinkId(null)} className="text-[11px] font-bold text-slate-400 hover:text-slate-700 underline">
                Collapse
              </button>
            )}
          </div>
        </div>

        {/* Top action bar */}
        <div className="flex items-center justify-between pt-1">
          <button
            onClick={onAddCollection}
            className="px-3.5 py-1.5 text-slate-700 font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer"
            style={{ background: '#FFFFFF', borderRadius: '12px', border: '1.5px solid rgba(148,163,184,0.35)', boxShadow: 'inset 0 1.5px 0 rgba(255,255,255,0.95), inset 0 -2px 0 rgba(148,163,184,0.10), 0 3px 0 rgba(148,163,184,0.25), 0 4px 10px -2px rgba(15,23,42,0.06)' }}
          >
            <FolderPlus className="w-3.5 h-3.5 text-violet-500" />
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
          <span className="text-sm font-extrabold text-slate-700 tracking-tight group-hover:text-violet-700 transition-colors">Add Link or Feature</span>
        </button>

        {/* Search */}
        {links.length > 3 && (
          <div className="relative flex items-center">
            <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 pointer-events-none" />
            <input
              type="text"
              value={filterQuery}
              onChange={e => setFilterQuery(e.target.value)}
              placeholder="Search your links..."
              className="w-full bg-white border border-gray-200 focus:border-purple-400 rounded-xl pl-9 pr-3 py-1.5 text-xs text-gray-700 outline-none transition-all"
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
                  <Sparkles className="w-6 h-6 text-violet-500" />
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
            <div className="shadow-xl rounded-3xl border border-violet-200 bg-white pointer-events-none" style={{ opacity: 0.9 }}>
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
      </div>
    </DndContext>
  )
}
