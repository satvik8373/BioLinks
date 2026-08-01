'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { UserPlus, Mail, Lock, User, AlertCircle, Sparkles } from 'lucide-react'
import { auth, googleProvider, githubProvider } from '@/lib/firebase'
import { signInWithPopup, createUserWithEmailAndPassword, updateProfile } from 'firebase/auth'

export default function SignUpPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      if (!formData.username || !formData.email || !formData.password || !formData.confirmPassword) {
        throw new Error('Please fill in all fields')
      }

      if (formData.username.length < 3) {
        throw new Error('Username must be at least 3 characters')
      }

      if (!formData.email.includes('@')) {
        throw new Error('Please enter a valid email')
      }

      if (formData.password.length < 6) {
        throw new Error('Password must be at least 6 characters')
      }

      if (formData.password !== formData.confirmPassword) {
        throw new Error('Passwords do not match')
      }

      try {
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          formData.email,
          formData.password
        )
        const user = userCredential.user

        await updateProfile(user, {
          displayName: formData.username
        })

        const userProfile = {
          id: user.uid,
          username: formData.username.toLowerCase(),
          email: formData.email,
          displayName: formData.username,
          avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.uid}`,
          createdAt: new Date().toISOString()
        }

        localStorage.setItem('userProfile', JSON.stringify(userProfile))
        localStorage.setItem('onboardingCompleted', 'false')
        router.push('/')
      } catch (firebaseError: any) {
        console.log('Firebase auth not configured, using mock signup')

        const userProfile = {
          id: Date.now().toString(),
          username: formData.username.toLowerCase(),
          email: formData.email,
          displayName: formData.username,
          avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${formData.username}`,
          createdAt: new Date().toISOString()
        }

        localStorage.setItem('userProfile', JSON.stringify(userProfile))
        localStorage.setItem('onboardingCompleted', 'false')
        router.push('/my-cards')
      }
    } catch (err: any) {
      setError(err.message || 'Sign up failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleSignUp = async () => {
    setError('')
    setLoading(true)

    try {
      const result = await signInWithPopup(auth, googleProvider)
      const user = result.user

      const userProfile = {
        id: user.uid,
        email: user.email || '',
        username: user.displayName?.toLowerCase().replace(/\s+/g, '') || user.email?.split('@')[0] || 'user',
        displayName: user.displayName || 'User',
        avatar: user.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.uid}`,
        createdAt: new Date().toISOString()
      }

      localStorage.setItem('userProfile', JSON.stringify(userProfile))
      localStorage.setItem('onboardingCompleted', 'false')
      router.push('/my-cards')
    } catch (err: any) {
      if (err.code === 'auth/popup-closed-by-user') {
        setError('Sign-up cancelled')
      } else if (err.code === 'auth/configuration-not-found') {
        setError('Google Sign-Up not configured in Firebase. Please contact support.')
      } else {
        setError(err.message || 'Google sign-up failed. Please try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleGithubSignUp = async () => {
    setError('')
    setLoading(true)

    try {
      const result = await signInWithPopup(auth, githubProvider)
      const user = result.user

      const userProfile = {
        id: user.uid,
        email: user.email || '',
        username: user.displayName?.toLowerCase().replace(/\s+/g, '') || user.email?.split('@')[0] || 'user',
        displayName: user.displayName || 'User',
        avatar: user.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.uid}`,
        createdAt: new Date().toISOString()
      }

      localStorage.setItem('userProfile', JSON.stringify(userProfile))
      localStorage.setItem('onboardingCompleted', 'false')
      router.push('/my-cards')
    } catch (err: any) {
      if (err.code === 'auth/popup-closed-by-user') {
        setError('Sign-up cancelled')
      } else if (err.code === 'auth/configuration-not-found') {
        setError('GitHub Sign-Up not configured in Firebase. Please contact support.')
      } else {
        setError(err.message || 'GitHub sign-up failed. Please try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-[90vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2.5 mb-4 group">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-indigo-500 to-indigo-600 flex items-center justify-center shadow-[3px_4px_12px_rgba(79,70,229,0.35)] text-white group-hover:scale-105 transition-transform">
              <Sparkles className="w-6 h-6" />
            </div>
            <span className="text-2xl font-extrabold text-indigo-950 tracking-tight">Bio<span className="text-rose-500">Link</span></span>
          </Link>
          <h1 className="text-3xl font-black text-indigo-950 mb-1">Create Account</h1>
          <p className="text-indigo-900/60 text-sm font-semibold">Build & share your bio link cards</p>
        </div>

        {/* Sharp Clay Container */}
        <div className="clay-card-flat p-8 bg-white">
          {error && (
            <div className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-200 flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-rose-600 flex-shrink-0" />
              <p className="text-xs font-extrabold text-rose-700">{error}</p>
            </div>
          )}

          <form onSubmit={handleSignUp} className="space-y-4">
            <div>
              <label className="block text-xs font-bold mb-1.5 text-indigo-950 uppercase tracking-wide">Username</label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-indigo-400" />
                <input
                  type="text"
                  name="username"
                  placeholder="johndoe"
                  value={formData.username}
                  onChange={handleChange}
                  disabled={loading}
                  className="clay-input pl-10"
                />
              </div>
              <p className="mt-1 text-[11px] font-semibold text-indigo-400">
                Your Link: biolinks.com/{formData.username || 'username'}
              </p>
            </div>

            <div>
              <label className="block text-xs font-bold mb-1.5 text-indigo-950 uppercase tracking-wide">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-indigo-400" />
                <input
                  type="email"
                  name="email"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  disabled={loading}
                  className="clay-input pl-10"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold mb-1.5 text-indigo-950 uppercase tracking-wide">Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-indigo-400" />
                <input
                  type="password"
                  name="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  disabled={loading}
                  className="clay-input pl-10"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold mb-1.5 text-indigo-950 uppercase tracking-wide">Confirm Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-indigo-400" />
                <input
                  type="password"
                  name="confirmPassword"
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  disabled={loading}
                  className="clay-input pl-10"
                />
              </div>
            </div>

            <div className="flex items-start gap-2 pt-1">
              <input
                type="checkbox"
                required
                className="w-4 h-4 accent-indigo-600 rounded mt-0.5"
              />
              <span className="text-xs text-indigo-950 font-bold">
                I agree to the{' '}
                <Link href="/terms" className="text-rose-500 hover:underline">Terms</Link>{' '}
                and{' '}
                <Link href="/privacy" className="text-rose-500 hover:underline">Privacy Policy</Link>
              </span>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="clay-btn clay-btn-primary w-full py-3.5 text-sm font-black mt-2"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <UserPlus className="w-4 h-4 mr-2" /> Create Free Account
                </>
              )}
            </button>
          </form>

          <p className="text-center text-xs font-bold text-indigo-900/60 mt-6">
            Already have an account?{' '}
            <Link href="/login" className="font-black text-rose-500 hover:text-rose-600 transition-colors">
              Sign In
            </Link>
          </p>

          {/* Social Sign-Up */}
          <div className="mt-6 pt-6 border-t border-indigo-50">
            <p className="text-center text-xs text-indigo-400 font-extrabold uppercase tracking-wider mb-4">Or sign up with</p>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={handleGoogleSignUp}
                disabled={loading}
                className="clay-btn clay-btn-ghost py-2.5 text-xs font-extrabold flex items-center justify-center gap-2"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Google
              </button>
              <button
                type="button"
                onClick={handleGithubSignUp}
                disabled={loading}
                className="clay-btn clay-btn-ghost py-2.5 text-xs font-extrabold flex items-center justify-center gap-2"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
                GitHub
              </button>
            </div>
          </div>
        </div>

        <div className="mt-6 text-center">
          <Link href="/create" className="text-xs font-extrabold text-indigo-600 hover:text-indigo-800 transition-colors">
            Try Without Account →
          </Link>
        </div>
      </div>
    </div>
  )
}
