# iSkillBiz Admin Dashboard Setup Guide

## Overview

This project now includes a complete Admin Dashboard system for managing dynamic content on the landing page.

## Architecture

- **Frontend**: Next.js (Admin Dashboard + Landing Page)
- **Backend**: NestJS (REST API)
- **Database**: Supabase (PostgreSQL + Auth + Storage + Realtime)

## Setup Instructions

### 1. Supabase Setup

1. Create a new Supabase project at https://supabase.com
2. Go to SQL Editor and run the migration files in order:
   - `supabase/migrations/001_initial_schema.sql`
   - `supabase/migrations/002_rls_policies.sql`
   - `supabase/migrations/003_seed_data.sql`
3. Create a storage bucket named `images`:
   - Go to Storage → Create bucket
   - Name: `images`
   - Public: Yes
   - Set RLS policies for public read access
4. Create your first admin user:
   - Go to Authentication → Users → Add user
   - Create user with email/password
   - Note the user ID
   - Run this SQL to add to admin_users:
   ```sql
   INSERT INTO admin_users (id, email, role) 
   VALUES ('<user-id-from-auth>', 'your-email@example.com', 'admin');
   ```

### 2. Environment Variables

Create `.env.local` in the root directory:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# NestJS Backend
NESTJS_PORT=3001
JWT_SECRET=your-random-secret-key-here
FRONTEND_URL=http://localhost:3000

# Next.js
NEXT_PUBLIC_API_URL=http://localhost:3001
```

### 3. Install Dependencies

```bash
# Install Next.js dependencies
npm install

# Install NestJS backend dependencies
cd backend
npm install
cd ..
```

### 4. Run Development Servers

**Terminal 1 - Next.js Frontend:**
```bash
npm run dev
```

**Terminal 2 - NestJS Backend:**
```bash
cd backend
npm run start:dev
```

### 5. Access Admin Dashboard

1. Navigate to http://localhost:3000/admin/login
2. Login with your admin credentials
3. Start managing content!

## Features

### Admin Dashboard
- ✅ Login/Logout with JWT authentication
- ✅ Dashboard with statistics
- ✅ Section content management
- ✅ Pricing plan management
- ✅ YouTube video management
- ✅ Image upload and management
- ✅ Dark mode support
- ✅ Real-time updates (via Supabase Realtime)

### Landing Page
- ✅ Dynamic content loading from Supabase
- ✅ Real-time content updates
- ✅ Fallback to static content if database unavailable
- ✅ All sections support dynamic content

## Project Structure

```
Static_SaaS_Landing_Page/
├── app/
│   ├── (admin)/          # Admin routes (protected)
│   │   └── admin/
│   ├── (public)/         # Public landing page
│   └── api/              # Next.js API routes
├── backend/              # NestJS backend
│   └── src/
│       ├── auth/         # Authentication
│       ├── sections/     # Sections API
│       ├── pricing/     # Pricing API
│       ├── videos/       # Videos API
│       └── images/       # Images API
├── components/
│   ├── admin/            # Admin components
│   └── sections/         # Landing page sections
├── lib/
│   ├── supabase/         # Supabase clients
│   └── hooks/            # React hooks
└── supabase/
    └── migrations/       # Database migrations
```

## Deployment

### Supabase
- Database and storage are automatically deployed with your Supabase project

### NestJS Backend
- Deploy to Railway, Render, or DigitalOcean
- Set environment variables in your hosting platform

### Next.js Frontend
- Deploy to Vercel (recommended)
- Set environment variables in Vercel dashboard
- Update `NEXT_PUBLIC_API_URL` to your backend URL

## Security Notes

- Admin routes are protected with JWT authentication
- Supabase RLS policies ensure only admins can edit content
- Public read access is allowed for landing page content
- Service role key should only be used server-side

## Troubleshooting

1. **Can't login**: Check that admin user exists in `admin_users` table
2. **Content not loading**: Verify Supabase environment variables
3. **Images not uploading**: Check storage bucket permissions
4. **Backend not starting**: Verify all environment variables are set

