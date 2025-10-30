const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const CandidateSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true }, // <-- ADD THIS LINE
  phone: { type: String },
  description: { type: String },
  votes: { type: Number, default: 0 }
}, { timestamps: true });
module.exports = mongoose.model('Candidate', CandidateSchema);