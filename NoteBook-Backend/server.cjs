const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const NoteModel = require('./src/models/noteModel');

dotenv.config();
const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174'],
  methods: ['GET', 'POST', 'PUT'],
  credentials: true
}));
app.use(express.json());

async function loadRoutes() {
  const noteRoutes = require('./src/routes/noteRoutes'); // Use require instead of dynamic import
  app.use('/api/notes', noteRoutes.default); // Use the routes with a common prefix
}

loadRoutes().catch(err => console.error('Error loading routes:', err));

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB connected'))
  .catch((error) => console.log('MongoDB connection error:', error));

io.on('connection', (socket) => {
  console.log('A user connected');

socket.on('editNote', (noteId, content) => {
    socket.broadcast.emit('noteUpdated', { noteId, content });
  });

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

app.get('/', (req, res) => {
  res.send('Welcome to the NoteBook API');
});

app.post('/api/notes', async (req, res) => {
  const newNote = new NoteModel({ content: '' }); // Create an empty note
  await newNote.save();
  res.status(201).json(newNote); // Return the created note
});