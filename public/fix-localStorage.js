/**
 * Emergency localStorage Fix Script
 * 
 * Run this in your browser console if you're seeing "Page not found"
 * 
 * Usage:
 * 1. Open browser console (F12)
 * 2. Copy and paste this entire script
 * 3. Press Enter
 * 4. Follow the instructions
 */

(function() {
  console.log('🔧 LinkTree LocalStorage Fix Tool');
  console.log('================================\n');

  // Check what's currently saved
  const currentConfig = localStorage.getItem('currentBioLinkConfig');
  const previewCardId = localStorage.getItem('editorPreviewCardId');
  const bioCardsStr = localStorage.getItem('bioCards');
  const bioCards = bioCardsStr ? JSON.parse(bioCardsStr) : {};

  console.log('📊 Current Status:');
  console.log('- Editor Config:', currentConfig ? '✅ Found' : '❌ Missing');
  console.log('- Preview Card ID:', previewCardId || '❌ Missing');
  console.log('- Saved Cards:', Object.keys(bioCards).length);
  console.log('\n');

  if (!currentConfig) {
    console.error('❌ No editor config found!');
    console.log('📝 Solution: Go to /create and fill out the form first');
    console.log('\n');
    return;
  }

  // Parse and save the config
  try {
    const config = JSON.parse(currentConfig);
    const cardId = previewCardId || '1139dai67'; // Use your card ID

    // Create the card
    bioCards[cardId] = {
      id: cardId,
      config: {
        profile: config.profile,
        links: config.links,
        theme: config.theme,
        socialLinks: config.socialLinks || {},
      },
      analytics: bioCards[cardId]?.analytics || { views: 0, clicks: 0 },
      createdAt: bioCards[cardId]?.createdAt || new Date().toISOString(),
    };

    // Save back
    localStorage.setItem('bioCards', JSON.stringify(bioCards));
    localStorage.setItem('editorPreviewCardId', cardId);

    console.log('✅ SUCCESS! Card saved!');
    console.log('\n📍 Your card URL:');
    console.log(`   ${window.location.origin}/card/${cardId}`);
    console.log('\n🎯 Next steps:');
    console.log(`   1. Visit: ${window.location.origin}/card/${cardId}`);
    console.log('   2. Or click "Share Link" button in editor');
    console.log('\n');

    // Show card details
    console.log('📦 Card Details:');
    console.log('- Title:', config.profile?.title || '(no title)');
    console.log('- Bio:', config.profile?.bio || '(no bio)');
    console.log('- Links:', config.links?.length || 0);
    console.log('- Theme:', config.theme?.id || '(no theme)');

  } catch (error) {
    console.error('❌ Error:', error.message);
    console.log('\n🔧 Try this manual fix:');
    console.log('1. Go to /create');
    console.log('2. Fill the form');
    console.log('3. Click Continue to Editor');
    console.log('4. Click "Share Link" button');
  }

  console.log('\n================================');
  console.log('Need more help? Visit /debug');
})();
