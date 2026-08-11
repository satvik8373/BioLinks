'use client'

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'

export default function CustomCursor() {
  const pathname = usePathname()
  const [position, setPosition] = useState({ x: -100, y: -100 })
  const [isClicking, setIsClicking] = useState(false)
  const [isHovered, setIsHovered] = useState(false)

  // Disable custom cursor on editor, live profiles, or card view pages so normal system cursor is restored
  const isEditorOrProfile = 
    pathname?.startsWith('/editor') ||
    pathname?.startsWith('/card/') ||
    pathname?.startsWith('/r/') ||
    (pathname?.match(/^\/[a-z0-9-]+$/i) && pathname !== '/' && pathname !== '/login' && pathname !== '/signup' && pathname !== '/create' && pathname !== '/my-cards')

  useEffect(() => {
    if (isEditorOrProfile) {
      document.body.classList.remove('has-custom-cursor')
      return
    }

    // Hide native cursor across document for landing/marketing pages
    document.body.classList.add('has-custom-cursor')

    const onMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY })

      const target = e.target as HTMLElement | null
      if (target) {
        const isClickable =
          target.tagName === 'BUTTON' ||
          target.tagName === 'A' ||
          target.tagName === 'INPUT' ||
          target.closest('button') ||
          target.closest('a') ||
          target.getAttribute('role') === 'button'

        setIsHovered(Boolean(isClickable))
      }
    }

    const onMouseDown = () => setIsClicking(true)
    const onMouseUp = () => setIsClicking(false)

    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('mousedown', onMouseDown)
    window.addEventListener('mouseup', onMouseUp)

    return () => {
      document.body.classList.remove('has-custom-cursor')
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('mousedown', onMouseDown)
      window.removeEventListener('mouseup', onMouseUp)
    }
  }, [isEditorOrProfile])

  if (isEditorOrProfile || position.x < 0) return null

  return (
    <div
      className="fixed top-0 left-0 pointer-events-none z-[99999] transition-transform duration-75 ease-out"
      style={{
        transform: `translate3d(${position.x}px, ${position.y}px, 0) scale(${
          isClicking ? 0.9 : isHovered ? 1.1 : 1
        })`,
        transformOrigin: 'top left',
      }}
    >
      {/* Crisp Compact Pointer Arrow SVG */}
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="drop-shadow-md"
      >
        <path
          d="M2 2V18.5L6.8 13.8L10.5 21L13.5 19.5L9.8 12.3H16L2 2Z"
          fill="#FFFFFF"
          stroke="#000000"
          strokeWidth="2"
          strokeLinejoin="bevel"
        />
      </svg>
    </div>
  )
}
