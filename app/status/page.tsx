import { Rocket, CheckCircle, Palette, Zap, BarChart3, Target, Flame } from 'lucide-react'

export default function StatusPage() {
  return (
    <div className="min-h-screen bg-neo-white p-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4 flex items-center justify-center">
            <Rocket className="w-12 h-12 mr-3" /> SYSTEM STATUS
          </h1>
          <p className="text-xl font-medium text-neo-gray">All systems operational!</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Server Status */}
          <div className="p-6 bg-neo-green border-4 border-neo-black shadow-neo">
            <div className="text-center">
              <CheckCircle className="w-12 h-12 mx-auto mb-2 text-green-700" />
              <h3 className="font-bold text-lg mb-2">SERVER</h3>
              <p className="text-sm">Running on localhost:3000</p>
            </div>
          </div>

          {/* Themes */}
          <div className="p-6 bg-neo-cyan border-4 border-neo-black shadow-neo">
            <div className="text-center">
              <Palette className="w-12 h-12 mx-auto mb-2 text-cyan-700" />
              <h3 className="font-bold text-lg mb-2">THEMES</h3>
              <p className="text-sm">10+ professional themes</p>
            </div>
          </div>

          {/* Editor */}
          <div className="p-6 bg-neo-pink border-4 border-neo-black shadow-neo">
            <div className="text-center">
              <Zap className="w-12 h-12 mx-auto mb-2 text-pink-700" />
              <h3 className="font-bold text-lg mb-2">EDITOR</h3>
              <p className="text-sm">Advanced tools ready</p>
            </div>
          </div>

          {/* Analytics */}
          <div className="p-6 bg-neo-yellow border-4 border-neo-black shadow-neo">
            <div className="text-center">
              <BarChart3 className="w-12 h-12 mx-auto mb-2 text-yellow-700" />
              <h3 className="font-bold text-lg mb-2">ANALYTICS</h3>
              <p className="text-sm">Tracking & insights</p>
            </div>
          </div>

          {/* Dashboard */}
          <div className="p-6 bg-neo-orange border-4 border-neo-black shadow-neo">
            <div className="text-center">
              <Target className="w-12 h-12 mx-auto mb-2 text-orange-700" />
              <h3 className="font-bold text-lg mb-2">DASHBOARD</h3>
              <p className="text-sm">Management tools</p>
            </div>
          </div>

          {/* Features */}
          <div className="p-6 bg-purple-400 border-4 border-neo-black shadow-neo">
            <div className="text-center">
              <Flame className="w-12 h-12 mx-auto mb-2 text-purple-700" />
              <h3 className="font-bold text-lg mb-2">FEATURES</h3>
              <p className="text-sm">All advanced tools</p>
            </div>
          </div>
        </div>

        {/* Quick Links */}
        <div className="mt-12 text-center">
          <h2 className="text-2xl font-bold mb-6">QUICK ACCESS</h2>
          <div className="flex flex-wrap justify-center gap-4">
            <a href="/" className="px-6 py-3 bg-neo-black text-neo-white border-4 border-neo-black font-bold hover:bg-neo-gray transition-colors">
              HOME
            </a>
            <a href="/create" className="px-6 py-3 bg-neo-yellow text-neo-black border-4 border-neo-black font-bold hover:bg-yellow-300 transition-colors">
              CREATE
            </a>
            <a href="/my-cards" className="px-6 py-3 bg-neo-pink text-neo-black border-4 border-neo-black font-bold hover:bg-pink-300 transition-colors">
              MY CARDS
            </a>
            <a href="/test-editor" className="px-6 py-3 bg-neo-cyan text-neo-black border-4 border-neo-black font-bold hover:bg-cyan-300 transition-colors">
              TEST EDITOR
            </a>
          </div>
        </div>

        {/* System Info */}
        <div className="mt-12 p-6 bg-neo-white border-4 border-neo-black">
          <h3 className="font-bold text-lg mb-4">SYSTEM INFORMATION</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <strong>Framework:</strong> Next.js 14.2.15
            </div>
            <div>
              <strong>Platform:</strong> React + TypeScript
            </div>
            <div>
              <strong>Styling:</strong> Tailwind CSS + Neo-Brutalist Design
            </div>
            <div>
              <strong>Features:</strong> 11 Link Types, Analytics, SEO, Custom CSS
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}