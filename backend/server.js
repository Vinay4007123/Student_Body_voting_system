// 1. Load environment variables FIRST
require('dotenv').config();

// 2. Import all dependencies
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const Voter = require('./models/Voter'); // Import the model

// 3. Initialize app and set port from .env
const app = express();
const PORT = process.env.PORT || 5000; // Reads PORT from .env

// 4. --- Middleware ---
app.use(cors()); // Allow cross-origin requests
app.use(express.json()); // Parse JSON bodies
// Serve uploaded files statically
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// 5. --- MongoDB Connection ---
// Read the connection string from .env
const MONGO_URI = process.env.MONGO_URI; 

// Check if the variable exists
if (!MONGO_URI) {
  console.error("FATAL ERROR: MONGO_URI is not defined in your .env file.");
  process.exit(1); // Exit the app if the DB connection string is missing
}

// Connect to MongoDB
mongoose.connect(MONGO_URI)
  .then(() => console.log('MongoDB connected successfully.'))
  .catch((err) => console.error('MongoDB connection error:', err));

// 6. --- Multer File Upload Setup ---
// Create an 'uploads' directory in your backend folder
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Store files in the 'uploads' folder
  },
  filename: (req, file, cb) => {
    // Create a unique filename
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

// 7. --- API Routes ---

/**
 * @route   POST /api/verify
 * @desc    Submit a new voter verification request
 */
app.post('/api/verify', upload.single('certificate'), async (req, res) => {
  try {
    const { regno } = req.body;

    // Check if file was uploaded
    if (!req.file) {
      return res.status(400).json({ msg: 'No certificate file uploaded.' });
    }

    // Check if regno exists
    let voter = await Voter.findOne({ regno });
    if (voter) {
      return res.status(400).json({ msg: 'Registration number already submitted.' });
    }

    // Create new voter
    voter = new Voter({
      regno: regno,
      certificateImage: req.file.path, // Save the path to the file
      status: 'pending',
    });

    await voter.save();
    res.status(201).json({ msg: 'Verification request submitted successfully. Please wait for admin approval.', voter });

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

/**
 * @route   GET /api/admin/pending
 * @desc    Get all pending voters for admin
 */
app.get('/api/admin/pending', async (req, res) => {
  try {
    const pendingVoters = await Voter.find({ status: 'pending' });
    res.json(pendingVoters);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

/**
 * @route   PATCH /api/admin/approve/:id
 * @desc    Approve a voter
 */
app.patch('/api/admin/approve/:id', async (req, res) => {
  try {
    const voter = await Voter.findByIdAndUpdate(
      req.params.id,
      { status: 'approved' },
      { new: true } // Return the updated document
    );

    if (!voter) {
      return res.status(404).json({ msg: 'Voter not found' });
    }

    res.json({ msg: 'Voter approved', voter });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// (Optional: Add a route for rejection)

// 8. --- Start Server ---
app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});