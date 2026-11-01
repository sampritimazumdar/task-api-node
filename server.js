const express = require('express');
const mongoose = require('mongoose');
const app = express();

app.use(express.json());

// 👇 PASTE YOUR CONNECTION STRING HERE 👇
const dbURI = "mongodb+srv://s4mpritiwork_db_user:Sammie678@cluster0.pim6eps.mongodb.net/taskDB?retryWrites=true&w=majority";

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

app.listen(3000, () => {
  console.log('Server running on port 3000');
});