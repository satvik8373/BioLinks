// Social Media and Service Icons Library (Professional SVG icons, no emojis)
export interface ServiceIcon {
  id: string
  name: string
  category: string
  color: string
  url?: string
  placeholder?: string
}

export const ICON_CATEGORIES = [
  'Social Media',
  'Music & Audio',
  'Video & Streaming',
  'E-commerce',
  'Professional',
  'Communication',
  'Gaming',
  'Finance',
  'Education',
  'Health & Fitness',
  'Food & Drink',
  'Travel',
  'News & Media',
  'Technology',
  'Creative',
  'Business Tools',
  'Dating',
  'Shopping',
  'Crypto',
  'NFT & Web3'
] as const

export const SERVICE_ICONS: ServiceIcon[] = [
  // Social Media
  { id: 'instagram', name: 'Instagram', category: 'Social Media', color: '#E4405F', placeholder: 'https://instagram.com/username' },
  { id: 'tiktok', name: 'TikTok', category: 'Social Media', color: '#000000', placeholder: 'https://tiktok.com/@username' },
  { id: 'youtube', name: 'YouTube', category: 'Social Media', color: '#FF0000', placeholder: 'https://youtube.com/@username' },
  { id: 'twitter', name: 'Twitter/X', category: 'Social Media', color: '#1DA1F2', placeholder: 'https://twitter.com/username' },
  { id: 'facebook', name: 'Facebook', category: 'Social Media', color: '#1877F2', placeholder: 'https://facebook.com/username' },
  { id: 'linkedin', name: 'LinkedIn', category: 'Social Media', color: '#0A66C2', placeholder: 'https://linkedin.com/in/username' },
  { id: 'snapchat', name: 'Snapchat', category: 'Social Media', color: '#FFFC00', placeholder: 'https://snapchat.com/add/username' },
  { id: 'pinterest', name: 'Pinterest', category: 'Social Media', color: '#BD081C', placeholder: 'https://pinterest.com/username' },
  { id: 'reddit', name: 'Reddit', category: 'Social Media', color: '#FF4500', placeholder: 'https://reddit.com/u/username' },
  { id: 'discord', name: 'Discord', category: 'Social Media', color: '#5865F2', placeholder: 'https://discord.gg/server' },
  { id: 'telegram', name: 'Telegram', category: 'Social Media', color: '#0088CC', placeholder: 'https://t.me/username' },
  { id: 'whatsapp', name: 'WhatsApp', category: 'Social Media', color: '#25D366', placeholder: 'https://wa.me/1234567890' },
  { id: 'threads', name: 'Threads', category: 'Social Media', color: '#000000', placeholder: 'https://threads.net/@username' },
  { id: 'mastodon', name: 'Mastodon', category: 'Social Media', color: '#6364FF', placeholder: 'https://mastodon.social/@username' },
  { id: 'bluesky', name: 'Bluesky', category: 'Social Media', color: '#00A8E8', placeholder: 'https://bsky.app/profile/username' },

  // Music & Audio
  { id: 'spotify', name: 'Spotify', category: 'Music & Audio', color: '#1DB954', placeholder: 'https://open.spotify.com/artist/...' },
  { id: 'apple-music', name: 'Apple Music', category: 'Music & Audio', color: '#FA243C', placeholder: 'https://music.apple.com/artist/...' },
  { id: 'soundcloud', name: 'SoundCloud', category: 'Music & Audio', color: '#FF3300', placeholder: 'https://soundcloud.com/username' },
  { id: 'bandcamp', name: 'Bandcamp', category: 'Music & Audio', color: '#629AA0', placeholder: 'https://username.bandcamp.com' },
  { id: 'audiomack', name: 'Audiomack', category: 'Music & Audio', color: '#FF6600', placeholder: 'https://audiomack.com/username' },
  { id: 'deezer', name: 'Deezer', category: 'Music & Audio', color: '#FEAA2D', placeholder: 'https://deezer.com/artist/...' },
  { id: 'tidal', name: 'Tidal', category: 'Music & Audio', color: '#000000', placeholder: 'https://tidal.com/artist/...' },
  { id: 'amazon-music', name: 'Amazon Music', category: 'Music & Audio', color: '#FF9900', placeholder: 'https://music.amazon.com/artists/...' },
  { id: 'pandora', name: 'Pandora', category: 'Music & Audio', color: '#005483', placeholder: 'https://pandora.com/artist/...' },
  { id: 'podcast', name: 'Podcast', category: 'Music & Audio', color: '#9146FF', placeholder: 'https://your-podcast-link.com' },

  // Video & Streaming
  { id: 'twitch', name: 'Twitch', category: 'Video & Streaming', color: '#9146FF', placeholder: 'https://twitch.tv/username' },
  { id: 'netflix', name: 'Netflix', category: 'Video & Streaming', color: '#E50914', placeholder: 'https://netflix.com/title/...' },
  { id: 'vimeo', name: 'Vimeo', category: 'Video & Streaming', color: '#1AB7EA', placeholder: 'https://vimeo.com/username' },
  { id: 'dailymotion', name: 'Dailymotion', category: 'Video & Streaming', color: '#0066DC', placeholder: 'https://dailymotion.com/username' },
  { id: 'rumble', name: 'Rumble', category: 'Video & Streaming', color: '#85C742', placeholder: 'https://rumble.com/c/username' },
  { id: 'kick', name: 'Kick', category: 'Video & Streaming', color: '#53FC18', placeholder: 'https://kick.com/username' },

  // E-commerce
  { id: 'shopify', name: 'Shopify', category: 'E-commerce', color: '#7AB55C', placeholder: 'https://your-store.myshopify.com' },
  { id: 'etsy', name: 'Etsy', category: 'E-commerce', color: '#F16521', placeholder: 'https://etsy.com/shop/username' },
  { id: 'amazon', name: 'Amazon', category: 'E-commerce', color: '#FF9900', placeholder: 'https://amazon.com/dp/...' },
  { id: 'ebay', name: 'eBay', category: 'E-commerce', color: '#E53238', placeholder: 'https://ebay.com/usr/username' },
  { id: 'gumroad', name: 'Gumroad', category: 'E-commerce', color: '#FF90E8', placeholder: 'https://gumroad.com/l/product' },
  { id: 'square', name: 'Square', category: 'E-commerce', color: '#3E4348', placeholder: 'https://square.link/u/...' },
  { id: 'stripe', name: 'Stripe', category: 'E-commerce', color: '#635BFF', placeholder: 'https://buy.stripe.com/...' },
  { id: 'paypal', name: 'PayPal', category: 'E-commerce', color: '#00457C', placeholder: 'https://paypal.me/username' },

  // Professional
  { id: 'github', name: 'GitHub', category: 'Professional', color: '#181717', placeholder: 'https://github.com/username' },
  { id: 'behance', name: 'Behance', category: 'Professional', color: '#1769FF', placeholder: 'https://behance.net/username' },
  { id: 'dribbble', name: 'Dribbble', category: 'Professional', color: '#EA4C89', placeholder: 'https://dribbble.com/username' },
  { id: 'portfolio', name: 'Portfolio', category: 'Professional', color: '#6366F1', placeholder: 'https://your-portfolio.com' },
  { id: 'resume', name: 'Resume/CV', category: 'Professional', color: '#059669', placeholder: 'https://your-resume-link.com' },
  { id: 'calendly', name: 'Calendly', category: 'Professional', color: '#006BFF', placeholder: 'https://calendly.com/username' },

  // Communication
  { id: 'email', name: 'Email', category: 'Communication', color: '#EA4335', placeholder: 'mailto:your@email.com' },
  { id: 'phone', name: 'Phone', category: 'Communication', color: '#34D399', placeholder: 'tel:+1234567890' },
  { id: 'zoom', name: 'Zoom', category: 'Communication', color: '#2D8CFF', placeholder: 'https://zoom.us/j/...' },
  { id: 'skype', name: 'Skype', category: 'Communication', color: '#00AFF0', placeholder: 'skype:username?chat' },
  { id: 'slack', name: 'Slack', category: 'Communication', color: '#4A154B', placeholder: 'https://workspace.slack.com' },

  // Gaming
  { id: 'steam', name: 'Steam', category: 'Gaming', color: '#171A21', placeholder: 'https://steamcommunity.com/id/username' },
  { id: 'xbox', name: 'Xbox', category: 'Gaming', color: '#107C10', placeholder: 'https://account.xbox.com/profile?gamertag=...' },
  { id: 'playstation', name: 'PlayStation', category: 'Gaming', color: '#003791', placeholder: 'https://psnprofiles.com/username' },
  { id: 'nintendo', name: 'Nintendo', category: 'Gaming', color: '#E60012', placeholder: 'SW-0000-0000-0000' },
  { id: 'epic-games', name: 'Epic Games', category: 'Gaming', color: '#313131', placeholder: 'https://fortnitetracker.com/profile/...' },

  // Finance & Crypto
  { id: 'bitcoin', name: 'Bitcoin', category: 'Crypto', color: '#F7931A', placeholder: 'bitcoin:address' },
  { id: 'ethereum', name: 'Ethereum', category: 'Crypto', color: '#627EEA', placeholder: '0x...' },
  { id: 'coinbase', name: 'Coinbase', category: 'Crypto', color: '#0052FF', placeholder: 'https://coinbase.com/username' },
  { id: 'opensea', name: 'OpenSea', category: 'NFT & Web3', color: '#2081E2', placeholder: 'https://opensea.io/username' },
  { id: 'metamask', name: 'MetaMask', category: 'Crypto', color: '#F6851B', placeholder: '0x...' },

  // Education
  { id: 'udemy', name: 'Udemy', category: 'Education', color: '#A435F0', placeholder: 'https://udemy.com/course/...' },
  { id: 'coursera', name: 'Coursera', category: 'Education', color: '#0056D3', placeholder: 'https://coursera.org/learn/...' },
  { id: 'skillshare', name: 'Skillshare', category: 'Education', color: '#00FF88', placeholder: 'https://skillshare.com/classes/...' },
  { id: 'masterclass', name: 'MasterClass', category: 'Education', color: '#000000', placeholder: 'https://masterclass.com/classes/...' },

  // Health & Fitness
  { id: 'strava', name: 'Strava', category: 'Health & Fitness', color: '#FC4C02', placeholder: 'https://strava.com/athletes/...' },
  { id: 'myfitnesspal', name: 'MyFitnessPal', category: 'Health & Fitness', color: '#0072CE', placeholder: 'https://myfitnesspal.com/profile/...' },
  { id: 'fitbit', name: 'Fitbit', category: 'Health & Fitness', color: '#00B0B9', placeholder: 'https://fitbit.com/user/...' },

  // Food & Drink
  { id: 'ubereats', name: 'Uber Eats', category: 'Food & Drink', color: '#000000', placeholder: 'https://ubereats.com/store/...' },
  { id: 'doordash', name: 'DoorDash', category: 'Food & Drink', color: '#FF3008', placeholder: 'https://doordash.com/store/...' },
  { id: 'grubhub', name: 'Grubhub', category: 'Food & Drink', color: '#FF8000', placeholder: 'https://grubhub.com/restaurant/...' },
  { id: 'yelp', name: 'Yelp', category: 'Food & Drink', color: '#FF1A1A', placeholder: 'https://yelp.com/biz/...' },

  // Travel
  { id: 'airbnb', name: 'Airbnb', category: 'Travel', color: '#FF5A5F', placeholder: 'https://airbnb.com/rooms/...' },
  { id: 'booking', name: 'Booking.com', category: 'Travel', color: '#003580', placeholder: 'https://booking.com/hotel/...' },
  { id: 'tripadvisor', name: 'TripAdvisor', category: 'Travel', color: '#00AF87', placeholder: 'https://tripadvisor.com/...' },

  // News & Media
  { id: 'medium', name: 'Medium', category: 'News & Media', color: '#000000', placeholder: 'https://medium.com/@username' },
  { id: 'substack', name: 'Substack', category: 'News & Media', color: '#FF6719', placeholder: 'https://username.substack.com' },
  { id: 'blog', name: 'Blog', category: 'News & Media', color: '#6366F1', placeholder: 'https://your-blog.com' },

  // Business Tools
  { id: 'notion', name: 'Notion', category: 'Business Tools', color: '#000000', placeholder: 'https://notion.so/...' },
  { id: 'airtable', name: 'Airtable', category: 'Business Tools', color: '#18BFFF', placeholder: 'https://airtable.com/...' },
  { id: 'typeform', name: 'Typeform', category: 'Business Tools', color: '#262627', placeholder: 'https://form.typeform.com/...' },
  { id: 'google-forms', name: 'Google Forms', category: 'Business Tools', color: '#673AB7', placeholder: 'https://forms.gle/...' },

  // Dating
  { id: 'tinder', name: 'Tinder', category: 'Dating', color: '#FD5068', placeholder: 'https://tinder.com/@username' },
  { id: 'bumble', name: 'Bumble', category: 'Dating', color: '#FFDD00', placeholder: 'https://bumble.com/...' },
  { id: 'hinge', name: 'Hinge', category: 'Dating', color: '#A100FF', placeholder: 'https://hinge.co/...' },

  // Custom/Generic
  { id: 'website', name: 'Website', category: 'Professional', color: '#6366F1', placeholder: 'https://your-website.com' },
  { id: 'custom-link', name: 'Custom Link', category: 'Professional', color: '#6B7280', placeholder: 'https://your-custom-link.com' }
]

// Helper functions
export const getIconsByCategory = (category: string): ServiceIcon[] => {
  return SERVICE_ICONS.filter(icon => icon.category === category)
}

export const searchIcons = (query: string): ServiceIcon[] => {
  const lowercaseQuery = query.toLowerCase()
  return SERVICE_ICONS.filter(icon => 
    icon.name.toLowerCase().includes(lowercaseQuery) ||
    icon.category.toLowerCase().includes(lowercaseQuery)
  )
}

export const getIconById = (id: string): ServiceIcon | undefined => {
  return SERVICE_ICONS.find(icon => icon.id === id)
}

export const getPopularIcons = (): ServiceIcon[] => {
  const popularIds = [
    'instagram', 'tiktok', 'youtube', 'twitter', 'spotify', 'website',
    'email', 'phone', 'linkedin', 'github', 'portfolio', 'shopify'
  ]
  return popularIds.flatMap(id => {
    const icon = getIconById(id)
    return icon ? [icon] : []
  })
}