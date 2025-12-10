const express = require('express');
const cors = require('cors');
const multer = require('multer');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Supabase client (only create if URL is provided)
let supabaseAdmin = null;
if (process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY) {
  supabaseAdmin = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    { auth: { persistSession: false } }
  );
}

// Auth helpers
function isAdminRequest(req) {
  try {
    const adminKey = process.env.ADMIN_API_KEY || '';
    const header = req.headers['x-admin-secret'] || '';
    return !!adminKey && header === adminKey;
  } catch (err) {
    return false;
  }
}

function getRequesterStudentId(req) {
  try {
    return req.headers['x-student-id'] || null;
  } catch (err) {
    return null;
  }
}

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API Routes
// ==========

// Drives routes
app.get('/api/drives', async (req, res) => {
  try {
    if (supabaseAdmin && process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY) {
      const { data, error } = await supabaseAdmin
        .from('drives')
        .select('*')
        .order('createdAt', { ascending: false });
      if (error) throw error;
      return res.json({ success: true, data });
    }
    // Fallback to mock data
    res.json({ success: true, data: [] });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message || String(err) });
  }
});

app.post('/api/drives', async (req, res) => {
  try {
    if (!isAdminRequest(req)) {
      return res.status(401).json({ success: false, error: 'Unauthorized' });
    }
    const payload = {
      ...req.body,
      createdAt: new Date().toISOString(),
    };
    if (supabaseAdmin && process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY) {
      const { data, error } = await supabaseAdmin
        .from('drives')
        .insert([payload])
        .select()
        .single();
      if (error) throw error;
      return res.status(201).json({ success: true, data });
    }
    res.status(201).json({ success: true, data: payload });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message || String(err) });
  }
});

app.put('/api/drives', async (req, res) => {
  try {
    if (!isAdminRequest(req)) {
      return res.status(401).json({ success: false, error: 'Unauthorized' });
    }
    const { id, ...updates } = req.body;
    if (!id) {
      return res.status(400).json({ success: false, error: 'Missing id' });
    }
    if (supabaseAdmin && process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY) {
      const { data, error } = await supabaseAdmin
        .from('drives')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return res.json({ success: true, data });
    }
    res.json({ success: true, data: { id, ...updates } });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message || String(err) });
  }
});

app.delete('/api/drives', async (req, res) => {
  try {
    if (!isAdminRequest(req)) {
      return res.status(401).json({ success: false, error: 'Unauthorized' });
    }
    const { id } = req.query;
    if (!id) {
      return res.status(400).json({ success: false, error: 'Missing id' });
    }
    if (supabaseAdmin && process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY) {
      const { error } = await supabaseAdmin
        .from('drives')
        .delete()
        .eq('id', id);
      if (error) throw error;
    }
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message || String(err) });
  }
});

app.get('/api/drives/:id', async (req, res) => {
  try {
    const { id } = req.params;
    if (supabaseAdmin && process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY) {
      const { data, error } = await supabaseAdmin
        .from('drives')
        .select('*')
        .eq('id', id)
        .single();
      if (error) throw error;
      if (!data) {
        return res.status(404).json({ success: false, error: 'Drive not found' });
      }
      return res.json({ success: true, data });
    }
    res.json({ success: true, data: null });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message || String(err) });
  }
});

app.put('/api/drives/:id', async (req, res) => {
  try {
    if (!isAdminRequest(req)) {
      return res.status(401).json({ success: false, error: 'Unauthorized' });
    }
    const { id } = req.params;
    const updates = req.body;
    if (supabaseAdmin && process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY) {
      const { data, error } = await supabaseAdmin
        .from('drives')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return res.json({ success: true, data });
    }
    res.json({ success: true, data: { id, ...updates } });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message || String(err) });
  }
});

// Registrations routes
app.get('/api/registrations', async (req, res) => {
  try {
    const { driveId, studentId } = req.query;
    
    if (supabaseAdmin && process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY) {
      let query = supabaseAdmin.from('registrations').select('*');
      if (driveId) query = query.eq('driveId', driveId);
      if (studentId) query = query.eq('studentId', studentId);
      const { data, error } = await query;
      if (error) throw error;
      return res.json({ success: true, data });
    }
    res.json({ success: true, data: [] });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message || String(err) });
  }
});

app.post('/api/registrations', async (req, res) => {
  try {
    const body = req.body;
    const requester = getRequesterStudentId(req);
    if (!isAdminRequest(req) && (!requester || requester !== body.studentId)) {
      return res.status(401).json({ success: false, error: 'Unauthorized' });
    }
    const payload = {
      ...body,
      submittedAt: new Date().toISOString(),
    };
    if (supabaseAdmin && process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY) {
      const { data, error } = await supabaseAdmin
        .from('registrations')
        .insert([payload])
        .select()
        .single();
      if (error) throw error;
      return res.status(201).json({ success: true, data });
    }
    res.status(201).json({ success: true, data: payload });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message || String(err) });
  }
});

app.put('/api/registrations', async (req, res) => {
  try {
    const { id, ...updates } = req.body;
    if (!id) {
      return res.status(400).json({ success: false, error: 'Missing id' });
    }
    const requester = getRequesterStudentId(req);
    if (supabaseAdmin && process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY) {
      const existing = await supabaseAdmin
        .from('registrations')
        .select('studentId')
        .eq('id', id)
        .single();
      if (existing.error) throw existing.error;
      const ownerId = existing.data?.studentId;
      if (!isAdminRequest(req) && (!requester || requester !== ownerId)) {
        return res.status(401).json({ success: false, error: 'Unauthorized' });
      }
      const { data, error } = await supabaseAdmin
        .from('registrations')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return res.json({ success: true, data });
    }
    res.json({ success: true, data: { id, ...updates } });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message || String(err) });
  }
});

