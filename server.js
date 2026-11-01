const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors'); // 1. Make sure this is here
require('dotenv').config();

const app = express();

// 2. This MUST be before your routes!
app.use(cors()); 
app.use(express.json());

const dbURI = process.env.MONGODB_URI;

mongoose.connect(dbURI)
  .then(() => console.log("Connected to MongoDB!"))
  .catch((err) => console.log("Database connection error:", err));

const Task = mongoose.model('Task', { name: String });

app.get('/', async (req, res) => {
  const allTasks = await Task.find();
  res.json(allTasks);
});

app.post('/add-task', async (req, res) => {
  const newTask = new Task({ name: req.body.taskName });
  await newTask.save();
  res.send("Success! Task saved to database: " + req.body.taskName);
});

// DELETE route: Remove a task by its ID
app.delete('/delete-task/:id', async (req, res) => {
  try {
    const taskId = req.params.id;
    await Task.findByIdAndDelete(taskId);
    res.send("Task deleted successfully!");
  } catch (error) {
    res.status(500).send("Error deleting task");
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});