import Link from 'next/link'
import { Sparkles, ArrowRight, Link2, Palette, BarChart3, ShieldCheck } from 'lucide-react'

const PREVIEW_CARDS = [
  {
    name: '@creator', role: 'Digital Artist & Designer', emoji: '🎨',
    bgColor: 'bg-slate-900',
    btnBg: 'bg-brand-600',
    links: ['Portfolio', 'Shop My Art'],
    rotate: '-rotate-2',
  },
  {
    name: 'Sarah Connor', role: 'CEO & Founder', emoji: '💼',
    bgColor: 'bg-brand-600',
    btnBg: 'bg-slate-900',
    links: ['Our Venture', 'LinkedIn'],
    rotate: 'rotate-1',
  },
  {
    name: '@vibes', role: 'Content Creator', emoji: '✨',
    bgColor: 'bg-slate-800',
    btnBg: 'bg-brand-600',
    links: ['Latest Video', 'Community'],
    rotate: '-rotate-1',
  },
]

const FEATURES = [
  {
    icon: Palette,
    title: '25+ Theme Templates',
    desc: 'Crafted with official color palettes for maximum visual conversion.',
  },
  {
    icon: Link2,
    title: 'Rich Media Embeds',
    desc: 'Integrate shop products, videos, audio, and social links seamlessly.',
  },
  {
    icon: BarChart3,
    title: 'Real-Time Analytics',
    desc: 'Monitor impressions, click-through rates, and audience engagement.',
  },
]

export default function Hero() {
  return (
    <section className="relative min-h-[85vh] flex flex-col items-center justify-center px-6 pt-12 pb-20 overflow-hidden">

      {/* ── Hero Main Content ── */}
      <div className="relative z-10 text-center max-w-3xl mx-auto mb-14">
        {/* Pill Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-slate-200 shadow-sm text-xs font-bold text-slate-800 mb-6">
          <Sparkles className="w-3.5 h-3.5 text-brand-600" />
          <span>Next-Gen Bio Link Platform</span>
        </div>

        {/* Headline */}
        <h1 className="text-4xl sm:text-6xl font-extrabold text-slate-950 mb-6 leading-[1.15] tracking-tight">
          Everything You Are.{' '}
          <span className="bg-gradient-to-r from-brand-600 to-indigo-600 bg-clip-text text-transparent">
            In One Bio Link.
          </span>
        </h1>

        <p className="text-base sm:text-lg text-slate-600 mb-9 max-w-xl mx-auto font-medium leading-relaxed">
          Create a sleek, professional clay-morphic bio page in seconds. Share all your links, stores, and media with a single URL.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/create"
            className="clay-btn clay-btn-primary px-7 py-3.5 text-sm font-bold flex items-center gap-2 shadow-md"
          >
            <Sparkles className="w-4 h-4" />
            Create Your Card Free
            <ArrowRight className="w-4 h-4 ml-1" />
          </Link>
          <Link
            href="/login"
            className="clay-btn clay-btn-ghost px-7 py-3.5 text-sm font-bold"
          >
            Sign In to Dashboard
          </Link>
        </div>
      </div>

      {/* ── Preview Cards Grid ── */}
      <div className="relative z-10 flex items-center justify-center gap-6 mb-16 flex-wrap max-w-5xl mx-auto">
        {PREVIEW_CARDS.map((card, i) => (
          <div
            key={i}
            className={`${card.rotate} w-48 p-5 rounded-[22px] ${card.bgColor} text-white shadow-xl border border-slate-700/50 transition-all duration-300 hover:scale-105 hover:rotate-0`}
          >
            <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center text-xl mx-auto mb-3 border border-white/20">
              {card.emoji}
            </div>
            <h3 className="font-extrabold text-white text-sm text-center mb-0.5">{card.name}</h3>
            <p className="text-white/70 text-[11px] text-center font-medium mb-3 truncate">{card.role}</p>
            <div className="space-y-1.5">
              {card.links.map((l, j) => (
                <div
                  key={j}
                  className={`text-xs font-bold text-white text-center py-2 rounded-lg ${card.btnBg} shadow-sm`}
                >
                  {l}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* ── Feature Cards Row ── */}
      <div className="relative z-10 grid grid-cols-1 sm:grid-cols-3 gap-5 max-w-4xl mx-auto w-full">
        {FEATURES.map((f, i) => (
          <div
            key={i}
            className="clay-card-flat p-5 bg-white flex flex-col items-start gap-2.5"
          >
            <div className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-brand-600">
              <f.icon className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm mb-1">{f.title}</h3>
              <p className="text-slate-500 text-xs font-medium leading-relaxed">{f.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}