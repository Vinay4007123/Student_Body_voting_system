const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const VoterSchema = new Schema({
  regno: {
    type: String,
    required: true,
    unique: true,
  },
  certificateImage: {
    type: String,
    // Not required, because admin can add a voter manually
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending',
  },
  hasVoted: {
    type: Boolean,
    default: false,
  }
}, { timestamps: true });

module.exports = mongoose.model('Voter', VoterSchema);