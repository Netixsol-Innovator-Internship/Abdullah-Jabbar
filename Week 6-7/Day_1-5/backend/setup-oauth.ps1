# OAuth Setup Script for Windows
Write-Host "🚀 Setting up OAuth Authentication..." -ForegroundColor Green

# Check if we're in the right directory
if (-not (Test-Path "package.json")) {
    Write-Host "❌ Error: Please run this script from the backend directory" -ForegroundColor Red
    exit 1
}

# Install OAuth dependencies
Write-Host "📦 Installing OAuth dependencies..." -ForegroundColor Yellow
npm install passport-google-oauth20 passport-github2 passport-discord @types/passport-google-oauth20 @types/passport-github2 @types/passport-discord

# Check if .env file exists
if (-not (Test-Path ".env")) {
    Write-Host "📝 Creating .env file from example..." -ForegroundColor Yellow
    Copy-Item ".env.example" ".env"
    Write-Host "⚠️  Please update the .env file with your OAuth credentials" -ForegroundColor Yellow
} else {
    Write-Host "✅ .env file already exists" -ForegroundColor Green
}

# Build the application
Write-Host "🔨 Building application..." -ForegroundColor Yellow
npm run build

Write-Host "✅ OAuth setup complete!" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "1. Update your .env file with proper OAuth credentials"
Write-Host "2. Configure OAuth providers (Google, GitHub, Discord)"
Write-Host "3. Start the application: npm run start:dev"
Write-Host "4. Test OAuth endpoints: node test-oauth.js"
Write-Host ""
Write-Host "📖 See OAUTH_SETUP_GUIDE.md for detailed instructions" -ForegroundColor Blue