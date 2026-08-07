'use client'

import React from 'react'

interface BlockEditorContainerProps {
  title?: string
  description?: string
  actionLink?: {
    text: string
    href?: string
    onClick?: () => void
  }
  children: React.ReactNode
}

/**
 * Standard Reusable LinkItem Block Container
 * Matches official Linktree YouTube / Video block layout styling.
 */
export function BlockEditorContainer({
  title,
  description,
  actionLink,
  children,
}: BlockEditorContainerProps) {
  return (
    <div className="w-full font-sans space-y-4 text-gray-900 text-left pt-1">
      {/* Standard Section Header */}
      {(title || description) && (
        <div className="space-y-1">
          {title && <h3 className="text-sm font-bold text-gray-900">{title}</h3>}
          {description && (
            <p className="text-xs text-gray-500 font-medium leading-relaxed">{description}</p>
          )}
          {actionLink && (
            <a
              href={actionLink.href || '#'}
              onClick={(e) => {
                if (actionLink.onClick) {
                  e.preventDefault()
                  actionLink.onClick()
                }
              }}
              className="text-xs font-bold text-purple-600 hover:underline inline-block mt-0.5"
            >
              {actionLink.text}
            </a>
          )}
        </div>
      )}

      {/* Main Content Body */}
      {children}
    </div>
  )
}

interface BlockRadioOptionProps {
  selected: boolean
  onClick: () => void
  title: string
  subtitle?: string
  name?: string
}

/**
 * Standard Reusable Block Radio Choice matching YouTube block native style
 */
export function BlockRadioOption({
  selected,
  onClick,
  title,
  subtitle,
  name,
}: BlockRadioOptionProps) {
  return (
    <label
      onClick={onClick}
      className="flex items-center gap-3 cursor-pointer group py-1 select-none"
    >
      <input
        type="radio"
        name={name}
        checked={selected}
        onChange={onClick}
        className="w-5 h-5 text-black border-2 border-gray-300 focus:ring-black accent-black cursor-pointer"
      />
      <div className="flex-1 min-w-0">
        <span className={`text-sm ${selected ? 'font-bold text-gray-900' : 'font-medium text-gray-700'}`}>
          {title}
        </span>
        {subtitle && <p className="text-xs text-gray-400 font-medium mt-0.5">{subtitle}</p>}
      </div>
    </label>
  )
}
