@echo off
echo ========================================
echo   Deploy Firestore Rules - BioLinks
echo ========================================
echo.

echo Step 1: Login to Firebase...
firebase login
echo.

echo Step 2: Initialize Firestore (if needed)...
firebase init firestore
echo.

echo Step 3: Deploy Firestore Rules...
firebase deploy --only firestore:rules
echo.

echo ========================================
echo   Deployment Complete!
echo ========================================
echo.
echo Next steps:
echo 1. Refresh your localhost:3000/editor page
echo 2. Try "Save & Share Link" again
echo 3. Should work now!
echo.

pause
