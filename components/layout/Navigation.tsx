'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import Avatar from '@/components/ui/Avatar'
import {
  Menu, X, Home, Layout, Settings, User,
  Plus, Eye, LogOut, LogIn, ChevronDown, Sparkles
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

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href)

  return (
    <>
      {/* ── Official Desktop Navigation ── */}
      <nav className="hidden md:block sticky top-0 z-50 py-3 px-6 bg-slate-50/80 backdrop-blur-md border-b border-slate-200/80">
        <div className="mx-auto max-w-7xl flex items-center justify-between">
          
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 flex items-center justify-center rounded-xl bg-brand-600 text-white font-extrabold shadow-sm group-hover:bg-brand-700 transition-colors">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="font-extrabold text-xl text-slate-900 tracking-tight">
              Bio<span className="text-brand-600">Link</span>
            </span>
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center gap-1.5 bg-slate-200/60 p-1 rounded-xl border border-slate-300/50">
            <Link
              href="/"
              className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                isActive('/')
                  ? 'bg-white text-slate-900 shadow-sm font-extrabold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
              }`}
            >
              <Home className="w-3.5 h-3.5" /> Home
            </Link>

            {userProfile && (
              <Link
                href="/my-cards"
                className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  isActive('/my-cards')
                    ? 'bg-white text-slate-900 shadow-sm font-extrabold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
                }`}
              >
                <Layout className="w-3.5 h-3.5" /> My Cards
              </Link>
            )}
          </div>

          {/* User Menu / CTA Actions */}
          <div className="flex items-center gap-3">
            {userProfile ? (
              <>
                <Link
                  href="/create"
                  className="clay-btn clay-btn-primary px-4 py-2 text-xs font-bold flex items-center gap-1.5 shadow-sm"
                >
                  <Plus className="w-3.5 h-3.5" /> New Card
                </Link>

                {/* User Dropdown */}
                <div className="relative" ref={menuRef}>
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 font-bold text-xs text-slate-900 transition-colors shadow-sm"
                  >
                    <Avatar src={userProfile.avatar} size="xs" fallback="user" />
                    <span className="max-w-[100px] truncate">{userProfile.username}</span>
                    <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${showUserMenu ? 'rotate-180' : ''}`} />
                  </button>

                  {showUserMenu && (
                    <div className="absolute top-full right-0 mt-2 w-52 p-1.5 bg-white rounded-xl border border-slate-200 shadow-lg z-50">
                      <div className="px-3 py-2 border-b border-slate-100 mb-1">
                        <p className="text-xs font-extrabold text-slate-900 truncate">{userProfile.displayName}</p>
                        <p className="text-[11px] font-medium text-slate-500 truncate">@{userProfile.username}</p>
                      </div>
                      <Link
                        href="/my-cards"
                        onClick={() => setShowUserMenu(false)}
                        className="flex items-center gap-2 px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-100 hover:text-slate-900 rounded-lg transition-colors"
                      >
                        <Layout className="w-4 h-4 text-slate-400" />
                        My Cards
                      </Link>
                      <div className="border-t border-slate-100 mt-1 pt-1">
                        <button
                          onClick={handleLogout}
                          className="flex items-center gap-2 w-full px-3 py-2 text-xs font-bold text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <LogOut className="w-4 h-4 text-red-500" />
                          Logout
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <Link href="/login" className="clay-btn clay-btn-ghost px-4 py-2 text-xs font-bold">
                  <LogIn className="w-3.5 h-3.5 mr-1.5" /> Login
                </Link>
                <Link href="/signup" className="clay-btn clay-btn-secondary px-4 py-2 text-xs font-bold">
                  <User className="w-3.5 h-3.5 mr-1.5" /> Sign Up
                </Link>
                <Link href="/create" className="clay-btn clay-btn-primary px-4 py-2 text-xs font-bold">
                  <Plus className="w-3.5 h-3.5 mr-1.5" /> Create Card
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* ── Official Mobile Navigation ── */}
      <nav className="md:hidden sticky top-0 z-50 bg-white border-b border-slate-200 px-4 py-3">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center text-white font-bold">
              <Sparkles className="w-4 h-4" />
            </div>
            <span className="font-extrabold text-slate-900 text-base">Bio<span className="text-brand-600">Link</span></span>
          </Link>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-1.5 rounded-lg text-slate-700 hover:bg-slate-100 transition-colors"
          >
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {isOpen && (
          <div className="pt-3 pb-2 space-y-2 border-t border-slate-100 mt-3">
            <Link
              href="/"
              onClick={() => setIsOpen(false)}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-bold ${
                isActive('/') ? 'bg-brand-600 text-white' : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              <Home className="w-4 h-4" /> Home
            </Link>
            {userProfile ? (
              <>
                <Link
                  href="/my-cards"
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-bold ${
                    isActive('/my-cards') ? 'bg-brand-600 text-white' : 'text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <Layout className="w-4 h-4" /> My Cards
                </Link>
                <Link
                  href="/create"
                  onClick={() => setIsOpen(false)}
                  className="clay-btn clay-btn-primary w-full py-2.5 text-xs font-bold flex items-center justify-center gap-1.5"
                >
                  <Plus className="w-4 h-4" /> Create New Card
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-3 py-2 rounded-lg text-xs font-bold text-red-600 hover:bg-red-50 flex items-center gap-2"
                >
                  <LogOut className="w-4 h-4" /> Logout
                </button>
              </>
            ) : (
              <div className="grid grid-cols-2 gap-2 pt-1">
                <Link href="/login" onClick={() => setIsOpen(false)} className="clay-btn clay-btn-ghost py-2 text-xs font-bold text-center">
                  Login
                </Link>
                <Link href="/signup" onClick={() => setIsOpen(false)} className="clay-btn clay-btn-primary py-2 text-xs font-bold text-center">
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        )}
      </nav>
    </>
  )
}