const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { MongoClient } = require('mongodb');
 
var cors = require('cors')
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = require("socket.io")(server, {
  cors: {
    origin: '*',
    methods: ["GET", "POST"],
    // allowedHeaders: ["my-custom-header"],
  }
});




const PORT = process.env.PORT || 5000;
const secretKey = process.env.JWT_SECRET;
const mongoURI = 'mongodb://127.0.0.1:27017/chatapp'; // Replace with your local MongoDB connection URI


app.use(cors());
app.use(bodyParser.json());

let db;

const connectToMongoDB = async () => {
  const client = new MongoClient(mongoURI, { useNewUrlParser: true}); // useUnifiedTopology: true

  try {
    await client.connect();
    console.log('Connected to MongoDB');
    db = client.db(); // Set the database instance
  } catch (error) {
    console.error('Error connecting to MongoDB:', error.message);
  }
};

connectToMongoDB(); // Connect when the server starts

// Registration endpoint
app.post('/register', async (req, res) => {
  const { username, password } = req.body;

  // Check if the username is taken
  const existingUser = await db.collection('users').findOne({ username });
  if (existingUser) {
    return res.status(400).json({ message: 'Username is already taken' });
  }

  // Hash the password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Save the user to the users collection in MongoDB
  await db.collection('users').insertOne({ username, password: hashedPassword });

  res.json({ message: 'Registration successful' });
});

// Login endpoint
app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  // Find the user by username
  const user = await db.collection('users').findOne({ username });

  // If the user is not found or the password is incorrect, send an error response
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ message: 'Login failed' });
  }

  // Generate a JWT token
  const token = jwt.sign({ username: user.username }, secretKey);

  res.json({ message: 'Login successful', token });
});

// Protected endpoint - example usage of JWT authentication
app.get('/protected', authenticateJWT, (req, res) => {
  res.json({ message: 'Protected endpoint, only accessible with a valid token' });
});

function authenticateJWT(req, res, next) {
  const token = req.header('Authorization');

  if (!token) return res.status(403).json({ message: 'Access denied' });

  jwt.verify(token, secretKey, (err, user) => {
    if (err) return res.status(401).json({ message: 'Invalid token' });

    req.user = user;
    next();
  });
}

io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`);

  // Handle custom events or messages from clients
  socket.on('login', (data) => {
    console.log(`User ${data.username} logged in`);
    // You can broadcast messages or perform other actions here
  });

  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.id}`);
  });
});

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
