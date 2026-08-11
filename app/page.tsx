'use client'

import { useEffect, useState, useRef } from 'react'
import Navigation from '@/components/layout/Navigation'
import Footer from '@/components/layout/Footer'
import Link from 'next/link'
import {
  Plus, Eye, TrendingUp, ArrowRight, Edit3, ChevronRight, BarChart3, Globe, Sparkles
} from 'lucide-react'
import { getAllCards } from '@/lib/storage'
import { THEMES } from '@/lib/themes'
import BioCard from '@/components/card/BioCard'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import Badge from '@/components/ui/Badge'
import Input from '@/components/ui/Input'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

const DEMO_THEME_IDS = ['retro-lcd', 'skeuo-wood', 'soft-clay', 'pop-brutalist']

// Dynamic landing page theme palette engine with high contrast and header/footer color sync
const LANDING_THEMES: Record<string, {
  name: string
  sec1Bg: string
  sec1Text: string
  sec1BtnBg: string
  sec1BtnText: string
  sec2Bg: string
  sec2Text: string
  sec2AccText: string
  sec3Bg: string
  sec3Text: string
  sec3AccText: string
  sec4Bg: string
  sec4Text: string
  sec4CardBg: string
  sec4CardText: string
  accentGlow: string
}> = {
  'retro-lcd': {
    name: 'Retro LCD',
    sec1Bg: '#c7d2ab',
    sec1Text: '#1a2211',
    sec1BtnBg: '#1a2211',
    sec1BtnText: '#c7d2ab',
    sec2Bg: '#1a2211',
    sec2Text: '#ffffff',
    sec2AccText: '#c7d2ab',
    sec3Bg: '#808c63',
    sec3Text: '#ffffff',
    sec3AccText: '#eef5db',
    sec4Bg: '#d9e2bd',
    sec4Text: '#1a2211',
    sec4CardBg: '#ffffff',
    sec4CardText: '#1a2211',
    accentGlow: 'rgba(199, 210, 171, 0.5)',
  },
  'skeuo-wood': {
    name: 'Skeuo Wood',
    sec1Bg: '#e6c594',
    sec1Text: '#3d2314',
    sec1BtnBg: '#3d2314',
    sec1BtnText: '#e6c594',
    sec2Bg: '#3d2314',
    sec2Text: '#ffffff',
    sec2AccText: '#e6c594',
    sec3Bg: '#8c522b',
    sec3Text: '#ffffff',
    sec3AccText: '#fceade',
    sec4Bg: '#f4e6d4',
    sec4Text: '#3d2314',
    sec4CardBg: '#ffffff',
    sec4CardText: '#3d2314',
    accentGlow: 'rgba(230, 197, 148, 0.5)',
  },
  'soft-clay': {
    name: 'Soft Clay',
    sec1Bg: '#f1f5f9',
    sec1Text: '#0f172a',
    sec1BtnBg: '#0f172a',
    sec1BtnText: '#ffffff',
    sec2Bg: '#0f172a',
    sec2Text: '#ffffff',
    sec2AccText: '#38bdf8',
    sec3Bg: '#334155',
    sec3Text: '#ffffff',
    sec3AccText: '#93c5fd',
    sec4Bg: '#e2e8f0',
    sec4Text: '#0f172a',
    sec4CardBg: '#ffffff',
    sec4CardText: '#0f172a',
    accentGlow: 'rgba(51, 65, 85, 0.4)',
  },
  'pop-brutalist': {
    name: 'Pop Brutalist',
    sec1Bg: '#fde047',
    sec1Text: '#000000',
    sec1BtnBg: '#000000',
    sec1BtnText: '#fde047',
    sec2Bg: '#000000',
    sec2Text: '#ffffff',
    sec2AccText: '#fde047',
    sec3Bg: '#ff4757',
    sec3Text: '#ffffff',
    sec3AccText: '#fde047',
    sec4Bg: '#fef08a',
    sec4Text: '#000000',
    sec4CardBg: '#ffffff',
    sec4CardText: '#000000',
    accentGlow: 'rgba(253, 224, 71, 0.5)',
  },
}

