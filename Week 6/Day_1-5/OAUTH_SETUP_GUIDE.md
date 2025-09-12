# OAuth Authentication Setup Guide

This guide explains how to set up OAuth authentication with Google, GitHub, and Discord for your application.

## Prerequisites

1. Node.js and npm installed
2. MongoDB database running
3. Backend and Frontend applications set up

## Backend Setup

### 1. Install Dependencies

The OAuth dependencies have been installed:
```bash
npm install passport-google-oauth20 passport-github2 passport-discord @types/passport-google-oauth20 @types/passport-github2 @types/passport-discord
```

### 2. Environment Variables

Copy the `.env.example` file to `.env` and update the values:

```bash
cp .env.example .env
```

Update the following OAuth configuration in your `.env` file:

```env
# OAuth Configuration
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_CALLBACK_URL=http://localhost:4000/auth/google/callback

GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret
GITHUB_CALLBACK_URL=http://localhost:4000/auth/github/callback

DISCORD_CLIENT_ID=your-discord-client-id
DISCORD_CLIENT_SECRET=your-discord-client-secret
DISCORD_CALLBACK_URL=http://localhost:4000/auth/discord/callback

# Frontend URL for redirects after OAuth
FRONTEND_URL=http://localhost:3000

# JWT Configuration
JWT_SECRET=your-secure-jwt-secret-key
JWT_EXPIRES_IN=7d
```

### 3. Database Schema Update

The User schema has been updated to support OAuth providers. The changes include:
- `oauthProviders` field to store OAuth provider information
- `picture` field for user profile pictures
- `passwordHash` is now optional for OAuth-only users

### 4. OAuth Providers Configuration

#### Google OAuth Setup
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable Google+ API
4. Go to "Credentials" → "Create Credentials" → "OAuth 2.0 Client IDs"
5. Set application type to "Web application"
6. Add authorized redirect URIs:
   - `http://localhost:4000/auth/google/callback` (development)
   - `https://yourdomain.com/auth/google/callback` (production)
7. Copy Client ID and Client Secret to your `.env` file

#### GitHub OAuth Setup
1. Go to [GitHub Developer Settings](https://github.com/settings/developers)
2. Click "New OAuth App"
3. Fill in the application details:
   - Application name: Your app name
   - Homepage URL: `http://localhost:3000` (development)
   - Authorization callback URL: `http://localhost:4000/auth/github/callback`
4. Copy Client ID and Client Secret to your `.env` file

#### Discord OAuth Setup
1. Go to [Discord Developer Portal](https://discord.com/developers/applications)
2. Click "New Application"
3. Go to "OAuth2" section
4. Add redirect URI: `http://localhost:4000/auth/discord/callback`
5. Copy Client ID and Client Secret to your `.env` file

## Frontend Setup

### 1. Environment Variables

Copy the `.env.example` file to `.env.local`:

```bash
cp .env.example .env.local
```

Update the API URL:

```env
NEXT_PUBLIC_API_URL=http://localhost:4000
```

### 2. OAuth Flow

The OAuth flow works as follows:
1. User clicks OAuth button on the auth form
2. User is redirected to the OAuth provider (Google/GitHub/Discord)
3. After authorization, provider redirects to backend callback
4. Backend processes the OAuth data and creates/updates user
5. Backend redirects to frontend callback page with JWT token
6. Frontend callback page stores the token and redirects to main app

## API Endpoints

### OAuth Endpoints

- `GET /auth/google` - Initiate Google OAuth
- `GET /auth/google/callback` - Google OAuth callback
- `GET /auth/github` - Initiate GitHub OAuth
- `GET /auth/github/callback` - GitHub OAuth callback
- `GET /auth/discord` - Initiate Discord OAuth
- `GET /auth/discord/callback` - Discord OAuth callback

### Existing Auth Endpoints

- `POST /auth/login` - Email/password login
- `POST /auth/register` - Register with email/password/OTP
- `POST /auth/pre-register` - Request OTP for registration
- `POST /auth/verify-email` - Verify email with OTP
- `POST /auth/me` - Get current user profile
- `POST /auth/refresh` - Refresh JWT token

## Frontend Pages

- `/authForm` - Main authentication form with OAuth buttons
- `/auth/callback` - OAuth callback handler page

## Usage

### Starting the Application

1. Start the backend:
```bash
cd backend
npm run start:dev
```

2. Start the frontend:
```bash
cd frontend
npm run dev
```

3. Navigate to `http://localhost:3000/authForm`
4. Choose either email/password authentication or OAuth provider

### OAuth Button Integration

The OAuth buttons are integrated into the existing auth form and will redirect users to their chosen provider. After successful authentication, users are redirected back to the main application.

## Security Considerations

1. **Environment Variables**: Never commit real OAuth credentials to version control
2. **HTTPS**: Use HTTPS in production for OAuth callbacks
3. **JWT Secret**: Use a strong, random JWT secret in production
4. **Callback URLs**: Ensure callback URLs match exactly in OAuth provider settings
5. **CORS**: Configure CORS properly for your domain

## Troubleshooting

### Common Issues

1. **Invalid Redirect URI**: Ensure callback URLs in OAuth provider settings match your configuration
2. **Missing Environment Variables**: Verify all required environment variables are set
3. **Token Issues**: Check JWT secret and expiration settings
4. **Email Scope**: Ensure email scope is requested from OAuth providers

### Error Handling

The implementation includes comprehensive error handling:
- OAuth provider errors are caught and displayed to users
- Failed authentications redirect to error page with details
- Token validation errors are handled gracefully

## Testing

1. Test each OAuth provider individually
2. Verify user creation and login flow
3. Test token persistence and refresh
4. Verify profile data is correctly saved

## Production Deployment

1. Update OAuth provider settings with production URLs
2. Set secure environment variables
3. Configure HTTPS
4. Update CORS settings
5. Test all OAuth flows in production environment