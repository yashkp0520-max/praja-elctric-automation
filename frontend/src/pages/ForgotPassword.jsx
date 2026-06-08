import { useState, useRef, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaBolt, FaEnvelope, FaLock, FaEye, FaEyeSlash, FaCheckCircle, FaArrowLeft, FaShieldAlt, FaRedo } from 'react-icons/fa';
import { authService } from '../services/auth.service';

// Password validation rules
const PASSWORD_RULES = [
  { label: 'At least 8 characters', test: (p) => p.length >= 8 },
  { label: 'One uppercase letter', test: (p) => /[A-Z]/.test(p) },
  { label: 'One lowercase letter', test: (p) => /[a-z]/.test(p) },
  { label: 'One number', test: (p) => /\d/.test(p) },
  { label: 'One special character', test: (p) => /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(p) },
];

const stepVariants = {
  enter: (direction) => ({ x: direction > 0 ? 80 : -80, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (direction) => ({ x: direction > 0 ? -80 : 80, opacity: 0 }),
};

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1=email, 2=otp, 3=new password, 4=success
  const [direction, setDirection] = useState(1);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
  const [redirectCount, setRedirectCount] = useState(5);

  const otpRefs = useRef([]);

  // Resend timer countdown
  useEffect(() => {
    if (resendTimer <= 0) return;
    const interval = setInterval(() => setResendTimer((t) => t - 1), 1000);
    return () => clearInterval(interval);
  }, [resendTimer]);

  // Redirect countdown on success
  useEffect(() => {
    if (step !== 4) return;
    if (redirectCount <= 0) {
      navigate('/login');
      return;
    }
    const interval = setInterval(() => setRedirectCount((c) => c - 1), 1000);
    return () => clearInterval(interval);
  }, [step, redirectCount, navigate]);

  const goToStep = useCallback((newStep) => {
    setDirection(newStep > step ? 1 : -1);
    setError('');
    setStep(newStep);
  }, [step]);

  // Step 1: Send OTP
  const handleSendOtp = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await authService.forgotPassword(email);
      setResendTimer(60);
      goToStep(2);
    } catch (err) {
      setError(err.response?.data?.error || 'Unable to connect. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  // Resend OTP
  const handleResendOtp = async () => {
    if (resendTimer > 0) return;
    setError('');
    setLoading(true);
    try {
      await authService.forgotPassword(email);
      setResendTimer(60);
      setOtp(['', '', '', '', '', '']);
      otpRefs.current[0]?.focus();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to resend OTP.');
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Verify OTP
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    const otpString = otp.join('');
    if (otpString.length !== 6) {
      setError('Please enter the complete 6-digit OTP.');
      return;
    }
    setError('');
    setLoading(true);
    try {
      await authService.verifyOtp(email, otpString);
      goToStep(3);
    } catch (err) {
      setError(err.response?.data?.error || 'Unable to verify. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Step 3: Reset Password
  const handleResetPassword = async (e) => {
    e.preventDefault();
    const passedRules = PASSWORD_RULES.filter((r) => r.test(newPassword)).length;
    if (passedRules < 5) {
      setError('Please meet all password requirements.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    setError('');
    setLoading(true);
    try {
      await authService.resetPassword(email, otp.join(''), newPassword);
      goToStep(4);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to reset password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // OTP input handlers
  const handleOtpChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);
    if (value && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const handleOtpPaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (pasted.length === 6) {
      setOtp(pasted.split(''));
      otpRefs.current[5]?.focus();
    }
  };

  // Password strength
  const passedRules = PASSWORD_RULES.filter((r) => r.test(newPassword));
  const strengthPercent = (passedRules.length / PASSWORD_RULES.length) * 100;
  const strengthColor =
    passedRules.length <= 2 ? '#ef4444' : passedRules.length <= 4 ? '#f59e0b' : '#22c55e';
  const strengthLabel =
    passedRules.length <= 2 ? 'Weak' : passedRules.length <= 4 ? 'Medium' : 'Strong';

  const passwordsMatch = confirmPassword.length > 0 && newPassword === confirmPassword;
  const passwordsMismatch = confirmPassword.length > 0 && newPassword !== confirmPassword;

  return (
    <div className="min-h-screen bg-navy flex items-center justify-center px-4 relative overflow-hidden pt-20 pb-10">
      {/* Background decorations */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-electric/20 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-[120px] pointer-events-none"></div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="bg-steel/80 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-[0_0_40px_rgba(0,0,0,0.5)]">
          {/* Header */}
          <div className="text-center mb-6">
            <FaBolt className="text-electric text-4xl mx-auto mb-4 drop-shadow-[0_0_8px_rgba(0,212,255,0.8)]" />
            <h2 className="text-2xl font-orbitron font-bold text-white mb-2">
              {step === 1 && 'FORGOT PASSWORD'}
              {step === 2 && 'VERIFY OTP'}
              {step === 3 && 'NEW PASSWORD'}
              {step === 4 && 'PASSWORD RESET'}
            </h2>
            <p className="text-gray-400 text-sm">
              {step === 1 && 'Enter your email to receive a verification code'}
              {step === 2 && `We sent a 6-digit code to ${email}`}
              {step === 3 && 'Create a strong new password'}
              {step === 4 && 'Your password has been updated'}
            </p>
          </div>

          {/* Step progress dots */}
          <div className="flex justify-center gap-2 mb-6">
            {[1, 2, 3, 4].map((s) => (
              <motion.div
                key={s}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  s === step ? 'w-8 bg-electric' : s < step ? 'w-4 bg-electric/50' : 'w-4 bg-white/10'
                }`}
                layout
              />
            ))}
          </div>

          {/* Error message */}
          <AnimatePresence mode="wait">
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-3 rounded-lg mb-5 text-sm text-center"
              >
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Step content */}
          <AnimatePresence mode="wait" custom={direction}>
            {/* Step 1: Enter Email */}
            {step === 1 && (
              <motion.form
                key="step-email"
                custom={direction}
                variants={stepVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.3 }}
                onSubmit={handleSendOtp}
                className="space-y-5"
              >
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Email Address</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaEnvelope className="text-gray-500" />
                    </div>
                    <input
                      type="email"
                      required
                      className="block w-full pl-10 pr-3 py-3 border border-white/10 rounded-lg bg-navy/50 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-electric focus:border-transparent transition"
                      placeholder="Enter your registered email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      autoFocus
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex justify-center items-center gap-2 py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-bold text-navy bg-electric hover:bg-blue-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-navy focus:ring-electric transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <><Spinner /> Sending OTP...</>
                  ) : (
                    'SEND VERIFICATION CODE'
                  )}
                </button>
                <Link
                  to="/login"
                  className="flex items-center justify-center gap-2 text-sm text-gray-400 hover:text-electric transition-colors mt-2"
                >
                  <FaArrowLeft className="text-xs" /> Back to Login
                </Link>
              </motion.form>
            )}

            {/* Step 2: Enter OTP */}
            {step === 2 && (
              <motion.form
                key="step-otp"
                custom={direction}
                variants={stepVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.3 }}
                onSubmit={handleVerifyOtp}
                className="space-y-5"
              >
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-3 text-center">
                    Enter 6-digit verification code
                  </label>
                  <div className="flex justify-center gap-2" onPaste={handleOtpPaste}>
                    {otp.map((digit, i) => (
                      <input
                        key={i}
                        ref={(el) => (otpRefs.current[i] = el)}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleOtpChange(i, e.target.value)}
                        onKeyDown={(e) => handleOtpKeyDown(i, e)}
                        className="w-12 h-14 text-center text-xl font-bold border border-white/10 rounded-lg bg-navy/50 text-electric placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-electric focus:border-transparent transition"
                        autoFocus={i === 0}
                      />
                    ))}
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading || otp.join('').length !== 6}
                  className="w-full flex justify-center items-center gap-2 py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-bold text-navy bg-electric hover:bg-blue-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-navy focus:ring-electric transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <><Spinner /> Verifying...</>
                  ) : (
                    <><FaShieldAlt /> VERIFY CODE</>
                  )}
                </button>

                <div className="text-center">
                  <button
                    type="button"
                    onClick={handleResendOtp}
                    disabled={resendTimer > 0 || loading}
                    className="inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-electric transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    <FaRedo className="text-xs" />
                    {resendTimer > 0 ? `Resend in ${resendTimer}s` : 'Resend OTP'}
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => goToStep(1)}
                  className="flex items-center justify-center gap-2 text-sm text-gray-400 hover:text-electric transition-colors w-full"
                >
                  <FaArrowLeft className="text-xs" /> Change email
                </button>
              </motion.form>
            )}

            {/* Step 3: New Password */}
            {step === 3 && (
              <motion.form
                key="step-password"
                custom={direction}
                variants={stepVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.3 }}
                onSubmit={handleResetPassword}
                className="space-y-5"
              >
                {/* New Password */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">New Password</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaLock className="text-gray-500" />
                    </div>
                    <input
                      type={showNewPassword ? 'text' : 'password'}
                      required
                      className="block w-full pl-10 pr-10 py-3 border border-white/10 rounded-lg bg-navy/50 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-electric focus:border-transparent transition"
                      placeholder="Enter new password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      autoFocus
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-electric transition-colors"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                    >
                      {showNewPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>
                </div>

                {/* Password Strength Indicator */}
                {newPassword && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="space-y-2"
                  >
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-400">Password strength</span>
                      <span style={{ color: strengthColor }} className="font-medium">
                        {strengthLabel}
                      </span>
                    </div>
                    <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full rounded-full"
                        style={{ backgroundColor: strengthColor }}
                        initial={{ width: 0 }}
                        animate={{ width: `${strengthPercent}%` }}
                        transition={{ duration: 0.3 }}
                      />
                    </div>
                    <div className="grid grid-cols-1 gap-1 mt-2">
                      {PASSWORD_RULES.map((rule, i) => {
                        const passed = rule.test(newPassword);
                        return (
                          <div
                            key={i}
                            className={`flex items-center gap-2 text-xs transition-colors ${
                              passed ? 'text-green-400' : 'text-gray-500'
                            }`}
                          >
                            <span className="text-[10px]">{passed ? '✓' : '✗'}</span>
                            {rule.label}
                          </div>
                        );
                      })}
                    </div>
                  </motion.div>
                )}

                {/* Confirm Password */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Confirm Password</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaLock className="text-gray-500" />
                    </div>
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      required
                      className={`block w-full pl-10 pr-10 py-3 border rounded-lg bg-navy/50 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:border-transparent transition ${
                        passwordsMismatch
                          ? 'border-red-500/50 focus:ring-red-500'
                          : passwordsMatch
                          ? 'border-green-500/50 focus:ring-green-500'
                          : 'border-white/10 focus:ring-electric'
                      }`}
                      placeholder="Confirm new password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-electric transition-colors"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>
                  {passwordsMismatch && (
                    <p className="text-red-400 text-xs mt-1.5">Passwords do not match</p>
                  )}
                  {passwordsMatch && (
                    <p className="text-green-400 text-xs mt-1.5">Passwords match ✓</p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={loading || passedRules.length < 5 || !passwordsMatch}
                  className="w-full flex justify-center items-center gap-2 py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-bold text-navy bg-electric hover:bg-blue-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-navy focus:ring-electric transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <><Spinner /> Resetting Password...</>
                  ) : (
                    'RESET PASSWORD'
                  )}
                </button>
              </motion.form>
            )}

            {/* Step 4: Success */}
            {step === 4 && (
              <motion.div
                key="step-success"
                custom={direction}
                variants={stepVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.3 }}
                className="text-center py-4"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 200, damping: 12, delay: 0.1 }}
                >
                  <FaCheckCircle className="text-green-400 text-6xl mx-auto mb-4 drop-shadow-[0_0_12px_rgba(34,197,94,0.5)]" />
                </motion.div>
                <h3 className="text-xl font-bold text-white mb-2">Password Reset Successful!</h3>
                <p className="text-gray-400 text-sm mb-6">
                  Your password has been updated. You can now login with your new password.
                </p>

                {/* Countdown */}
                <div className="bg-navy/50 border border-white/10 rounded-lg px-4 py-3 mb-5">
                  <p className="text-gray-400 text-xs">
                    Redirecting to login in{' '}
                    <span className="text-electric font-bold text-sm">{redirectCount}</span>
                    {' '}seconds
                  </p>
                  <div className="h-1 bg-white/5 rounded-full mt-2 overflow-hidden">
                    <motion.div
                      className="h-full bg-electric rounded-full"
                      initial={{ width: '100%' }}
                      animate={{ width: '0%' }}
                      transition={{ duration: 5, ease: 'linear' }}
                    />
                  </div>
                </div>

                <Link
                  to="/login"
                  className="inline-flex items-center gap-2 text-sm text-electric hover:text-white transition-colors font-medium"
                >
                  <FaArrowLeft className="text-xs" /> Go to Login Now
                </Link>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Footer */}
          <p className="text-center text-gray-600 text-xs mt-6">
            Praja Electric & Automation © {new Date().getFullYear()}
          </p>
        </div>
      </motion.div>
    </div>
  );
}

// Spinner component
function Spinner() {
  return (
    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );
}
