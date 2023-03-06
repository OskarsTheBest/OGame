const express = require('express')
const { StreamChat } = require("stream-chat");
const { v4: uuidv4 } = require("uuid");
const axios = require('axios');

const userstatDbFunc = require('../methods/userstatDbFunc')
const UserStatsModel = require('../models/userStats')

const router = express.Router();

router.post('/addStats', async (req, res) => {
    const { userId, win } = req.body;

    try {
        const userStats = await UserStatsModel.findOne({ userId });

        if (!userStats) {
            const newUserStats = new UserStatsModel({ userId, wins: 0, losses: 0 });
            await newUserStats.save();
        }

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

router.get('/create-UserStats', userstatDbFunc.createUserStats)

router.get('/get-UserStats', userstatDbFunc.getUserStats)

router.get('/update-UserStats', userstatDbFunc.updateUserStats)

module.exports = router
