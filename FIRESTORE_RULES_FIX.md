# 🔒 Firestore Rules Setup (Required)

## Error: "Missing or insufficient permissions"

This error occurs because Firestore has security rules that require authentication.

---

## Quick Fix: Open Rules for Development

### Step 1: Go to Firebase Console
1. Open [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Go to **Firestore Database** (left sidebar)
4. Click **Rules** tab

### Step 2: Update Rules for Development

Replace your current rules with these **open rules** (for development only):

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // DEVELOPMENT ONLY - Allow all reads and writes
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
```

**⚠️ Warning:** These rules allow anyone to read/write. Only use during development!

### Step 3: Publish Rules
Click **"Publish"** button in Firebase Console

---

## Production Rules (Use When Ready)

When you're ready for production, use these secure rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // User documents - only owner can access
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
      
      // User's cards subcollection - only owner can write
      match /cards/{cardId} {
        allow read: if true; // Anyone can view published cards
        allow write: if request.auth != null && request.auth.uid == userId;
      }
    }
    
    // Public profiles - anyone can read
    match /profiles/{profileId} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.uid == profileId;
    }
  }
}
```

---

## Alternative: Use localStorage Temporarily

If you can't access Firebase Console right now, update `lib/storage.ts` to use localStorage as temporary storage:

### Update `lib/storage.ts`

Add this at the top after imports:

```typescript
const USE_FIRESTORE = false // Set to true when Firestore rules are fixed
```

Then wrap all Firestore operations:

```typescript
export async function saveCard(cardId: string, cardData: any) {
  if (!USE_FIRESTORE) {
    // Temporary localStorage fallback
    const cards = JSON.parse(localStorage.getItem('bioCards') || '{}')
    cards[cardId] = { ...cardData, id: cardId }
    localStorage.setItem('bioCards', JSON.stringify(cards))
    return { success: true }
  }
  
  // Firestore code...
}
```

---

## Check Current Rules

To see your current rules:

1. Firebase Console → Your Project
2. Firestore Database → Rules
3. Check what rules are currently published

Common issues:
- ❌ Rules require authentication but user isn't logged in with Firebase Auth
- ❌ Rules check `request.auth.uid` but using mock login (no real Firebase user)
- ❌ Rules are too restrictive for your collection path

---

## Test After Fixing

1. Update rules in Firebase Console
2. Refresh your app
3. Try creating a card
4. Check browser console for any errors

If you still see errors, check:
- Firebase config in `.env.local` is correct
- User is properly logged in (check `auth.currentUser`)
- Collection path matches your rules

---

## Summary

**Quick Development Fix:**
```javascript
// In Firebase Console > Firestore > Rules
match /{document=**} {
  allow read, write: if true;
}
```

**Then click Publish** ✅

This will let you test without authentication issues. Update to production rules later!
