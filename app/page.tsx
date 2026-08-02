'use client'

import { useEffect, useState } from 'react'
import Hero from '@/components/landing/Hero'
import Footer from '@/components/layout/Footer'
import Link from 'next/link'
import {
  BarChart3, Plus, Eye, Users, TrendingUp,
  ArrowRight, Sparkles, Rocket, Edit3
} from 'lucide-react'
import { loadCards } from '@/lib/cardStorage'

const STAT_CONFIG = [
  { key: 'cards',  label: 'Your Cards',    icon: Users,      bgColor: 'bg-slate-900' },
  { key: 'views',  label: 'Total Views',   icon: Eye,        bgColor: 'bg-brand-600' },
  { key: 'clicks', label: 'Total Clicks',  icon: TrendingUp, bgColor: 'bg-indigo-600' },
]

const QUICK_ACTIONS = [
  { href: '/create',             icon: Plus,      label: 'Create New Card',  desc: 'Pick an official theme & customize', btnVariant: 'primary' },
  { href: '/my-cards',           icon: BarChart3,  label: 'My Bio Cards',     desc: 'Manage & view all your bio cards',  btnVariant: 'ghost' },
  { href: '/dashboard/analytics',icon: Eye,        label: 'Analytics',        desc: 'Views, clicks & audience data',    btnVariant: 'ghost' },
]

export default function Home() {
  const [userProfile, setUserProfile] = useState<any>(null)
  const [recentCards, setRecentCards] = useState<any[]>([])

  useEffect(() => {
    const profile = localStorage.getItem('userProfile')
    if (profile) {
      setUserProfile(JSON.parse(profile))
      // Load cards from Firestore (synced across devices)
      loadCards().then(result => {
        if (result.success) {
          const arr = Object.values(result.cards)
            .sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
            .slice(0, 3)
          setRecentCards(arr as any[])
        }
      })
    }
  }, [])

  if (!userProfile) {
    return (
      <main className="min-h-screen">
        <Hero />
        <Footer />
      </main>
    )
  }

  const totalCards  = recentCards.length
  const totalViews  = recentCards.reduce((s: number, c: any) => s + (c.analytics?.views  || 0), 0)
  const totalClicks = recentCards.reduce((s: number, c: any) => s + (c.analytics?.clicks || 0), 0)
  const statValues  = { cards: totalCards, views: totalViews, clicks: totalClicks }

  return (
    <main className="min-h-screen">
      {/* ── Official Welcome Banner (Slate 900) ── */}
      <div className="max-w-6xl mx-auto px-5 pt-6 pb-2">
        <div
          className="rounded-[24px] p-7 bg-slate-900 text-white border border-slate-800 shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-6"
        >
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold mb-1 tracking-tight">
              Welcome back, {userProfile.displayName}! 👋
            </h1>
            <p className="text-slate-300 text-xs sm:text-sm font-medium">
              Manage your published bio link cards and monitor audience analytics.
            </p>
          </div>
          <Link
            href="/create"
            className="clay-btn clay-btn-primary px-5 py-2.5 text-xs font-bold flex-shrink-0 flex items-center gap-2 shadow-md"
          >
            <Plus className="w-4 h-4" /> Create New Card
          </Link>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-5 py-6 space-y-6">

        {/* ── Stat Cards Grid ── */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {STAT_CONFIG.map(({ key, label, icon: Icon, bgColor }) => (
            <div
              key={key}
              className="clay-card-flat p-5 flex items-center justify-between bg-white"
            >
              <div>
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">{label}</p>
                <p className="text-3xl font-extrabold text-slate-900">{(statValues as any)[key]}</p>
              </div>
              <div
                className={`w-11 h-11 rounded-xl flex items-center justify-center ${bgColor} text-white shadow-sm`}
              >
                <Icon className="w-5 h-5" />
              </div>
            </div>
          ))}
        </div>

        {/* ── Quick Action Cards ── */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {QUICK_ACTIONS.map(({ href, icon: Icon, label, desc }) => (
            <Link
              key={href}
              href={href}
              className="clay-card p-5 flex flex-col justify-between group bg-white"
            >
              <div className="flex items-center gap-3 mb-3">
                <div
                  className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200 text-slate-800 flex items-center justify-center font-bold"
                >
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-slate-900 text-sm">{label}</h3>
                  <p className="text-slate-500 text-xs font-medium">{desc}</p>
                </div>
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                <span className="text-xs font-bold text-brand-600 group-hover:text-brand-700 transition-colors">
                  Open Action
                </span>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          ))}
        </div>

        {/* ── Recent Bio Cards List ── */}
        {recentCards.length > 0 ? (
          <div className="clay-card-flat p-6 bg-white">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-extrabold text-slate-900">Recent Bio Cards</h2>
              <Link href="/my-cards" className="flex items-center gap-1 text-xs font-bold text-brand-600 hover:text-brand-700 transition-colors">
                View all cards <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {recentCards.map((card: any) => (
                <div
                  key={card.id}
                  className="clay-card p-4 bg-slate-50/60 border border-slate-200/80"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-9 h-9 rounded-full bg-slate-900 text-white flex items-center justify-center text-sm font-bold shadow-sm">
                      {card.config?.profile?.avatar || '👤'}
                    </div>
                    <div className="min-w-0">
                      <p className="font-extrabold text-xs text-slate-900 truncate">{card.config?.profile?.title}</p>
                      <p className="text-[11px] text-slate-500 font-semibold">{card.config?.links?.length || 0} links attached</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between pt-3 border-t border-slate-200/60">
                    <span className="flex items-center gap-1 text-xs text-slate-600 font-bold">
                      <Eye className="w-3.5 h-3.5 text-slate-400" />{card.analytics?.views || 0} views
                    </span>
                    <Link
                      href="/my-cards"
                      className="clay-btn clay-btn-ghost px-3 py-1 text-xs font-bold"
                    >
                      <Edit3 className="w-3.5 h-3.5 mr-1" /> Edit
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="clay-card-flat p-12 text-center bg-white">
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 bg-brand-600 text-white shadow-md"
            >
              <Rocket className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-extrabold text-slate-900 mb-2">Ready to create your first bio card?</h2>
            <p className="text-slate-500 text-xs mb-6 max-w-sm mx-auto font-medium">
              Choose from our collection of official themes and customize your card in seconds.
            </p>
            <Link
              href="/create"
              className="clay-btn clay-btn-primary px-6 py-2.5 text-xs font-bold"
            >
              <Sparkles className="w-4 h-4 mr-1.5" /> Browse Themes
            </Link>
          </div>
        )}
      </div>

      <Footer />
    </main>
  )
}