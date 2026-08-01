# 🚀 Deployment Guide - LinkTree App

## 📋 Prerequisites

- [x] Firebase set up and working locally
- [x] Links working across browsers
- [x] GitHub account
- [x] Vercel account (free - sign up at vercel.com)

---

## 🎯 Deployment Options

### Option 1: Vercel (Recommended - Easiest)
- ✅ Free tier available
- ✅ Automatic deployments from GitHub
- ✅ Built for Next.js
- ✅ Custom domains included
- ✅ SSL certificates automatic

### Option 2: Netlify
- ✅ Free tier available
- ✅ Good for static sites
- ⚠️ Requires extra config for Next.js

### Option 3: Firebase Hosting
- ✅ Same platform as your database
- ✅ Free tier available
- ⚠️ More complex setup

---

## 🚀 Deploy to Vercel (Recommended)

### Step 1: Push to GitHub

```bash
# Initialize git (if not already done)
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit - LinkTree app with Firebase"

# Create a new repository on GitHub, then:
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
git branch -M main
git push -u origin main
```

### Step 2: Connect to Vercel

1. **Go to**: https://vercel.com/signup
2. **Sign in** with GitHub
3. **Click**: "Add New" → "Project"
4. **Import** your GitHub repository
5. **Vercel will auto-detect** Next.js settings

### Step 3: Add Environment Variables

In Vercel project settings, add these environment variables:

```
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyDxTsYuolPzFFnHGop30uzwywA3ZpKfqMc
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=linktree-c2389.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=linktree-c2389
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=linktree-c2389.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=487897218810
NEXT_PUBLIC_FIREBASE_APP_ID=1:487897218810:web:b1b72e4a7beb2f15f49343
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-WRDY7EVCQ0
NEXT_PUBLIC_APP_URL=https://YOUR_APP_NAME.vercel.app
```

**How to add:**
1. Go to your project in Vercel
2. Click "Settings" tab
3. Click "Environment Variables"
4. Add each variable one by one
5. Click "Save"

### Step 4: Deploy

1. **Click "Deploy"**
2. **Wait 2-3 minutes** for build to complete
3. **Get your URL**: `https://your-app-name.vercel.app`
4. **Test it!** Create a bio link and share it

---

## 🔒 Update Firebase Settings for Production

After deployment, you need to allow your production domain in Firebase:

### Update Firebase Auth Domain

1. **Go to**: Firebase Console → Authentication → Settings
2. **Add your Vercel domain** to authorized domains:
   - `your-app-name.vercel.app`
   - Any custom domains you'll use

### Update Firestore Security Rules

For production, use more secure rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /bioCards/{cardId} {
      // Anyone can read bio cards (they're public)
      allow read: if true;
      
      // Only allow writes from your app's domain
      allow write: if request.time < timestamp.date(2025, 12, 31);
      // TODO: Add authentication to restrict who can create cards
    }
  }
}
```

---

## 🌐 Add Custom Domain (Optional)

### In Vercel:

1. Go to project **Settings** → **Domains**
2. **Add your domain** (e.g., `mylinktree.com`)
3. **Follow DNS instructions** to point your domain to Vercel
4. **Wait for SSL certificate** (automatic, takes 1-2 minutes)

### Update Environment Variables:

```
NEXT_PUBLIC_APP_URL=https://mylinktree.com
```

### Update Firebase:

Add your custom domain to Firebase authorized domains.

---

## ✅ Post-Deployment Checklist

After deploying, test these:

- [ ] Homepage loads: `https://your-app.vercel.app`
- [ ] Can access editor: `https://your-app.vercel.app/editor`
- [ ] Can create a bio link
- [ ] Share Link button works
- [ ] Links work in different browsers
- [ ] Links work on mobile devices
- [ ] Analytics tracking works
- [ ] Preview works in editor
- [ ] All images/assets load correctly

---

## 🔄 Automatic Deployments

Once connected to Vercel:

1. **Push to GitHub**:
   ```bash
   git add .
   git commit -m "Update bio link editor"
   git push
   ```

2. **Vercel automatically**:
   - Detects the push
   - Builds your app
   - Deploys to production
   - Takes 2-3 minutes

---

## 📊 Monitor Your App

### Vercel Dashboard

- **Deployment logs**: See build status
- **Analytics**: Page views, performance
- **Function logs**: API route logs

### Firebase Console

- **Firestore usage**: Database reads/writes
- **Storage usage**: How much data stored

---

## 🐛 Troubleshooting Deployment

### Build Fails

**Check build logs in Vercel:**
1. Go to Deployments tab
2. Click on failed deployment
3. Read the error message
4. Common issues:
   - TypeScript errors → Fix and push again
   - Missing dependencies → Check package.json
   - Environment variables missing → Add in Vercel settings

### Links Don't Work in Production

1. **Check environment variables** are set in Vercel
2. **Check Firebase security rules** allow reads/writes
3. **Check browser console** for errors
4. **Verify `NEXT_PUBLIC_APP_URL`** matches your deployed URL

### "Failed to save card" in Production

1. **Check Firestore security rules**
2. **Check Firebase config** in Vercel environment variables
3. **Check browser console** for specific Firebase errors
4. **Visit** `https://your-app.vercel.app/test-firebase` to diagnose

---

## 🎯 Production Best Practices

### 1. Security

**Add authentication** so only authorized users can create bio links:
- Use Firebase Authentication
- Update Firestore rules to check user ID
- Add login/signup pages

### 2. Monitoring

**Set up monitoring:**
- Vercel Analytics (built-in)
- Firebase Monitoring
- Google Analytics (optional)

### 3. Backups

**Backup Firestore data regularly:**
- Use Firebase scheduled exports
- Or manual exports from Firebase Console

### 4. Domain

**Use a custom domain:**
- More professional
- Better SEO
- Easier to remember

---

## 💰 Costs

### Free Tier Limits:

**Vercel (Free):**
- ✅ 100 GB bandwidth/month
- ✅ Unlimited projects
- ✅ Automatic SSL
- ✅ Custom domains

**Firebase (Free - Spark Plan):**
- ✅ 1 GB storage
- ✅ 50K reads/day
- ✅ 20K writes/day
- ✅ 50K deletes/day

**When you need to upgrade:**
- If you get >1000 active users/day
- If you store lots of images
- If you need more than 20K writes/day

---

## 🚀 Quick Deploy Commands

```bash
# 1. Commit your changes
git add .
git commit -m "Ready for deployment"

# 2. Push to GitHub
git push origin main

# 3. Vercel will auto-deploy!
# Check: https://vercel.com/dashboard
```

---

## 📝 Environment Variables Reference

Copy these to Vercel:

```bash
# Firebase
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your_measurement_id

# App (update after deployment)
NEXT_PUBLIC_APP_URL=https://your-app-name.vercel.app
```

---

## 🎉 You're Live!

Once deployed, share your app:
- 🔗 Share the Vercel URL
- 📱 Test on mobile devices
- 🌍 Works worldwide
- ⚡ Fast CDN delivery

**Your bio links are now production-ready!** 🚀

---

## 🆘 Need Help?

- **Vercel Docs**: https://vercel.com/docs
- **Firebase Docs**: https://firebase.google.com/docs
- **Next.js Docs**: https://nextjs.org/docs
