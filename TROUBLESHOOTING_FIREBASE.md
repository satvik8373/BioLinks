# 🔧 Troubleshooting Firebase Issues

## 🧪 Step 1: Test Firebase Connection

**Visit this URL to test Firebase:**
```
http://localhost:3000/test-firebase
```

This page will:
- ✅ Check if Firebase is initialized
- ✅ Test Firestore write permissions
- ✅ Test Firestore read permissions
- ✅ Show detailed error messages

---

## 🐛 Common Issues & Solutions

### Issue 1: "Failed to save card" Error

**Symptoms:**
- Click "Share Link" button
- Get an error message
- Link doesn't work

**Solutions:**

#### A. Check if dev server was restarted
After adding `.env.local`, you MUST restart the dev server:

```bash
# Stop the server (Ctrl+C in terminal)
# Then restart:
npm run dev
```

#### B. Check `.env.local` file exists
```bash
# Check if file exists
ls .env.local

# Should show the file
```

#### C. Verify all Firebase values are correct
Open `.env.local` and make sure all values are filled:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=AIza...  (should start with AIza)
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456:web:abc123
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-ABC123
```

---

### Issue 2: "Permission Denied" or "Missing Permissions"

**Cause:** Firestore security rules are blocking access

**Solution:**

1. Go to **Firebase Console** → **Firestore Database** → **Rules**
2. Replace with this:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /bioCards/{cardId} {
      allow read: if true;
      allow write: if true;
    }
  }
}
```

3. Click **"Publish"**
4. Wait 1-2 minutes for rules to propagate
5. Try again

---

### Issue 3: "Card not found" When Opening Link

**Symptoms:**
- Create a link successfully
- But when you open it, shows "Page not found"
- Or blank page

**Debugging Steps:**

#### Step 1: Check Browser Console
1. Open the link that's not working
2. Press **F12** to open DevTools
3. Click **Console** tab
4. Look for errors (red text)
5. Take a screenshot and check what it says

#### Step 2: Check if Card Was Saved to Firebase
1. Go to **Firebase Console**
2. Go to **Firestore Database** → **Data**
3. Look for `bioCards` collection
4. Check if your card ID exists there
5. If NOT there → The save failed

#### Step 3: Check Network Tab
1. In the editor, open DevTools (F12)
2. Go to **Network** tab
3. Click "Share Link" button
4. Look for request to `/api/cards`
5. Click on it and check:
   - **Status**: Should be 200
   - **Response**: Should show `success: true`
   - If status is 500 or 400, check the error message

---

### Issue 4: Firestore Not Enabled

**Error:** `Firestore is not enabled`

**Solution:**

1. Go to **Firebase Console**
2. Click on your project
3. Go to **Build** → **Firestore Database**
4. If you see "Get started", click it
5. Choose **"Production mode"**
6. Select a region
7. Click **"Enable"**
8. Wait 2-3 minutes

---

### Issue 5: Wrong Firebase Project

**Symptoms:**
- Everything looks right
- But still not working

**Solution:**

Check if you're using the right Firebase project:

1. Go to **Firebase Console**
2. Check the project name at the top
3. Make sure it matches your `.env.local` project ID
4. If you have multiple projects, make sure you copied config from the right one

---

## 🔍 How to Debug Step by Step

### Step 1: Test Firebase Connection
```
http://localhost:3000/test-firebase
```

**If this FAILS:**
- Firebase is not set up correctly
- Follow solutions above

**If this SUCCEEDS:**
- Firebase is working
- Problem is in your app code

---

### Step 2: Check Console Logs

I've added detailed console logs. Open browser console (F12) and you'll see:

**When saving:**
```
💾 Saving card: abc123
📡 API Response status: 200
✅ Card saved successfully: { cardId: "abc123", ... }
🔗 Card URL: http://localhost:3000/card/abc123
```

**When loading:**
```
🔍 Fetching card: abc123
📡 API Response status: 200
✅ Card loaded from Firebase: { id: "abc123", ... }
```

**If you see ❌ or errors, that tells you where the problem is.**

---

### Step 3: Manual Firebase Check

1. Go to **Firebase Console**
2. Go to **Firestore Database** → **Data**
3. Look for `bioCards` collection
4. You should see documents with your card IDs
5. Click on a document to see the data
6. Verify it has: `config`, `analytics`, `createdAt`

---

## 🆘 Still Not Working?

### Get More Info:

1. **Visit `/test-firebase`** and screenshot the result
2. **Open browser console** (F12) when saving a card
3. **Check Firestore Data tab** in Firebase Console
4. **Check Network tab** (F12 → Network) when clicking "Share Link"

### Check These:

- [ ] `.env.local` file exists and has all values
- [ ] Dev server was restarted after creating `.env.local`
- [ ] Firestore is enabled in Firebase Console
- [ ] Security rules are published
- [ ] Browser console shows no errors
- [ ] `/test-firebase` page shows success

---

## 📝 Quick Checklist

Copy this and check each item:

```
✅ Firebase project created
✅ Firestore database enabled
✅ Security rules set to allow read/write
✅ Security rules published
✅ Firebase config copied correctly
✅ .env.local file created
✅ All environment variables filled in
✅ Dev server restarted
✅ /test-firebase shows success
✅ Browser console shows no Firebase errors
✅ Card appears in Firestore Data tab
```

---

## 🎯 Expected Behavior

When everything works correctly:

1. **In Editor:**
   - Click "Share Link"
   - See modal with URL
   - Console shows: `✅ Card saved successfully`

2. **In Firebase Console:**
   - Go to Firestore Data
   - See `bioCards` collection
   - See your card document

3. **Opening Link:**
   - URL works in same browser ✅
   - URL works in different browser ✅
   - URL works on phone ✅
   - Console shows: `✅ Card loaded from Firebase`

---

**Need more help?** Share the output from `/test-firebase` and browser console errors!
