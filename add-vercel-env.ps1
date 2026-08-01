# PowerShell script to add environment variables to Vercel
# Run this after resolving the Vercel fair use limit issue

Write-Host "🚀 Adding Environment Variables to Vercel..." -ForegroundColor Cyan
Write-Host ""

# Check if vercel CLI is installed
try {
    $vercelVersion = vercel --version 2>&1
    Write-Host "✅ Vercel CLI found: $vercelVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Vercel CLI not found. Install it with: npm i -g vercel" -ForegroundColor Red
    exit 1
}

# Check if logged in
Write-Host ""
Write-Host "Checking Vercel login..." -ForegroundColor Yellow
$whoami = vercel whoami 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Not logged in to Vercel. Run: vercel login" -ForegroundColor Red
    exit 1
}
Write-Host "✅ Logged in as: $whoami" -ForegroundColor Green

# Read .env.local file
Write-Host ""
Write-Host "Reading .env.local file..." -ForegroundColor Yellow
if (!(Test-Path ".env.local")) {
    Write-Host "❌ .env.local file not found!" -ForegroundColor Red
    exit 1
}

$envContent = Get-Content ".env.local" -Raw
Write-Host "✅ Found .env.local" -ForegroundColor Green

# Parse environment variables
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

Write-Host ""
Write-Host "Found $($envVars.Count) environment variables:" -ForegroundColor Cyan
$envVars.Keys | ForEach-Object {
    Write-Host "  - $_" -ForegroundColor Gray
}

# Ask for confirmation
Write-Host ""
Write-Host "⚠️  IMPORTANT: Make sure you've resolved the Vercel fair use limit issue first!" -ForegroundColor Yellow
Write-Host ""
$confirm = Read-Host "Do you want to add these variables to Vercel? (yes/no)"
if ($confirm -ne "yes") {
    Write-Host "Cancelled." -ForegroundColor Red
    exit 0
}

# Ask for project name
Write-Host ""
Write-Host "Available projects:" -ForegroundColor Cyan
vercel project ls
Write-Host ""
$projectName = Read-Host "Enter your project name (e.g., bio-links)"

# Add each environment variable
Write-Host ""
Write-Host "Adding environment variables..." -ForegroundColor Cyan
$successCount = 0
$errorCount = 0

foreach ($key in $envVars.Keys) {
    $value = $envVars[$key]
    Write-Host ""
    Write-Host "Adding: $key" -ForegroundColor Yellow
    
    # Create a temporary file with the value
    $tempFile = [System.IO.Path]::GetTempFileName()
    Set-Content -Path $tempFile -Value $value -NoNewline
    
    # Add to Vercel (production, preview, and development)
    $result = Get-Content $tempFile | vercel env add $key production --yes 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Host "  ✅ Added to production" -ForegroundColor Green
        $successCount++
    } else {
        Write-Host "  ❌ Failed to add to production: $result" -ForegroundColor Red
        $errorCount++
    }
    
    # Clean up temp file
    Remove-Item $tempFile -Force
    
    Start-Sleep -Milliseconds 500
}

Write-Host ""
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host "✅ Successfully added: $successCount variables" -ForegroundColor Green
Write-Host "❌ Failed: $errorCount variables" -ForegroundColor Red
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "1. Go to Vercel Dashboard" -ForegroundColor White
Write-Host "2. Navigate to your project → Deployments" -ForegroundColor White
Write-Host "3. Click 'Redeploy' on the latest deployment" -ForegroundColor White
Write-Host "4. Wait 2-3 minutes for deployment to complete" -ForegroundColor White
Write-Host "5. Test: https://your-app.vercel.app/test-firebase" -ForegroundColor White
Write-Host ""
Write-Host "🚀 Done!" -ForegroundColor Cyan
