import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaUserCircle, FaSignOutAlt, FaHome, FaCogs, FaInfoCircle, FaBolt, FaBars, FaTimes } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';


export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsOpen(false);
  };

  return (
    <nav className="fixed w-full z-50 bg-navy/80 backdrop-blur-md border-b border-electric/20 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-4">
          
          {/* Logo and Brand */}
          <Link to="/" className="flex items-center gap-4 group shrink-0 relative">
            <div className="relative h-14 sm:h-16 w-auto flex items-center">
              {/* Glow effect behind logo */}
              <div className="absolute inset-0 bg-electric/10 rounded-xl blur-xl opacity-0 group-hover:opacity-100 transition-all duration-500 scale-110" />
              <img 
                src="/logo.jpg" 
                alt="Praja Electric Logo" 
                className="h-14 sm:h-16 w-auto object-contain relative z-10 transition-all duration-500 group-hover:scale-110 rounded-lg"
                style={{ 
                  mixBlendMode: 'lighten',
                  filter: 'contrast(1.2) brightness(1.1) saturate(1.3)',
                }}
              />
            </div>
            {/* Subtle separator line */}
            <div className="hidden sm:block h-8 w-px bg-gradient-to-b from-transparent via-electric/40 to-transparent" />
            <div className="font-orbitron font-bold tracking-wide text-white transition-all duration-300 group-hover:text-electric group-hover:scale-105 origin-left flex flex-col justify-center">
              <span className="text-lg lg:text-xl leading-none bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent group-hover:from-electric group-hover:to-cyan-300 transition-all duration-300">PRAJA ELECTRIC</span>
              <span className="text-[10px] lg:text-xs text-gray-500 font-medium tracking-[0.3em] hidden sm:block mt-1">& AUTOMATION</span>
            </div>
          </Link>

          {/* Navigation Links - Centered */}
          <div className="hidden md:flex items-center justify-center gap-2 lg:gap-3 flex-1">
            <Link to="/" className="flex items-center gap-2 text-gray-300 hover:text-electric px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 hover:bg-electric/10 hover:shadow-[0_0_15px_rgba(0,212,255,0.15)]"><FaHome className="text-base" /> Home</Link>
            <Link to="/panels" className="flex items-center gap-2 text-gray-300 hover:text-electric px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 hover:bg-electric/10 hover:shadow-[0_0_15px_rgba(0,212,255,0.15)]">
              <FaBolt className="text-base" /> Panels
            </Link>
            <Link to="/services" className="flex items-center gap-2 text-gray-300 hover:text-electric px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 hover:bg-electric/10 hover:shadow-[0_0_15px_rgba(0,212,255,0.15)]"><FaCogs className="text-base" /> Services</Link>
            <Link to="/about" className="flex items-center gap-2 text-gray-300 hover:text-electric px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 hover:bg-electric/10 hover:shadow-[0_0_15px_rgba(0,212,255,0.15)]"><FaInfoCircle className="text-base" /> About Us</Link>
          </div>

          {/* Right Section: Auth */}
          <div className="flex items-center gap-4 lg:gap-6 shrink-0">

            {/* User Auth */}
            {user ? (
              <div className="flex items-center gap-4">
                <div className="hidden lg:flex items-center gap-2 text-gray-300 bg-steel/40 px-3 py-1.5 rounded-full border border-white/5">
                  <FaUserCircle className="text-lg text-electric" />
                  <span className="font-medium text-sm">{user.name}</span>
                </div>
                {user.role === 'admin' && (
                  <Link to="/admin" className="text-xs font-bold bg-electric/20 text-electric px-3 py-1.5 rounded-full border border-electric/50 hover:bg-electric hover:text-navy transition-all shadow-[0_0_10px_rgba(0,212,255,0.2)]">
                    ADMIN
                  </Link>
                )}
                <button 
                  onClick={handleLogout}
                  className="text-gray-400 hover:text-red-400 bg-steel/40 hover:bg-red-500/10 p-2 rounded-full transition-colors flex items-center justify-center border border-transparent hover:border-red-500/30"
                  title="Logout"
                >
                  <FaSignOutAlt className="text-lg" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3 sm:gap-4">
                <Link to="/login" className="text-gray-300 hover:text-white font-medium text-sm transition-colors hidden sm:block">Login</Link>
                <Link to="/register" className="bg-electric hover:bg-blue-400 text-navy font-bold px-4 py-2 sm:px-5 rounded-lg transition-all duration-300 shadow-[0_0_15px_rgba(0,212,255,0.4)] hover:shadow-[0_0_25px_rgba(0,212,255,0.6)] text-sm">
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Toggle Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-gray-300 hover:text-electric p-2 rounded-lg transition-colors focus:outline-none flex items-center justify-center shrink-0 border border-transparent hover:border-electric/30"
            aria-label="Toggle Menu"
          >
            {isOpen ? <FaTimes className="text-2xl" /> : <FaBars className="text-2xl" />}
          </button>

        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="md:hidden bg-navy/95 backdrop-blur-lg border-b border-electric/20 overflow-hidden"
          >
            <div className="px-4 pt-2 pb-6 space-y-2 flex flex-col">
              <Link 
                to="/" 
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 text-gray-300 hover:text-electric px-4 py-3 rounded-xl text-base font-medium transition-colors hover:bg-electric/10"
              >
                <FaHome /> Home
              </Link>
              <Link 
                to="/panels" 
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 text-gray-300 hover:text-electric px-4 py-3 rounded-xl text-base font-medium transition-colors hover:bg-electric/10"
              >
                <FaBolt /> Panels
              </Link>
              <Link 
                to="/services" 
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 text-gray-300 hover:text-electric px-4 py-3 rounded-xl text-base font-medium transition-colors hover:bg-electric/10"
              >
                <FaCogs /> Services
              </Link>
              <Link 
                to="/about" 
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 text-gray-300 hover:text-electric px-4 py-3 rounded-xl text-base font-medium transition-colors hover:bg-electric/10"
              >
                <FaInfoCircle /> About Us
              </Link>
              
              {!user && (
                <div className="pt-4 border-t border-white/5 flex flex-col gap-3">
                  <Link 
                    to="/login" 
                    onClick={() => setIsOpen(false)}
                    className="flex justify-center items-center text-gray-300 hover:text-white py-3 rounded-xl text-base font-medium bg-steel/30 border border-white/5"
                  >
                    Login
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
