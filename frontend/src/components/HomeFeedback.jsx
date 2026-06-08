import { useState } from 'react';
import { motion } from 'framer-motion';

export default function HomeFeedback() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
    rating: 5,
  });
  const [status, setStatus] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRatingChange = (newRating) => {
    setFormData({ ...formData, rating: newRating });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('submitting');
    
    try {
      const response = await fetch('https://praja-elctric-automation-backend.onrender.com/api/feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setStatus('success');
        setFormData({ name: '', email: '', message: '', rating: 5 });
        setTimeout(() => setStatus(null), 3000);
      } else {
        setStatus('error');
      }
    } catch (error) {
      console.error('Error submitting feedback:', error);
      setStatus('error');
    }
  };

  return (
    <section className="py-24 bg-navy relative overflow-hidden">
      <div className="absolute top-0 right-0 w-1/3 h-full bg-steel/30 pointer-events-none transform skew-x-12 translate-x-1/4"></div>
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="bg-navy/80 backdrop-blur-xl border border-electric/30 rounded-3xl p-8 md:p-12 shadow-[0_0_40px_rgba(0,212,255,0.1)] relative overflow-hidden"
        >
          {/* Subtle glow behind the form */}
          <div className="absolute -top-32 -left-32 w-64 h-64 bg-electric/20 rounded-full blur-[80px] pointer-events-none"></div>

          <div className="text-center mb-10">
            <h2 className="text-sm font-bold text-electric tracking-widest uppercase mb-2">We Value Your Voice</h2>
            <h3 className="text-3xl md:text-4xl font-orbitron font-bold text-white mb-4">
              Share Your <span className="text-electric">Feedback</span>
            </h3>
            <p className="text-gray-400">
              Help us improve our services. Your insights matter to us.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">Full Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full bg-steel/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-electric focus:ring-1 focus:ring-electric transition-colors"
                  placeholder="John Doe"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">Email Address</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full bg-steel/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-electric focus:ring-1 focus:ring-electric transition-colors"
                  placeholder="john@example.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Rating</label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => handleRatingChange(star)}
                    className={`text-2xl transition-colors ${
                      star <= formData.rating ? 'text-gold' : 'text-gray-600'
                    }`}
                    style={{ color: star <= formData.rating ? '#FFD700' : '' }}
                  >
                    ★
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-2">Your Feedback</label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                rows="4"
                className="w-full bg-steel/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-electric focus:ring-1 focus:ring-electric transition-colors resize-none"
                placeholder="Tell us what you think..."
              ></textarea>
            </div>

            <div className="text-center pt-4">
              <button
                type="submit"
                disabled={status === 'submitting'}
                className="bg-electric hover:bg-electric/80 text-navy font-bold py-3 px-8 rounded-full transition-all transform hover:scale-105 shadow-[0_0_20px_rgba(0,212,255,0.4)] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {status === 'submitting' ? 'Submitting...' : 'Submit Feedback'}
              </button>
              
              {status === 'success' && (
                <p className="mt-4 text-green-400 font-medium">Thank you for your feedback!</p>
              )}
              {status === 'error' && (
                <p className="mt-4 text-red-400 font-medium">Something went wrong. Please try again later.</p>
              )}
            </div>
          </form>
        </motion.div>
      </div>
    </section>
  );
}
