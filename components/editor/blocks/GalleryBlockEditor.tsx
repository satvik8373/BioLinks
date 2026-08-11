import React, { useState, useSyncExternalStore } from 'react'
import { createPortal } from 'react-dom'
import { Plus, X, Pencil, Trash2, GripVertical, Image as ImageIcon } from 'lucide-react'
import { LinkItem } from '@/lib/types/link'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import MediaLibraryModal from '@/components/modals/MediaLibraryModal'

const emptySubscribe = () => () => {}
const getClientBody = () => (typeof document !== 'undefined' ? document.body : null)
const getServerBody = () => null

interface Props {
  link: LinkItem
  onUpdate: (updated: LinkItem) => void
}

interface GalleryImage {
  id: string
  url: string
  title?: string
  description?: string
}

export default function GalleryBlockEditor({ link, onUpdate }: Props) {
  const gallery = (link.galleryPhotos || []) as GalleryImage[]
  const [editingId, setEditingId] = useState<string | null>(null)
  const [showAddModal, setShowAddModal] = useState(false)

  const handleAdd = (url: string, caption: string) => {
    const newImage: GalleryImage = { id: Date.now().toString(), url, title: caption, description: caption }
    onUpdate({ ...link, galleryPhotos: [...gallery, newImage] })
    setShowAddModal(false)
  }

  const handleUpdate = (id: string, caption: string) => {
    const updated = gallery.map(img => (img.id === id ? { ...img, title: caption, description: caption } : img))
    onUpdate({ ...link, galleryPhotos: updated })
    setEditingId(null)
  }

  const handleRemove = (id: string) => {
    onUpdate({ ...link, galleryPhotos: gallery.filter(img => img.id !== id) })
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-slate-900">Gallery Photos</h3>
        <Button
          type="button"
          variant="primary"
          size="xs"
          shape="pill"
          onClick={() => setShowAddModal(true)}
        >
          <Plus className="w-3.5 h-3.5 stroke-[3]" /> Add Photo
        </Button>
      </div>

      {gallery.length === 0 ? (
        <div className="text-center py-8 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
          <p className="text-xs font-semibold text-slate-500">No photos added yet</p>
          <Button
            type="button"
            variant="secondary"
            size="xs"
            shape="pill"
            onClick={() => setShowAddModal(true)}
            className="mt-3"
          >
            <Plus className="w-3.5 h-3.5" /> Add First Photo
          </Button>
        </div>
      ) : (
        <div className="space-y-2">
          {gallery.map((img) => (
            <div key={img.id} className="flex items-center gap-3 p-3 bg-slate-50 border border-slate-200 rounded-xl">
              <div className="w-16 h-16 rounded-lg bg-slate-200 overflow-hidden flex-shrink-0 shadow-sm">
                <img src={img.url} alt="" className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                {editingId === img.id ? (
                  <Input
                    type="text"
                    defaultValue={img.title || img.description || ''}
                    placeholder="Caption (optional)"
                    onBlur={(e) => handleUpdate(img.id, e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleUpdate(img.id, (e.target as HTMLInputElement).value)
                    }}
                    autoFocus
                  />
                ) : (
                  <p className="text-xs font-semibold text-slate-700 truncate">
                    {img.title || img.description || 'No caption'}
                  </p>
                )}
              </div>
              <div className="flex items-center gap-1 flex-shrink-0">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => setEditingId(img.id)}
                  title="Edit caption"
                >
                  <Pencil className="w-3.5 h-3.5" />
                </Button>
                <Button
                  type="button"
                  variant="danger"
                  size="icon"
                  onClick={() => handleRemove(img.id)}
                  title="Delete photo"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showAddModal && (
        <AddPhotoModal
          onClose={() => setShowAddModal(false)}
          onAdd={handleAdd}
        />
      )}
    </div>
  )
}

function AddPhotoModal({
  onClose,
  onAdd,
}: {
  onClose: () => void
  onAdd: (url: string, caption: string) => void
}) {
  const portalContainer = useSyncExternalStore(emptySubscribe, getClientBody, getServerBody)
  const [url, setUrl] = useState('')
  const [caption, setCaption] = useState('')
  const [showMediaLibrary, setShowMediaLibrary] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!url.trim()) return
    onAdd(url.trim(), caption.trim())
    onClose()
  }

  if (!portalContainer) return null

  return createPortal(
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-slate-100">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-slate-900">Add Photo to Gallery</h3>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Photo Source</label>
            <div className="flex gap-2">
              <input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://images.unsplash.com/..."
                className="flex-1 px-3 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900"
              />
              <button
                type="button"
                onClick={() => setShowMediaLibrary(true)}
                className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors shrink-0"
              >
                <ImageIcon className="w-4 h-4" />
                Library
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Caption (Optional)</label>
            <input
              type="text"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="Summer trip photo..."
              className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!url.trim()}
              className="px-4 py-2 text-xs font-semibold bg-slate-900 text-white hover:bg-slate-800 rounded-xl transition-colors disabled:opacity-50"
            >
              Add Photo
            </button>
          </div>
        </form>
      </div>

      {showMediaLibrary && (
        <MediaLibraryModal
          onClose={() => setShowMediaLibrary(false)}
          onSelectImage={(selectedUrl) => {
            setUrl(selectedUrl)
            setShowMediaLibrary(false)
          }}
          title="Select Photo for Gallery"
        />
      )}
    </div>,
    portalContainer
  )
}
