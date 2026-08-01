# 🔧 Fix Vercel Secret Reference Error

## 🚨 Error You're Seeing

```
Environment Variable "NEXT_PUBLIC_FIREBASE_API_KEY" references 
Secret "firebase_api_key", which does not exist.
```

---

## ✅ Solution: Add Variables Manually (One by One)

Vercel's bulk import is trying to use Secrets. We need to add them manually instead.

---

## 📋 Step-by-Step Fix

### Step 1: Delete All Current Variables

1. Go to your project in Vercel
2. Settings → Environment Variables
3. Click the **trash icon (🗑️)** on EACH variable
4. Confirm deletion
5. Make sure ALL variables are deleted

### Step 2: Click "Add New" (NOT "Import .env")

⚠️ **Important**: Click the **"Add New"** button (NOT "Import .env" or paste)

### Step 3: Add Each Variable Manually

For EACH of the 8 variables below:

1. Click **"Add New"**
2. **Type** the Key (left box)
3. **Type** or paste the Value (right box)
4. **IMPORTANT**: Make sure the value field shows **"Plaintext"** or **"Value"** (NOT "Secret")
5. Check: ✓ Production, ✓ Preview, ✓ Development
6. Click **"Save"**

---

## 📝 Variables to Add (Copy One at a Time)

### Variable 1:
**Key:**
```
NEXT_PUBLIC_FIREBASE_API_KEY
```
**Value:**
```
AIzaSyDxTsYuolPzFFnHGop30uzwywA3ZpKfqMc
```

---

### Variable 2:
**Key:**
```
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
```
**Value:**
```
linktree-c2389.firebaseapp.com
```

---

### Variable 3:
**Key:**
```
NEXT_PUBLIC_FIREBASE_PROJECT_ID
```
**Value:**
```
linktree-c2389
```

---

### Variable 4:
**Key:**
```
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
```
**Value:**
```
linktree-c2389.firebasestorage.app
```

---

### Variable 5:
**Key:**
```
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
```
**Value:**
```
487897218810
```

---

### Variable 6:
**Key:**
```
NEXT_PUBLIC_FIREBASE_APP_ID
```
**Value:**
```
1:487897218810:web:b1b72e4a7beb2f15f49343
```

---

### Variable 7:
**Key:**
```
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
```
**Value:**
```
G-WRDY7EVCQ0
```

---

### Variable 8:
**Key:**
```
NEXT_PUBLIC_APP_URL
```
**Value:**
```
https://bio-links-satvik8373s-projects.vercel.app
```

⚠️ **Or use your actual Vercel URL if different**

---

## 🎯 Important: Check the Value Field Type

When adding each variable, make sure:

- ✅ Value field says **"Plaintext"** or **"Value"**
- ❌ NOT "Reference Secret" or similar

If you see any dropdown or option about "Secrets", **ignore it** and just type the value directly.

---

## 🔄 Step 4: After Adding All 8 Variables

1. Verify all 8 variables are listed
2. Each should show the actual value (not "references Secret...")
3. Go to **"Deployments"** tab
4. Click your latest deployment
5. Click **"Redeploy"** button
6. Wait 2-3 minutes
7. Test!

---

## 🧪 Test After Redeployment

Visit: `https://bio-links-satvik8373s-projects.vercel.app/test-firebase`

Should show: **"✅ Firestore write successful"**

---

## 💡 Why This Happens

**The Problem:**
- When you paste `.env` format or use "Import .env", Vercel thinks you want to use **Vercel Secrets**
- Vercel Secrets are for sensitive backend-only values
- Our Firebase config needs to be **public** (available to browser)

**The Solution:**
- Add each variable **manually** using "Add New" button
- Type values directly as **plaintext**
- Don't use the Import .env feature

---

## 🎨 Visual Guide

### ❌ WRONG Way:
```
[Import .env] → Paste file contents → References Secrets ❌
```

### ✅ RIGHT Way:
```
[Add New] → Type Key → Type Value → Save ✅
[Add New] → Type Key → Type Value → Save ✅
[Add New] → Type Key → Type Value → Save ✅
... (8 times total)
```

---

## 📸 What You Should See

After adding all variables, your Environment Variables page should look like:

```
NEXT_PUBLIC_FIREBASE_API_KEY
AIzaSyDxTsYuolPzFFnHGop30uzwywA3ZpKfqMc
Production, Preview, Development

NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
linktree-c2389.firebaseapp.com
Production, Preview, Development

NEXT_PUBLIC_FIREBASE_PROJECT_ID
linktree-c2389
Production, Preview, Development

... (and so on for all 8 variables)
```

**No "references Secret" text anywhere!** ✅

---

## 🆘 Still Getting the Error?

### Option 1: Use Vercel CLI

If the UI keeps giving you trouble, use the CLI:

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Link to your project
vercel link

# Add environment variables
vercel env add NEXT_PUBLIC_FIREBASE_API_KEY
# Paste: AIzaSyDxTsYuolPzFFnHGop30uzwywA3ZpKfqMc
# Select: Production, Preview, Development

# Repeat for all 8 variables
```

### Option 2: Contact Vercel Support

If neither works, there might be a caching issue with Vercel. Try:
1. Delete the entire project from Vercel
2. Re-import from GitHub
3. Add variables manually before first deploy

---

## ✅ Checklist

- [ ] Deleted all existing environment variables
- [ ] Used "Add New" button (NOT "Import .env")
- [ ] Added all 8 variables one by one
- [ ] Each variable shows plaintext value (not "references Secret")
- [ ] All checked for Production, Preview, Development
- [ ] Redeployed after adding variables
- [ ] Waited 2-3 minutes for deployment
- [ ] Tested /test-firebase endpoint
- [ ] No errors showing

---

**Remember**: Firebase API keys are PUBLIC by design. You don't need to hide them in secrets! 🚀
