import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-neo-black text-neo-white py-16 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Brand */}
          <div>
            <h3 className="text-2xl font-bold mb-4">BIOCARD</h3>
            <p className="font-medium text-neo-gray">
              Create stunning bio link cards with our template marketplace.
            </p>
          </div>
          
          {/* Themes */}
          <div>
            <h4 className="font-bold mb-4">THEMES</h4>
            <ul className="space-y-2 font-medium text-neo-gray">
              <li><Link href="/create" className="hover:text-neo-yellow">Minimal</Link></li>
              <li><Link href="/create" className="hover:text-neo-yellow">Vibrant</Link></li>
              <li><Link href="/create" className="hover:text-neo-yellow">Professional</Link></li>
              <li><Link href="/create" className="hover:text-neo-yellow">Creative</Link></li>
            </ul>
          </div>
          
          {/* Tools */}
          <div>
            <h4 className="font-bold mb-4">TOOLS</h4>
            <ul className="space-y-2 font-medium text-neo-gray">
              <li><Link href="/create" className="hover:text-neo-yellow">Create Bio Link</Link></li>
              <li><Link href="/dashboard" className="hover:text-neo-yellow">Dashboard</Link></li>
              <li><Link href="/card/demo123" className="hover:text-neo-yellow">Sample Card</Link></li>
            </ul>
          </div>
          
          {/* Legal */}
          <div>
            <h4 className="font-bold mb-4">LEGAL</h4>
            <ul className="space-y-2 font-medium text-neo-gray">
              <li><Link href="/privacy" className="hover:text-neo-yellow">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-neo-yellow">Terms of Service</Link></li>
            </ul>
          </div>
        </div>
        
        {/* Bottom */}
        <div className="border-t-4 border-neo-white pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="font-medium text-neo-gray mb-4 md:mb-0">
            © 2024 BioCard Creator. All rights reserved.
          </p>
          
          <div className="flex space-x-6">
            <a href="#" className="text-neo-gray hover:text-neo-yellow font-bold">TWITTER</a>
            <a href="#" className="text-neo-gray hover:text-neo-yellow font-bold">INSTAGRAM</a>
            <a href="#" className="text-neo-gray hover:text-neo-yellow font-bold">GITHUB</a>
          </div>
        </div>
      </div>
    </footer>
  )
}