export default function Home() {
  const [userProfile, setUserProfile] = useState<any>(null)
  const [recentCards, setRecentCards] = useState<any[]>([])
  const [claimHandle, setClaimHandle] = useState('biolinks.app/')
  const [activeDemoTheme, setActiveDemoTheme] = useState('retro-lcd')

  const heroRef = useRef<HTMLDivElement>(null)
  const sec2Ref = useRef<HTMLDivElement>(null)
  const sec3Ref = useRef<HTMLDivElement>(null)
  const sec4Ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const profile = localStorage.getItem('userProfile')
    if (profile) {
      setUserProfile(JSON.parse(profile))
      getAllCards().then(result => {
        if (result.success) {
          const recent = result.cards
            .sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
          setRecentCards(recent)
        }
      })
    }
  }, [])

  // ── Official Lenis + GSAP Smooth Inertia Scrolling ──
  useEffect(() => {
    if (!userProfile && typeof window !== 'undefined') {
      const lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
      })

      lenis.on('scroll', ScrollTrigger.update)

      const updateTicker = (time: number) => {
        lenis.raf(time * 1000)
      }

      gsap.ticker.add(updateTicker)
      gsap.ticker.lagSmoothing(0)

      return () => {
        gsap.ticker.remove(updateTicker)
        lenis.destroy()
      }
    }
  }, [userProfile])

  // Enhanced GSAP ScrollTrigger Animations for Smooth & Slow Cinematic Section Scrolling
  useEffect(() => {
    if (!userProfile && typeof window !== 'undefined') {
      const ctx = gsap.context(() => {
        // Hero Section Entrance
        if (heroRef.current) {
          gsap.fromTo(
            heroRef.current.children,
            { opacity: 0, y: 50 },
            { opacity: 1, y: 0, duration: 1.4, stagger: 0.18, ease: 'power2.out' }
          )
        }

        // Section 2 Scroll Trigger (Customization)
        if (sec2Ref.current) {
          gsap.fromTo(
            sec2Ref.current,
            { opacity: 0, y: 70 },
            {
              opacity: 1,
              y: 0,
              duration: 1.4,
              ease: 'power2.out',
              scrollTrigger: {
                trigger: sec2Ref.current,
                start: 'top 85%',
                toggleActions: 'play none none reverse',
              },
            }
          )
        }

        // Section 3 Scroll Trigger (Sharing)
        if (sec3Ref.current) {
          gsap.fromTo(
            sec3Ref.current,
            { opacity: 0, scale: 0.94, y: 50 },
            {
              opacity: 1,
              scale: 1,
              y: 0,
              duration: 1.4,
              ease: 'power2.out',
              scrollTrigger: {
                trigger: sec3Ref.current,
                start: 'top 85%',
                toggleActions: 'play none none reverse',
              },
            }
          )
        }

        // Section 4 Scroll Trigger (Analytics)
        if (sec4Ref.current) {
          gsap.fromTo(
            sec4Ref.current,
            { opacity: 0, y: 70 },
            {
              opacity: 1,
              y: 0,
              duration: 1.4,
              ease: 'power2.out',
              scrollTrigger: {
                trigger: sec4Ref.current,
                start: 'top 85%',
                toggleActions: 'play none none reverse',
              },
            }
          )
        }
      })
      return () => ctx.revert()
    }
  }, [userProfile])

  // Sample card config with dynamic theme switcher
  const demoCardData = {
    cardId: 'demo-hero',
    config: {
      profile: {
        title: 'Satvik Patel',
        bio: 'Digital Creator & Product Designer',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
        verified: true,
      },
      theme: {
        id: activeDemoTheme,
      },
      socialLinks: {
        instagram: 'https://instagram.com',
        github: 'https://github.com',
        twitter: 'https://twitter.com',
      },
      links: [
        { id: '1', type: 'link', text: 'MY WEBSITE', url: 'https://satvik.dev' },
        { id: '2', type: 'link', text: 'FOLLOW ON INSTAGRAM', url: 'https://instagram.com' },
      ],
    },
  }

  const activeTheme = LANDING_THEMES[activeDemoTheme] || LANDING_THEMES['retro-lcd']

  // ── Public Guest Landing View ──
  if (!userProfile) {
    return (
      <main className="min-h-screen font-sans transition-colors duration-500 ease-in-out overflow-x-hidden relative selection:bg-slate-900 selection:text-white">

        {/* Hero Section 1: Dynamic Theme Section */}
        <section
          className="transition-colors duration-500 ease-in-out max-w-full pt-36 pb-20"
          style={{ backgroundColor: activeTheme.sec1Bg, color: activeTheme.sec1Text }}
        >
          <div ref={heroRef} className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            
            {/* Left Copy */}
            <div className="space-y-6 text-left">
              <div
                className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-black uppercase tracking-wider shadow-sm transition-colors duration-500"
                style={{
                  backgroundColor: activeTheme.sec1BtnBg,
                  color: activeTheme.sec1BtnText,
                }}
              >
                <span
                  className="w-2 h-2 rounded-full animate-pulse shrink-0"
                  style={{ backgroundColor: activeTheme.sec1Bg }}
                />
                <span>{activeTheme.name} Theme</span>
              </div>

              <h1
                className="text-5xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-[1.05]"
                style={{ color: activeTheme.sec1Text }}
              >
                A link in bio built for you.
              </h1>

              <p
                className="text-base sm:text-lg max-w-lg font-medium leading-relaxed opacity-95"
                style={{ color: activeTheme.sec1Text }}
              >
                Join 70M+ people using BioLinks for their link in bio. One link to help you share everything you create, curate and sell from your Instagram, TikTok, Twitter, YouTube and other social media profiles.
              </p>

              {/* Claim Username Input Form */}
              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  const clean = claimHandle.replace('biolinks.app/', '').replace('/', '')
                  window.location.href = `/signup?handle=${encodeURIComponent(clean)}`
                }}
                className="flex flex-col sm:flex-row items-stretch gap-3 pt-2 max-w-md"
              >
                <div className="flex-1">
                  <Input
                    value={claimHandle}
                    onChange={(e) => setClaimHandle(e.target.value)}
                    placeholder="biolinks.app/yourname"
                    aria-label="Claim your BioLinks username"
                    className="!py-3.5 !rounded-2xl !text-sm !font-semibold !border-0 !shadow-sm"
                    style={{ color: '#0f172a', backgroundColor: '#ffffff' }}
                  />
                </div>
                <button
                  type="submit"
                  className="px-7 py-4 rounded-full font-extrabold text-xs transition-all cursor-pointer whitespace-nowrap shadow-md hover:scale-[1.02] active:scale-95"
                  style={{ backgroundColor: activeTheme.sec1BtnBg, color: activeTheme.sec1BtnText }}
                >
                  Get started for free
                </button>
              </form>
            </div>

            {/* Right Phone Frame Showcase + Dynamic Theme Selector Pills */}
            <div className="flex flex-col items-center md:items-end space-y-4">
              {/* Theme Switcher Button Group */}
              <div
                className="flex items-center gap-1.5 p-1.5 rounded-full shadow-md transition-colors duration-500"
                style={{ backgroundColor: activeTheme.sec1BtnBg }}
              >
                {THEMES.filter(t => DEMO_THEME_IDS.includes(t.id)).map((t) => {
                  const isActive = activeDemoTheme === t.id
                  return (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => setActiveDemoTheme(t.id)}
                      className={`px-3.5 py-1.5 rounded-full text-[11px] font-black transition-all cursor-pointer ${
                        isActive ? 'shadow-md scale-105' : 'opacity-80 hover:opacity-100'
                      }`}
                      style={{
                        backgroundColor: isActive ? activeTheme.sec1Bg : 'transparent',
                        color: isActive ? activeTheme.sec1Text : activeTheme.sec1BtnText,
                      }}
                    >
                      {t.name.split(' ')[0]}
                    </button>
                  )
                })}
              </div>

              {/* Phone Frame Container with Dynamic Theme Accent Glow */}
              <div
                className="w-full max-w-[340px] aspect-[9/18] rounded-[42px] p-2.5 transition-all duration-500"
                style={{
                  backgroundColor: activeTheme.sec1BtnBg,
                  boxShadow: `0 20px 45px ${activeTheme.accentGlow}`,
                }}
              >
                <div className="w-full h-full rounded-[32px] overflow-hidden bg-white">
                  <BioCard overrideConfig={demoCardData.config as any} isPreview={true} />
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* Hero Section 2: Seamless Dynamic Customization Section */}
        <section
          ref={sec2Ref}
          className="py-24 px-6 transition-colors duration-500 ease-in-out"
          style={{ backgroundColor: activeTheme.sec2Bg, color: activeTheme.sec2Text }}
        >
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2
                className="text-4xl sm:text-5xl font-black tracking-tight leading-tight transition-colors duration-500"
                style={{ color: activeTheme.sec2AccText }}
              >
                Create and customize your BioLinks in minutes
              </h2>
              <p className="text-base sm:text-lg font-medium leading-relaxed max-w-xl opacity-90">
                Connect all your content across social media, websites, stores and more in one link in bio. Customize every detail or let BioLinks automatically enhance it to match your brand.
              </p>
              <Link href="/signup">
                <button
                  className="px-8 py-4 rounded-full font-extrabold text-xs transition-all shadow-md hover:scale-[1.02]"
                  style={{ backgroundColor: activeTheme.sec2AccText, color: activeTheme.sec2Bg }}
                >
                  Get started for free
                </button>
              </Link>
            </div>

            <div className="bg-black/20 border border-white/15 text-white p-6 rounded-3xl shadow-2xl space-y-3 backdrop-blur-md">
              {[
                { step: '1', title: 'Pick your personalized handle & theme' },
                { step: '2', title: 'Add social links, videos, products & music' },
                { step: '3', title: 'Share your unique bio link everywhere online' },
              ].map(({ step, title }) => (
                <div key={step} className="p-4 rounded-xl bg-white/10 border border-white/15 flex items-center gap-3">
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center font-black text-xs transition-colors duration-500 shrink-0"
                    style={{ backgroundColor: activeTheme.sec2AccText, color: activeTheme.sec2Bg }}
                  >
                    {step}
                  </div>
                  <span className="text-sm sm:text-base font-bold text-white tracking-wide">{title}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Hero Section 3: Seamless Dynamic Sharing Section */}
        <section
          ref={sec3Ref}
          className="py-24 px-6 transition-colors duration-500 ease-in-out"
          style={{ backgroundColor: activeTheme.sec3Bg, color: activeTheme.sec3Text }}
        >
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2
                className="text-4xl sm:text-5xl font-black tracking-tight leading-tight transition-colors duration-500"
                style={{ color: activeTheme.sec3AccText }}
              >
                Share your BioLinks anywhere you like!
              </h2>
              <p className="text-base sm:text-lg font-medium leading-relaxed max-w-xl opacity-90">
                Add your unique BioLinks URL to all the platforms and places you find your audience. Then use your QR code to drive your offline traffic back to your link in bio.
              </p>
              <Link href="/signup">
                <button
                  className="px-8 py-4 rounded-full font-extrabold text-xs transition-all shadow-md hover:scale-[1.02]"
                  style={{ backgroundColor: activeTheme.sec3AccText, color: activeTheme.sec3Bg }}
                >
                  Get started for free
                </button>
              </Link>
            </div>

            <div className="bg-black/20 border border-white/15 p-8 rounded-3xl text-center space-y-4 shadow-2xl backdrop-blur-md">
              <div className="w-24 h-24 rounded-2xl bg-white p-3 mx-auto shadow-md">
                <img
                  src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=https://biolinks.app"
                  alt="QR Code"
                  className="w-full h-full object-contain"
                />
              </div>
              <p className="text-xs font-bold text-white opacity-90">Scan & Connect Instantly</p>
            </div>
          </div>
        </section>

        {/* Hero Section 4: Seamless Dynamic Analytics Section */}
        <section
          ref={sec4Ref}
          className="py-24 px-6 transition-colors duration-500 ease-in-out"
          style={{ backgroundColor: activeTheme.sec4Bg, color: activeTheme.sec4Text }}
        >
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2
                className="text-4xl sm:text-5xl font-black tracking-tight leading-tight"
                style={{ color: activeTheme.sec4Text }}
              >
                Analyze your audience and keep them engaged
              </h2>
              <p
                className="text-base sm:text-lg font-medium leading-relaxed max-w-xl opacity-90"
                style={{ color: activeTheme.sec4Text }}
              >
                Track your engagement over time, monitor click revenue and learn what’s converting your audience. Make informed updates on the fly to keep them coming back.
              </p>
              <Link href="/signup">
                <button
                  className="px-8 py-4 rounded-full font-extrabold text-xs transition-all shadow-md hover:scale-[1.02]"
                  style={{ backgroundColor: activeTheme.sec1BtnBg, color: activeTheme.sec1BtnText }}
                >
                  Get started for free
                </button>
              </Link>
            </div>

            <Card
              className="border border-black/10 p-8 rounded-3xl shadow-xl space-y-6"
              style={{ backgroundColor: activeTheme.sec4CardBg, color: activeTheme.sec4CardText }}
            >
              <div className="flex items-center justify-between pb-4 border-b border-slate-200">
                <span className="text-xs font-bold uppercase tracking-wider opacity-60">Analytics Overview</span>
                <Badge variant="success" size="md">+24.8% growth</Badge>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-slate-100/70 border border-slate-200/60">
                  <p className="text-xs font-bold opacity-60">Views</p>
                  <p className="text-2xl font-black mt-1" style={{ color: activeTheme.sec4CardText }}>128,450</p>
                </div>
                <div className="p-4 rounded-2xl bg-slate-100/70 border border-slate-200/60">
                  <p className="text-xs font-bold opacity-60">Clicks</p>
                  <p className="text-2xl font-black mt-1" style={{ color: activeTheme.sec4CardText }}>84,120</p>
                </div>
              </div>
            </Card>
          </div>
        </section>
      </main>
    )
  }

  // ── Authenticated User Dashboard View ──
  const totalCards  = recentCards.length
  const totalViews  = recentCards.reduce((s: number, c: any) => s + (c.analytics?.views  || 0), 0)
  const totalClicks = recentCards.reduce((s: number, c: any) => s + (c.analytics?.clicks || 0), 0)

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 pb-16 font-sans">
      <Navigation />

      {/* Header Banner */}
      <div className="bg-white border-b border-slate-200 py-8 px-6">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">
              Welcome back, {userProfile.displayName || 'User'}
            </h1>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Manage and customize your bio link cards
            </p>
          </div>

          <Link href="/create">
            <Button variant="primary" size="md" shape="rounded" className="!bg-[#10301a] hover:!bg-black !text-white flex items-center gap-2">
              <Plus className="w-4 h-4" /> Create New Card
            </Button>
          </Link>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-8 space-y-8">

        {/* Reusable Stat Cards Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { label: 'Total Cards', value: totalCards },
            { label: 'Total Views', value: totalViews },
            { label: 'Total Clicks', value: totalClicks },
          ].map(({ label, value }) => (
            <Card key={label} className="bg-white border-slate-200 p-5 rounded-2xl shadow-xs">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">{label}</p>
              <p className="text-2xl font-black text-slate-900">{value}</p>
            </Card>
          ))}
        </div>

        {/* Cards Section */}
        <Card className="bg-white border-slate-200 p-6 rounded-2xl shadow-xs">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-base font-bold text-slate-900">Your Bio Cards</h2>
            <Link href="/create" className="text-xs font-bold text-slate-600 hover:text-slate-900 transition-colors flex items-center gap-1">
              Create new <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {recentCards.length > 0 ? (
            <div className="divide-y divide-slate-100">
              {recentCards.map((card: any) => (
                <div key={card.id} className="py-4 flex items-center justify-between gap-4 first:pt-0 last:pb-0">
                  <div className="min-w-0">
                    <p className="font-bold text-sm text-slate-900 truncate">
                      {card.config?.profile?.title || 'Untitled Card'}
                    </p>
                    <p className="text-xs text-slate-500 font-medium">
                      {card.config?.links?.length || 0} links · {card.analytics?.views || 0} views
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <Link href="/editor">
                      <Button variant="secondary" size="xs" shape="rounded" className="flex items-center gap-1.5">
                        <Edit3 className="w-3.5 h-3.5" /> Edit
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-12 text-center">
              <p className="text-sm font-bold text-slate-700 mb-1">No cards created yet</p>
              <p className="text-xs text-slate-500 mb-4 font-medium">Get started by creating your first bio link card.</p>
              <Link href="/create">
                <Button variant="primary" size="sm" shape="rounded" className="!bg-[#10301a] hover:!bg-black !text-[#ffffff] inline-flex items-center gap-1.5">
                  <Plus className="w-3.5 h-3.5" /> Create Card
                </Button>
              </Link>
            </div>
          )}
        </Card>

      </div>

      <Footer />
    </main>
  )
}