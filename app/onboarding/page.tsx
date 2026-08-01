'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import Input from '@/components/ui/Input'
import Avatar from '@/components/ui/Avatar'
import { 
  User, 
  Mail, 
  MapPin, 
  Globe, 
  Briefcase, 
  ArrowRight, 
  ArrowLeft,
  Check,
  Upload,
  Camera,
  Sparkles
} from 'lucide-react'

interface UserProfile {
  username: string
  displayName: string
  email: string
  bio: string
  location: string
  website: string
  profession: string
  avatar: string
  interests: string[]
}

const INTEREST_OPTIONS = [
  'Business', 'Technology', 'Design', 'Marketing', 'Content Creation',
  'Photography', 'Music', 'Art', 'Fashion', 'Fitness', 'Food',
  'Travel', 'Education', 'Gaming', 'Sports', 'Health', 'Finance'
]

export default function OnboardingPage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [profile, setProfile] = useState<UserProfile>({
    username: '',
    displayName: '',
    email: '',
    bio: '',
    location: '',
    website: '',
    profession: '',
    avatar: 'user',
    interests: []
  })

  const totalSteps = 4

  useEffect(() => {
    const savedProfile = localStorage.getItem('userProfile')
    if (savedProfile) {
      const parsed = JSON.parse(savedProfile)
      setProfile(prev => ({ ...prev, ...parsed }))
    }
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setProfile(prev => ({ ...prev, [name]: value }))
  }

  const toggleInterest = (interest: string) => {
    setProfile(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest]
    }))
  }

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(prev => prev + 1)
    } else {
      completeOnboarding()
    }
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1)
    }
  }

  const completeOnboarding = () => {
    localStorage.setItem('userProfile', JSON.stringify(profile))
    localStorage.setItem('onboardingCompleted', 'true')
    router.push('/create')
  }

  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return profile.username.length >= 3 && profile.displayName.length >= 2
      case 2:
        return profile.email.includes('@') && profile.bio.length >= 10
      case 3:
        return true
      case 4:
        return profile.interests.length >= 1
      default:
        return false
    }
  }

  const handleAvatarUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setProfile(prev => ({ ...prev, avatar: reader.result as string }))
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <div className="min-h-screen py-12 px-4 flex flex-col justify-center items-center">
      <div className="w-full max-w-xl">

        {/* Brand Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2.5 mb-4 group">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-indigo-500 to-indigo-600 flex items-center justify-center shadow-[3px_4px_12px_rgba(79,70,229,0.35)] text-white group-hover:scale-105 transition-transform">
              <Sparkles className="w-6 h-6" />
            </div>
            <span className="text-2xl font-extrabold text-indigo-950 tracking-tight">Bio<span className="text-rose-500">Link</span></span>
          </Link>
          <h1 className="text-3xl font-black text-indigo-950 mb-1">Set Up Your Profile</h1>
          <p className="text-indigo-900/60 text-sm font-semibold">Step {currentStep} of {totalSteps}: Customize how your bio page looks</p>
        </div>

        {/* Progress Dots */}
        <div className="flex items-center justify-center gap-3 mb-8">
          {Array.from({ length: totalSteps }, (_, i) => i + 1).map((step) => (
            <div
              key={step}
              className={`h-2.5 rounded-full transition-all duration-300 ${
                step === currentStep
                  ? 'w-10 bg-indigo-600 shadow-sm'
                  : step < currentStep
                  ? 'w-2.5 bg-rose-500'
                  : 'w-2.5 bg-indigo-200'
              }`}
            />
          ))}
        </div>

        {/* Form Container */}
        <div className="clay-card-flat p-8 bg-white">

          {/* STEP 1 */}
          {currentStep === 1 && (
            <div className="space-y-5">
              <h2 className="text-xl font-extrabold text-indigo-950 border-b border-indigo-50 pb-3">Basic Information</h2>
              
              <div>
                <label className="block text-xs font-bold text-indigo-950 uppercase tracking-wide mb-1.5">Username</label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-indigo-400" />
                  <Input
                    type="text"
                    name="username"
                    placeholder="johndoe"
                    value={profile.username}
                    onChange={handleChange}
                    className="pl-10"
                  />
                </div>
                <p className="mt-1 text-[11px] font-semibold text-indigo-400">biolinks.com/{profile.username || 'username'}</p>
              </div>

              <div>
                <label className="block text-xs font-bold text-indigo-950 uppercase tracking-wide mb-1.5">Display Name</label>
                <Input
                  type="text"
                  name="displayName"
                  placeholder="John Doe"
                  value={profile.displayName}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-indigo-950 uppercase tracking-wide mb-2">Avatar Picture</label>
                <div className="flex items-center gap-4">
                  <Avatar src={profile.avatar} size="xl" />
                  <div className="space-y-2">
                    <label className="clay-btn clay-btn-ghost px-4 py-2 text-xs font-bold cursor-pointer inline-flex items-center gap-1.5">
                      <Camera className="w-3.5 h-3.5 text-indigo-600" />
                      Upload Photo
                      <input type="file" accept="image/*" onChange={handleAvatarUpload} className="hidden" />
                    </label>
                    <p className="text-[11px] font-medium text-indigo-900/50">PNG, JPG up to 5MB</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2 */}
          {currentStep === 2 && (
            <div className="space-y-5">
              <h2 className="text-xl font-extrabold text-indigo-950 border-b border-indigo-50 pb-3">Contact & Bio</h2>

              <div>
                <label className="block text-xs font-bold text-indigo-950 uppercase tracking-wide mb-1.5">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-indigo-400" />
                  <Input
                    type="email"
                    name="email"
                    placeholder="you@example.com"
                    value={profile.email}
                    onChange={handleChange}
                    className="pl-10"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-indigo-950 uppercase tracking-wide mb-1.5">Short Bio</label>
                <textarea
                  name="bio"
                  rows={3}
                  placeholder="Tell your story, what you build or create..."
                  value={profile.bio}
                  onChange={handleChange}
                  className="clay-input"
                />
              </div>
            </div>
          )}

          {/* STEP 3 */}
          {currentStep === 3 && (
            <div className="space-y-5">
              <h2 className="text-xl font-extrabold text-indigo-950 border-b border-indigo-50 pb-3">Location & Work (Optional)</h2>

              <div>
                <label className="block text-xs font-bold text-indigo-950 uppercase tracking-wide mb-1.5">Profession / Title</label>
                <div className="relative">
                  <Briefcase className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-indigo-400" />
                  <Input
                    type="text"
                    name="profession"
                    placeholder="Digital Creator / Entrepreneur"
                    value={profile.profession}
                    onChange={handleChange}
                    className="pl-10"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-indigo-950 uppercase tracking-wide mb-1.5">Location</label>
                <div className="relative">
                  <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-indigo-400" />
                  <Input
                    type="text"
                    name="location"
                    placeholder="New York, USA"
                    value={profile.location}
                    onChange={handleChange}
                    className="pl-10"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-indigo-950 uppercase tracking-wide mb-1.5">Personal Website</label>
                <div className="relative">
                  <Globe className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-indigo-400" />
                  <Input
                    type="url"
                    name="website"
                    placeholder="https://yourwebsite.com"
                    value={profile.website}
                    onChange={handleChange}
                    className="pl-10"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 4 */}
          {currentStep === 4 && (
            <div className="space-y-5">
              <h2 className="text-xl font-extrabold text-indigo-950 border-b border-indigo-50 pb-3">Your Focus & Interests</h2>
              <p className="text-xs font-semibold text-indigo-900/60">Pick categories that describe your page</p>

              <div className="flex flex-wrap gap-2 pt-2">
                {INTEREST_OPTIONS.map((interest) => {
                  const isSelected = profile.interests.includes(interest)
                  return (
                    <button
                      key={interest}
                      type="button"
                      onClick={() => toggleInterest(interest)}
                      className={`px-3.5 py-2 rounded-xl text-xs font-extrabold transition-all ${
                        isSelected
                          ? 'bg-rose-500 text-white shadow-[2px_3px_8px_rgba(244,63,94,0.3)]'
                          : 'bg-indigo-50 text-indigo-950 hover:bg-indigo-100'
                      }`}
                    >
                      {interest}
                    </button>
                  )
                })}
              </div>
            </div>
          )}

          {/* Navigation Actions */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t border-indigo-50">
            <Button
              onClick={handleBack}
              variant="outline"
              disabled={currentStep === 1}
              size="sm"
            >
              <ArrowLeft className="w-4 h-4 mr-1.5" /> Back
            </Button>

            <Button
              onClick={handleNext}
              disabled={!isStepValid()}
              variant="primary"
              size="sm"
            >
              {currentStep === totalSteps ? (
                <>
                  <Check className="w-4 h-4 mr-1.5" /> Complete Setup
                </>
              ) : (
                <>
                  Next <ArrowRight className="w-4 h-4 ml-1.5" />
                </>
              )}
            </Button>
          </div>

        </div>
      </div>
    </div>
  )
}