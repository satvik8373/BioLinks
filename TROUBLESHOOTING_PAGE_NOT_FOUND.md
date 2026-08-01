# Troubleshooting: "Page Not Found" Error

## 🔍 Quick Diagnosis

If you're seeing "Page not found" when clicking Preview or Share Link, it means your bio link hasn't been saved to localStorage yet.

## ✅ Solution: Follow These Steps

### Step 1: Check What's Saved
1. Go to: `http://localhost:3000/debug`
2. This page shows:
   - Your preview card ID
   - All saved bio cards
   - Current editor config
   - Raw data in localStorage

### Step 2: Create/Fix Your Bio Link

#### Option A: Start Fresh (Recommended)
1. Go to `/create` page
2. Fill in your profile information
3. Add at least one link
4. Click "Continue to Editor"
5. The editor will open with your config
6. Click **"Share Link"** button (bottom left sidebar)
7. Your card is now saved and shareable!

#### Option B: If Already in Editor
1. Make sure you're in the editor (`/editor` page)
2. Your changes auto-save as you edit
3. Click the **"Share Link"** button at the bottom of the left sidebar
4. This will save your card to localStorage and show the share modal

### Step 3: Verify It's Working
1. After clicking "Share Link", the modal should appear
2. Click "Copy" to copy your link
3. Click "View Live" to open in new tab
4. OR click the "Preview" button in the sidebar

## 🐛 Common Issues

### Issue: "Page not found" even after clicking Share Link

**Cause**: The bio link card wasn't saved properly

**Fix**:
```
1. Open browser console (F12)
2. Go to Application > Local Storage > http://localhost:3000
3. Check if these keys exist:
   - bioCards (should have your card data)
   - editorPreviewCardId (should have a card ID)
   - currentBioLinkConfig (should have your config)
```

### Issue: Preview shows old/wrong content

**Cause**: Multiple cards in localStorage or browser cache

**Fix**:
1. Go to `/debug` page
2. Check which card IDs exist
3. Open the correct one, or
4. Click "Clear All Data" and start fresh

### Issue: Can't access /editor page

**Cause**: No config in localStorage

**Fix**:
1. Go to `/create` page first
2. Complete the form
3. Then navigate to `/editor`

## 🔧 Manual Fix (Advanced)

If you want to manually create a test card:

```javascript
// Open browser console and run:
const testCard = {
  id: 'test123',
  config: {
    profile: {
      title: 'Test User',
      bio: 'This is a test bio',
      avatar: ''
    },
    links: [
      {
        id: '1',
        type: 'link',
        text: 'My Website',
        url: 'https://example.com',
        icon: '🌐',
        isVisible: true
      }
    ],
    theme: {
      id: 'modern-dark',
      colors: {
        background: '#1a1a1a',
        buttonDefault: '#6366f1',
        buttonText: '#ffffff',
        profileText: '#ffffff',
        profileBio: '#d1d5db'
      },
      buttonStyle: {
        borderRadius: 12,
        borderWidth: 0,
        shadow: true,
        style: 'solid'
      },
      fonts: {
        heading: 'Inter',
        body: 'Inter'
      }
    },
    socialLinks: {}
  },
  analytics: { views: 0, clicks: 0 },
  createdAt: new Date().toISOString()
}

// Save it
const cards = JSON.parse(localStorage.getItem('bioCards') || '{}')
cards['test123'] = testCard
localStorage.setItem('bioCards', JSON.stringify(cards))
localStorage.setItem('editorPreviewCardId', 'test123')

// Now visit: /card/test123
console.log('Test card created! Visit: /card/test123')
```

## 🚀 Expected Flow

### Normal User Journey:
```
1. Visit homepage (/)
   ↓
2. Click "Get Started" → Goes to /create
   ↓
3. Fill form and submit
   ↓
4. Redirected to /editor
   ↓
5. Edit your bio link (auto-saves)
   ↓
6. Click "Share Link" button
   ↓
7. Card saved to localStorage
   ↓
8. Share modal opens with your link
   ↓
9. Copy/share your link (e.g., /card/abc123)
   ↓
10. Visit /card/abc123 to see live version
```

## 📞 Still Having Issues?

1. **Check the dev server is running**: `npm run dev`
2. **Clear browser cache**: Ctrl+Shift+Delete
3. **Use incognito mode**: Test with fresh localStorage
4. **Check console errors**: Open DevTools (F12) and look for errors
5. **Visit `/debug`**: See exactly what's in localStorage

## 🔑 Key Points

- **Auto-save**: Changes save automatically as you edit
- **Stable URL**: Your share link URL never changes once created
- **localStorage**: All data stored locally (no database yet)
- **Card ID**: Generated once per editor session and reused
- **Share Link button**: This is the "publish" action that saves your card

---

**Next Steps**: 
1. Visit `/debug` to see what's currently saved
2. If empty, go to `/create` and start fresh
3. Once in editor, click "Share Link" to publish
4. Use the Preview button or share modal to view your live link
