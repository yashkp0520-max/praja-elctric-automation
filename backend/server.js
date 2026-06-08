const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const http = require('http');
const { Server } = require('socket.io');

// Load .env from backend folder
dotenv.config();

const app = express();
const server = http.createServer(app);

// Socket.IO setup with CORS for frontend and admin origins
const io = new Server(server, {
  cors: {
    origin: [
      'http://localhost:5173',  // Frontend dev server
      'http://localhost:5174',  // Admin dev server
    ],
    credentials: true,
  },
});

// Make io accessible to route handlers via req.app.get('io')
app.set('io', io);

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log(`⚡ Socket connected: ${socket.id}`);
  socket.on('disconnect', () => {
    console.log(`🔌 Socket disconnected: ${socket.id}`);
  });
});

// CORS configuration — allow frontend and admin origins
app.use(cors({
  origin: [
    'http://localhost:5173',  // Frontend dev server
    'http://localhost:5174',  // Admin dev server
  ],
  credentials: true,
}));

app.use(express.json());
app.use('/uploads', express.static('uploads'));

// Basic route so you can "see" the backend in your browser!
app.get('/', (req, res) => {
  res.json({ message: "Welcome to the Praja Electric Backend API! The server is running successfully." });
});

// Routes
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/products', require('./routes/product.routes'));
app.use('/api/enquiries', require('./routes/enquiry.routes'));
app.use('/api/admin', require('./routes/admin.routes'));
app.use('/api/feedback', require('./routes/feedback.routes'));

mongoose.connect(process.env.MONGO_URI).then(() => {
  server.listen(process.env.PORT || 5000, () =>
    console.log(`Server running on port ${process.env.PORT || 5000}`)
  );
}).catch(err => {
  console.error("MongoDB Connection Error:", err.message);
  console.log("Please ensure MongoDB is running or update your MONGO_URI in the .env file.");
});
