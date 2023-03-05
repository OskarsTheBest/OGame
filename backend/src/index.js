const express = require("express");
const cors = require("cors");
const { StreamChat } = require("stream-chat");
const { v4: uuidv4 } = require("uuid");
const bcrypt = require("bcrypt");
const connectDb = require("./db/db");

// Call connectDb function to connect to the database
connectDb();

const app = express()

app.use(cors());
app.use(express.json());
const api_key = "cy5uuk3773vq";
const api_secret = "d3feydgzfge2etnywjjvwruwpy252qt3ay7bz5y7hadmhwz53aexh33x6mk8s8xd";
const serverClient = StreamChat.getInstance(api_key, api_secret);


app.post("/signup", async (req, res) =>{
        try {
    const {firstName, lastName, username, password} = req.body
    const userId = uuidv4();
    const hashedPassword = await bcrypt.hash(password, 10);
    const token = serverClient.createToken(userId);
    res.json({ token, userId, firstName, lastName, username, hashedPassword})
    } catch (error) {
        res.json(error);
    }
});

app.post("/login", async (req, res) =>{
    try {
    const {username,password} = req.body
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

app.listen(3001, () => {
    console.log("Server is running on port 3001");
});
