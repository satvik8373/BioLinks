# Top Cutout Fix - BioCard Header Issue

## Problem
The fixed mobile header was overlapping and cutting off the top portion of the profile image/avatar in the bio card preview.

## Changes Made

### 1. Removed Clickly Package
- ✅ Removed `import { Clickly } from 'useclickly'` from `app/layout.tsx`
- ✅ Removed `<Clickly />` component from layout render
- ✅ Uninstalled `useclickly` package with `npm uninstall useclickly`

### 2. Fixed Card Frame Padding
**File:** `components/card/BioCard.tsx`

**Before:**
```tsx
<div className="... p-4 sm:p-5 md:p-8 ...">
```

**After:**
```tsx
<div className="... pt-16 px-4 pb-4 sm:pt-20 sm:px-5 sm:pb-5 md:p-8 ...">
```

**Changes:**
- Added `pt-16` (64px) top padding on mobile to account for fixed header height
- Added `sm:pt-20` (80px) top padding on small screens
- Kept horizontal and bottom padding separate
- Desktop `md:p-8` remains unchanged (no fixed header on desktop)

### 3. Adjusted Hero Layout Negative Margins
**Before:**
```tsx
-mt-[64px] sm:-mt-[80px] md:-mt-[92px] pt-20 sm:pt-24 md:pt-28
```

**After:**
```tsx
-mt-16 sm:-mt-20 md:-mt-8
```

**Changes:**
- Reduced negative top margin to match the new card frame padding
- Removed extra positive padding that was compensating for old margins
- Hero image now sits properly below the fixed header without being cut off

### 4. Adjusted Banner Layout Negative Margins
**Before:**
```tsx
-mt-[64px] sm:-mt-[80px] md:-mt-[92px]
```

**After:**
```tsx
-mt-16 sm:-mt-20 md:-mt-8
```

**Changes:**
- Consistent with hero layout adjustments
- Banner strip now aligns properly with the fixed header

## Visual Result
- ✅ Fixed header sits at the very top (back button, URL, share button)
- ✅ Profile image/avatar starts immediately below the header (no cutoff)
- ✅ All content is visible and properly spaced
- ✅ Smooth layout on mobile, tablet, and desktop breakpoints

## Technical Details
- Fixed header height: 48px (with padding = ~56-60px total)
- Card frame top padding: 64px (pt-16) provides breathing room
- Negative margins pull content back up to edge while respecting the header space
- Desktop retains original full padding (md:p-8) since no fixed header exists there
