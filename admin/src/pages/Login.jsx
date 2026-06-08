import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-navy min-h-screen flex items-center justify-center font-rajdhani p-4">
      {/* Background decorative elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-electric/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-electric/5 rounded-full blur-3xl"></div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="bg-steel/80 backdrop-blur-xl border border-electric/20 rounded-2xl p-8 shadow-[0_0_40px_rgba(0,212,255,0.08)]">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-2xl font-orbitron font-bold text-white mb-2">
              Admin <span className="text-electric">Panel</span>
            </h1>
            <p className="text-gray-400 text-sm">
              Sign in to access the admin dashboard
            </p>
          </div>

          {/* Error message */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-lg text-sm mb-6"
            >
              {error}
            </motion.div>
          )}

          {/* Login form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-gray-400 text-sm mb-2 font-medium">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="admin@prajaelectric.com"
                className="w-full bg-navy/60 border border-electric/20 text-white rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-electric transition-colors placeholder:text-gray-600"
              />
            </div>

            <div>
              <label className="block text-gray-400 text-sm mb-2 font-medium">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                className="w-full bg-navy/60 border border-electric/20 text-white rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-electric transition-colors placeholder:text-gray-600"
              />
            </div>

            <div className="flex justify-end -mt-1">
              <Link to="/forgot-password" className="text-xs text-electric hover:text-white transition-colors font-medium">
                Forgot Password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-electric hover:bg-electric/90 text-navy font-bold py-3 rounded-lg transition-all duration-300 text-sm uppercase tracking-wider disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_20px_rgba(0,212,255,0.3)] hover:shadow-[0_0_30px_rgba(0,212,255,0.5)]"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          {/* Footer */}
          <p className="text-center text-gray-500 text-xs mt-6">
            Praja Electric & Automation © {new Date().getFullYear()}
          </p>
        </div>
      </motion.div>
    </div>
  );
}
