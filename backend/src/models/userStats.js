const mongoose = require('mongoose')



// Defines the user schema

const UserStatsSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  wins: { type: Number, default: 0 },
  losses: { type: Number, default: 0 },
});

const UserStatsModel = mongoose.model('UserStats', UserStatsSchema);

module.exports = UserStatsModel;