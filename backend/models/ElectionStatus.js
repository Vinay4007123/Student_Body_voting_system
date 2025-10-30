const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ElectionStatusSchema = new Schema({
  status: {
    type: String,
    enum: ['Not Started', 'Running', 'Ended', 'Published'],
    default: 'Not Started',
  }
});

module.exports = mongoose.model('ElectionStatus', ElectionStatusSchema);