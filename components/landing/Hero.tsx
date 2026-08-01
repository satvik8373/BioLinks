import Link from 'next/link'
import Button from '@/components/ui/Button'
import { ServiceIcon } from '@/components/icons/ServiceIcons'

export default function Hero() {
  return (
    <section className="min-h-screen bg-neo-yellow flex items-center justify-center px-4">
      <div className="max-w-6xl mx-auto text-center">
        <h1 className="text-6xl md:text-8xl font-bold text-neo-black mb-6 leading-tight">
          CREATE
          <br />
          YOUR BIO
          <br />
          <span className="text-neo-pink">CARD</span>
        </h1>
        <p className="text-xl md:text-2xl font-medium text-neo-black mb-8 max-w-3xl mx-auto">
          Create beautiful bio links with our theme-based customization system. Choose a theme and make it yours.
        </p>
        
        <div className="flex justify-center mb-16">
          <Link href="/create">
            <Button size="lg" className="px-12 py-4">
              CREATE BIO LINK
            </Button>
          </Link>
        </div>
        
        {/* Template Preview Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {/* Creator Template */}
          <div className="bg-white border-4 border-neo-black shadow-neo-xl p-6 transform rotate-1">
            <div className="w-16 h-16 bg-neo-pink border-4 border-neo-black rounded-full mx-auto mb-4 flex items-center justify-center">
              <ServiceIcon iconId="palette" size={32} className="text-neo-white" />
            </div>
            <h3 className="font-bold text-lg mb-2">@creator</h3>
            <p className="text-sm mb-4">Digital Artist & Designer</p>
            <div className="space-y-2">
              <div className="bg-neo-cyan border-2 border-neo-black p-2 text-sm font-bold text-center">
                PORTFOLIO
              </div>
              <div className="bg-neo-green border-2 border-neo-black p-2 text-sm font-bold text-center">
                SHOP
              </div>
            </div>
            <div className="mt-4 text-xs font-bold text-neo-gray">CREATOR TEMPLATE</div>
          </div>
          
          {/* Business Template */}
          <div className="bg-neo-black text-neo-white border-4 border-neo-white shadow-neo-xl p-6 transform -rotate-1">
            <div className="w-16 h-16 bg-neo-yellow border-4 border-neo-white rounded-full mx-auto mb-4 flex items-center justify-center">
              <ServiceIcon iconId="business" size={32} className="text-neo-black" />
            </div>
            <h3 className="font-bold text-lg mb-2">JOHN DOE</h3>
            <p className="text-sm mb-4">CEO & Entrepreneur</p>
            <div className="space-y-2">
              <div className="bg-neo-yellow text-neo-black border-2 border-neo-white p-2 text-sm font-bold text-center">
                COMPANY
              </div>
              <div className="bg-neo-pink text-neo-black border-2 border-neo-white p-2 text-sm font-bold text-center">
                LINKEDIN
              </div>
            </div>
            <div className="mt-4 text-xs font-bold text-neo-gray">BUSINESS TEMPLATE</div>
          </div>
          
          {/* Influencer Template */}
          <div className="bg-gradient-to-br from-neo-pink to-neo-cyan border-4 border-neo-black shadow-neo-xl p-6 transform rotate-1">
            <div className="w-16 h-16 bg-neo-white border-4 border-neo-black rounded-full mx-auto mb-4 flex items-center justify-center">
              <ServiceIcon iconId="influencers" size={32} className="text-neo-black" />
            </div>
            <h3 className="font-bold text-lg mb-2 text-neo-black">@influencer</h3>
            <p className="text-sm mb-4 text-neo-black">Lifestyle & Travel</p>
            <div className="space-y-2">
              <div className="bg-neo-white text-neo-black border-2 border-neo-black p-2 text-sm font-bold text-center">
                INSTAGRAM
              </div>
              <div className="bg-neo-yellow text-neo-black border-2 border-neo-black p-2 text-sm font-bold text-center">
                YOUTUBE
              </div>
            </div>
            <div className="mt-4 text-xs font-bold text-neo-black">INFLUENCER TEMPLATE</div>
          </div>
        </div>
      </div>
    </section>
  )
}