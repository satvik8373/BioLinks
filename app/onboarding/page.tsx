'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import Input from '@/components/ui/Input'
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
  PartyPopper,
  Sparkles,
  Image as ImageIcon
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
    // Check if user has already completed onboarding
    const existingProfile = localStorage.getItem('userProfile')
    if (existingProfile) {
      router.push('/dashboard')
    }
  }, [router])

  const updateProfile = (field: keyof UserProfile, value: any) => {
    setProfile(prev => ({ ...prev, [field]: value }))
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
    // Save profile to localStorage (in real app, this would be saved to database)
    localStorage.setItem('userProfile', JSON.stringify(profile))
    localStorage.setItem('onboardingCompleted', 'true')
    
    // Redirect to create page
    router.push('/create')
  }

  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return profile.username.length >= 3 && profile.displayName.length >= 2
      case 2:
        return profile.email.includes('@') && profile.bio.length >= 10
      case 3:
        return true // Optional fields
      case 4:
        return profile.interests.length >= 1
      default:
        return false
    }
  }

  const handleAvatarUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert('File size must be less than 2MB')
        return
      }
      
      const reader = new FileReader()
      reader.onload = (e) => {
        const result = e.target?.result as string
        updateProfile('avatar', result)
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <div className="min-h-screen bg-neo-white flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold flex items-center">
              Welcome to BioLink! <PartyPopper className="w-6 h-6 ml-2" />
            </h1>
            <span className="text-sm font-bold text-neo-gray">
              Step {currentStep} of {totalSteps}
            </span>
          </div>
          
          <div className="w-full bg-neo-gray/20 border-2 border-neo-black h-3">
            <div 
              className="bg-neo-pink h-full border-r-2 border-neo-black transition-all duration-300"
              style={{ width: `${(currentStep / totalSteps) * 100}%` }}
            />
          </div>
        </div>

        <Card className="p-8">
          {/* Step 1: Basic Info */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-neo-yellow border-4 border-neo-black rounded-full flex items-center justify-center text-2xl mx-auto mb-4">
                  <User className="w-8 h-8" />
                </div>
                <h2 className="text-2xl font-bold mb-2">Let's start with the basics</h2>
                <p className="text-neo-gray">Choose your username and display name</p>
              </div>

              <div className="space-y-4">
                <Input
                  label="USERNAME *"
                  value={profile.username}
                  onChange={(e) => updateProfile('username', e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''))}
                  placeholder="johndoe"
                  prefix="@"
                />
                <div className="text-xs text-neo-gray">
                  Your unique username (3+ characters, letters, numbers, and underscores only)
                </div>

                <Input
                  label="DISPLAY NAME *"
                  value={profile.displayName}
                  onChange={(e) => updateProfile('displayName', e.target.value)}
                  placeholder="John Doe"
                />
                <div className="text-xs text-neo-gray">
                  How your name will appear on your bio link
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Profile Details */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-neo-cyan border-4 border-neo-black rounded-full flex items-center justify-center text-2xl mx-auto mb-4">
                  <Mail className="w-8 h-8" />
                </div>
                <h2 className="text-2xl font-bold mb-2">Tell us about yourself</h2>
                <p className="text-neo-gray">Add your contact info and bio</p>
              </div>

              <div className="space-y-4">
                <Input
                  label="EMAIL ADDRESS *"
                  type="email"
                  value={profile.email}
                  onChange={(e) => updateProfile('email', e.target.value)}
                  placeholder="john@example.com"
                />

                <div>
                  <label className="block text-sm font-bold mb-2">BIO / DESCRIPTION *</label>
                  <textarea
                    value={profile.bio}
                    onChange={(e) => updateProfile('bio', e.target.value)}
                    className="w-full px-4 py-3 border-4 border-neo-black bg-white focus:outline-none focus:shadow-neo font-medium resize-none"
                    rows={4}
                    placeholder="Tell people about yourself, your business, or what you do..."
                    maxLength={500}
                  />
                  <div className="text-xs text-neo-gray mt-1">
                    {profile.bio.length}/500 characters (minimum 10 characters)
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Additional Info */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-neo-green border-4 border-neo-black rounded-full flex items-center justify-center text-2xl mx-auto mb-4">
                  <Briefcase className="w-8 h-8" />
                </div>
                <h2 className="text-2xl font-bold mb-2">Professional details</h2>
                <p className="text-neo-gray">Add your location, website, and profession (optional)</p>
              </div>

              <div className="space-y-4">
                {/* Avatar Upload */}
                <div>
                  <label className="block text-sm font-bold mb-2">PROFILE PICTURE</label>
                  <div className="flex items-center space-x-4">
                    <div className="w-20 h-20 bg-neo-white border-4 border-neo-black rounded-full flex items-center justify-center text-2xl overflow-hidden">
                      {profile.avatar && profile.avatar.startsWith('data:') ? (
                        <img 
                          src={profile.avatar} 
                          alt="Avatar" 
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                            const parent = e.currentTarget.parentElement;
                            if (parent) {
                              parent.innerHTML = '';
                              const icon = document.createElement('div');
                              icon.className = 'w-full h-full flex items-center justify-center';
                              parent.appendChild(icon);
                            }
                          }}
                        />
                      ) : (
                        profile.avatar === 'user' ? <Camera className="w-10 h-10" /> : profile.avatar
                      )}
                    </div>
                    <div className="flex-1">
                      <Button 
                        onClick={() => document.getElementById('avatar-upload')?.click()}
                        variant="outline"
                        size="sm"
                      >
                        <Upload className="w-4 h-4 mr-2" />
                        UPLOAD PHOTO
                      </Button>
                      <input
                        id="avatar-upload"
                        type="file"
                        accept="image/*"
                        onChange={handleAvatarUpload}
                        className="hidden"
                      />
                      <p className="text-xs text-neo-gray mt-1">Or use an emoji as your avatar</p>
                    </div>
                  </div>
                  <Input
                    value={profile.avatar && profile.avatar.startsWith('data:') ? 'image' : profile.avatar}
                    onChange={(e) => updateProfile('avatar', e.target.value)}
                    placeholder="user"
                    className="mt-2 text-center text-2xl"
                  />
                </div>

                <Input
                  label="PROFESSION"
                  value={profile.profession}
                  onChange={(e) => updateProfile('profession', e.target.value)}
                  placeholder="e.g., Digital Marketer, Content Creator, CEO"
                />

                <Input
                  label="LOCATION"
                  value={profile.location}
                  onChange={(e) => updateProfile('location', e.target.value)}
                  placeholder="City, Country"
                />

                <Input
                  label="WEBSITE"
                  value={profile.website}
                  onChange={(e) => updateProfile('website', e.target.value)}
                  placeholder="https://yourwebsite.com"
                />
              </div>
            </div>
          )}

          {/* Step 4: Interests */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-neo-orange border-4 border-neo-black rounded-full flex items-center justify-center text-2xl mx-auto mb-4">
                  <Sparkles className="w-8 h-8" />
                </div>
                <h2 className="text-2xl font-bold mb-2">What are your interests?</h2>
                <p className="text-neo-gray">Select at least one to help us recommend themes</p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {INTEREST_OPTIONS.map((interest) => (
                  <button
                    key={interest}
                    onClick={() => toggleInterest(interest)}
                    className={`p-3 border-3 border-neo-black font-bold text-sm transition-all ${
                      profile.interests.includes(interest)
                        ? 'bg-neo-pink text-neo-black shadow-neo'
                        : 'bg-white text-neo-black hover:bg-neo-yellow'
                    }`}
                  >
                    {interest}
                  </button>
                ))}
              </div>

              <div className="text-sm text-neo-gray">
                Selected: {profile.interests.length} interest{profile.interests.length !== 1 ? 's' : ''}
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t-2 border-neo-gray">
            <Button
              onClick={handleBack}
              variant="outline"
              disabled={currentStep === 1}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              BACK
            </Button>

            <Button
              onClick={handleNext}
              disabled={!isStepValid()}
            >
              {currentStep === totalSteps ? (
                <>
                  <Check className="w-4 h-4 mr-2" />
                  COMPLETE SETUP
                </>
              ) : (
                <>
                  NEXT
                  <ArrowRight className="w-4 h-4 ml-2" />
                </>
              )}
            </Button>
          </div>
        </Card>

        {/* Skip Option */}
        {currentStep > 2 && (
          <div className="text-center mt-4">
            <button
              onClick={completeOnboarding}
              className="text-sm text-neo-gray hover:text-neo-black font-medium"
            >
              Skip and continue with basic setup
            </button>
          </div>
        )}
      </div>
    </div>
  )
}