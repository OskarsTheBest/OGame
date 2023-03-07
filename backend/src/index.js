// Importing required modules and files
const express = require("express"); // Importing express module
const cors = require("cors"); // Importing cors module
const bcrypt = require("bcrypt"); // Importing bcrypt module for password encryption
const { StreamChat } = require("stream-chat"); // Importing StreamChat module for chat functionality
const { v4: uuidv4 } = require("uuid"); // Importing uuidv4 module for generating unique IDs
const connectDb = require("./db/db"); // Importing connectDb function to connect to the database
const routes = require('./router/router'); // Importing router module to define API endpoints
const UserStatsModel = require('./models/userStats'); // Importing UserStatsModel to interact with UserStats collection in database
const userStatDbFunc = require('./methods/userstatDbFunc'); // Importing userstatDbFunc module to interact with UserStats collection in database

// StreamChat API credentials
const api_key = "s9hp376zjtsg";
const api_secret = "5sn5xy7gq2ehsfesrmeyg7huhqkxsvpm7f8dzxg57dvf88r5gjxd39usav46t2zy";
const serverClient = StreamChat.getInstance(api_key, api_secret);

// Call connectDb function to connect to the database
connectDb();

// Initialize express app
const app = express();

// Set up CORS middleware
app.use(cors());

// Parse incoming JSON requests
app.use(express.json());

// Use the router module to define API endpoints
app.use(routes);

// Handle user signup
app.post("/signup", async (req, res) =>{
  try {
    const {firstName, lastName, username, password} = req.body;
    const userId = uuidv4();
    const hashedPassword = await bcrypt.hash(password, 10);
    const token = serverClient.createToken(userId);

    res.json({ token, userId, firstName, lastName, username, hashedPassword });
  } catch (error) {
    res.json(error);
  }
});
// Handle user login
app.post("/login", async (req, res) =>{
  try {
    const {username,password} = req.body;
    const {users} = await serverClient.queryUsers({name: username});

    if (users.length === 0) return res.json({message: "User not found"});

    const token = serverClient.createToken(users[0].id);
    const passwordMatch = await bcrypt.compare(password, users[0].hashedPassword);

    if (passwordMatch) {
      res.json({
        token,
        firstName: users[0].firstName,
        lastName: users[0].lastName,
        username,
        userId: users[0].id,
      });
    }
  } catch (error){
    res.json(error);
  }
});
//start expressjs server
app.listen(3001, () => {
  console.log("Server is running on port 3001");
});
