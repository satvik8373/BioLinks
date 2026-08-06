'use client'

import React, { useState, useRef, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { LinkItem } from '@/lib/types/link'
import {
  Image as ImageIcon, Upload, Trash2, ArrowUp, ArrowDown,
  Loader2, CheckCircle2, AlertCircle, GripVertical, Pencil, X, Plus, ChevronLeft
} from 'lucide-react'
import {
  uploadToCloudinary,
  deleteFromCloudinary,
  validateImageFile,
  type CloudinaryPhoto,
} from '@/lib/cloudinaryUpload'
import { useDraftStore } from '@/lib/stores/useDraftStore'

interface Props {
  link: LinkItem
  onUpdate: (updated: LinkItem) => void
}

type UploadStatus = 'idle' | 'uploading' | 'done' | 'error'

function toPhotos(raw: any[]): (CloudinaryPhoto & { description?: string; linkUrl?: string; disabled?: boolean })[] {
  if (!Array.isArray(raw)) return []
  return raw.filter(Boolean).map(p => ({
    id:          String(p.id          ?? Date.now()),
    public_id:   String(p.public_id   ?? ''),
    url:         String(p.url         ?? ''),
    title:       String(p.title       ?? ''),
    description: String(p.description ?? ''),
    linkUrl:     String(p.linkUrl     ?? ''),
    disabled:    Boolean(p.disabled   ?? false),
    hash:        String(p.hash        ?? ''),
  }))
}

export default function GalleryBlockEditor({ link, onUpdate }: Props) {
  const [photos, setPhotos] = useState(() => toPhotos(link.galleryPhotos || []))

  // Re-sync when a different gallery block is selected
  const prevLinkId = useRef(link.id)
  useEffect(() => {
    if (link.id !== prevLinkId.current) {
      prevLinkId.current = link.id
      setPhotos(toPhotos(link.galleryPhotos || []))
    }
  }, [link.id, link.galleryPhotos])

  const [deleting, setDeleting] = useState<string | null>(null)

  // Modal State for Add / Edit Photo
  const [editingPhotoIndex, setEditingPhotoIndex] = useState<number | null>(null)
  const [isAddModalOpen, setIsAddModalOpen]       = useState(false)
  const [modalTitle, setModalTitle]               = useState('')
  const [modalDescription, setModalDescription]   = useState('')
  const [modalUrl, setModalUrl]                   = useState('')
  const [modalPhotoUrl, setModalPhotoUrl]         = useState('')
  const [modalPhotoPublicId, setModalPhotoPublicId] = useState('')
  const [modalUploading, setModalUploading]       = useState(false)

  const fileInputRef = useRef<HTMLInputElement>(null)

  // Commit updates atomically
  function commit(nextPhotos: typeof photos, extraFields?: Partial<LinkItem>) {
    setPhotos(nextPhotos)
    const first = nextPhotos.find(p => p.url)
    onUpdate({
      ...link,
      ...extraFields,
      galleryPhotos: nextPhotos as any,
      thumbnail: first?.url || link.thumbnail || '',
    })
    useDraftStore.getState().saveDraftNow()
  }

  // ── Open Add Photo Modal ───────────────────────────────────────────────────
  function openAddModal() {
    setEditingPhotoIndex(null)
    setModalTitle('')
    setModalDescription('')
    setModalUrl('')
    setModalPhotoUrl('')
    setModalPhotoPublicId('')
    setIsAddModalOpen(true)
  }

  // ── Open Edit Photo Modal ──────────────────────────────────────────────────
  function openEditModal(index: number) {
    const target = photos[index]
    if (!target) return
    setEditingPhotoIndex(index)
    setModalTitle(target.title || '')
    setModalDescription(target.description || '')
    setModalUrl(target.linkUrl || '')
    setModalPhotoUrl(target.url || '')
    setModalPhotoPublicId(target.public_id || '')
    setIsAddModalOpen(true)
  }

  // ── Handle Modal File Upload ────────────────────────────────────────────────
  async function handleModalFileUpload(file: File) {
    const invalid = validateImageFile(file)
    if (invalid) {
      alert(invalid)
      return
    }

    setModalUploading(true)
    try {
      const { photo } = await uploadToCloudinary(file, 'Biolinks', photos)
      setModalPhotoUrl(photo.url)
      setModalPhotoPublicId(photo.public_id)
      if (!modalTitle) {
        setModalTitle(file.name.replace(/\.[^/.]+$/, ''))
      }
    } catch (err: any) {
      alert('Failed to upload image: ' + err.message)
    } finally {
      setModalUploading(false)
    }
  }

  // ── Save Modal Photo ───────────────────────────────────────────────────────
  function handleSaveModalPhoto() {
    if (!modalPhotoUrl) {
      alert('Please upload an image first.')
      return
    }

    if (editingPhotoIndex !== null) {
      // Update existing photo
      const next = photos.map((p, i) =>
        i === editingPhotoIndex
          ? {
              ...p,
              url: modalPhotoUrl,
              public_id: modalPhotoPublicId || p.public_id,
              title: modalTitle,
              description: modalDescription,
              linkUrl: modalUrl,
            }
          : p
      )
      commit(next)
    } else {
      // Add new photo
      const newPhoto = {
        id: String(Date.now()),
        public_id: modalPhotoPublicId,
        url: modalPhotoUrl,
        title: modalTitle,
        description: modalDescription,
        linkUrl: modalUrl,
        disabled: false,
        hash: '',
      }
      commit([...photos, newPhoto])
    }

    setIsAddModalOpen(false)
  }

  // ── Toggle Photo Enabled/Disabled ──────────────────────────────────────────
  function handleTogglePhotoVisibility(index: number) {
    const next = photos.map((p, i) =>
      i === index ? { ...p, disabled: !p.disabled } : p
    )
    commit(next)
  }

  // ── Delete Photo ───────────────────────────────────────────────────────────
  async function handleRemovePhoto(index: number) {
    const photo = photos[index]
    setDeleting(photo.id)
    if (photo.public_id) {
      await deleteFromCloudinary(photo.public_id).catch(e =>
        console.warn('Cloudinary delete non-fatal:', e)
      )
    }
    commit(photos.filter((_, i) => i !== index))
    setDeleting(null)
  }

  return (
    <div className="space-y-6 text-left animate-fadeIn">
      {/* SECTION 1: Image gallery Header */}
      <div className="space-y-1">
        <h4 className="text-base font-extrabold text-slate-900">Image gallery</h4>
        <p className="text-xs text-slate-500 font-medium">Showcase your photos in a beautiful gallery.</p>
      </div>

      {/* SECTION 2: Photos List & Add Button */}
      <div className="space-y-3">
        <div>
          <h5 className="text-sm font-extrabold text-slate-900">Photos</h5>
          <p className="text-xs text-slate-500 font-medium mt-0.5">Add photos and control the order of the photos</p>
        </div>

        {/* Photos Card List */}
        {photos.length > 0 && (
          <div className="space-y-2 max-h-[360px] overflow-y-auto pr-1">
            {photos.map((photo, i) => {
              const isBeingDeleted = deleting === photo.id
              const isDisabled     = Boolean(photo.disabled)
              return (
                <div
                  key={photo.id}
                  className={`flex items-center justify-between p-3 bg-white border border-slate-200/90 rounded-2xl transition-all ${
                    isDisabled ? 'opacity-50' : 'hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <GripVertical className="w-4 h-4 text-slate-300 cursor-grab flex-shrink-0" />

                    <div className="w-12 h-12 rounded-xl overflow-hidden bg-slate-100 flex-shrink-0 border border-slate-200 relative">
                      {photo.url ? (
                        <img src={photo.url} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <ImageIcon className="w-5 h-5 text-slate-400 m-auto mt-3" />
                      )}
                    </div>

                    <div className="min-w-0">
                      <h6 className="font-extrabold text-sm text-slate-900 truncate">
                        {photo.title || `Photo #${i + 1}`}
                      </h6>
                      {photo.description && (
                        <p className="text-xs text-slate-400 truncate">{photo.description}</p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0 pl-2">
                    <button
                      type="button"
                      onClick={() => openEditModal(i)}
                      className="p-1.5 text-slate-400 hover:text-slate-800 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
                      title="Edit photo details"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>

                    <button
                      type="button"
                      onClick={() => handleTogglePhotoVisibility(i)}
                      className={`w-9 h-5 rounded-full transition-colors relative flex items-center px-0.5 cursor-pointer ${
                        !isDisabled ? 'bg-emerald-600' : 'bg-slate-200'
                      }`}
                      title={!isDisabled ? 'Enabled' : 'Disabled'}
                    >
                      <div
                        className={`w-4 h-4 rounded-full bg-white shadow-xs transform transition-transform ${
                          !isDisabled ? 'translate-x-4' : 'translate-x-0'
                        }`}
                      />
                    </button>

                    <button
                      type="button"
                      onClick={() => handleRemovePhoto(i)}
                      disabled={isBeingDeleted}
                      className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors cursor-pointer"
                      title="Delete photo"
                    >
                      {isBeingDeleted ? <Loader2 className="w-4 h-4 animate-spin text-red-500" /> : <Trash2 className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* + Add another photo Button */}
        <button
          type="button"
          onClick={openAddModal}
          className="w-full py-3.5 border-2 border-slate-300 hover:border-slate-400 active:scale-[0.99] rounded-full text-slate-900 font-extrabold text-sm flex items-center justify-center gap-2 cursor-pointer transition-all bg-white shadow-2xs"
        >
          <Plus className="w-4 h-4" />
          <span>{photos.length === 0 ? 'Add photo' : 'Add another photo'}</span>
        </button>
      </div>

      {/* SECTION 3: Gallery button URL */}
      <div className="space-y-1.5 pt-2 border-t border-slate-100">
        <label className="block text-sm font-extrabold text-slate-900">Gallery button URL</label>
        <p className="text-xs text-slate-500 font-medium">This link opens when someone clicks the CTA button in your gallery.</p>
        <input
          type="text"
          value={link.galleryCtaUrl || ''}
          onChange={e => onUpdate({ ...link, galleryCtaUrl: e.target.value })}
          placeholder="https://example.com/gallery-cta"
          className="w-full bg-slate-50 border border-slate-200 focus:border-purple-500 focus:bg-white rounded-2xl px-4 py-3 text-sm text-slate-900 outline-none transition-all font-medium"
        />
      </div>

      {/* SECTION 4: Gallery button label */}
      <div className="space-y-1.5">
        <label className="block text-sm font-extrabold text-slate-900">Gallery button label</label>
        <p className="text-xs text-slate-500 font-medium">Text shown on the button inside the gallery.</p>
        <input
          type="text"
          value={link.galleryCtaLabel || ''}
          onChange={e => onUpdate({ ...link, galleryCtaLabel: e.target.value })}
          placeholder="e.g. View Full Collection"
          className="w-full bg-slate-50 border border-slate-200 focus:border-purple-500 focus:bg-white rounded-2xl px-4 py-3 text-sm text-slate-900 outline-none transition-all font-medium"
        />
      </div>

      {/* ── OFFICIAL LINKTREE "ADD PHOTO" MODAL ── */}
      {isAddModalOpen && typeof document !== 'undefined' && createPortal(
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white w-full max-w-lg rounded-[28px] p-6 space-y-5 shadow-2xl relative border border-slate-200 max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-800 rounded-full cursor-pointer"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <h3 className="font-extrabold text-base text-slate-900">
                {editingPhotoIndex !== null ? 'Edit photo' : 'Add photo'}
              </h3>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-800 rounded-full cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Image Upload Box */}
            <div className="space-y-1.5 text-left">
              <label className="block text-xs font-bold text-slate-900">Image</label>
              <p className="text-xs text-slate-500">Add a file</p>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={e => {
                  if (e.target.files?.[0]) handleModalFileUpload(e.target.files[0])
                }}
              />

              <div
                onClick={() => fileInputRef.current?.click()}
                className="w-32 h-32 rounded-2xl bg-slate-50 border-2 border-dashed border-slate-200 hover:border-purple-500 flex flex-col items-center justify-center cursor-pointer transition-all relative overflow-hidden group"
              >
                {modalPhotoUrl ? (
                  <>
                    <img src={modalPhotoUrl} alt="" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/50 text-white font-bold text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      Change
                    </div>
                  </>
                ) : modalUploading ? (
                  <div className="flex flex-col items-center gap-1.5 text-purple-600">
                    <Loader2 className="w-6 h-6 animate-spin" />
                    <span className="text-[10px] font-bold">Uploading…</span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-1 text-slate-400 group-hover:text-purple-600">
                    <Plus className="w-6 h-6" />
                    <span className="text-xs font-extrabold text-slate-700">Add</span>
                  </div>
                )}
              </div>
            </div>

            {/* Title Input Field */}
            <div className="space-y-1.5 text-left">
              <label className="block text-xs font-bold text-slate-900">Title</label>
              <input
                type="text"
                maxLength={60}
                value={modalTitle}
                onChange={e => setModalTitle(e.target.value)}
                placeholder="Sun Flower Dream"
                className="w-full bg-slate-50 border border-slate-200 focus:border-purple-500 focus:bg-white rounded-2xl px-4 py-3 text-sm text-slate-900 outline-none transition-all font-medium"
              />
              <div className="text-right text-[11px] text-slate-400 font-mono">
                {modalTitle.length}/60
              </div>
            </div>

            {/* Description Input Field */}
            <div className="space-y-1.5 text-left">
              <label className="block text-xs font-bold text-slate-900">Description</label>
              <textarea
                rows={3}
                maxLength={200}
                value={modalDescription}
                onChange={e => setModalDescription(e.target.value)}
                placeholder="Lost in the beauty of a sunflower field..."
                className="w-full bg-slate-50 border border-slate-200 focus:border-purple-500 focus:bg-white rounded-2xl px-4 py-3 text-sm text-slate-900 outline-none transition-all font-medium resize-none"
              />
              <div className="text-right text-[11px] text-slate-400 font-mono">
                {modalDescription.length}/200
              </div>
            </div>

            {/* URL Input Field */}
            <div className="space-y-1.5 text-left">
              <label className="block text-xs font-bold text-slate-900">URL</label>
              <input
                type="text"
                maxLength={500}
                value={modalUrl}
                onChange={e => setModalUrl(e.target.value)}
                placeholder="https://example.com/link"
                className="w-full bg-slate-50 border border-slate-200 focus:border-purple-500 focus:bg-white rounded-2xl px-4 py-3 text-sm text-slate-900 outline-none transition-all font-medium"
              />
              <div className="text-right text-[11px] text-slate-400 font-mono">
                {modalUrl.length}/500
              </div>
            </div>

            {/* Save Button */}
            <button
              type="button"
              onClick={handleSaveModalPhoto}
              disabled={modalUploading}
              className="w-full py-4 bg-slate-900 hover:bg-black active:scale-[0.99] text-white font-extrabold text-sm rounded-full shadow-md transition-all cursor-pointer disabled:opacity-50"
            >
              Save
            </button>
          </div>
        </div>,
        document.body
      )}
    </div>
  )
}
