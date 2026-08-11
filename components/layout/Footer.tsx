import Link from 'next/link'
import { Sparkles, ArrowRight, Github, Twitter, Instagram, Disc as Discord, Youtube } from 'lucide-react'

interface FooterProps {
  footerBg?: string
  footerText?: string
  accentText?: string
}

export default function Footer({
  footerBg = '#10301a',
  footerText = '#ffffff',
  accentText = '#d2e823'
}: FooterProps) {
  return (
    <footer
      className="border-t border-black/10 transition-colors duration-500 font-sans"
      style={{ backgroundColor: footerBg, color: footerText }}
    >
      {/* ── Pre-Footer Callout Banner ── */}
      <div className="max-w-7xl mx-auto px-6 pt-16 pb-12 border-b border-black/10">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 p-8 rounded-3xl bg-black/15 border border-white/10 backdrop-blur-md">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-xs font-extrabold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" style={{ color: accentText }} /> Create Your Bio Link Free
            </div>
            <h3 className="text-2xl sm:text-3xl font-black tracking-tight" style={{ color: footerText }}>
              Jumpstart your BioLink in 60 seconds.
            </h3>
            <p className="text-xs sm:text-sm font-medium opacity-80 max-w-xl">
              Join millions of creators, artists, and professionals sharing their content across the world.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <Link href="/signup">
              <button
                type="button"
                className="px-8 py-4 rounded-full font-black text-xs transition-all shadow-md hover:scale-[1.02] active:scale-95"
                style={{ backgroundColor: accentText, color: footerBg }}
              >
                Get Started Free <ArrowRight className="w-4 h-4 inline ml-1" />
              </button>
            </Link>
          </div>
        </div>
      </div>

      {/* ── Main Footer Columns Grid ── */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10 mb-12">
          {/* Brand Column */}
          <div className="md:col-span-1 space-y-4">
            <Link href="/" className="flex items-center gap-2">
              <span className="font-black text-2xl tracking-tight" style={{ color: footerText }}>
                Bio<span style={{ color: accentText }}>Links</span>
              </span>
            </Link>
            <p className="text-xs font-medium leading-relaxed opacity-80" style={{ color: footerText }}>
              The ultimate modular link in bio platform with real-time theme design engines.
            </p>
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-white/10 text-[10px] font-bold">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>All Systems Operational</span>
            </div>
          </div>

          {/* Column 1: Product */}
          <div>
            <h4 className="font-black mb-4 text-xs uppercase tracking-wider" style={{ color: accentText }}>Product</h4>
            <ul className="space-y-2.5">
              {[
                { label: 'Theme Customizer', href: '/create' },
                { label: 'Analytics Dashboard', href: '/my-cards' },
                { label: 'QR Code Generator', href: '/create' },
                { label: 'Modular Components', href: '/editor' },
              ].map(item => (
                <li key={item.label}>
                  <Link href={item.href} className="text-xs hover:opacity-100 opacity-80 transition-opacity font-medium" style={{ color: footerText }}>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 2: Themes */}
          <div>
            <h4 className="font-black mb-4 text-xs uppercase tracking-wider" style={{ color: accentText }}>Official Themes</h4>
            <ul className="space-y-2.5">
              {['Retro LCD GameBoy', 'Skeuo Wood', 'Soft Clay 3D', 'Pop Brutalist'].map(t => (
                <li key={t}>
                  <Link href="/create" className="text-xs hover:opacity-100 opacity-80 transition-opacity font-medium" style={{ color: footerText }}>
                    {t}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Resources */}
          <div>
            <h4 className="font-black mb-4 text-xs uppercase tracking-wider" style={{ color: accentText }}>Resources</h4>
            <ul className="space-y-2.5">
              {[
                { label: 'Creator Guide', href: '#' },
                { label: 'Help Center', href: '#' },
                { label: 'API & Integrations', href: '#' },
                { label: 'Changelog v2.5', href: '#' },
              ].map(item => (
                <li key={item.label}>
                  <a href={item.href} className="text-xs hover:opacity-100 opacity-80 transition-opacity font-medium" style={{ color: footerText }}>
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Company */}
          <div>
            <h4 className="font-black mb-4 text-xs uppercase tracking-wider" style={{ color: accentText }}>Company</h4>
            <ul className="space-y-2.5">
              {[
                { label: 'About BioLinks', href: '#' },
                { label: 'Careers', href: '#' },
                { label: 'Privacy Policy', href: '/privacy' },
                { label: 'Terms of Service', href: '/terms' },
              ].map(item => (
                <li key={item.label}>
                  <Link href={item.href} className="text-xs hover:opacity-100 opacity-80 transition-opacity font-medium" style={{ color: footerText }}>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* ── Bottom Bar & Social Icon Pills ── */}
        <div className="border-t border-black/10 pt-8 flex flex-col sm:flex-row justify-between items-center gap-6">
          <p className="text-xs font-medium opacity-70" style={{ color: footerText }}>
            Designed for creators — © {new Date().getFullYear()} BioLinks Inc. All rights reserved.
          </p>

          {/* Social Icons */}
          <div className="flex items-center gap-3">
            {[
              { icon: Twitter, label: 'Twitter', href: '#' },
              { icon: Instagram, label: 'Instagram', href: '#' },
              { icon: Github, label: 'GitHub', href: '#' },
              { icon: Youtube, label: 'YouTube', href: '#' },
            ].map(({ icon: Icon, label, href }) => (
              <a
                key={label}
                href={href}
                aria-label={label}
                className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center transition-all hover:scale-110 hover:bg-white/20"
                style={{ color: footerText }}
              >
                <Icon className="w-4 h-4" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}