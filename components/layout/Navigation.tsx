'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import Avatar from '@/components/ui/Avatar'
import {
  Menu, X, Layout, Plus, LogOut, ChevronDown
} from 'lucide-react'

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false)
  const [userProfile, setUserProfile] = useState<any>(null)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const pathname = usePathname()
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const profile = localStorage.getItem('userProfile')
    if (profile) setUserProfile(JSON.parse(profile))
  }, [])

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setShowUserMenu(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('userProfile')
    localStorage.removeItem('onboardingCompleted')
    localStorage.removeItem('bioCards')
    setUserProfile(null)
    setShowUserMenu(false)
    window.location.href = '/'
  }

  return (
    <header className="absolute top-5 left-0 right-0 z-50 px-4 sm:px-8 pointer-events-none">
      {/* Thicker, Bigger Official Linktree Floating White Pill Capsule Navbar */}
      <nav className="mx-auto max-w-7xl bg-white text-slate-900 rounded-full px-8 sm:px-10 py-4 sm:py-5 shadow-2xl flex items-center justify-between border border-black/10 transition-all pointer-events-auto">
        
        {/* Brand Logo - Bigger Linktree Style with Asterisk */}
        <Link href="/" className="flex items-center gap-0.5 group">
          <span className="font-black text-3xl tracking-tight text-slate-900">
            BioLinks
          </span>
          <span className="font-black text-2xl text-slate-900 leading-none select-none">*</span>
        </Link>

        {/* Center Links (Thicker, Bigger Items) */}
        <div className="hidden md:flex items-center gap-9 text-sm font-extrabold text-slate-700">
          <Link href="/create" className="hover:text-black transition-colors">
            Products
          </Link>
          <Link href="/create" className="hover:text-black transition-colors">
            Templates
          </Link>
          <Link href="/create" className="hover:text-black transition-colors">
            Marketplace
          </Link>
          <Link href="/create" className="hover:text-black transition-colors">
            Learn
          </Link>
          <Link href="/create" className="hover:text-black transition-colors">
            Pricing
          </Link>
        </div>

        {/* Right Actions (Thicker, Bigger Buttons) */}
        <div className="hidden md:flex items-center gap-3.5">
          {userProfile ? (
            <div className="flex items-center gap-3" ref={menuRef}>
              <Link
                href="/editor"
                className="px-6 py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-black transition-all"
              >
                Editor
              </Link>
              <button
                onClick={handleLogout}
                className="px-7 py-3 rounded-full bg-[#1e2330] hover:bg-black text-white text-xs font-black transition-all shadow-md active:scale-95"
              >
                Log out
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link
                href="/login"
                className="px-6 py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-black transition-all"
              >
                Log in
              </Link>
              <Link href="/signup">
                <button
                  type="button"
                  className="px-7 py-3 rounded-full bg-[#1e2330] hover:bg-black text-white text-xs font-black transition-all shadow-md active:scale-95"
                >
                  Sign up free
                </button>
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden p-2 text-slate-800"
          aria-label="Toggle menu"
        >
          {isOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
        </button>
      </nav>

      {/* Mobile Dropdown Menu */}
      {isOpen && (
        <div className="mx-auto max-w-7xl mt-3 bg-white rounded-3xl p-6 shadow-2xl border border-slate-200 space-y-4 pointer-events-auto md:hidden">
          <Link
            href="/create"
            onClick={() => setIsOpen(false)}
            className="block px-4 py-2.5 text-sm font-extrabold text-slate-800 hover:bg-slate-50 rounded-xl"
          >
            Products
          </Link>
          <Link
            href="/create"
            onClick={() => setIsOpen(false)}
            className="block px-4 py-2.5 text-sm font-extrabold text-slate-800 hover:bg-slate-50 rounded-xl"
          >
            Templates
          </Link>
          <Link
            href="/create"
            onClick={() => setIsOpen(false)}
            className="block px-4 py-2.5 text-sm font-extrabold text-slate-800 hover:bg-slate-50 rounded-xl"
          >
            Marketplace
          </Link>

          <div className="pt-3 border-t border-slate-100 flex flex-col gap-2.5">
            {userProfile ? (
              <button
                onClick={handleLogout}
                className="w-full text-left px-5 py-3 rounded-full bg-[#1e2330] text-white text-xs font-black"
              >
                Log out
              </button>
            ) : (
              <div className="flex gap-3">
                <Link href="/login" onClick={() => setIsOpen(false)} className="flex-1">
                  <button className="w-full py-3 rounded-2xl bg-slate-100 text-slate-800 text-xs font-black">
                    Log in
                  </button>
                </Link>
                <Link href="/signup" onClick={() => setIsOpen(false)} className="flex-1">
                  <button className="w-full py-3 rounded-full bg-[#1e2330] text-white text-xs font-black">
                    Sign up free
                  </button>
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  )
}