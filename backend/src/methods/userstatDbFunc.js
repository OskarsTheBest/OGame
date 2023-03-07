const UserStatsModel = require('../models/userStats')

class UserStatsProvider {

    // Creates a new userStat entry in the database
    static async createUserStats(userId, wins = 0, losses = 0) {
        try {
            const createUserStats = new UserStatsModel({ userId, wins, losses });
            return await createUserStats.save();
        } catch (error) {
            throw new Error(`Failed to save userStat: ${error.message}`);
        }
    }

    // Retrieves the userStat data for the given userId from the database
    static async getUserStats(userId) {
        const userStatData = await UserStatsModel.findOne({ userId });
        return userStatData;
    }

    // Updates the userStat data for the given userId in the database
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

    // API endpoint for creating a new userStat entry
    createUserStats: async (req, res, next) => {
        try {
            const { userId } = req.body;

            // Calls UserStatsProvider.createUserStats() to create a new userStat entry in the database
            const userStat = await UserStatsProvider.createUserStats(userId);

            // Returns a JSON response indicating that the operation was successful and includes the new userStat data
            res.json({ status: true, success: userStat });
        } catch (error) {
            next(error);
        }
    },

    // API endpoint for retrieving userStat data for a given userId
    getUserStats: async (req, res, next) => {
        try {
            const { userId } = req.query;

            // Calls UserStatsProvider.getUserStats() to retrieve userStat data for the given userId
            const userStatData = await UserStatsProvider.getUserStats(userId);

            // If no userStat data is found for the given userId, returns a JSON response indicating that the operation failed
            if (!userStatData) {
                return res.json({ status: false, message: 'User stats not found.' });
            }

            // Returns a JSON response indicating that the operation was successful and includes the retrieved userStat data
            const { wins, losses } = userStatData;
            res.json({ status: true, success: { userId, wins, losses } });
        } catch (error) {
            next(error);
        }
    },

    // API endpoint for updating userStat data for a given userId
    updateUserStats: async (req, res, next) => {
        try {
            const { userId } = req.params;
            const { wins, losses } = req.body;

            // Calls UserStatsProvider.updateUserStats() to update userStat data for the given userId in the database
            const updatedUserStatData = await UserStatsProvider.updateUserStats(userId, wins, losses);

            // If no userStat data is found for the given userId, returns a JSON response indicating that the operation failed
            if (!updatedUserStatData) {
                return res.json({ status: false, message: 'User stats not found.' });
            }

            // Returns a JSON response indicating that the operation was successful and includes the updated userStat data
            res.json({ status: true, success: updatedData})
        } catch (error){
            next(error);
        }
    }
}

