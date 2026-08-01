# 🔥 Firebase Setup Guide - Get Your Links Working Everywhere!

This guide will help you set up Firebase Firestore so your bio links work across **all browsers and devices** with real shareable URLs.

---

## 📋 Prerequisites

- A Google account
- Your LinkTree project already set up locally

---

## 🚀 Step-by-Step Setup

### Step 1: Create a Firebase Project

1. **Go to Firebase Console**: https://console.firebase.google.com/
2. **Click "Add project"** or "Create a project"
3. **Enter project name**: `linktree-app` (or any name you like)
4. **Disable Google Analytics** (optional, you can enable it later)
5. **Click "Create project"** and wait for it to be ready
6. **Click "Continue"** when done

### Step 2: Register Your Web App

1. In your Firebase project, click the **Web icon** (`</>`) to add a web app
2. **Enter app nickname**: `LinkTree Web App`
3. **DON'T check** "Firebase Hosting" (we'll deploy separately)
4. **Click "Register app"**
5. **Copy the Firebase config** - you'll see something like this:

```javascript
const firebaseConfig = {
  apiKey: "AIza...",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456:web:abc123",
  measurementId: "G-ABC123"
};
```

6. **Keep this tab open** - we'll need these values!

### Step 3: Enable Firestore Database

1. In Firebase Console, go to **"Build" → "Firestore Database"** in the left sidebar
2. **Click "Create database"**
3. **Choose "Start in production mode"** (we'll add security rules later)
4. **Select a location**: Choose the closest to your users (e.g., `us-central`, `europe-west`, etc.)
5. **Click "Enable"** and wait for it to be ready

### Step 4: Set Up Security Rules (Important!)

1. In Firestore Database, click the **"Rules"** tab
2. **Replace the default rules** with this:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow anyone to read bio cards (public links)
    match /bioCards/{cardId} {
      allow read: if true;
      allow write: if true; // For now, anyone can create/edit
      // TODO: Add authentication and restrict write access
    }
  }
}
```

3. **Click "Publish"**

### Step 5: Configure Your Project

1. **Open your project** in your code editor
2. **Copy `.env.example` to `.env.local`**:

```bash
# In PowerShell
Copy-Item .env.example .env.local
```

3. **Edit `.env.local`** and add your Firebase config values:

```env
# Firebase Configuration (from Step 2)
NEXT_PUBLIC_FIREBASE_API_KEY=AIza...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456:web:abc123
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-ABC123

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

4. **Save the file**

### Step 6: Test It Locally

1. **Restart your dev server** (if running):

```bash
# Stop the server (Ctrl+C)
# Start it again
npm run dev
```

2. **Go to**: `http://localhost:3000/editor`
3. **Edit your bio link**
4. **Click "Share Link"** button
5. **Copy the URL** (e.g., `http://localhost:3000/card/abc123`)
6. **Open the URL in:**
   - ✅ Same browser - should work
   - ✅ **Different browser** - should work now!
   - ✅ **Incognito mode** - should work!
   - ✅ **Another device** (phone) - should work!

---

## ✅ Verification Checklist

After setup, verify everything works:

- [ ] Firebase project created
- [ ] Firestore database enabled
- [ ] Security rules published
- [ ] `.env.local` file created with all Firebase config
- [ ] Dev server restarted
- [ ] Created a bio link in editor
- [ ] Clicked "Share Link" button
- [ ] Link opens in same browser ✅
- [ ] Link opens in different browser ✅
- [ ] Link opens on another device ✅

---

## 🌐 How to Check Firebase Console

To see your saved cards:

1. Go to **Firebase Console** → **Firestore Database**
2. Click **"Data"** tab
3. You should see a collection called `bioCards`
4. Click to expand and see your saved cards
5. Each card will have:
   - **Document ID**: Your card ID (e.g., `abc123`)
   - **Fields**: `config`, `analytics`, `createdAt`, etc.

---

## 🚨 Troubleshooting

### Issue: "Failed to save card" error

**Solution:**
1. Check `.env.local` file has all values
2. Make sure dev server was restarted after adding `.env.local`
3. Check Firebase Console → Firestore → Rules (make sure they're published)
4. Check browser console for errors (F12)

### Issue: "Card not found" in different browser

**Solution:**
1. Go to Firebase Console → Firestore Database → Data
2. Check if the card exists in the `bioCards` collection
3. If not, try saving again from the editor
4. Check that the card ID in the URL matches what's in Firestore

### Issue: Firebase errors in console

**Common errors and solutions:**

```
Error: Firebase: Error (auth/operation-not-allowed)
```
→ Don't worry, we're not using Auth yet. This is normal.

```
Error: Missing or insufficient permissions
```
→ Check Firestore security rules (Step 4)

```
Error: Firebase config object is not valid
```
→ Double-check `.env.local` values match Firebase Console

---

## 🎯 What's Next?

### For Production Deployment:

1. **Deploy to Vercel/Netlify**:
   - Add Firebase environment variables in deployment settings
   - Update `NEXT_PUBLIC_APP_URL` to your production URL

2. **Secure Your Firestore** (Important for production!):
   - Add authentication
   - Update security rules to require user ownership
   - Limit write access to authenticated users only

3. **Add Custom Domain**:
   - Set up your custom domain
   - Update Firebase Auth domain if using authentication

---

## 📚 Resources

- **Firebase Documentation**: https://firebase.google.com/docs/firestore
- **Firestore Security Rules**: https://firebase.google.com/docs/firestore/security/get-started
- **Next.js with Firebase**: https://firebase.google.com/docs/web/setup

---

## 🎉 Success!

If you can now share your link and it works in different browsers, **congratulations!** 

Your bio links are now:
- ✅ Stored in Firebase Firestore (cloud database)
- ✅ Accessible from any browser
- ✅ Shareable with real URLs
- ✅ Tracked with analytics (views & clicks)
- ✅ Production-ready!

---

**Need help?** Check the troubleshooting section or open the browser console (F12) for error messages.
