const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const AdminSchema = new Schema({
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true },
  role: { type: String, default: 'admin' }
}, { timestamps: true });
module.exports = mongoose.model('Admin', AdminSchema);