// 1. Load environment variables FIRST
require('dotenv').config();

// 2. Import all dependencies
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const bcrypt = require('bcryptjs'); 
const jwt = require('jsonwebtoken'); 

// 3. --- IMPORT ALL YOUR MODELS ---
const Voter = require('./models/Voter'); 
const Candidate = require('./models/Candidate');
const Complaint = require('./models/Complaint');
const ElectionStatus = require('./models/ElectionStatus');
const Admin = require('./models/Admin'); 

// 4. Initialize app and set port from .env
const app = express();
const PORT = process.env.PORT || 5000;

// 5. --- Middleware ---
app.use(cors()); 
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// 6. --- MongoDB Connection ---
const MONGO_URI = process.env.MONGO_URI; 
if (!MONGO_URI) {
  console.error("FATAL ERROR: MONGO_URI is not defined.");
  process.exit(1); 
}
mongoose.connect(MONGO_URI)
  .then(async () => {
    console.log('MongoDB connected successfully.');
    const statusCount = await ElectionStatus.countDocuments();
    if (statusCount === 0) {
      console.log('Initializing election status...');
      await new ElectionStatus().save();
    }
  })
  .catch((err) => console.error('MongoDB connection error:', err));

// 7. --- Multer File Upload Setup ---
const storage = multer.diskStorage({
  destination: (req, file, cb) => { cb(null, 'uploads/'); },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  },
});
const upload = multer({ storage: storage });

// 8. --- API Routes ---

// === VOTER-FACING Routes (Not Protected) ===
app.post('/api/verify', upload.single('certificate'), async (req, res) => {
  try {
    const { regno } = req.body;
    if (!req.file) return res.status(400).json({ msg: 'No certificate file uploaded.' });
    if (!regno) return res.status(400).json({ msg: 'Registration number is required.' });
    let voter = await Voter.findOne({ regno });
    if (voter) return res.status(400).json({ msg: 'Registration number already submitted.' });
    voter = new Voter({ regno: regno, certificateImage: req.file.path, status: 'pending' });
    await voter.save();
    res.status(201).json({ msg: 'Verification request submitted. Please wait for admin approval.', voter });
  } catch (err) { console.error(err.message); res.status(500).send('Server Error'); }
});

app.post('/api/complaint', async (req, res) => {
    try {
        const { name, email, message } = req.body;
        if (!name || !email || !message) {
            return res.status(400).json({ msg: 'All fields are required.' });
        }
        const complaint = new Complaint({ name, email, message });
        await complaint.save();
        res.status(201).json({ msg: 'Complaint submitted successfully.' });
    } catch (err) { console.error(err.message); res.status(500).send('Server Error'); }
});

