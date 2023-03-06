const UserStatsModel = require('../models/userStats')

class UserStatsProvider {

    static async createUserStats(userId, wins = 0, losses = 0) {
        try {
            const createUserStats = new UserStatsModel({ userId, wins, losses });
            return await createUserStats.save();
        } catch (error) {
            throw new Error(`Failed to save userStat: ${error.message}`);
        }
    }

    static async getUserStats(userId) {
        const userStatData = await UserStatsModel.findOne({ userId });
        return userStatData;
    }

    static async updateUserStats(userId, wins, losses) {
        const updatedUserStatData = await UserStatsModel.findOneAndUpdate(
            { userId },
            { $set: { wins, losses } },
            { new: true }
        );
        return updatedUserStatData;
    }

}

module.exports = UserstatDbFunc = {
    createUserStats: async (req, res, next) => {
        try {
            const { userId } = req.body;

            const userStat = await UserStatsProvider.createUserStats(userId);
            res.json({ status: true, success: userStat });
        } catch (error) {
            next(error);
        }
    },

    getUserStats: async (req, res, next) => {
        try {
            const { userId } = req.query;
            const userStatData = await UserStatsProvider.getUserStats(userId);

            if (!userStatData) {
                return res.json({ status: false, message: 'User stats not found.' });
            }

            const { wins, losses } = userStatData;
            res.json({ status: true, success: { userId, wins, losses } });
        } catch (error) {
            next(error);
        }
    },

    updateUserStats: async (req, res, next) => {
        try {
            const { userId } = req.params;
            const { wins, losses } = req.body;

            const updatedUserStatData = await UserStatsProvider.updateUserStats(userId, wins, losses);

            if (!updatedUserStatData) {
                return res.json({ status: false, message: 'User stats not found.' });
            }
            res.json({ status: true, success: updatedData})
        } catch (error){
            next(error);
        }
    }
}