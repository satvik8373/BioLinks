'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import Button from '@/components/ui/Button'
import Avatar from '@/components/ui/Avatar'
import { 
  Menu, 
  X, 
  Home, 
  Layout, 
  BarChart3, 
  Settings, 
  User,
  Plus,
  Eye,
  LogOut,
  UserCircle
} from 'lucide-react'

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false)
  const [userProfile, setUserProfile] = useState<any>(null)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const profile = localStorage.getItem('userProfile')
    if (profile) {
      setUserProfile(JSON.parse(profile))
    }
  }, [])

  const navItems = [
    { href: '/', label: 'Home', icon: Home },
    ...(userProfile ? [
      { href: '/dashboard', label: 'Dashboard', icon: BarChart3 },
      { href: '/dashboard/analytics', label: 'Analytics', icon: Eye },
    ] : [])
  ]

  const handleLogout = () => {
    localStorage.removeItem('userProfile')
    localStorage.removeItem('onboardingCompleted')
    localStorage.removeItem('bioCards')
    setUserProfile(null)
    setShowUserMenu(false)
    window.location.href = '/'
  }

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/'
    return pathname.startsWith(href)
  }

  return (
    <>
      {/* Desktop Navigation */}
      <nav className="hidden md:block bg-neo-white border-b-4 border-neo-black sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-neo-pink border-2 border-neo-black flex items-center justify-center font-bold">
                B
              </div>
              <span className="text-xl font-bold">BIO LINK</span>
            </Link>

            {/* Navigation Links */}
            <div className="flex items-center space-x-1">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center px-4 py-2 font-bold text-sm transition-all duration-150 ${
                    isActive(item.href)
                      ? 'bg-neo-yellow text-neo-black border-2 border-neo-black'
                      : 'text-neo-black hover:bg-neo-yellow hover:border-2 hover:border-neo-black'
                  }`}
                >
                  <item.icon className="w-4 h-4 mr-2" />
                  {item.label}
                </Link>
              ))}
            </div>

            {/* User Menu / CTA */}
            <div className="flex items-center space-x-3">
              {userProfile ? (
                <>
                  <Link href="/create">
                    <Button>
                      <Plus className="w-4 h-4 mr-2" />
                      CREATE
                    </Button>
                  </Link>
                  
                  <div className="relative">
                    <button
                      onClick={() => setShowUserMenu(!showUserMenu)}
                      className="flex items-center space-x-2 px-3 py-2 border-2 border-neo-black bg-white hover:bg-neo-yellow transition-colors"
                    >
                      <Avatar 
                        src={userProfile.avatar}
                        size="sm"
                        fallback="user"
                      />
                      <span className="font-bold text-sm">{userProfile.username}</span>
                    </button>

                    {showUserMenu && (
                      <div className="absolute top-full right-0 mt-2 w-48 bg-white border-3 border-neo-black shadow-neo z-50">
                        <div className="p-2">
                          <Link
                            href="/dashboard"
                            className="flex items-center px-3 py-2 hover:bg-neo-yellow transition-colors font-bold text-sm"
                            onClick={() => setShowUserMenu(false)}
                          >
                            <BarChart3 className="w-4 h-4 mr-2" />
                            Dashboard
                          </Link>
                          <Link
                            href="/dashboard/settings"
                            className="flex items-center px-3 py-2 hover:bg-neo-yellow transition-colors font-bold text-sm"
                            onClick={() => setShowUserMenu(false)}
                          >
                            <Settings className="w-4 h-4 mr-2" />
                            Settings
                          </Link>
                          <hr className="my-2 border-neo-gray" />
                          <button
                            onClick={handleLogout}
                            className="w-full flex items-center px-3 py-2 hover:bg-neo-yellow transition-colors font-bold text-sm text-left"
                          >
                            <LogOut className="w-4 h-4 mr-2" />
                            Logout
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <>
                  <Link href="/create">
                    <Button variant="outline">
                      <User className="w-4 h-4 mr-2" />
                      GET STARTED
                    </Button>
                  </Link>
                  <Link href="/create">
                    <Button>
                      <Plus className="w-4 h-4 mr-2" />
                      CREATE
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Navigation */}
      <nav className="md:hidden bg-neo-white border-b-4 border-neo-black sticky top-0 z-50">
        <div className="px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-neo-pink border-2 border-neo-black flex items-center justify-center font-bold">
                B
              </div>
              <span className="text-xl font-bold">BIO LINK</span>
            </Link>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 border-2 border-neo-black bg-white hover:bg-neo-yellow transition-colors"
            >
              {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

          {/* Mobile Menu */}
          {isOpen && (
            <div className="border-t-2 border-neo-black bg-white">
              <div className="py-4 space-y-2">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className={`flex items-center px-4 py-3 font-bold text-sm transition-all duration-150 ${
                      isActive(item.href)
                        ? 'bg-neo-yellow text-neo-black border-l-4 border-neo-black'
                        : 'text-neo-black hover:bg-neo-yellow hover:border-l-4 hover:border-neo-black'
                    }`}
                  >
                    <item.icon className="w-4 h-4 mr-3" />
                    {item.label}
                  </Link>
                ))}
                
                <div className="px-4 pt-4">
                  {userProfile ? (
                    <>
                      <Link href="/create" onClick={() => setIsOpen(false)}>
                        <Button className="w-full mb-3">
                          <Plus className="w-4 h-4 mr-2" />
                          CREATE NEW CARD
                        </Button>
                      </Link>
                      
                      <div className="flex items-center space-x-2 p-3 bg-neo-gray/10 border-2 border-neo-black mb-3">
                        <Avatar 
                          src={userProfile.avatar}
                          size="md"
                          fallback="user"
                        />
                        <div>
                          <div className="font-bold text-sm">{userProfile.displayName}</div>
                          <div className="text-xs text-neo-gray">@{userProfile.username}</div>
                        </div>
                      </div>
                      
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center justify-center px-4 py-2 border-2 border-neo-black bg-white hover:bg-neo-yellow transition-colors font-bold text-sm"
                      >
                        <LogOut className="w-4 h-4 mr-2" />
                        LOGOUT
                      </button>
                    </>
                  ) : (
                    <>
                      <Link href="/create" onClick={() => setIsOpen(false)}>
                        <Button variant="outline" className="w-full mb-3">
                          <User className="w-4 h-4 mr-2" />
                          GET STARTED
                        </Button>
                      </Link>
                      <Link href="/create" onClick={() => setIsOpen(false)}>
                        <Button className="w-full">
                          <Plus className="w-4 h-4 mr-2" />
                          CREATE NEW CARD
                        </Button>
                      </Link>
                    </>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>
    </>
  )
}