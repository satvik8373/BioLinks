# ✅ Pre-Deployment Checklist

Before deploying, make sure everything is ready:

## 🔥 Firebase Setup

- [ ] Firebase project created
- [ ] Firestore database enabled
- [ ] Security rules published and working
- [ ] Tested locally with `npm run dev`
- [ ] Links work in different browsers locally
- [ ] `/test-firebase` page shows success

## 💻 Code Ready

- [ ] All features working locally
- [ ] No console errors
- [ ] `.gitignore` includes `.env.local`
- [ ] `package.json` has all dependencies
- [ ] No TypeScript errors: `npm run build` (test locally)

## 📦 Repository

- [ ] Code pushed to GitHub
- [ ] Repository is public (or Vercel has access to private repos)
- [ ] `.env.local` is NOT committed (should be in .gitignore)
- [ ] README updated with project info

## 🚀 Ready to Deploy!

---

# 🚀 Quick Deploy Steps

## Step 1: Push to GitHub

```bash
# Initialize git
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit - Ready for deployment"

# Create repo on GitHub first, then:
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git branch -M main
git push -u origin main
```

## Step 2: Deploy to Vercel

1. Go to: https://vercel.com/new
2. Import your GitHub repository
3. Add environment variables (see below)
4. Click "Deploy"
5. Wait 2-3 minutes
6. Get your URL: `https://your-app.vercel.app`

## Step 3: Add Environment Variables in Vercel

Go to: Project Settings → Environment Variables

Add these (copy from your `.env.local`):

```
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyDxTsYuolPzFFnHGop30uzwywA3ZpKfqMc
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=linktree-c2389.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=linktree-c2389
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=linktree-c2389.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=487897218810
NEXT_PUBLIC_FIREBASE_APP_ID=1:487897218810:web:b1b72e4a7beb2f15f49343
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-WRDY7EVCQ0
NEXT_PUBLIC_APP_URL=https://your-app-name.vercel.app
```

**⚠️ Important:** Update `NEXT_PUBLIC_APP_URL` with your actual Vercel URL after first deployment!

## Step 4: Test Production

After deployment:

- [ ] Visit your Vercel URL
- [ ] Go to `/editor`
- [ ] Create a test bio link
- [ ] Click "Share Link"
- [ ] Open link in different browser
- [ ] Verify it works! ✅

---

# 🐛 Common Deployment Issues

## Build Fails

**Error:** `Type error: ...`

**Fix:** Run `npm run build` locally to see the error, fix it, then push again.

## Environment Variables Missing

**Error:** `Firebase config is undefined`

**Fix:** Double-check all environment variables are added in Vercel Settings.

## Links Don't Work in Production

**Fix:** 
1. Check Firebase security rules allow writes
2. Check all environment variables are set
3. Visit `https://your-app.vercel.app/test-firebase` to diagnose

---

# 📊 After Deployment

## Update Firebase Authorized Domains

1. Go to Firebase Console → Authentication → Settings
2. Add authorized domains:
   - `your-app-name.vercel.app`
   - Any custom domains

## Monitor Your App

- **Vercel Dashboard**: https://vercel.com/dashboard
- **Firebase Console**: https://console.firebase.google.com/

## Share Your App!

Your LinkTree is now live at:
```
https://your-app-name.vercel.app
```

Create bio links and share them worldwide! 🌍

---

# 🔄 Future Updates

To update your app:

```bash
# Make changes
# Test locally
npm run dev

# Commit and push
git add .
git commit -m "Update feature XYZ"
git push

# Vercel auto-deploys! ✅
```

---

# 🎉 Success!

You now have a production-ready LinkTree app that:

✅ Works across all browsers and devices  
✅ Uses Firebase for reliable storage  
✅ Auto-deploys on every GitHub push  
✅ Has SSL certificates (https)  
✅ Scales automatically  
✅ Costs $0/month (free tier)  

**Congratulations!** 🚀
