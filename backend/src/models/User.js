const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  githubUsername: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    index: true
  },
  leetcodeUsername: {
    type: String,
    trim: true,
    lowercase: true
  },
  codeforcesUsername: {
    type: String,
    trim: true,
    lowercase: true
  },
  devUsername: {
    type: String,
    trim: true,
    lowercase: true
  },
  cacheExpiry: {
    type: Date,
    default: () => new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('User', userSchema);
