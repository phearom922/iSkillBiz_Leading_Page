# iSkillBiz Backend API

NestJS backend for iSkillBiz Admin Dashboard.

## Setup

1. Install dependencies:
```bash
cd backend
npm install
```

2. Create `.env` file:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
JWT_SECRET=your_jwt_secret
NESTJS_PORT=3001
FRONTEND_URL=http://localhost:3000
```

3. Run development server:
```bash
npm run start:dev
```

## API Endpoints

### Authentication
- `POST /api/auth/login` - Login
- `POST /api/auth/logout` - Logout
- `GET /api/auth/me` - Get current user

### Sections
- `GET /api/sections` - Get all sections
- `GET /api/sections/:id` - Get section by ID
- `POST /api/sections` - Create section (auth required)
- `PUT /api/sections/:id` - Update section (auth required)
- `DELETE /api/sections/:id` - Delete section (auth required)
- `PUT /api/sections/:id/content` - Update section content (auth required)

### Pricing
- `GET /api/pricing` - Get all pricing plans
- `GET /api/pricing/:id` - Get plan by ID
- `PUT /api/pricing/:id` - Update plan (auth required)

### Videos
- `GET /api/videos?section_id=xxx` - Get videos (optional filter)
- `POST /api/videos` - Create video (auth required)
- `PUT /api/videos/:id` - Update video (auth required)
- `DELETE /api/videos/:id` - Delete video (auth required)

### Images
- `GET /api/images?section_id=xxx` - Get images (optional filter)
- `POST /api/images/upload` - Upload image (auth required)
- `DELETE /api/images/:id` - Delete image (auth required)