// Students routes
app.get('/api/students', async (req, res) => {
  try {
    // Using mock data from lib/db.ts logic
    res.json({ success: true, data: [] });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch students' });
  }
});

app.post('/api/students', async (req, res) => {
  try {
    const newStudent = {
      id: `student-${Date.now()}`,
      ...req.body,
      appliedDrives: [],
      selectedDrives: [],
    };
    res.status(201).json({ success: true, data: newStudent });
  } catch (error) {
    res.status(400).json({ success: false, error: 'Failed to create student' });
  }
});

app.get('/api/students/:id', async (req, res) => {
  try {
    const { id } = req.params;
    // Using mock data from lib/db.ts logic
    res.json({ success: true, data: null });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch student' });
  }
});

// Applications routes
app.get('/api/applications', async (req, res) => {
  try {
    const { studentId, driveId } = req.query;
    res.json({ success: true, data: [] });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch applications' });
  }
});

app.post('/api/applications', async (req, res) => {
  try {
    const { studentId, driveId } = req.body;
    if (!studentId || !driveId) {
      return res.status(400).json({ success: false, error: 'Missing required fields' });
    }
    const application = {
      id: `app-${Date.now()}`,
      studentId,
      driveId,
      appliedAt: new Date().toISOString(),
      status: 'applied',
    };
    res.status(201).json({ success: true, data: application });
  } catch (error) {
    res.status(400).json({ success: false, error: 'Failed to create application' });
  }
});

// Analytics route
app.get('/api/analytics', async (req, res) => {
  try {
    const analytics = {
      totalStudents: 4000,
      totalApplications: 8500,
      totalPlacements: 7820,
      placementRate: 92.0,
      averagePackage: 62.3,
      highestPackage: 125,
      lowestPackage: 38,
      activeCompanies: 150,
      activeStudents: 3850,
      pendingApplications: 680,
      monthlyData: [
        { month: 'Jan', applications: 1200, placements: 450 },
        { month: 'Feb', applications: 1900, placements: 620 },
        { month: 'Mar', applications: 2200, placements: 750 },
        { month: 'Apr', applications: 2800, placements: 920 },
        { month: 'May', applications: 3200, placements: 1100 },
        { month: 'Jun', applications: 3500, placements: 1250 },
      ],
      branchDistribution: [
        { branch: 'CSE', students: 1200, placements: 1150 },
        { branch: 'ECE', students: 800, placements: 730 },
        { branch: 'Mechanical', students: 600, placements: 520 },
        { branch: 'Civil', students: 400, placements: 320 },
      ],
    };
    res.json({ success: true, data: analytics });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch analytics' });
  }
});

// Chat route (AI)
app.post('/api/chat', async (req, res) => {
  try {
    const { message } = req.body;
    // For now, return a mock response
    // In production, integrate with OpenAI API
    const response = `This is a mock response to: ${message}. Set up OPENAI_API_KEY to enable real AI responses.`;
    res.json({ response });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to process chat' });
  }
});

// Support chatbot route
app.post('/api/support/chatbot', async (req, res) => {
  try {
    const { message } = req.body;
    // Mock response
    const response = `Support response to: ${message}`;
    res.json({ response });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to process support request' });
  }
});

// Upload route (with file handling)
const upload = multer({ storage: multer.memoryStorage() });

app.post('/api/upload', upload.single('file'), async (req, res) => {
  try {
    // Check auth
    const adminKey = process.env.ADMIN_API_KEY || '';
    const adminHeader = req.headers['x-admin-secret'] || '';
    const studentId = req.headers['x-student-id'] || '';
    
    if (!adminKey || (adminHeader !== adminKey && !studentId)) {
      return res.status(401).json({ success: false, error: 'Unauthorized' });
    }

    if (!req.file) {
      return res.status(400).json({ success: false, error: 'No file provided' });
    }

    // If Supabase is configured, upload to Supabase storage
    if (supabaseAdmin && process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY) {
      const filename = `uploads/${Date.now()}_${req.file.originalname}`;
      const { data, error } = await supabaseAdmin.storage
        .from('uploads')
        .upload(filename, req.file.buffer, { upsert: true });
      
      if (error) throw error;
      
      const { data: { publicUrl } } = supabaseAdmin.storage
        .from('uploads')
        .getPublicUrl(data.path);
      
      return res.status(201).json({
        success: true,
        data: {
          fileName: data.path,
          url: publicUrl,
          size: req.file.size,
          type: req.file.mimetype,
        },
      });
    }

    // Mock response if Supabase not configured
    res.status(201).json({
      success: true,
      data: {
        fileName: `uploads/${Date.now()}_${req.file.originalname}`,
        url: `/uploads/mock-${req.file.originalname}`,
        size: req.file.size,
        type: req.file.mimetype,
      },
    });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message || 'Upload failed' });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ success: false, error: 'Internal server error' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, error: 'Route not found' });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Backend server running on http://localhost:${PORT}`);
  console.log(`📡 API endpoints available at http://localhost:${PORT}/api`);
});

module.exports = app;

