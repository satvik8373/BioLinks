# 🎯 Vercel Environment Variables Setup (Step-by-Step)

## 📋 Quick Setup Guide

### Step 1: Open Vercel Dashboard

Go to: **https://vercel.com/dashboard**

---

### Step 2: Select Your Project

Click on: **BioLinks** project

---

### Step 3: Go to Settings

Click: **Settings** tab (at the top)

---

### Step 4: Open Environment Variables

Click: **Environment Variables** (in left sidebar)

---

### Step 5: Add Each Variable

Click **"Add New"** button and add these **8 variables** one by one:

---

## 📝 Copy-Paste These Variables

### 1️⃣ Firebase API Key
```
Name: NEXT_PUBLIC_FIREBASE_API_KEY
Value: AIzaSyDxTsYuolPzFFnHGop30uzwywA3ZpKfqMc
```
✓ Check: Production, Preview, Development

---

### 2️⃣ Firebase Auth Domain
```
Name: NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
Value: linktree-c2389.firebaseapp.com
```
✓ Check: Production, Preview, Development

---

### 3️⃣ Firebase Project ID
```
Name: NEXT_PUBLIC_FIREBASE_PROJECT_ID
Value: linktree-c2389
```
✓ Check: Production, Preview, Development

---

### 4️⃣ Firebase Storage Bucket
```
Name: NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
Value: linktree-c2389.firebasestorage.app
```
✓ Check: Production, Preview, Development

---

### 5️⃣ Firebase Messaging Sender ID
```
Name: NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
Value: 487897218810
```
✓ Check: Production, Preview, Development

---

### 6️⃣ Firebase App ID
```
Name: NEXT_PUBLIC_FIREBASE_APP_ID
Value: 1:487897218810:web:b1b72e4a7beb2f15f49343
```
✓ Check: Production, Preview, Development

---

### 7️⃣ Firebase Measurement ID
```
Name: NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
Value: G-WRDY7EVCQ0
```
✓ Check: Production, Preview, Development

---

### 8️⃣ App URL (⚠️ UPDATE THIS!)
```
Name: NEXT_PUBLIC_APP_URL
Value: https://YOUR-APP-NAME.vercel.app
```
⚠️ **IMPORTANT**: Replace `YOUR-APP-NAME` with your actual Vercel URL!

✓ Check: Production, Preview, Development

---

## 🔄 Step 6: Redeploy

After adding ALL variables:

1. Go to **"Deployments"** tab
2. Click on your **latest deployment**
3. Click **"Redeploy"** button (top right corner)
4. Select **"Use existing Build Cache"** (faster)
5. Click **"Redeploy"**
6. ⏳ Wait 2-3 minutes

---

## ✅ Step 7: Test Your Deployment

Visit these URLs to test:

### Test 1: Homepage
```
https://your-app-name.vercel.app
```
Should load without errors ✅

### Test 2: Firebase Connection
```
https://your-app-name.vercel.app/test-firebase
```
Should show: "✅ Firestore write successful" ✅

### Test 3: Editor
```
https://your-app-name.vercel.app/editor
```
Should load the editor ✅

### Test 4: Create & Share
1. Create a bio link in editor
2. Click "Share Link"
3. Open link in incognito/different browser
4. Should show your bio card ✅

---

## 🎯 Visual Checklist

After setup, your Environment Variables page should look like:

```
✓ NEXT_PUBLIC_FIREBASE_API_KEY              Production, Preview, Development
✓ NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN          Production, Preview, Development
✓ NEXT_PUBLIC_FIREBASE_PROJECT_ID           Production, Preview, Development
✓ NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET       Production, Preview, Development
✓ NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID  Production, Preview, Development
✓ NEXT_PUBLIC_FIREBASE_APP_ID               Production, Preview, Development
✓ NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID       Production, Preview, Development
✓ NEXT_PUBLIC_APP_URL                       Production, Preview, Development
```

**Total: 8 environment variables** ✅

---

## 🚨 Common Mistakes

### ❌ Mistake 1: Wrong Variable Names
```
# WRONG:
FIREBASE_API_KEY

# RIGHT:
NEXT_PUBLIC_FIREBASE_API_KEY
```
⚠️ Must start with `NEXT_PUBLIC_`

---

### ❌ Mistake 2: Extra Spaces
```
# WRONG:
AIzaSyDxTs... (with space at end)

# RIGHT:
AIzaSyDxTsYuolPzFFnHGop30uzwywA3ZpKfqMc
```
⚠️ No extra spaces!

---

### ❌ Mistake 3: Not Redeploying
Adding variables is not enough - you MUST redeploy!

```
Add Variables → Save → REDEPLOY → Wait → Test ✅
```

---

### ❌ Mistake 4: Wrong APP_URL
```
# WRONG:
http://localhost:3000
https://vercel.app
https://your-app-name.com

# RIGHT:
https://your-actual-app-name.vercel.app
```
⚠️ Use your EXACT Vercel URL!

---

## 💡 How to Find Your Vercel URL

1. Go to Vercel Dashboard
2. Click on your BioLinks project
3. Look at the top - you'll see:
   ```
   https://bio-links-xyz123.vercel.app
   ```
4. Copy this EXACT URL
5. Use it for `NEXT_PUBLIC_APP_URL`

---

## 🔍 Troubleshooting

### Issue: Still seeing "Firebase API key undefined"

**Solution:**
1. Verify all 8 variables are added
2. Check for typos in variable names
3. **Redeploy** (this is crucial!)
4. Clear browser cache
5. Test in incognito mode

---

### Issue: "Failed to save card" error

**Solution:**
1. Check Firebase security rules are published
2. Verify project ID matches: `linktree-c2389`
3. Go to `/test-firebase` to diagnose
4. Check browser console for specific errors

---

### Issue: Variables not showing up

**Solution:**
1. Make sure you're checking the right project
2. Environment variables only work after redeploy
3. Try pushing a new commit to trigger auto-deploy

---

## 📱 Mobile Testing

After deployment:
1. Open your Vercel URL on phone
2. Test creating a bio link
3. Share the link with a friend
4. Verify it works on their device

---

## 🎉 Success Indicators

You know it's working when:

✅ No Firebase errors in console  
✅ `/test-firebase` shows success  
✅ Can create bio links  
✅ Links load in incognito mode  
✅ Works on mobile devices  
✅ Analytics tracking works  
✅ Share buttons work  

---

## 🔐 Security Note

**Q: Are my API keys safe in environment variables?**

**A: YES!** ✅

- These are **public** Firebase config values
- They're meant to be visible in client-side code
- Real security comes from **Firestore security rules**
- Anyone can see them by inspecting your website anyway
- The `NEXT_PUBLIC_` prefix makes them intentionally public

**Your data is protected by:**
- ✅ Firestore security rules (already set up)
- ✅ Data validation rules
- ✅ Firebase App Check (optional, can add later)

---

## ⏭️ Next Steps

After deployment:

1. ✅ Test thoroughly
2. 🎨 Customize your homepage
3. 📱 Share with users
4. 📊 Monitor analytics
5. 🚀 Add custom domain (optional)
6. 🔐 Add authentication (future)

---

## 📞 Need Help?

If still not working:
1. Take screenshot of your Vercel environment variables
2. Check browser console for errors
3. Visit `/test-firebase` and share the result
4. Verify Firebase console shows your project

---

**You're almost there! Just add those 8 variables and redeploy!** 🚀