app.post('/api/voter-status', async (req, res) => {
    try {
        const { regno } = req.body;
        if (!regno) {
            return res.status(400).json({ msg: 'Registration number is required.' });
        }
        const voter = await Voter.findOne({ regno });
        if (!voter) {
            return res.status(404).json({ msg: 'Voter not found. Please check your registration number.' });
        }
        if (voter.status !== 'approved') {
            return res.status(403).json({ msg: `Your registration is not yet approved (Status: ${voter.status}).` });
        }
        if (voter.hasVoted) {
            return res.status(403).json({ msg: 'You have already voted.' });
        }
        res.json({ msg: 'Voter is eligible.', voter: { _id: voter._id, regno: voter.regno } });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

app.post('/api/vote', async (req, res) => {
    try {
        const { regno, candidateId } = req.body;
        const electionStatus = await ElectionStatus.findOne();
        if (electionStatus.status !== 'Running') {
            return res.status(403).json({ msg: `Voting is not currently active. Status: ${electionStatus.status}` });
        }
        const voter = await Voter.findOne({ regno });
        if (!voter) return res.status(404).json({ msg: 'Voter not found.' });
        if (voter.status !== 'approved') return res.status(403).json({ msg: 'Voter is not approved to vote.' });
        if (voter.hasVoted) return res.status(400).json({ msg: 'You have already voted.' });
        const candidate = await Candidate.findById(candidateId);
        if (!candidate) return res.status(404).json({ msg: 'Candidate not found.' });
        candidate.votes += 1;
        await candidate.save();
        voter.hasVoted = true;
        await voter.save();
        res.json({ msg: 'Vote cast successfully!' });
    } catch (err) { console.error(err.message); res.status(500).send('Server Error'); }
});

app.post('/api/vote/nota', async (req, res) => {
    try {
        const { regno } = req.body;
        const electionStatus = await ElectionStatus.findOne();
        if (electionStatus.status !== 'Running') {
            return res.status(403).json({ msg: `Voting is not currently active.` });
        }
        const voter = await Voter.findOne({ regno });
        if (!voter) return res.status(404).json({ msg: 'Voter not found.' });
        if (voter.status !== 'approved') return res.status(403).json({ msg: 'Voter is not approved.' });
        if (voter.hasVoted) return res.status(400).json({ msg: 'You have already voted.' });
        voter.hasVoted = true;
        await voter.save();
        res.json({ msg: 'NOTA vote cast successfully!' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// --- Public Results Routes ---
app.get('/api/results/live', async (req, res) => {
    try {
        const electionStatus = await ElectionStatus.findOne();
        if (electionStatus.status === 'Not Started') {
            return res.status(403).json({ msg: 'Voting has not started.' });
        }
        const results = await Candidate.find({}).sort({ votes: -1 });
        res.json(results);
    } catch (err) { console.error(err.message); res.status(500).send('Server Error'); }
});
app.get('/api/results/final', async (req, res) => {
    try {
        const electionStatus = await ElectionStatus.findOne();
        if (electionStatus.status !== 'Published') {
            return res.status(403).json({ msg: 'Final results are not yet published.' });
        }
        const results = await Candidate.find({}).sort({ votes: -1 });
        res.json(results);
    } catch (err) { console.error(err.message); res.status(500).send('Server Error'); }
});

// --- NEW: Public Election Status Route ---
/**
 * @route   GET /api/election-status
 * @desc    Get the current status of the election (public)
 */
app.get('/api/election-status', async (req, res) => {
    try {
        const status = await ElectionStatus.findOne();
        if (!status) {
            return res.status(500).json({ msg: 'Election status not found.' });
        }
        res.json(status);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// --- NEW: Public Candidates Route ---
/**
 * @route   GET /api/candidates
 * @desc    Get all candidates (public)
 */
app.get('/api/candidates', async (req, res) => {
    try {
        // Only send back non-sensitive info
        const candidates = await Candidate.find({}).select('name description'); 
        res.json(candidates);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});


// === CANDIDATE-FACING Routes ===

app.post('/api/candidate/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ msg: 'Please enter all fields' });
        }
        const candidate = await Candidate.findOne({ email });
        if (!candidate) {
            return res.status(400).json({ msg: 'Invalid credentials' });
        }
        const isMatch = await bcrypt.compare(password, candidate.password);
        if (!isMatch) {
            return res.status(400).json({ msg: 'Invalid credentials' });
        }
        const payload = { user: { id: candidate.id, name: candidate.name, role: 'candidate' } };
        jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '3h' }, (err, token) => {
            if (err) throw err;
            res.json({ token });
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// --- Auth Middleware (to protect routes) ---
const auth = (req, res, next) => {
    const token = req.header('x-auth-token');
    if (!token) {
        return res.status(401).json({ msg: 'No token, authorization denied' });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded.user;
        next();
    } catch (err) {
        res.status(401).json({ msg: 'Token is not valid' });
    }
};
// -----------------------------------------------

// --- NEW: Get Candidate Details (Protected) ---
app.get('/api/candidate/me', auth, async (req, res) => {
    if (req.user.role !== 'candidate') {
        return res.status(403).json({ msg: 'Forbidden' });
    }
    try {
        const candidate = await Candidate.findById(req.user.id).select('-password'); 
        if (!candidate) {
            return res.status(404).json({ msg: 'Candidate not found' });
        }
        res.json(candidate);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// --- NEW: Update Candidate Details (Protected) ---
app.put('/api/candidate/me', auth, async (req, res) => {
    if (req.user.role !== 'candidate') {
        return res.status(403).json({ msg: 'Forbidden' });
    }
    try {
        const { name, email, phone, description } = req.body;
        const updatedFields = { name, email, phone, description };

        const candidate = await Candidate.findByIdAndUpdate(
            req.user.id,
            { $set: updatedFields },
            { new: true }
        ).select('-password');

        res.json({ msg: 'Profile updated successfully', candidate });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});


app.post('/api/candidate/change-password', auth, async (req, res) => {
    if (req.user.role !== 'candidate') {
        return res.status(403).json({ msg: 'Forbidden' });
    }
    try {
        const { oldPassword, newPassword } = req.body;
        if (!oldPassword || !newPassword) {
            return res.status(400).json({ msg: 'Please provide old and new passwords' });
        }
        const candidate = await Candidate.findById(req.user.id);
        if (!candidate) {
            return res.status(404).json({ msg: 'Candidate not found' });
        }
        const isMatch = await bcrypt.compare(oldPassword, candidate.password);
        if (!isMatch) {
            return res.status(400).json({ msg: 'Incorrect old password' });
        }
        const salt = await bcrypt.genSalt(10);
        candidate.password = await bcrypt.hash(newPassword, salt);
        await candidate.save();
        res.json({ msg: 'Password changed successfully' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});


// === ADMIN-FACING Routes (ALL ARE NOW PROTECTED) ===

// --- Admin Auth (Login/Register are public) ---
app.post('/api/admin/register', async (req, res) => {
    try {
        const { email, password, secretKey } = req.body;
        if (!email || !password || !secretKey) {
            return res.status(400).json({ msg: 'Please enter email, password, and secret key.' });
        }
        if (secretKey !== process.env.ADMIN_REGISTER_SECRET) {
            return res.status(401).json({ msg: 'Invalid secret key. Admin registration failed.' });
        }
        let admin = await Admin.findOne({ email });
        if (admin) {
            return res.status(400).json({ msg: 'Admin account with this email already exists.' });
        }
        admin = new Admin({ email, password });
        const salt = await bcrypt.genSalt(10);
        admin.password = await bcrypt.hash(password, salt);
        await admin.save();
        res.status(201).json({ msg: 'Admin registered successfully.' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

app.post('/api/admin/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ msg: 'Please enter all fields' });
        }
        const admin = await Admin.findOne({ email });
        if (!admin) {
            return res.status(400).json({ msg: 'Invalid credentials' });
        }
        const isMatch = await bcrypt.compare(password, admin.password);
        if (!isMatch) {
            return res.status(400).json({ msg: 'Invalid credentials' });
        }
        const payload = { user: { id: admin.id, email: admin.email, role: 'admin' } };
        jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '3h' }, (err, token) => {
            if (err) throw err;
            res.json({ token });
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// --- NEW: Get Admin Details (Protected) ---
app.get('/api/admin/me', auth, async (req, res) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ msg: 'Forbidden' });
    }
    try {
        const admin = await Admin.findById(req.user.id).select('-password'); 
        if (!admin) {
            return res.status(404).json({ msg: 'Admin not found' });
        }
        res.json(admin);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});


// --- Candidate Management (Protected) ---
app.post('/api/admin/candidates', auth, async (req, res) => {
    try {
        const { name, email, phone, description } = req.body;
        if (!name || !email) {
            return res.status(400).json({ msg: 'Please enter name and email' });
        }
        let candidate = await Candidate.findOne({ email });
        if (candidate) {
            return res.status(400).json({ msg: 'Candidate already exists' });
        }
        const defaultPassword = 'password123';
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(defaultPassword, salt);
        
        candidate = new Candidate({ 
            name, 
            email, 
            phone, 
            description, 
            password: hashedPassword 
        });
        
        await candidate.save();
        res.status(201).json({ 
            msg: 'Candidate added successfully.', 
            candidate,
            defaultPassword: defaultPassword 
        });
    } catch (err) { console.error(err.message); res.status(500).send('Server Error'); }
});

app.get('/api/admin/candidates', auth, async (req, res) => {
    try {
        const candidates = await Candidate.find({});
        res.json(candidates);
    } catch (err) { console.error(err.message); res.status(500).send('Server Error'); }
});

app.delete('/api/admin/candidates/:id', auth, async (req, res) => {
    try {
        const candidate = await Candidate.findByIdAndDelete(req.params.id);
        if (!candidate) return res.status(404).json({ msg: 'Candidate not found' });
        res.json({ msg: 'Candidate deleted' });
    } catch (err) { console.error(err.message); res.status(500).send('Server Error'); }
});

// --- Voter Management (Protected) ---
app.post('/api/admin/voters', auth, async (req, res) => {
    try {
        const { regno } = req.body;
        if (!regno) return res.status(400).json({ msg: 'Registration number is required' });
        let voter = await Voter.findOne({ regno });
        if (voter) return res.status(400).json({ msg: 'Voter with this registration number already exists' });
        voter = new Voter({ regno: regno, status: 'approved' });
        await voter.save();
        res.status(201).json({ msg: 'Voter added successfully', voter });
    } catch (err) { console.error(err.message); res.status(500).send('Server Error'); }
});
app.get('/api/admin/voters', auth, async (req, res) => {
    try {
        const voters = await Voter.find({}); 
        res.json(voters);
    } catch (err) { console.error(err.message); res.status(500).send('Server Error'); }
});
app.delete('/api/admin/voters/:id', auth, async (req, res) => {
    try {
        const voter = await Voter.findByIdAndDelete(req.params.id);
        if (!voter) return res.status(404).json({ msg: 'Voter not found' });
        res.json({ msg: 'Voter deleted' });
    } catch (err) { console.error(err.message); res.status(500).send('Server Error'); }
});

// --- Verification Management (Protected) ---
app.get('/api/admin/pending', auth, async (req, res) => {
    try {
        const pendingVoters = await Voter.find({ status: 'pending' });
        res.json(pendingVoters);
    } catch (err) { console.error(err.message); res.status(500).send('Server Error'); }
});
app.patch('/api/admin/approve/:id', auth, async (req, res) => {
    try {
        const voter = await Voter.findByIdAndUpdate(req.params.id, { status: 'approved' }, { new: true });
        if (!voter) return res.status(404).json({ msg: 'Voter not found' });
        res.json({ msg: 'Voter approved', voter });
    } catch (err) { console.error(err.message); res.status(500).send('Server Error'); }
});
app.patch('/api/admin/reject/:id', auth, async (req, res) => {
    try {
        const voter = await Voter.findByIdAndUpdate(req.params.id, { status: 'rejected' }, { new: true });
        if (!voter) return res.status(404).json({ msg: 'Voter not found' });
        res.json({ msg: 'Voter rejected', voter });
    } catch (err) { console.error(err.message); res.status(500).send('Server Error'); }
});


// --- Complaint Management (Protected) ---
app.get('/api/admin/complaints', auth, async (req, res) => {
    try {
        const complaints = await Complaint.find({}).sort({ createdAt: -1 }); 
        res.json(complaints);
    } catch (err) { console.error(err.message); res.status(500).send('Server Error'); }
});
app.delete('/api/admin/complaints/:id', auth, async (req, res) => {
    try {
        const complaint = await Complaint.findByIdAndDelete(req.params.id);
        if (!complaint) return res.status(404).json({ msg: 'Complaint not found' });
        res.json({ msg: 'Complaint deleted' });
    } catch (err) { console.error(err.message); res.status(500).send('Server Error'); }
});

// --- Election Control (Protected) ---
app.get('/api/admin/election-status', auth, async (req, res) => {
    try {
        const status = await ElectionStatus.findOne();
        res.json(status);
    } catch (err) { console.error(err.message); res.status(500).send('Server Error'); }
});
app.post('/api/admin/election-status', auth, async (req, res) => {
    try {
        const { newStatus } = req.body;
        if (!['Not Started', 'Running', 'Ended', 'Published'].includes(newStatus)) {
            return res.status(400).json({ msg: 'Invalid status.' });
        }
        if (newStatus === 'Not Started') {
            console.log('Resetting election...');
            await Voter.updateMany({}, { $set: { hasVoted: false } });
            await Candidate.updateMany({}, { $set: { votes: 0 } });
            console.log('Votes and voters reset.');
        }
        const status = await ElectionStatus.findOneAndUpdate({}, 
            { status: newStatus }, 
            { new: true }
        );
        let message = `Election status changed to ${newStatus}`;
        if (newStatus === 'Not Started') {
            message += '. All votes have been reset.';
        }
        res.json({ msg: message, status });
    } catch (err) { console.error(err.message); res.status(500).send('Server Error'); }
});


// 9. --- Start Server ---
app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});

