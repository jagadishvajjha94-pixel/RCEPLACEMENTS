# Backend Server

Express.js backend server for the RCE Career Hub API.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file in the root directory (copy from `.env.example`):
```bash
cp .env.example .env
```

3. Update `.env` with your configuration values.

## Running the Server

### Development (with frontend)
```bash
npm run dev
```
This runs both the backend server and Vite dev server concurrently.

### Backend only
```bash
npm run server
# or
npm run dev:server
```

### Frontend only
```bash
npm run dev:client
```

## API Endpoints

### Health Check
- `GET /health` - Server health check

### Drives
- `GET /api/drives` - Get all drives
- `POST /api/drives` - Create a new drive (requires admin auth)
- `PUT /api/drives` - Update a drive (requires admin auth)
- `DELETE /api/drives?id=:id` - Delete a drive (requires admin auth)
- `GET /api/drives/:id` - Get a specific drive
- `PUT /api/drives/:id` - Update a specific drive (requires admin auth)

### Registrations
- `GET /api/registrations?driveId=:id&studentId=:id` - Get registrations
- `POST /api/registrations` - Create a registration
- `PUT /api/registrations` - Update a registration

### Students
- `GET /api/students` - Get all students
- `POST /api/students` - Create a new student
- `GET /api/students/:id` - Get a specific student

### Applications
- `GET /api/applications?studentId=:id&driveId=:id` - Get applications
- `POST /api/applications` - Create an application

### Analytics
- `GET /api/analytics` - Get analytics data

### Chat
- `POST /api/chat` - AI chat endpoint
- `POST /api/support/chatbot` - Support chatbot endpoint

### Upload
- `POST /api/upload` - File upload endpoint

## Authentication

### Admin Endpoints
Admin-only endpoints require the `x-admin-secret` header:
```
x-admin-secret: your_admin_api_key
```

### Student Endpoints
Some endpoints accept `x-student-id` header for student-specific operations:
```
x-student-id: student-123
```

## Environment Variables

- `PORT` - Server port (default: 3001)
- `FRONTEND_URL` - Frontend URL for CORS (default: http://localhost:5173)
- `SUPABASE_URL` - Supabase project URL
- `SUPABASE_SERVICE_ROLE_KEY` - Supabase service role key
- `ADMIN_API_KEY` - Secret key for admin endpoints
- `OPENAI_API_KEY` - OpenAI API key for AI features

## Database

The server supports two modes:

1. **Supabase Mode**: When `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` are set, the server uses Supabase as the database.

2. **Mock Mode**: When Supabase credentials are not set, the server returns mock/empty data. This is useful for development without a database.

## Development Notes

- The server runs on port 3001 by default
- CORS is enabled for the frontend URL
- All API responses follow the format: `{ success: boolean, data?: any, error?: string }`
- Error responses include appropriate HTTP status codes

