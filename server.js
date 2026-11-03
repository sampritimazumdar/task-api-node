const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors()); 
app.use(express.json());

const dbURI = process.env.MONGODB_URI;

mongoose.connect(dbURI)
  .then(() => console.log("Connected to MongoDB!"))
  .catch((err) => console.log("Database connection error:", err));

// Updated Model to include createdAt and isCompleted
const Task = mongoose.model('Task', { 
  name: String,
  createdAt: { type: Date, default: Date.now },
  isCompleted: { type: Boolean, default: false }
});

// GET all tasks
app.get('/', async (req, res) => {
  try {
    const allTasks = await Task.find();
    res.json(allTasks);
  } catch (error) {
    res.status(500).send("Error fetching tasks");
  }
});

// POST a new task
app.post('/add-task', async (req, res) => {
  try {
    const newTask = new Task({ name: req.body.taskName });
    await newTask.save();
    res.send("Success! Task saved to database: " + req.body.taskName);
  } catch (error) {
    res.status(500).send("Error saving task");
  }
});

// DELETE a task
app.delete('/delete-task/:id', async (req, res) => {
  try {
    const taskId = req.params.id;
    await Task.findByIdAndDelete(taskId);
    res.send("Task deleted successfully!");
  } catch (error) {
    res.status(500).send("Error deleting task");
  }
});

// PUT (update) a task's completion status
app.put('/update-task/:id', async (req, res) => {
  try {
    const taskId = req.params.id;
    const task = await Task.findById(taskId);
    
    // Flip the boolean (true to false, false to true)
    task.isCompleted = !task.isCompleted;
    await task.save();
    
    res.send("Task updated successfully!");
  } catch (error) {
    res.status(500).send("Error updating task");
  }
});

// Start the server
const PORT = process.env.PORT || 3000;

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});