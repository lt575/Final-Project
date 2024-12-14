const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const { authRoutes } = require('./authRoute');
const cors = require('cors');

dotenv.config();
const app = express();
app.use(express.json());
app.use(cors({
  origin: '*'
}));

mongoose.connect(process.env.MONGODB_URI);

const db = mongoose.connection;
  
db.on('error', (error) => {
  console.error('MongoDB Connection Error:', error);
});

db.once('open', () => {
  console.log('Connected to MongoDB');
});

app.use('/api/auth', authRoutes);



const Todo = mongoose.model('Todo', new mongoose.Schema({
  userId: { type: String, required: true },
  text: { type: String, required: true },
  completed: { type: Boolean, default: false },
}));

const Timer = mongoose.model('Timer', new mongoose.Schema({
  userId: { type: String, required: true },
  timeRemaining: { type: Number, default: 0 },
  isPaused: { type: Boolean, default: false },
}));

const Event = mongoose.model('Event', new mongoose.Schema({
  userId: { type: String, required: true },
  day: { type: Date, required: true },
  events: [{eventName: String, eventTime: String }],
}));

// Routes
app.get('/api/todos', async (req, res) => {
  const { userId } = req.user;
  try {
    const todos = await Todo.find({ userId });
    res.status(200).json(todos);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve Todos' });
  }
});

app.post('/api/todos', async (req, res) => {
  const { userId } = req.user;
  const { text } = req.body;
  try {
    const newTodo = new Todo({ userId, text });
    await newTodo.save();
    res.status(201).json(newTodo);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create new Todo' });
  }
});

app.delete('/api/todos/:id', async (req, res) => {
  const { userId } = req.user;
  const { id } = req.params;
  try {
    const todo = await Todo.findOneAndDelete({ _id: id, userId });
    if (!todo) return res.status(404).json({ error: 'Todo not found' });
    res.status(200).json({ message: 'Todo deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete Todo' });
  }
});

app.get('/api/timer', async (req, res) => {
  const { userId } = req.user;
  try {
    const timer = await Timer. findOne({ userId })
    if (!timer) return res.status(404).json({ error: 'Timer not found' });
    res.status(200).json(timer);
  } catch (error) {
    res.status(500).json({ error: 'Failed to locate timer' });
  }
});

app.post('/api/timer', async (req, res) => {
  const { userId } = req.user;
  const { timeRemaining, isPaused } = req.body;
  try {
    let timer = await Timer.findOne({ userId });
    if (timer) {
      timer.timeRemaining = timeRemaining;
      timer.isPaused = isPaused;
      await timer.save();
    } else {
      timer = new Timer({ userId, timeRemaining, isPaused });
      await timer.save();
    }
    res.status(200).json(timer);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update timer' });
  }
});

app.delete('/api/timer', async (req, res) => {
  const { userId } = req.user;
  try {
    const timer = await Timer.findOneAndDelete({ userId });
    if (!timer) return res.status(404).json({ error: 'Timer not found' });
    res.status(200).json({ message: 'Timer reset successful' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to reset timer' });
  }
});

app.get('/api/events', async (req, res) => {
  const { userId } = req.user;
  try {
    const events = await Event.find({ userId });
    res.status(200).json(events);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve events' });
  }
});
    
app.post('/api/events', async (req, res) => {
  const { userId } = req.user;
  const { day, eventName, eventTime } = req.body;
  try  {
    let event = await Event.findOne({ userId, day });
    if (!event) {
      event = new Event({ userId, day, events: [{ eventName, eventTime }] });
    } else {
      event.events.push({ eventName, eventTime });
    }
    await event.save();
    res.status(201).json(event);
  } catch (error) {
    res.status(500).json({ error: 'Failed to add new event' });
  }
});

app.delete('/api/events/:day/:index', async (req, res) => {
  const { userId } = req.user;
  const { day, index } = req.params;
  try  {
    let event = await Event.findOne({ userId, day });
    if (!event || !event.events[index]) {
      return res.status(404).json({ error: 'Event not found' });
    }
    event.events.splice(index, 1);
    if (event.events.length === 0) {
      await Event.findOneAndDelete({ userId, day });
    } else {
      await event.save();
    }
    res.status(200).json({ message: 'Event removal successful' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete event' });
  }
});

app.get('/', (req, res) => {
  res.send('Welcome to the API!');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});


