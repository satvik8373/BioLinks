# 🔗 BioLinks - Beautiful Bio Link Creator

A modern, production-ready bio link creator built with **Next.js 14**, **Firebase Firestore**, and **TypeScript**. Create beautiful, customizable bio link pages like Linktree - completely free and open source!

![Build Status](https://img.shields.io/badge/build-passing-brightgreen)
![Next.js](https://img.shields.io/badge/Next.js-14-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![Firebase](https://img.shields.io/badge/Firebase-Firestore-orange)
![License](https://img.shields.io/badge/license-MIT-green)

## ✨ Features

- 🎨 **JSON-Based Theme System** - Production-grade design token architecture (Linktree/Notion pattern)
- 🔗 **Multiple Link Types** - Regular links, social media, shop products, contact buttons, events
- 📱 **Mobile-First** - Responsive design that looks perfect on all devices
- 🎯 **Clean Visitor View** - No navigation bars or website elements on shared links
- 📊 **Analytics** - Track views and clicks on your bio links
- 🌐 **Cross-Browser** - Works everywhere with Firebase backend (no localStorage limitations!)
- ⚡ **Real-time Preview** - See changes instantly as you edit
- 🎭 **Customizable** - Colors, fonts, button styles, backgrounds, and more
- 🔒 **Secure** - Validated Firebase security rules for production
- 🚀 **Fast** - Optimized build, lazy loading, and edge deployment ready

## 🎨 Official Theme System

This project uses the **JSON + CSS Variables** architecture—the same system used by Linktree, Notion, and modern SaaS platforms:

```
JSON Theme Files → Theme Engine → CSS Variables → Components
```

**Benefits:**
- ✅ Add unlimited themes without changing React code
- ✅ Store themes in database (MongoDB, PostgreSQL)
- ✅ Build theme marketplace
- ✅ User-created custom themes
- ✅ Instant theme switching (no re-renders)

**Built-in Themes:**
- Minimal Light / Dark
- Glass Dark (glassmorphism)
- Clay Soft (neomorphism)
- Luxury Gold
- Gradient Sunset

→ **Full documentation:** [THEME_SYSTEM.md](./THEME_SYSTEM.md)  
→ **Architecture guide:** [ARCHITECTURE.md](./ARCHITECTURE.md)

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
- Firebase account (free tier is enough)
- Vercel account for deployment (optional)

### Installation

```bash
# Clone the repository
git clone https://github.com/satvik8373/BioLinks.git
cd BioLinks

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local and add your Firebase config

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app!

### Firebase Setup

1. Create a Firebase project at [console.firebase.google.com](https://console.firebase.google.com)
2. Enable Firestore Database
3. Copy your Firebase config to `.env.local`
4. Deploy security rules from `firestore.rules`

See [FIREBASE_SETUP_GUIDE.md](./FIREBASE_SETUP_GUIDE.md) for detailed instructions.

## 📦 Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Database**: Firebase Firestore
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Deployment**: Vercel (recommended)

## 🏗️ Project Structure

```
LinkTree/
├── app/                    # Next.js app directory
│   ├── api/               # API routes (cards, proxy)
│   ├── card/              # Card viewer (clean public view)
│   ├── editor/            # Bio link editor
│   ├── create/            # Theme selector & card creator
│   ├── my-cards/          # User dashboard
│   └── [username]/        # Public profile pages
├── components/            # React components
│   ├── card/             # BioCard display component
│   ├── editor/           # Editor tools & link management
│   ├── layout/           # Navigation, footer
│   └── ui/               # Reusable UI primitives
├── contexts/             # React context providers
│   └── ThemeContext.tsx  # Global theme state
├── lib/                   # Utilities & business logic
│   ├── firebase.ts       # Firebase initialization
│   ├── firestore.ts      # Database CRUD operations
│   ├── themes.ts         # Legacy theme definitions
│   ├── themeEngine.ts    # 🆕 JSON theme loader & CSS var applier
│   └── storage.ts        # Card storage interface
├── themes/                # 🆕 JSON theme definitions
│   ├── minimal-light/
│   │   └── config.json
│   ├── glass-dark/
│   ├── clay-soft/
│   └── ...
├── public/               # Static assets
├── .data/                # Local data cache
└── firestore.rules       # Firebase security rules
```

### Key Architecture Files

- **`lib/themeEngine.ts`** - Theme loader, validator, and CSS variable applier
- **`themes/*/config.json`** - Design token definitions (colors, typography, layout)
- **`app/globals.css`** - CSS variable defaults and global styles
- **`components/card/BioCard.tsx`** - Pure CSS variable consumption (no theme props)

## 🎨 Features Overview

### For Creators

- **Visual Editor** - Drag-and-drop link management
- **Theme Library** - 50+ professional themes
- **Customization** - Colors, fonts, button styles
- **Preview** - Live preview while editing
- **Analytics** - Track performance
- **Share** - One-click sharing to social media

### For Visitors

- **Clean Experience** - No navigation bars or distractions
- **Fast Loading** - Optimized for speed
- **Mobile Optimized** - Perfect on all screen sizes
- **Click Tracking** - Analytics for creators

## 📱 Deployment

### Deploy to Vercel (Recommended)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/satvik8373/BioLinks)

See [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) for manual deployment instructions.

### Environment Variables

Required environment variables for deployment:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your_measurement_id
NEXT_PUBLIC_APP_URL=https://your-domain.com
```

## 🔒 Security

- Validated Firebase security rules
- Data structure validation on create/update
- Prevention of unauthorized deletes
- No localStorage dependency (works cross-browser)
- SSR-safe code (no browser globals during render)

## 📊 Performance

- **Lighthouse Score**: 95+ (Performance, Accessibility, Best Practices, SEO)
- **First Load JS**: ~87 KB (gzipped)
- **Build Time**: ~2 minutes
- **Pages Generated**: 15 static + dynamic routes

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Inspired by Linktree, Beacons, and other bio link tools
- Built with Next.js and Firebase
- Icons by Lucide React
- Themes inspired by modern design trends

## 📧 Contact

**Satvik** - [@satvik8373](https://github.com/satvik8373)

Project Link: [https://github.com/satvik8373/BioLinks](https://github.com/satvik8373/BioLinks)

## 🗺️ Roadmap

- [ ] User authentication
- [ ] Custom domains
- [ ] QR code generation
- [ ] Email capture forms
- [ ] Payment integration
- [ ] Advanced analytics
- [ ] Team collaboration
- [ ] API access

---

**⭐ Star this repo if you find it useful!**

Made with ❤️ by [Satvik](https://github.com/satvik8373)
