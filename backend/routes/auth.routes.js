const router = require('express').Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const User = require('../models/User');
const { verifyToken } = require('../middleware/auth');
const { sendOtpEmail } = require('../utils/email');

// Register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;
    
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    const user = await User.create({ name, email, password, phone });
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch (err) { res.status(400).json({ error: err.message }); }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !await bcrypt.compare(password, user.password))
      return res.status(401).json({ error: 'Invalid credentials' });
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch (err) { res.status(400).json({ error: err.message }); }
});

// Get current user (validates token)
router.get('/me', verifyToken, async (req, res) => {
  try {
    res.json({
      id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      role: req.user.role,
      phone: req.user.phone,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ========================================
// FORGOT PASSWORD FLOW
// ========================================

// Step 1: Request password reset OTP
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) {
      return res.status(404).json({ error: 'No account found with this email address' });
    }

    // Generate 6-digit OTP
    const otp = crypto.randomInt(100000, 999999).toString();

    // Hash OTP before storing
    const hashedOtp = await bcrypt.hash(otp, 10);

    // Save to user document (10-minute expiry)
    user.resetOtp = hashedOtp;
    user.resetOtpExpiry = new Date(Date.now() + 10 * 60 * 1000);
    user.resetOtpAttempts = 0;
    await user.save();

    // Send OTP email
    let emailSent = false;
    try {
      await sendOtpEmail(user.email, otp, user.name || 'User');
      emailSent = true;
    } catch (emailErr) {
      console.error('Email send error:', emailErr.message);
      // In development: log OTP to console so you can still test
      console.log('═══════════════════════════════════════');
      console.log(`  🔐 OTP for ${user.email}: ${otp}`);
      console.log('  (Email failed — use this OTP manually)');
      console.log('═══════════════════════════════════════');
    }

    res.json({
      message: emailSent
        ? 'OTP sent successfully to your email address'
        : 'OTP generated! Check your backend console for the code (email service not configured)'
    });
  } catch (err) {
    console.error('Forgot password error:', err);
    res.status(500).json({ error: 'Something went wrong. Please try again.' });
  }
});

// Step 2: Verify OTP
router.post('/verify-otp', async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ error: 'Email and OTP are required' });
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) {
      return res.status(404).json({ error: 'No account found with this email address' });
    }

    // Check if OTP exists
    if (!user.resetOtp || !user.resetOtpExpiry) {
      return res.status(400).json({ error: 'No OTP request found. Please request a new OTP.' });
    }

    // Check if OTP has expired
    if (new Date() > user.resetOtpExpiry) {
      user.resetOtp = undefined;
      user.resetOtpExpiry = undefined;
      user.resetOtpAttempts = 0;
      await user.save();
      return res.status(400).json({ error: 'OTP has expired. Please request a new one.' });
    }

    // Check max attempts
    if (user.resetOtpAttempts >= 3) {
      user.resetOtp = undefined;
      user.resetOtpExpiry = undefined;
      user.resetOtpAttempts = 0;
      await user.save();
      return res.status(400).json({ error: 'Too many failed attempts. Please request a new OTP.' });
    }

    // Verify OTP
    const isValid = await bcrypt.compare(otp, user.resetOtp);
    if (!isValid) {
      user.resetOtpAttempts += 1;
      await user.save();
      const remaining = 3 - user.resetOtpAttempts;
      return res.status(400).json({
        error: `Invalid OTP. ${remaining} attempt${remaining !== 1 ? 's' : ''} remaining.`
      });
    }

    // OTP is valid — don't clear yet (needed for reset-password step)
    res.json({ message: 'OTP verified successfully', verified: true });
  } catch (err) {
    console.error('Verify OTP error:', err);
    res.status(500).json({ error: 'Something went wrong. Please try again.' });
  }
});

// Step 3: Reset password
router.post('/reset-password', async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    if (!email || !otp || !newPassword) {
      return res.status(400).json({ error: 'Email, OTP, and new password are required' });
    }

    // Validate password strength server-side
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/;
    if (!passwordRegex.test(newPassword)) {
      return res.status(400).json({
        error: 'Password must be at least 8 characters with uppercase, lowercase, number, and special character'
      });
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) {
      return res.status(404).json({ error: 'No account found with this email address' });
    }

    // Re-validate OTP
    if (!user.resetOtp || !user.resetOtpExpiry) {
      return res.status(400).json({ error: 'No OTP request found. Please start over.' });
    }

    if (new Date() > user.resetOtpExpiry) {
      user.resetOtp = undefined;
      user.resetOtpExpiry = undefined;
      user.resetOtpAttempts = 0;
      await user.save();
      return res.status(400).json({ error: 'OTP has expired. Please request a new one.' });
    }

    const isValid = await bcrypt.compare(otp, user.resetOtp);
    if (!isValid) {
      return res.status(400).json({ error: 'Invalid OTP. Please verify your OTP first.' });
    }

    // Update password (will be hashed by the pre-save hook)
    user.password = newPassword;

    // Clear OTP fields
    user.resetOtp = undefined;
    user.resetOtpExpiry = undefined;
    user.resetOtpAttempts = 0;

    await user.save();

    res.json({ message: 'Password reset successfully! You can now login with your new password.' });
  } catch (err) {
    console.error('Reset password error:', err);
    res.status(500).json({ error: 'Something went wrong. Please try again.' });
  }
});

module.exports = router;

