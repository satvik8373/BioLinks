# PowerShell script to clean up old Vercel projects
# This will help you stay within free tier limits

Write-Host ""
Write-Host "🗑️  Vercel Project Cleanup Tool" -ForegroundColor Cyan
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host ""

# Check if vercel CLI is installed
try {
    $vercelVersion = vercel --version 2>&1 | Select-Object -First 1
    Write-Host "✅ Vercel CLI found" -ForegroundColor Green
} catch {
    Write-Host "❌ Vercel CLI not found. Install it with: npm i -g vercel" -ForegroundColor Red
    exit 1
}

# List all projects
Write-Host ""
Write-Host "📋 Fetching your Vercel projects..." -ForegroundColor Yellow
Write-Host ""
vercel project ls

Write-Host ""
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host ""
Write-Host "🎯 Recommended: Delete OLD projects to free up limits" -ForegroundColor Yellow
Write-Host ""
Write-Host "Projects that are 60+ days old:" -ForegroundColor Gray
Write-Host "  • cover-pro-ai (67 days)" -ForegroundColor Gray
Write-Host "  • practicals-collage (67 days)" -ForegroundColor Gray
Write-Host "  • mavrix-perfume-style (67 days)" -ForegroundColor Gray
Write-Host "  • home-treding-api (68 days)" -ForegroundColor Gray
Write-Host "  • res-tful-blog-application (71 days)" -ForegroundColor Gray
Write-Host "  • mx-compiler (72 days)" -ForegroundColor Gray
Write-Host "  • mavrix-perfume (73 days)" -ForegroundColor Gray
Write-Host "  • u-meet (74 days)" -ForegroundColor Gray
Write-Host "  • home-treding (74 days)" -ForegroundColor Gray
Write-Host "  • mini-over (75 days)" -ForegroundColor Gray
Write-Host "  • 27-09-2004 (76 days)" -ForegroundColor Gray
Write-Host ""
Write-Host "⚠️  Deleting 5-8 projects will FREE UP your account limits!" -ForegroundColor Yellow
Write-Host ""

# Ask which projects to delete
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host ""
Write-Host "How do you want to proceed?" -ForegroundColor Cyan
Write-Host ""
Write-Host "1. Delete SUGGESTED old projects automatically (Recommended)" -ForegroundColor White
Write-Host "2. Let me choose which projects to delete manually" -ForegroundColor White
Write-Host "3. Cancel (I'll do it manually via dashboard)" -ForegroundColor White
Write-Host ""

$choice = Read-Host "Enter your choice (1, 2, or 3)"

if ($choice -eq "1") {
    # Automatically delete suggested projects
    $projectsToDelete = @(
        "27-09-2004",
        "mini-over",
        "home-treding",
        "u-meet",
        "mavrix-perfume",
        "mx-compiler",
        "res-tful-blog-application",
        "home-treding-api"
    )
    
    Write-Host ""
    Write-Host "🗑️  Will delete these 8 projects:" -ForegroundColor Yellow
    foreach ($proj in $projectsToDelete) {
        Write-Host "  • $proj" -ForegroundColor Gray
    }
    Write-Host ""
    Write-Host "⚠️  WARNING: This action cannot be undone!" -ForegroundColor Red
    Write-Host ""
    $confirm = Read-Host "Are you sure? Type 'DELETE' to confirm"
    
    if ($confirm -eq "DELETE") {
        Write-Host ""
        Write-Host "🚀 Starting cleanup..." -ForegroundColor Cyan
        $deleted = 0
        $failed = 0
        
        foreach ($project in $projectsToDelete) {
            Write-Host ""
            Write-Host "Deleting: $project..." -ForegroundColor Yellow
            
            $result = vercel remove $project --yes 2>&1
            if ($LASTEXITCODE -eq 0) {
                Write-Host "  ✅ Deleted successfully" -ForegroundColor Green
                $deleted++
            } else {
                Write-Host "  ❌ Failed (might not exist or no permission)" -ForegroundColor Red
                $failed++
            }
            
            Start-Sleep -Seconds 1
        }
        
        Write-Host ""
        Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
        Write-Host ""
        Write-Host "✅ Cleanup Summary:" -ForegroundColor Green
        Write-Host "  • Deleted: $deleted projects" -ForegroundColor Green
        Write-Host "  • Failed: $failed projects" -ForegroundColor Red
        Write-Host ""
        Write-Host "🎉 Your Vercel limits should be freed up now!" -ForegroundColor Cyan
        Write-Host ""
        Write-Host "Next steps:" -ForegroundColor Yellow
        Write-Host "  1. Wait 5-10 minutes for Vercel to update" -ForegroundColor White
        Write-Host "  2. Try deploying your BioLinks project again" -ForegroundColor White
        Write-Host "  3. Add environment variables via dashboard" -ForegroundColor White
        Write-Host ""
        
    } else {
        Write-Host ""
        Write-Host "❌ Cancelled. No projects were deleted." -ForegroundColor Red
        Write-Host ""
    }
    
} elseif ($choice -eq "2") {
    # Manual selection
    Write-Host ""
    Write-Host "📝 Manual deletion mode" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "To delete a project, run:" -ForegroundColor Yellow
    Write-Host "  vercel remove PROJECT-NAME --yes" -ForegroundColor White
    Write-Host ""
    Write-Host "Example:" -ForegroundColor Yellow
    Write-Host "  vercel remove mini-over --yes" -ForegroundColor White
    Write-Host ""
    
} else {
    Write-Host ""
    Write-Host "ℹ️  To delete projects manually:" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "1. Go to: https://vercel.com/dashboard" -ForegroundColor White
    Write-Host "2. Click on a project" -ForegroundColor White
    Write-Host "3. Settings → General → Delete Project" -ForegroundColor White
    Write-Host "4. Type project name to confirm" -ForegroundColor White
    Write-Host "5. Click Delete" -ForegroundColor White
    Write-Host ""
    Write-Host "Repeat for 5-8 old projects to free up limits!" -ForegroundColor Yellow
    Write-Host ""
}

Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host ""
