# Backend Server Setup Guide

## ✅ Express Backend Server Created

A complete Express.js backend server has been set up for your RCE Career Hub application.

## 📁 Server Structure

```
server/
├── index.js          # Main Express server file
└── README.md         # Server documentation
```

## 🚀 Quick Start

### 1. Install Dependencies

```bash
npm install --legacy-peer-deps
```

This will install:
- `express` - Web framework
- `cors` - CORS middleware
- `dotenv` - Environment variables
- `multer` - File upload handling
- `concurrently` - Run multiple commands

### 2. Create Environment File

Create a `.env` file in the root directory (copy from `.env.example` if it exists, or create manually):

```env
FRONTEND_URL=http://localhost:5173
PORT=3001
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
ADMIN_API_KEY=your_admin_secret
OPENAI_API_KEY=your_openai_key
```

### 3. Run the Application

**Development (both frontend and backend):**
```bash
npm run dev
```

This will:
- Start the Express backend on `http://localhost:3001`
- Start the Vite frontend on `http://localhost:5173`
- Proxy all `/api/*` requests from frontend to backend

**Backend only:**
```bash
npm run server
```

**Frontend only:**
```bash
npm run dev:client
```

## 🔌 API Endpoints

All API routes from `app/api/` have been converted to Express routes:

### Available Endpoints

- **Drives**: 
  - `GET /api/drives` - Get all drives
  - `POST /api/drives` - Create a new drive (admin only)
  - `PUT /api/drives` - Update a drive (admin only)
  - `DELETE /api/drives?id=:id` - Delete a drive (admin only)
  - `GET /api/drives/:id` - Get a specific drive
  - `PUT /api/drives/:id` - Update a specific drive (admin only)

- **Registrations**: 
  - `GET /api/registrations?driveId=:id&studentId=:id` - Get registrations
  - `POST /api/registrations` - Create a registration
  - `PUT /api/registrations` - Update a registration

- **Students**: 
  - `GET /api/students` - Get all students
  - `POST /api/students` - Create a new student
  - `GET /api/students/:id` - Get a specific student

- **Applications**: 
  - `GET /api/applications?studentId=:id&driveId=:id` - Get applications
  - `POST /api/applications` - Create an application

- **Analytics**: 
  - `GET /api/analytics` - Get analytics data

- **Chat**: 
  - `POST /api/chat` - AI chat endpoint
  - `POST /api/support/chatbot` - Support chatbot endpoint

- **Upload**: 
  - `POST /api/upload` - File upload endpoint (multipart/form-data)

## 🔐 Authentication

### Admin Endpoints
Add this header to admin-only requests:
```
x-admin-secret: your_admin_api_key
```

### Student Endpoints
Add this header for student-specific operations:
```
x-student-id: student-123
```

## 🗄️ Database Support

The server supports two modes:

1. **Supabase Mode** (Production):
   - Set `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY`
   - Uses Supabase as the database
   - All CRUD operations work with real data
   - File uploads go to Supabase Storage

2. **Mock Mode** (Development):
   - Leave Supabase credentials unset
   - Returns mock/empty data
   - Perfect for development without database setup
   - File uploads return mock URLs

## 🔄 How It Works

1. **Frontend** (Vite) runs on port `5173`
2. **Backend** (Express) runs on port `3001`
3. **Vite Proxy** automatically forwards `/api/*` requests to the backend
4. **CORS** is configured to allow frontend requests

## 📝 Example API Call

From the frontend, you can call APIs like this:

```javascript
// This will be proxied to http://localhost:3001/api/drives
const response = await fetch('/api/drives');
const data = await response.json();
```

## 📤 File Upload Example

```javascript
const formData = new FormData();
formData.append('file', fileInput.files[0]);

const response = await fetch('/api/upload', {
  method: 'POST',
  headers: {
    'x-admin-secret': 'your_admin_key', // or 'x-student-id': 'student-123'
  },
  body: formData,
});

const result = await response.json();
console.log(result.data.url); // File URL
```

## 🚢 Deployment

### Vercel
The backend can be deployed as Vercel serverless functions. See `vercel.json` configuration.

### Other Platforms
- **Heroku**: Add a `Procfile` with `web: node server/index.js`
- **Railway**: Configure start command as `node server/index.js`
- **DigitalOcean**: Use App Platform or Droplet
- **Render**: Set build command and start command

## 🛠️ Customization

### Adding New Routes

Edit `server/index.js` and add new routes:

```javascript
app.get('/api/your-route', async (req, res) => {
  try {
    // Your logic here
    res.json({ success: true, data: {} });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});
```

### Adding Middleware

Add middleware before routes:

```javascript
// Example: Request logging
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});
```

## ✅ Next Steps

1. ✅ Backend server created
2. ✅ All API routes converted
3. ✅ Vite proxy configured
4. ✅ File upload support added
5. ⏭️ Set up environment variables
6. ⏭️ Test API endpoints
7. ⏭️ Configure Supabase (optional)
8. ⏭️ Deploy backend server

## 📚 Documentation

See `server/README.md` for detailed API documentation.

## 🐛 Troubleshooting

### Port Already in Use
If port 3001 is already in use, change it in `.env`:
```env
PORT=3002
```

### CORS Errors
Make sure `FRONTEND_URL` in `.env` matches your frontend URL.

### API Not Working
1. Check that the backend server is running: `npm run server`
2. Check the backend logs for errors
3. Verify the Vite proxy is configured correctly in `vite.config.ts`

---

**Status**: ✅ Backend server is ready to use!
