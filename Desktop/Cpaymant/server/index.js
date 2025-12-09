const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs').promises;
const multer = require('multer');

const app = express();
const PORT = process.env.PORT || 5000;
const DATA_FILE = path.join(__dirname, 'data', 'payments.json');
const SETTINGS_FILE = path.join(__dirname, 'data', 'settings.json');
const UPLOADS_DIR = path.join(__dirname, 'uploads');

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(UPLOADS_DIR));

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOADS_DIR);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'qr-code-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (extname && mimetype) {
      return cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'));
    }
  }
});

// Ensure data directory exists
const ensureDataDir = async () => {
  const dataDir = path.dirname(DATA_FILE);
  try {
    await fs.access(dataDir);
  } catch {
    await fs.mkdir(dataDir, { recursive: true });
  }
  
  // Ensure uploads directory exists
  try {
    await fs.access(UPLOADS_DIR);
  } catch {
    await fs.mkdir(UPLOADS_DIR, { recursive: true });
  }
  
  // Initialize payments file if it doesn't exist
  try {
    await fs.access(DATA_FILE);
  } catch {
    await fs.writeFile(DATA_FILE, JSON.stringify([], null, 2));
  }
  
  // Initialize settings file if it doesn't exist
  try {
    await fs.access(SETTINGS_FILE);
  } catch {
    await fs.writeFile(SETTINGS_FILE, JSON.stringify({
      upiId: '',
      qrCode: ''
    }, null, 2));
  }
};

// Initialize on startup
ensureDataDir();

// Helper functions
const readPayments = async () => {
  try {
    const data = await fs.readFile(DATA_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
};

const writePayments = async (payments) => {
  await fs.writeFile(DATA_FILE, JSON.stringify(payments, null, 2));
};

// Settings helper functions
const readSettings = async () => {
  try {
    const data = await fs.readFile(SETTINGS_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    return { upiId: '', qrCode: '' };
  }
};

const writeSettings = async (settings) => {
  await fs.writeFile(SETTINGS_FILE, JSON.stringify(settings, null, 2));
};

// Routes

// Get all payment requests
app.get('/api/payments', async (req, res) => {
  try {
    const payments = await readPayments();
    res.json(payments);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch payments' });
  }
});

// Get payment statistics
app.get('/api/statistics', async (req, res) => {
  try {
    const payments = await readPayments();
    const stats = {
      total: payments.length,
      pending: payments.filter(p => p.status === 'pending').length,
      approved: payments.filter(p => p.status === 'approved').length,
      rejected: payments.filter(p => p.status === 'rejected').length,
      totalAmount: payments
        .filter(p => p.status === 'approved')
        .reduce((sum, p) => sum + (parseFloat(p.amount) || 0), 0)
    };
    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch statistics' });
  }
});

// Update payment status (approve/reject)
app.patch('/api/payments/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    if (!['approved', 'rejected', 'pending'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }
    
    const payments = await readPayments();
    const paymentIndex = payments.findIndex(p => p.id === id);
    
    if (paymentIndex === -1) {
      return res.status(404).json({ error: 'Payment not found' });
    }
    
    payments[paymentIndex].status = status;
    payments[paymentIndex].updatedAt = new Date().toISOString();
    
    await writePayments(payments);
    res.json(payments[paymentIndex]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update payment status' });
  }
});

// Get single payment by ID
app.get('/api/payments/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const payments = await readPayments();
    const payment = payments.find(p => p.id === id);
    
    if (!payment) {
      return res.status(404).json({ error: 'Payment not found' });
    }
    
    res.json(payment);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch payment' });
  }
});

// Admin Settings Routes

// Get admin settings
app.get('/api/admin/settings', async (req, res) => {
  try {
    const settings = await readSettings();
    res.json(settings);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch settings' });
  }
});

// Update admin settings
app.post('/api/admin/settings', upload.single('qrCode'), async (req, res) => {
  try {
    const { upiId } = req.body;
    const settings = await readSettings();
    
    // Update UPI ID
    settings.upiId = upiId || settings.upiId;
    
    // Update QR code if file is uploaded
    if (req.file) {
      // Delete old QR code if exists
      if (settings.qrCode && settings.qrCode.startsWith('/uploads/')) {
        const oldFilePath = path.join(__dirname, settings.qrCode);
        try {
          await fs.unlink(oldFilePath);
        } catch (error) {
          console.error('Error deleting old QR code:', error);
        }
      }
      settings.qrCode = `/uploads/${req.file.filename}`;
    }
    
    await writeSettings(settings);
    res.json(settings);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update settings' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

