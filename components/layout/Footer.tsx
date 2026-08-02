import Link from 'next/link'
import { Sparkles, Heart } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="mt-20 border-t border-slate-200/80 bg-slate-900 text-white">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-10">
          {/* Brand Column */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center text-white font-bold">
                <Sparkles className="w-4 h-4" />
              </div>
              <span className="font-extrabold text-white text-lg tracking-tight">
                Bio<span className="text-brand-400">Link</span>
              </span>
            </div>
            <p className="text-slate-400 text-xs font-medium leading-relaxed">
              Create stunning, high-converting bio link cards with official Claymorphism design templates.
            </p>
          </div>

          {/* Theme Collections */}
          <div>
            <h4 className="font-bold text-white mb-4 text-xs uppercase tracking-wider text-slate-300">Themes</h4>
            <ul className="space-y-2.5">
              {['Minimal', 'Vibrant', 'Gradient', 'Dark'].map(t => (
                <li key={t}>
                  <Link href="/create" className="text-xs text-slate-400 hover:text-white transition-colors font-medium">
                    {t}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Core Tools */}
          <div>
            <h4 className="font-bold text-white mb-4 text-xs uppercase tracking-wider text-slate-300">Tools</h4>
            <ul className="space-y-2.5">
              {[
                { label: 'Create Bio Link', href: '/create' },
                { label: 'My Cards',        href: '/my-cards' },
              ].map(item => (
                <li key={item.href}>
                  <Link href={item.href} className="text-xs text-slate-400 hover:text-white transition-colors font-medium">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-bold text-white mb-4 text-xs uppercase tracking-wider text-slate-300">Legal</h4>
            <ul className="space-y-2.5">
              {[
                { label: 'Privacy Policy',   href: '/privacy' },
                { label: 'Terms of Service', href: '/terms' },
              ].map(item => (
                <li key={item.href}>
                  <Link href={item.href} className="text-xs text-slate-400 hover:text-white transition-colors font-medium">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-slate-800 pt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-slate-400 text-xs font-medium flex items-center gap-1.5">
            Designed for creators — © {new Date().getFullYear()} BioLink Inc.
          </p>
          <div className="flex gap-6">
            {['Twitter', 'Instagram', 'GitHub'].map(s => (
              <a key={s} href="#" className="text-slate-400 hover:text-brand-400 text-xs font-bold transition-colors">
                {s}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}