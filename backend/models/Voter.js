const mongoose = require('mongoose');

const VoterSchema = new mongoose.Schema({
  regno: {
    type: String,
    required: true,
    unique: true,
  },
  certificateImage: {
    type: String, // We will store the file path
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending',
  },
}, { timestamps: true });

module.exports = mongoose.model('Voter', VoterSchema);