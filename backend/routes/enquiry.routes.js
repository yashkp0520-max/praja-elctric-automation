const express = require('express');
const router = express.Router();
const Enquiry = require('../models/Enquiry');

// POST a new enquiry (from frontend contact form)
router.post('/', async (req, res) => {
  try {
    const { name, email, phone, message, product } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ error: 'Name, email, and message are required' });
    }

    const newEnquiry = new Enquiry({
      name,
      email,
      phone,
      message,
      product,
    });

    await newEnquiry.save();

    // Emit real-time event to admin panel
    const io = req.app.get('io');
    if (io) {
      io.emit('new-enquiry', newEnquiry);
    }

    res.status(201).json({ success: true, enquiry: newEnquiry });
  } catch (error) {
    console.error('Error saving enquiry:', error);
    res.status(500).json({ error: 'Server Error' });
  }
});

// GET all enquiries
router.get('/', async (req, res) => {
  try {
    const enquiries = await Enquiry.find().sort({ createdAt: -1 });
    res.json(enquiries);
  } catch (error) {
    console.error('Error fetching enquiries:', error);
    res.status(500).json({ error: 'Server Error' });
  }
});

// DELETE enquiry by ID
router.delete('/:id', async (req, res) => {
  try {
    const enquiry = await Enquiry.findByIdAndDelete(req.params.id);
    if (!enquiry) {
      return res.status(404).json({ error: 'Enquiry not found' });
    }
    res.json({ success: true, message: 'Enquiry deleted' });
  } catch (error) {
    console.error('Error deleting enquiry:', error);
    res.status(500).json({ error: 'Server Error' });
  }
});

module.exports = router;
