#!/bin/bash

# OAuth Setup Script
echo "🚀 Setting up OAuth Authentication..."

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: Please run this script from the backend directory"
    exit 1
fi

# Install OAuth dependencies
echo "📦 Installing OAuth dependencies..."
npm install passport-google-oauth20 passport-github2 passport-discord @types/passport-google-oauth20 @types/passport-github2 @types/passport-discord

# Check if .env file exists
if [ ! -f ".env" ]; then
    echo "📝 Creating .env file from example..."
    cp .env.example .env
    echo "⚠️  Please update the .env file with your OAuth credentials"
else
    echo "✅ .env file already exists"
fi

# Build the application
echo "🔨 Building application..."
npm run build

echo "✅ OAuth setup complete!"
echo ""
echo "Next steps:"
echo "1. Update your .env file with proper OAuth credentials"
echo "2. Configure OAuth providers (Google, GitHub, Discord)"
echo "3. Start the application: npm run start:dev"
echo "4. Test OAuth endpoints: node test-oauth.js"
echo ""
echo "📖 See OAUTH_SETUP_GUIDE.md for detailed instructions"