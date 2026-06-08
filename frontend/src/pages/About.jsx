import { useState } from 'react';
import { motion } from 'framer-motion';
import { FaPhoneAlt, FaEnvelope, FaMapMarkerAlt, FaIdCard, FaPaperPlane } from 'react-icons/fa';
import { enquiryService } from '../services/enquiry.service';

export default function About() {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', message: '' });
  const [submitStatus, setSubmitStatus] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitStatus('submitting');
    try {
      await enquiryService.submitEnquiry(formData);
      setSubmitStatus('success');
      setFormData({ name: '', email: '', phone: '', message: '' });
      setTimeout(() => setSubmitStatus(null), 4000);
    } catch {
      setSubmitStatus('error');
    }
  };

  return (
    <div className="min-h-screen bg-navy pt-24 pb-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-full h-96 bg-gradient-to-b from-electric/5 to-transparent pointer-events-none"></div>
      
      <div className="max-w-4xl mx-auto relative z-10">
        <div className="text-center mb-12">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-orbitron font-bold text-white mb-4"
          >
            ABOUT <span className="text-electric">US</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-gray-400 max-w-2xl mx-auto text-xl italic"
          >
            "Smart Power, Smart Solutions"
          </motion.p>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="bg-steel/80 backdrop-blur-xl border border-white/10 rounded-3xl p-8 md:p-12 shadow-[0_0_40px_rgba(0,212,255,0.1)]"
        >
          <div className="text-center mb-10 border-b border-white/10 pb-10">
            <h2 className="text-3xl md:text-4xl font-bold text-white tracking-wider mb-2 font-orbitron">
              PRAJA ELECTRIC & AUTOMATION
            </h2>
            <div className="w-24 h-1 bg-electric mx-auto rounded-full mt-4 shadow-[0_0_10px_rgba(0,212,255,0.8)]"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Contact Information */}
            <div>
              <h3 className="text-2xl font-bold text-electric mb-6 flex items-center gap-3">
                <div className="w-8 h-px bg-electric"></div>
                Contact Details
              </h3>
              <ul className="space-y-6">
                <li className="flex items-start gap-4 group">
                  <div className="bg-navy p-3 rounded-lg border border-white/5 text-electric group-hover:bg-electric group-hover:text-navy transition-colors">
                    <FaPhoneAlt className="text-xl" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-400 uppercase tracking-wider mb-1">Phone</p>
                    <p className="text-white text-lg font-medium">+91 9889797908</p>
                  </div>
                </li>
                <li className="flex items-start gap-4 group">
                  <div className="bg-navy p-3 rounded-lg border border-white/5 text-electric group-hover:bg-electric group-hover:text-navy transition-colors">
                    <FaEnvelope className="text-xl" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-400 uppercase tracking-wider mb-1">Email</p>
                    <a href="mailto:contact.prajaelectric@gmail.com" className="text-white hover:text-electric text-lg font-medium transition-colors">
                      contact.prajaelectric@gmail.com
                    </a>
                  </div>
                </li>

              </ul>
            </div>

            {/* Location & Tax Info */}
            <div>
              <h3 className="text-2xl font-bold text-electric mb-6 flex items-center gap-3">
                <div className="w-8 h-px bg-electric"></div>
                Location & Details
              </h3>
              <ul className="space-y-6">
                <li className="flex items-start gap-4 group">
                  <div className="bg-navy p-3 rounded-lg border border-white/5 text-electric group-hover:bg-electric group-hover:text-navy transition-colors">
                    <FaMapMarkerAlt className="text-xl" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-400 uppercase tracking-wider mb-1">Address</p>
                    <p className="text-white text-lg leading-relaxed">
                      Shop No. 05, Near Pawan Crane Service,<br />
                      Bhiwadi (Raj) - 301019
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-4 group">
                  <div className="bg-navy p-3 rounded-lg border border-white/5 text-electric group-hover:bg-electric group-hover:text-navy transition-colors">
                    <FaIdCard className="text-xl" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-400 uppercase tracking-wider mb-1">GSTIN</p>
                    <p className="text-white font-mono text-lg bg-navy/50 px-3 py-1 rounded inline-block border border-white/5 tracking-wider">
                      08FYBPP2111P1Z6
                    </p>
                  </div>
                </li>
              </ul>
            </div>
          </div>

          {/* Owner / Head Profile Box */}
          <div className="mt-12 pt-8 border-t border-white/10">
            <div className="bg-navy/50 rounded-2xl p-8 border border-white/5 text-center hover:border-electric/30 transition-colors">
              <h3 className="text-2xl font-bold text-white mb-1">RAVI PRAJAPATI</h3>
              <div className="inline-block bg-electric/20 text-electric font-medium uppercase tracking-wider text-sm px-4 py-1 rounded-full mb-4 border border-electric/30">
                Sales & Technical Head
              </div>
              <p className="text-gray-300 text-lg max-w-lg mx-auto">
                Any queries, complaints & technical support,<br/> please do not hesitate to contact us.
              </p>
            </div>
          </div>
          
        </motion.div>

        {/* Enquiry / Contact Form */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mt-12 bg-steel/60 backdrop-blur-xl border border-electric/20 rounded-3xl p-8 md:p-12 shadow-[0_0_30px_rgba(0,212,255,0.08)] relative overflow-hidden"
        >
          <div className="absolute -top-20 -right-20 w-48 h-48 bg-electric/10 rounded-full blur-[80px] pointer-events-none" />
          
          <div className="text-center mb-8">
            <h3 className="text-sm font-bold text-electric tracking-widest uppercase mb-2">Get In Touch</h3>
            <h4 className="text-2xl md:text-3xl font-orbitron font-bold text-white">
              Send Us An <span className="text-electric">Enquiry</span>
            </h4>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5 max-w-2xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label htmlFor="contact-name" className="block text-sm font-medium text-gray-300 mb-2">Full Name *</label>
                <input
                  type="text"
                  id="contact-name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full bg-navy/60 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-electric focus:ring-1 focus:ring-electric transition-colors"
                  placeholder="Your name"
                />
              </div>
              <div>
                <label htmlFor="contact-email" className="block text-sm font-medium text-gray-300 mb-2">Email *</label>
                <input
                  type="email"
                  id="contact-email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full bg-navy/60 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-electric focus:ring-1 focus:ring-electric transition-colors"
                  placeholder="your@email.com"
                />
              </div>
            </div>
            <div>
              <label htmlFor="contact-phone" className="block text-sm font-medium text-gray-300 mb-2">Phone Number</label>
              <input
                type="tel"
                id="contact-phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full bg-navy/60 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-electric focus:ring-1 focus:ring-electric transition-colors"
                placeholder="+91 XXXXX XXXXX"
              />
            </div>
            <div>
              <label htmlFor="contact-message" className="block text-sm font-medium text-gray-300 mb-2">Message *</label>
              <textarea
                id="contact-message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                rows="4"
                className="w-full bg-navy/60 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-electric focus:ring-1 focus:ring-electric transition-colors resize-none"
                placeholder="Tell us about your requirement..."
              ></textarea>
            </div>
            <div className="text-center pt-2">
              <button
                type="submit"
                disabled={submitStatus === 'submitting'}
                className="inline-flex items-center gap-2 bg-electric hover:bg-white text-navy font-bold py-3 px-10 rounded-full transition-all transform hover:scale-105 shadow-[0_0_20px_rgba(0,212,255,0.4)] disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-wider text-sm"
              >
                <FaPaperPlane />
                {submitStatus === 'submitting' ? 'Sending...' : 'Send Enquiry'}
              </button>
              {submitStatus === 'success' && (
                <p className="mt-4 text-green-400 font-medium">✓ Enquiry sent successfully! We'll get back to you soon.</p>
              )}
              {submitStatus === 'error' && (
                <p className="mt-4 text-red-400 font-medium">Something went wrong. Please try again or call us directly.</p>
              )}
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
