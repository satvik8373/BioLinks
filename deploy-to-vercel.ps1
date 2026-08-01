# Deploy BioLinks to Vercel with environment variables
Write-Host ""
Write-Host "🚀 Deploying BioLinks to Vercel..." -ForegroundColor Cyan
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host ""

# Check if .env.local exists
if (!(Test-Path ".env.local")) {
    Write-Host "❌ .env.local file not found!" -ForegroundColor Red
    exit 1
}

# Read .env.local
Write-Host "📋 Reading environment variables from .env.local..." -ForegroundColor Yellow
$envContent = Get-Content ".env.local" -Raw
$envVars = @{}

$envContent -split "`n" | ForEach-Object {
    $line = $_.Trim()
    if ($line -and !$line.StartsWith("#")) {
        $parts = $line -split "=", 2
        if ($parts.Length -eq 2) {
            $key = $parts[0].Trim()
            $value = $parts[1].Trim()
            $envVars[$key] = $value
        }
    }
}

Write-Host "✅ Found $($envVars.Count) environment variables" -ForegroundColor Green
Write-Host ""

# Build environment variable arguments for Vercel
$envArgs = @()
foreach ($key in $envVars.Keys) {
    $value = $envVars[$key]
    $envArgs += "-e"
    $envArgs += "$key=$value"
}

Write-Host "🏗️  Starting deployment..." -ForegroundColor Cyan
Write-Host ""
Write-Host "This will:" -ForegroundColor Yellow
Write-Host "  1. Create a NEW Vercel project" -ForegroundColor White
Write-Host "  2. Upload your code" -ForegroundColor White
Write-Host "  3. Add all environment variables automatically" -ForegroundColor White
Write-Host "  4. Build and deploy" -ForegroundColor White
Write-Host ""

# Deploy to Vercel with environment variables
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host ""
Write-Host "🚀 Running: vercel --prod" -ForegroundColor Yellow
Write-Host ""

# Run vercel deploy
$arguments = @("--prod", "--yes") + $envArgs
& vercel $arguments

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "✅ Deployment successful!" -ForegroundColor Green
    Write-Host ""
    Write-Host "🎉 Your BioLinks app is now live!" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Next steps:" -ForegroundColor Yellow
    Write-Host "  1. Check the deployment URL above" -ForegroundColor White
    Write-Host "  2. Visit: https://your-url.vercel.app/test-firebase" -ForegroundColor White
    Write-Host "  3. Should show: ✅ Firestore write successful" -ForegroundColor White
    Write-Host ""
} else {
    Write-Host ""
    Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "❌ Deployment failed!" -ForegroundColor Red
    Write-Host ""
    Write-Host "This might be due to:" -ForegroundColor Yellow
    Write-Host "  1. Fair use limits still active" -ForegroundColor White
    Write-Host "  2. Need to delete old projects first" -ForegroundColor White
    Write-Host "  3. Account verification needed" -ForegroundColor White
    Write-Host ""
    Write-Host "Try:" -ForegroundColor Yellow
    Write-Host "  1. Delete old projects: .\cleanup-old-vercel-projects.ps1" -ForegroundColor White
    Write-Host "  2. Wait 24 hours for limits to reset" -ForegroundColor White
    Write-Host "  3. Deploy to Netlify instead: https://netlify.com" -ForegroundColor White
    Write-Host ""
}

Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host ""
