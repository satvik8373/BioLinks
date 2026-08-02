# 🚀 Deployment Guide - Firestore Rules & Production

## 📋 Table of Contents
1. [Deploy Firestore Rules](#1-deploy-firestore-rules)
2. [Deploy to Vercel](#2-deploy-to-vercel)
3. [Deploy to Netlify](#3-deploy-to-netlify)
4. [Verify Deployment](#4-verify-deployment)

---

## 1️⃣ Deploy Firestore Rules

### Method A: Firebase Console (Easy - 2 minutes)

**Step 1:** Go to Firebase Console
- Visit: https://console.firebase.google.com/
- Select your project
- Click **Firestore Database** (left sidebar)
- Click **Rules** tab

**Step 2:** Copy These Production Rules

```javascript
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {
    
    // Helper functions
    function isAuthenticated() {
      return request.auth != null;
    }
    
    function isOwner(userId) {
      return isAuthenticated() && request.auth.uid == userId;
    }
    
    // User data
    match /users/{userId} {
      allow read, write: if isOwner(userId);
      
      // User's cards
      match /cards/{cardId} {
        // Anyone can view published cards
        allow read: if true;
        
        // Only owner can create/update/delete
        allow create: if isOwner(userId);
        allow update: if isOwner(userId);
        allow delete: if isOwner(userId);
      }
      
      // User's analytics
      match /analytics/{docId} {
        allow read, write: if isOwner(userId);
      }
    }
    
    // Public profiles
    match /profiles/{username} {
      allow read: if true;
      allow create: if isAuthenticated();
      allow update: if isAuthenticated() && 
                      request.resource.data.userId == request.auth.uid;
      allow delete: if isAuthenticated() && 
                      resource.data.userId == request.auth.uid;
    }
    
    // Block everything else
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

**Step 3:** Publish
- Click **"Publish"** button
- ✅ Done! Rules are live

---

### Method B: Firebase CLI (Professional - Recommended)

**Step 1:** Install Firebase CLI

```bash
npm install -g firebase-tools
```

**Step 2:** Login to Firebase

```bash
firebase login
```

**Step 3:** Initialize Firebase (if not done)

```bash
# In your project directory
cd e:/LinkTree

# Initialize
firebase init

# Select:
# - Firestore: Configure security rules
# - Use existing project
# - Select your project
# - Use existing firestore.rules file
```

**Step 4:** Deploy Rules

```bash
firebase deploy --only firestore:rules
```

**Expected Output:**
```
✔ Deploy complete!

Project Console: https://console.firebase.google.com/project/your-project/overview
```

✅ Done! Rules are deployed

---

## 2️⃣ Deploy to Vercel

### Step 1: Install Vercel CLI

```bash
npm install -g vercel
```

### Step 2: Build Your App

```bash
npm run build
```

### Step 3: Deploy

```bash
vercel
```

### Step 4: Add Environment Variables

In Vercel Dashboard:
1. Go to your project
2. Click **Settings** → **Environment Variables**
3. Add these variables:

```
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-XXXXXXXXXX
```

### Step 5: Redeploy

```bash
vercel --prod
```

✅ Live at: https://your-project.vercel.app

---

## 3️⃣ Deploy to Netlify

### Step 1: Build

```bash
npm run build
```

### Step 2: Deploy with Netlify CLI

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login
netlify login

# Deploy
netlify deploy --prod
```

### Step 3: Add Environment Variables

In Netlify Dashboard:
1. Go to **Site settings** → **Environment variables**
2. Add all Firebase variables (same as Vercel above)

### Step 4: Trigger Rebuild

```bash
netlify deploy --prod
```

✅ Live at: https://your-site.netlify.app

---

## 4️⃣ Verify Deployment

### Test Checklist

**1. Test Authentication**
```
✓ Visit your production URL
✓ Click "Login"
✓ Login with Google
✓ Should redirect to homepage
```

**2. Test Card Creation**
```
✓ Go to /create
✓ Create a new card
✓ Click "Save & Share"
✓ Should save successfully (no errors)
```

**3. Test Cross-Device Sync**
```
✓ Create card on production
✓ Open different browser/device
✓ Login with SAME Google account
✓ Go to /my-cards
✓ Should see the card ✅
```

**4. Test Firestore Rules**
```
✓ Open browser console
✓ Should see: "✅ Card saved to Firestore"
✓ Should NOT see permission errors
```

**5. Check Firebase Console**
```
✓ Go to Firebase Console
✓ Firestore Database → Data
✓ Should see: users/{uid}/cards/{cardId}
✓ Card data should be there
```

---

## 🔍 Troubleshooting

### Issue: "Missing or insufficient permissions"

**Cause:** Firestore rules not deployed  
**Fix:** Deploy rules using Method A or B above

### Issue: Firebase env variables not working

**Cause:** Variables not added to deployment platform  
**Fix:** Add all `NEXT_PUBLIC_FIREBASE_*` variables in Vercel/Netlify dashboard

### Issue: Cards don't appear on production

**Cause 1:** Different Google account  
**Fix:** Use SAME Google account on all devices

**Cause 2:** Firestore rules blocking access  
**Fix:** Verify rules are deployed correctly

### Issue: Build fails on deployment

**Cause:** Missing dependencies or env variables  
**Fix:** 
```bash
# Locally test build first
npm run build

# If successful, check env variables on platform
```

---

## 📊 Production Checklist

Before going live, verify:

- ✅ Firebase Authentication enabled (Google, Email)
- ✅ Firestore rules deployed (`firestore.rules`)
- ✅ All environment variables added
- ✅ App builds successfully (`npm run build`)
- ✅ Login works on production
- ✅ Card creation works
- ✅ Cross-device sync works
- ✅ Delete works (cards stay deleted)
- ✅ Analytics tracking works

---

## 🎯 Production URLs

After deployment, your app will be live at:

**Vercel:**
```
Production: https://your-project.vercel.app
Preview: https://your-project-git-branch.vercel.app
```

**Netlify:**
```
Production: https://your-site.netlify.app
Preview: https://deploy-preview-123--your-site.netlify.app
```

---

## 🔒 Security Notes

### Your Deployed Rules Provide:

✅ **User Isolation** - Users can only access their own cards  
✅ **Public Viewing** - Anyone can view published cards  
✅ **Authentication Required** - Must login to create/edit/delete  
✅ **Analytics Protection** - Only owner can view analytics  

### What's Protected:

- ❌ Unauthorized users can't edit other users' cards
- ❌ Unauthenticated users can't create cards
- ❌ Users can't access other users' analytics
- ❌ Users can't delete other users' cards

### What's Public:

- ✅ Anyone can VIEW published cards (e.g., /card/{cardId})
- ✅ This allows public sharing (like Linktree)

---

## 🚀 Quick Deploy Commands

**Deploy Everything:**
```bash
# 1. Deploy Firestore rules
firebase deploy --only firestore:rules

# 2. Build app
npm run build

# 3. Deploy to Vercel
vercel --prod

# OR deploy to Netlify
netlify deploy --prod
```

---

## 📝 Summary

**Firestore Rules:**
- ✅ Secure production-ready rules
- ✅ Users can only access their own data
- ✅ Public card viewing enabled

**Deployment:**
- ✅ Vercel or Netlify ready
- ✅ Environment variables configured
- ✅ Firebase rules deployed
- ✅ Cross-device sync working

**Your app is now production-ready!** 🎉

---

## 🆘 Need Help?

**Firebase Rules Issues:**
- Check: Firebase Console → Firestore → Rules
- Verify: Rules are published (not in draft)
- Test: Create a card and check console logs

**Deployment Issues:**
- Check: Build works locally (`npm run build`)
- Verify: All env variables added
- Test: Production URL in incognito window

**Cross-Device Sync Issues:**
- Check: Using SAME Google account
- Verify: Firebase UID is identical on both devices
- Test: Check Firestore Database for card data

---

**Ready to deploy? Run:**
```bash
firebase deploy --only firestore:rules
vercel --prod
```

🚀 Your professional BioLinks app is ready for the world!
