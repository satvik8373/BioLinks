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
  Save,
  Upload,
  Trash2,
  AlertTriangle,
  Camera
} from 'lucide-react'

export default function SettingsPage() {
  const router = useRouter()
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  useEffect(() => {
    const savedProfile = localStorage.getItem('userProfile')
    const onboardingCompleted = localStorage.getItem('onboardingCompleted')
    
    if (!savedProfile || !onboardingCompleted) {
      router.push('/onboarding')
      return
    }

    setProfile(JSON.parse(savedProfile))
    setLoading(false)
  }, [router])

  const updateProfile = (field: string, value: any) => {
    setProfile((prev: any) => ({ ...prev, [field]: value }))
  }

  const handleSave = async () => {
    setSaving(true)
    
    try {
      localStorage.setItem('userProfile', JSON.stringify(profile))
      
      // Update all existing cards with new profile info
      const savedCards = JSON.parse(localStorage.getItem('bioCards') || '{}')
      const updatedCards = Object.keys(savedCards).reduce((acc, cardId) => {
        acc[cardId] = {
          ...savedCards[cardId],
          config: {
            ...savedCards[cardId].config,
            profile: {
              ...savedCards[cardId].config.profile,
              title: profile.displayName || profile.username,
              bio: profile.bio,
              avatar: profile.avatar
            }
          }
        }
        return acc
      }, {} as any)
      
      localStorage.setItem('bioCards', JSON.stringify(updatedCards))
      
      alert('Profile updated successfully!')
    } catch (error) {
      console.error('Error saving profile:', error)
      alert('Error saving profile. Please try again.')
    } finally {
      setSaving(false)
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

  const handleDeleteAccount = () => {
    if (showDeleteConfirm) {
      // Delete all data
      localStorage.removeItem('userProfile')
      localStorage.removeItem('onboardingCompleted')
      localStorage.removeItem('bioCards')
      
      alert('Account deleted successfully.')
      router.push('/')
    } else {
      setShowDeleteConfirm(true)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-neo-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-4 border-neo-black border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="font-bold">Loading settings...</p>
        </div>
      </div>
    )
  }

  if (!profile) {
    return null
  }

  return (
    <div className="min-h-screen bg-neo-white">
      {/* Header */}
      <div className="bg-neo-cyan border-b-4 border-neo-black px-4 py-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-2">ACCOUNT SETTINGS</h1>
          <p className="font-medium text-neo-gray">Manage your profile information and preferences</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Settings */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Information */}
            <Card>
              <h2 className="text-xl font-bold mb-6">BASIC INFORMATION</h2>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="USERNAME"
                    value={profile.username}
                    onChange={(e) => updateProfile('username', e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''))}
                    prefix="@"
                  />
                  
                  <Input
                    label="DISPLAY NAME"
                    value={profile.displayName}
                    onChange={(e) => updateProfile('displayName', e.target.value)}
                  />
                </div>

                <Input
                  label="EMAIL ADDRESS"
                  type="email"
                  value={profile.email}
                  onChange={(e) => updateProfile('email', e.target.value)}
                />

                <div>
                  <label className="block text-sm font-bold mb-2">BIO / DESCRIPTION</label>
                  <textarea
                    value={profile.bio}
                    onChange={(e) => updateProfile('bio', e.target.value)}
                    className="w-full px-4 py-3 border-4 border-neo-black bg-white focus:outline-none focus:shadow-neo font-medium resize-none"
                    rows={4}
                    maxLength={500}
                  />
                  <div className="text-xs text-neo-gray mt-1">
                    {profile.bio.length}/500 characters
                  </div>
                </div>
              </div>
            </Card>

            {/* Profile Picture */}
            <Card>
              <h2 className="text-xl font-bold mb-6">PROFILE PICTURE</h2>
              <div className="flex items-start space-x-6">
                <div className="w-24 h-24 bg-neo-white border-4 border-neo-black rounded-full flex items-center justify-center text-3xl overflow-hidden">
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
                          const iconDiv = document.createElement('div');
                          iconDiv.className = 'w-full h-full flex items-center justify-center';
                          parent.appendChild(iconDiv);
                        }
                      }}
                    />
                  ) : (
                    profile.avatar === 'user' ? <Camera className="w-12 h-12" /> : profile.avatar
                  )}
                </div>
                
                <div className="flex-1 space-y-4">
                  <div>
                    <label className="block text-sm font-bold mb-2">AVATAR (TEXT OR ICON)</label>
                    <input
                      type="text"
                      value={profile.avatar && profile.avatar.startsWith('data:') ? 'image' : (profile.avatar || 'user')}
                      onChange={(e) => updateProfile('avatar', e.target.value)}
                      className="w-full px-4 py-3 border-4 border-neo-black bg-white focus:outline-none focus:shadow-neo font-medium text-center text-2xl"
                      placeholder="user"
                    />
                  </div>
                  
                  <div>
                    <Button 
                      onClick={() => document.getElementById('avatar-upload')?.click()}
                      variant="outline"
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
                    <p className="text-xs text-neo-gray mt-2">Max 2MB. JPG, PNG, GIF supported.</p>
                  </div>
                </div>
              </div>
            </Card>

            {/* Additional Information */}
            <Card>
              <h2 className="text-xl font-bold mb-6">ADDITIONAL INFORMATION</h2>
              <div className="space-y-4">
                <Input
                  label="PROFESSION / TITLE"
                  value={profile.profession || ''}
                  onChange={(e) => updateProfile('profession', e.target.value)}
                  placeholder="e.g., Digital Marketer, Content Creator, CEO"
                />

                <Input
                  label="LOCATION"
                  value={profile.location || ''}
                  onChange={(e) => updateProfile('location', e.target.value)}
                  placeholder="City, Country"
                />

                <Input
                  label="WEBSITE"
                  value={profile.website || ''}
                  onChange={(e) => updateProfile('website', e.target.value)}
                  placeholder="https://yourwebsite.com"
                />
              </div>
            </Card>

            {/* Danger Zone */}
            <Card className="border-red-500">
              <h2 className="text-xl font-bold mb-6 text-red-600">DANGER ZONE</h2>
              <div className="space-y-4">
                <div className="p-4 bg-red-50 border-2 border-red-200">
                  <div className="flex items-start space-x-3">
                    <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5" />
                    <div className="flex-1">
                      <h3 className="font-bold text-red-800 mb-1">Delete Account</h3>
                      <p className="text-sm text-red-700 mb-3">
                        This will permanently delete your account, profile, and all your bio link cards. This action cannot be undone.
                      </p>
                      
                      {showDeleteConfirm ? (
                        <div className="flex items-center space-x-3">
                          <Button 
                            onClick={handleDeleteAccount}
                            className="bg-red-600 hover:bg-red-700 text-white"
                            size="sm"
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            CONFIRM DELETE
                          </Button>
                          <Button 
                            onClick={() => setShowDeleteConfirm(false)}
                            variant="outline"
                            size="sm"
                          >
                            Cancel
                          </Button>
                        </div>
                      ) : (
                        <Button 
                          onClick={() => setShowDeleteConfirm(true)}
                          variant="outline"
                          className="border-red-500 text-red-600 hover:bg-red-50"
                          size="sm"
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          DELETE ACCOUNT
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Save Changes */}
            <Card>
              <h3 className="font-bold text-lg mb-4">SAVE CHANGES</h3>
              <Button 
                onClick={handleSave}
                disabled={saving}
                className="w-full"
              >
                <Save className="w-4 h-4 mr-2" />
                {saving ? 'SAVING...' : 'SAVE CHANGES'}
              </Button>
              <p className="text-xs text-neo-gray mt-2">
                Changes will be applied to all your existing bio link cards.
              </p>
            </Card>

            {/* Profile Preview */}
            <Card>
              <h3 className="font-bold text-lg mb-4">PROFILE PREVIEW</h3>
              <div className="text-center p-4 bg-neo-gray/10 border-2 border-neo-gray">
                <div className="w-16 h-16 bg-neo-white border-4 border-neo-black rounded-full flex items-center justify-center text-xl mx-auto mb-3 overflow-hidden">
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
                          const iconDiv = document.createElement('div');
                          iconDiv.className = 'w-full h-full flex items-center justify-center';
                          parent.appendChild(iconDiv);
                        }
                      }}
                    />
                  ) : (
                    profile.avatar === 'user' ? <User className="w-8 h-8" /> : profile.avatar
                  )}
                </div>
                <h4 className="font-bold text-lg">{profile.displayName}</h4>
                <p className="text-sm text-neo-gray">@{profile.username}</p>
                <p className="text-sm mt-2">{profile.bio}</p>
                {profile.profession && (
                  <p className="text-xs text-neo-gray mt-1">{profile.profession}</p>
                )}
                {profile.location && (
                  <p className="text-xs text-neo-gray">{profile.location}</p>
                )}
              </div>
            </Card>

            {/* Account Stats */}
            <Card>
              <h3 className="font-bold text-lg mb-4">ACCOUNT STATS</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span>Member since:</span>
                  <span className="font-bold">
                    {new Date().toLocaleDateString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Total cards:</span>
                  <span className="font-bold">
                    {Object.keys(JSON.parse(localStorage.getItem('bioCards') || '{}')).length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Profile completion:</span>
                  <span className="font-bold text-neo-green">100%</span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}