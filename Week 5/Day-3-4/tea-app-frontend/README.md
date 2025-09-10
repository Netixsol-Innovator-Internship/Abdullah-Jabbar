GO THROUGH THIS README FOR ACCESS GUIDE

# Backend URL Configuration Changes

## Files Modified to Use Deployed Backend

The following files have been updated to use the deployed tea-app-backend instead of the local version:

### 1. `src/lib/auth.js`
- **Lines changed**: 46, 143, 169
- **Change**: Updated to use deployed backend URL
- **Purpose**: Authentication and user profile fetching

### 2. `src/services/api.js`
- **Lines changed**: 4-5
- **Change**: Updated baseUrl to point to deployed backend
- **Purpose**: Main API service configuration

### 3. `src/components/SingleItem.jsx`
- **Lines changed**: 23-24
- **Change**: Updated tea product fetching URL to deployed backend
- **Purpose**: Single product page data fetching

## Local Development Setup

The frontend reads backend URLs from the `.env` file. Default vars are:

- `VITE_API_BASE` — main backend base (example: https://week5-day-3-4-tea-app-backend.vercel.app/api)
- `VITE_REVIEWS_BASE` — reviews backend base (example: https://week5-day3-4-tea-reviews-backend.vercel.app)

To run locally:
1. Edit `.env` to point `VITE_API_BASE` and `VITE_REVIEWS_BASE` to the desired backends (or leave defaults).
2. Run frontend with `npm run dev`

## Reverting to Deployed Backend

To use the deployed backend again, uncomment the deployed URLs and comment out the localhost URLs in the above files.

---

# URL Routes
Home:https://abdullah-week4-day5-tea-app-frontend-d8kaf4xor.vercel.app/
Signup: https://abdullah-week4-day5-tea-app-frontend-d8kaf4xor.vercel.app/signup
login: https://abdullah-week4-day5-tea-app-frontend-d8kaf4xor.vercel.app/login
Admin Dashboard: https://abdullah-week4-day5-tea-app-frontend-d8kaf4xor.vercel.app/admin


# Note
Super-Admin and Admin can only be made from backend (POST)signup request with role:super-admin /admin
# Credentials
Super-Admin:
* Email: super@mail.com
* Pass: super 

Admin:
* Email: admin@mail.com
* Pass: admin 

User:
* Email: super@mail.com
* Pass: super 