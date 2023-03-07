// Import required modules
const express = require('express')
const { StreamChat } = require("stream-chat");
const { v4: uuidv4 } = require("uuid");
const axios = require('axios');

// Import user stats functions and model
const userstatDbFunc = require('../methods/userstatDbFunc')
const UserStatsModel = require('../models/userStats')

// Create router
const router = express.Router();

// Route to add user stats
router.post('/addStats', async (req, res) => {
    const { userId, win } = req.body;

    try {
        // Check if user stats exist, create if not
        const userStats = await UserStatsModel.findOne({ userId });
    
        if (!userStats) {
            const newUserStats = new UserStatsModel({ userId, wins: 0, losses: 0 });
            await newUserStats.save();
        }
    
        // Increment wins or losses depending on result
        if (win) {
            await UserStatsModel.updateOne({ userId }, { $inc: { wins: 1 } });
        } else {
            await UserStatsModel.updateOne({ userId }, { $inc: { losses: 1 } });
        }
    
        res.status(200).json({ success: true });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false });
    }
});

// Route to create user stats
router.get('/create-UserStats', userstatDbFunc.createUserStats)

// Route to get user stats
router.get('/get-UserStats', userstatDbFunc.getUserStats)

// Route to update user stats
router.get('/update-UserStats', userstatDbFunc.updateUserStats)

// Export router
module.exports = router