'use client'

import React from 'react'
import { LinkItem } from '@/lib/types/link'
import LinkBlockEditor from './LinkBlockEditor'
import HeaderBlockEditor from './HeaderBlockEditor'
import TextBlockEditor from './TextBlockEditor'
import VideoBlockEditor from './VideoBlockEditor'
import FormBlockEditor from './FormBlockEditor'
import ContactBlockEditor from './ContactBlockEditor'
import EmbedBlockEditor from './EmbedBlockEditor'
import ShopBlockEditor from './ShopBlockEditor'
import DonationBlockEditor from './DonationBlockEditor'
import EventBlockEditor from './EventBlockEditor'

import GalleryBlockEditor from './GalleryBlockEditor'

interface BlockEditorDispatcherProps {
  link: LinkItem
  updateLink: (id: string, field: string, value: any) => void
}

export default function BlockEditorDispatcher({ link, updateLink }: BlockEditorDispatcherProps) {
  switch (link.type) {
    case 'gallery':
      return <GalleryBlockEditor link={link} onUpdate={(updated) => {
        // GalleryBlockEditor uses onUpdate (full link replacement)
        // We need to map each changed field through updateLink
        Object.keys(updated).forEach(key => {
          if (key !== 'id' && (updated as any)[key] !== (link as any)[key]) {
            updateLink(link.id, key, (updated as any)[key])
          }
        })
      }} />
    case 'header':
      return <HeaderBlockEditor link={link} updateLink={updateLink} />
    case 'text':
      return <TextBlockEditor link={link} updateLink={updateLink} />
    case 'video':
      return <VideoBlockEditor link={link} updateLink={updateLink} />
    case 'form':
      return <FormBlockEditor link={link} updateLink={updateLink} />
    case 'contact':
      return <ContactBlockEditor link={link} updateLink={updateLink} />
    case 'shop':
      return <ShopBlockEditor link={link} updateLink={updateLink} />
    case 'music':
      return <EmbedBlockEditor link={link} updateLink={updateLink} />
    case 'payment':
      return <DonationBlockEditor link={link} updateLink={updateLink} />
    case 'event':
    case 'booking':
      return <EventBlockEditor link={link} updateLink={updateLink} />
    case 'link':
    case 'social':
    default:
      return <LinkBlockEditor link={link} updateLink={updateLink} />
  }
}
