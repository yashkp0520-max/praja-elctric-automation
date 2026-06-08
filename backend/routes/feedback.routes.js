const express = require('express');
const router = express.Router();
const Feedback = require('../models/Feedback');

// POST a new feedback
router.post('/', async (req, res) => {
  try {
    const { name, email, message, rating } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ error: 'Name, email, and message are required' });
    }

    const newFeedback = new Feedback({
      name,
      email,
      message,
      rating
    });

    await newFeedback.save();

    // Emit real-time event to admin panel
    const io = req.app.get('io');
    if (io) {
      io.emit('new-feedback', newFeedback);
    }

    res.status(201).json({ success: true, feedback: newFeedback });
  } catch (error) {
    console.error('Error saving feedback:', error);
    res.status(500).json({ error: 'Server Error' });
  }
});

// GET all feedbacks (could be protected for admin later)
router.get('/', async (req, res) => {
  try {
    const feedbacks = await Feedback.find().sort({ createdAt: -1 });
    res.json(feedbacks);
  } catch (error) {
    console.error('Error fetching feedbacks:', error);
    res.status(500).json({ error: 'Server Error' });
  }
});

// DELETE feedback by ID
router.delete('/:id', async (req, res) => {
  try {
    const feedback = await Feedback.findByIdAndDelete(req.params.id);
    if (!feedback) {
      return res.status(404).json({ error: 'Feedback not found' });
    }
    res.json({ success: true, message: 'Feedback deleted' });
  } catch (error) {
    console.error('Error deleting feedback:', error);
    res.status(500).json({ error: 'Server Error' });
  }
});

module.exports = router;
