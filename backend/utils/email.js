const nodemailer = require('nodemailer');

// Cached transporter instance
let transporter = null;
let transporterVerified = false;

/**
 * Create and verify the email transporter (singleton)
 * Verifies SMTP connection on first call to catch bad credentials early
 */
const getTransporter = async () => {
  if (transporter && transporterVerified) {
    return transporter;
  }

  // Validate environment variables
  const emailUser = process.env.EMAIL_USER;
  const emailPass = process.env.EMAIL_PASS;

  if (!emailUser || !emailPass || emailUser === 'your-gmail@gmail.com' || emailPass === 'your-gmail-app-password') {
    throw new Error(
      'Email credentials not configured. Please update EMAIL_USER and EMAIL_PASS in your .env file.\n' +
      '  → EMAIL_USER = Your Gmail address\n' +
      '  → EMAIL_PASS = Your 16-character Gmail App Password\n' +
      '  → Get App Password at: https://myaccount.google.com/apppasswords'
    );
  }

  transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: emailUser,
      pass: emailPass,
    },
  });

  // Verify SMTP connection on first use
  try {
    await transporter.verify();
    transporterVerified = true;
    console.log('✅ Email service connected successfully (Gmail SMTP)');
  } catch (verifyErr) {
    transporter = null;
    transporterVerified = false;

    if (verifyErr.code === 'EAUTH') {
      throw new Error(
        'Gmail authentication failed. Please check:\n' +
        '  1. EMAIL_USER is your correct Gmail address\n' +
        '  2. EMAIL_PASS is a valid 16-character App Password (NOT your regular password)\n' +
        '  3. 2-Step Verification is enabled on your Google account\n' +
        '  → Generate App Password at: https://myaccount.google.com/apppasswords'
      );
    }

    throw new Error(`Email service connection failed: ${verifyErr.message}`);
  }

  return transporter;
};

/**
 * Send OTP email for password reset
 * @param {string} toEmail - Recipient email address
 * @param {string} otp - The 6-digit OTP code
 * @param {string} userName - User's name for personalization
 */
const sendOtpEmail = async (toEmail, otp, userName = 'User') => {
  const emailTransporter = await getTransporter();

  const htmlTemplate = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="margin: 0; padding: 0; background-color: #020b18; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
      <div style="max-width: 520px; margin: 0 auto; padding: 40px 20px;">
        
        <!-- Header -->
        <div style="text-align: center; margin-bottom: 32px;">
          <h1 style="color: #00d4ff; font-size: 24px; margin: 0; letter-spacing: 2px;">
            ⚡ PRAJA ELECTRIC
          </h1>
          <p style="color: #6b7280; font-size: 13px; margin-top: 4px; letter-spacing: 1px;">
            & AUTOMATION
          </p>
        </div>

        <!-- Card -->
        <div style="background-color: #0a1628; border: 1px solid rgba(0, 212, 255, 0.2); border-radius: 16px; padding: 40px 32px; text-align: center;">
          
          <div style="width: 64px; height: 64px; background: linear-gradient(135deg, rgba(0,212,255,0.2), rgba(0,212,255,0.05)); border-radius: 50%; margin: 0 auto 24px; display: flex; align-items: center; justify-content: center;">
            <span style="font-size: 28px;">🔐</span>
          </div>

          <h2 style="color: #ffffff; font-size: 22px; margin: 0 0 8px;">
            Password Reset Request
          </h2>
          <p style="color: #9ca3af; font-size: 14px; margin: 0 0 32px; line-height: 1.6;">
            Hi <strong style="color: #ffffff;">${userName}</strong>, we received a request to reset your password. Use the verification code below:
          </p>

          <!-- OTP Code -->
          <div style="background-color: #020b18; border: 2px solid rgba(0, 212, 255, 0.3); border-radius: 12px; padding: 20px; margin: 0 0 24px; display: inline-block;">
            <span style="font-size: 36px; font-weight: 700; letter-spacing: 12px; color: #00d4ff; font-family: 'Courier New', monospace;">
              ${otp}
            </span>
          </div>

          <p style="color: #f59e0b; font-size: 13px; margin: 0 0 24px;">
            ⏱ This code expires in <strong>10 minutes</strong>
          </p>

          <!-- Security Warning -->
          <div style="background-color: rgba(239, 68, 68, 0.08); border: 1px solid rgba(239, 68, 68, 0.2); border-radius: 8px; padding: 12px 16px; margin: 0 0 24px;">
            <p style="color: #f87171; font-size: 12px; margin: 0; line-height: 1.6;">
              ⚠️ <strong>Security Warning:</strong> Never share this OTP with anyone. Praja Electric will never ask for your OTP via phone or message.
            </p>
          </div>

          <div style="border-top: 1px solid rgba(255,255,255,0.1); padding-top: 24px;">
            <p style="color: #6b7280; font-size: 12px; margin: 0; line-height: 1.8;">
              If you didn't request this password reset, you can safely ignore this email.<br>
              Your password will remain unchanged.
            </p>
          </div>
        </div>

        <!-- Footer -->
        <div style="text-align: center; margin-top: 32px;">
          <p style="color: #374151; font-size: 11px; margin: 0;">
            © ${new Date().getFullYear()} Praja Electric & Automation. All rights reserved.
          </p>
        </div>
      </div>
    </body>
    </html>
  `;

  const mailOptions = {
    from: `"Praja Electric" <${process.env.EMAIL_USER}>`,
    to: toEmail,
    subject: '🔐 Password Reset OTP — Praja Electric',
    html: htmlTemplate,
  };

  try {
    const info = await emailTransporter.sendMail(mailOptions);
    console.log(`📧 OTP email sent to ${toEmail} (Message ID: ${info.messageId})`);
    return info;
  } catch (sendErr) {
    console.error(`❌ Failed to send OTP email to ${toEmail}:`, sendErr.message);
    
    // Reset transporter so next attempt re-verifies
    if (sendErr.code === 'EAUTH' || sendErr.code === 'ECONNECTION') {
      transporter = null;
      transporterVerified = false;
    }
    
    throw sendErr;
  }
};

module.exports = { sendOtpEmail };
