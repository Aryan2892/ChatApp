const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { MongoClient } = require('mongodb');
 
var cors = require('cors');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = require("socket.io")(server, {
  cors: {
    origin: '*',
    methods: ["GET", "POST"],
  }
});

const PORT = process.env.PORT || 5000;
const secretKey = process.env.JWT_SECRET;
const mongoURI = 'mongodb://127.0.0.1:27017/chatapp';

app.use(cors());
app.use(bodyParser.json());

let db;

const connectToMongoDB = async () => {
  const client = new MongoClient(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });

  try {
    await client.connect();
    console.log('Connected to MongoDB');
    db = client.db();
  } catch (error) {
    console.error('Error connecting to MongoDB:', error.message);
  }
};

connectToMongoDB();

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
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(' ')[1];

    jwt.verify(token, secretKey, (err, user) => {
      if (err) {
        return res.status(401).json({ message: 'Invalid token' });
      }

      req.user = user;
      next();
    });
  } else {
    return res.status(403).json({ message: 'Access denied' });
  }
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

// Endpoint to send a message
app.post('/send-message', authenticateJWT, async (req, res) => {
  const { username, message } = req.body;

  // Save the message to the MongoDB database
  try {
    await db.collection('messages').insertOne({ username, message, timestamp: new Date() });
    // Broadcast the message to other clients
    io.emit('new-message', { username, message });

    res.json({ message: 'Message sent successfully' });
  } catch (error) {
    console.error('Error sending message:', error.message);
    res.status(500).json({ message: 'Error sending message' });
  }
});

app.get('/user', authenticateJWT, async (req, res) => {
  try {
    const user = await db.collection('users').findOne({ username: req.user.username });
    if (user) {
      res.json({ username: user.username });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    console.error('Error fetching user:', error.message);
    res.status(500).json({ message: 'Error fetching user' });
  }
});

// Endpoint to get chat history
app.get('/get-chat', authenticateJWT, async (req, res) => {
  try {
    const messages = await db.collection('messages').find({}).toArray();
    res.json(messages);
  } catch (error) {
    console.error('Error fetching chat:', error.message);
    res.status(500).json({ message: 'Error fetching chat' });
  }
});


server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
