const express = require("express");
const app = express();
const PORT = 3000;

app.use(express.json());
app.use((req, res, next) => {
  const time = new Date().toLocaleTimeString();
  console.log(`[${time}] ${req.method} ${req.url}`);
  next();
});

let tasks = [
  { id: 1, title: "Learn Node.js", completed: false },
  { id: 2, title: "Master Express Routing", completed: true },
  { id: 3, title: "Implement Middleware", completed: false },
];

let nextId = 4;

app.get("/api/tasks", (req, res) => {
  res.json(tasks);
});

app.get("/api/tasks/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const task = tasks.find((t) => t.id === id);

  if (task) {
    res.json(task);
  } else {
    res.status(404).send("Task not found.");
  }
});

app.post("/api/tasks", (req, res) => {
  if (!req.body.title) {
    return res.status(400).send("Task title is required.");
  }

  const newTask = {
    id: nextId++,
    title: req.body.title,
    completed: req.body.completed || false,
  };

  tasks.push(newTask);
  res.status(201).json(newTask);
});

app.put("/api/tasks/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const task = tasks.find((t) => t.id === id);

  if (!task) {
    return res.status(404).send("Task not found.");
  }

  task.title = req.body.title || task.title;
  task.completed =
    req.body.completed !== undefined ? req.body.completed : task.completed;

  res.json(task);
});

app.delete("/api/tasks/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const initialLength = tasks.length;

  tasks = tasks.filter((t) => t.id !== id);

  if (tasks.length < initialLength) {
    res.status(204).send();
  } else {
    res.status(404).send("Task not found.");
  }
});

app.listen(PORT, () => {
  console.log(`Task Manager API running at http://localhost:${PORT}`);
});