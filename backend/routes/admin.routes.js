const router = require('express').Router();
const { verifyToken, isAdmin } = require('../middleware/auth');
const Product = require('../models/Product');
const User = require('../models/User');
const Feedback = require('../models/Feedback');
const Enquiry = require('../models/Enquiry');

// Dashboard stats
router.get('/stats', verifyToken, isAdmin, async (req, res) => {
  try {
    const [productCount, userCount, feedbackCount, enquiryCount] = await Promise.all([
      Product.countDocuments(),
      User.countDocuments(),
      Feedback.countDocuments(),
      Enquiry.countDocuments(),
    ]);
    res.json({ products: productCount, users: userCount, feedbacks: feedbackCount, enquiries: enquiryCount });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// List all users (admin only)
router.get('/users', verifyToken, isAdmin, async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create product (admin only)
router.post('/products', verifyToken, isAdmin, async (req, res) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json(product);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Update product (admin only)
router.put('/products/:id', verifyToken, isAdmin, async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!product) return res.status(404).json({ error: 'Product not found' });
    res.json(product);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete product (admin only)
router.delete('/products/:id', verifyToken, isAdmin, async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ error: 'Product not found' });
    res.json({ success: true, message: 'Product deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all enquiries (admin only)
router.get('/enquiries', verifyToken, isAdmin, async (req, res) => {
  try {
    const enquiries = await Enquiry.find().sort({ createdAt: -1 });
    res.json(enquiries);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update enquiry status (admin only)
router.put('/enquiries/:id', verifyToken, isAdmin, async (req, res) => {
  try {
    const enquiry = await Enquiry.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );
    if (!enquiry) return res.status(404).json({ error: 'Enquiry not found' });
    res.json(enquiry);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete enquiry (admin only)
router.delete('/enquiries/:id', verifyToken, isAdmin, async (req, res) => {
  try {
    const enquiry = await Enquiry.findByIdAndDelete(req.params.id);
    if (!enquiry) return res.status(404).json({ error: 'Enquiry not found' });
    res.json({ success: true, message: 'Enquiry deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
