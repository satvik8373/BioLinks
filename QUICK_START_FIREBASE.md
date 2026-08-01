# ⚡ Quick Start - Firebase Setup (5 Minutes)

## 🎯 Goal
Make your bio links work in **all browsers** with Firebase!

---

## 📝 Quick Steps

### 1️⃣ Create Firebase Project (2 min)
- Go to: https://console.firebase.google.com/
- Click "Add project"
- Name it (e.g., `linktree-app`)
- Click through the setup

### 2️⃣ Enable Firestore (1 min)
- In Firebase Console: **Build** → **Firestore Database**
- Click "Create database"
- Choose "Production mode"
- Select region → Enable

### 3️⃣ Add Security Rules (30 sec)
- In Firestore, click **"Rules"** tab
- Paste this:

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

- Click "Publish"

### 4️⃣ Get Firebase Config (1 min)
- Click **Web icon** (`</>`) in Firebase project overview
- Name it → Register
- Copy the config values

### 5️⃣ Add to Your Project (1 min)
- Copy `.env.example` to `.env.local`
- Paste your Firebase values:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your_measurement_id
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 6️⃣ Restart & Test (30 sec)
```bash
# Restart dev server
npm run dev
```

- Go to `/editor`
- Click "Share Link"
- **Test URL in different browser** → Should work! ✅

---

## ✅ Done!

Your links now work everywhere! 🎉

**See full guide**: `FIREBASE_SETUP_GUIDE.md`
