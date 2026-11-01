const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config(); // Loads variables from .env

const app = express();
app.use(express.json());

// This reads the hidden password from your .env file
const dbURI = process.env.MONGODB_URI;

mongoose.connect(dbURI)
  .then(() => console.log("Connected to MongoDB!"))
  .catch((err) => console.log("Database connection error:", err));

// Create the Task Model
const Task = mongoose.model('Task', { name: String });

// GET route: Fetch all tasks
app.get('/', async (req, res) => {
  try {
    const allTasks = await Task.find();
    res.json(allTasks);
  } catch (error) {
    res.status(500).send("Error fetching tasks");
  }
});

// POST route: Add a new task
app.post('/add-task', async (req, res) => {
  try {
    const newTask = new Task({ name: req.body.taskName });
    await newTask.save();
    res.send("Success! Task saved to database: " + req.body.taskName);
  } catch (error) {
    res.status(500).send("Error saving task");
  }
});

app.listen(3000, () => {
  console.log('Server running on port 3000');
});