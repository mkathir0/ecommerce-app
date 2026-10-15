const express = require('express');
const router = express.Router();
const Task = require('../models/Task');
const validateId = require('../middleware/validateId');

// 1. GET /api/tasks - Retrieve all tasks
router.get('/', async (req, res, next) => {
  try {
    const tasks = await Task.find().sort({ createdAt: -1 });
    res.status(200).json(tasks);
  } catch (error) {
    next(error);
  }
});

// 2. POST /api/tasks - Create a new task
router.post('/', async (req, res, next) => {
  try {
    const { title } = req.body;
    if (!title || !title.trim()) {
      return res.status(400).json({ error: 'Title is required' });
    }

    const newTask = await Task.create({ title: title.trim() });
    res.status(201).json(newTask);
  } catch (error) {
    next(error);
  }
});

// 3. PATCH /api/tasks/:id - Update completion status (protected by validateId)
router.patch('/:id', validateId, async (req, res, next) => {
  try {
    const { completed } = req.body;
    const task = await Task.findByIdAndUpdate(
      req.params.id,
      { completed },
      { new: true, runValidators: true }
    );

    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    res.status(200).json(task);
  } catch (error) {
    next(error);
  }
});

// 4. DELETE /api/tasks/:id - Delete a task (protected by validateId)
router.delete('/:id', validateId, async (req, res, next) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);

    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    res.status(200).json({ message: 'Task deleted successfully', id: req.params.id });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
