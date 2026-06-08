import { motion } from 'framer-motion';
import { FaUserTie, FaPhoneAlt, FaEnvelope, FaMapMarkerAlt, FaFileInvoiceDollar, FaGlobe } from 'react-icons/fa';

export default function HomeAbout() {
  return (
    <section className="py-24 bg-steel relative overflow-hidden">
      {/* Decorative Background */}
      <div className="absolute bottom-0 left-0 w-1/2 h-full bg-navy/50 pointer-events-none transform -skew-x-12 -translate-x-1/4"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col lg:flex-row gap-16 items-center">
          
          {/* About Text Left Side */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:w-3/5"
          >
            <h2 className="text-sm font-bold text-electric tracking-widest uppercase mb-2">About Us</h2>
            <h3 className="text-4xl md:text-5xl font-orbitron font-bold text-white mb-6 leading-tight">
              Powering Modern Industries with <span className="text-electric">Smart Systems</span>
            </h3>
            
            <div className="space-y-6 text-gray-300 text-lg">
              <p>
                <strong className="text-white">PRAJA ELECTRIC AND AUTOMATION</strong> is a leading electrical and automation solutions provider based in Bhiwadi, Rajasthan. Founded with a vision to power modern industries with smart, reliable systems.
              </p>
              <p>
                We specialize in LT/HT Panel Services, industrial automation, VFD integration, PLC programming, and comprehensive AMC solutions. Our engineers bring decades of combined experience to every project.
              </p>
              <p>
                Trusted by hundreds of clients across Rajasthan and neighboring states, we deliver safe, efficient, and future-ready electrical infrastructure — backed by round-the-clock technical support.
              </p>
            </div>
            
            <div className="mt-10 flex gap-4">
              <div className="flex-1 bg-navy/40 border border-white/10 p-4 rounded-xl text-center">
                <div className="text-3xl font-bold text-white font-orbitron mb-1">100%</div>
                <div className="text-sm text-electric">Safety Record</div>
              </div>
              <div className="flex-1 bg-navy/40 border border-white/10 p-4 rounded-xl text-center">
                <div className="text-3xl font-bold text-white font-orbitron mb-1">24/7</div>
                <div className="text-sm text-electric">Emergency Support</div>
              </div>
            </div>
          </motion.div>

          {/* Company Details Right Side */}
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:w-2/5 w-full"
          >
            <div className="bg-navy/80 backdrop-blur-xl border border-electric/30 rounded-2xl p-8 shadow-[0_0_30px_rgba(0,212,255,0.15)] relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-electric/20 rounded-full blur-[50px] pointer-events-none"></div>
              
              <h4 className="text-2xl font-bold text-white mb-8 flex items-center gap-3 border-b border-white/10 pb-4">
                Company Details
              </h4>
              
              <ul className="space-y-6">
                <li className="flex items-start gap-4">
                  <div className="mt-1 w-10 h-10 rounded-full bg-steel flex items-center justify-center text-electric shrink-0">
                    <FaUserTie />
                  </div>
                  <div>
                    <p className="text-sm text-gray-400 font-medium">Sales & Technical Head</p>
                    <p className="text-white font-bold text-lg">Ravi Prajapati</p>
                  </div>
                </li>
                
                <li className="flex items-start gap-4">
                  <div className="mt-1 w-10 h-10 rounded-full bg-steel flex items-center justify-center text-electric shrink-0">
                    <FaPhoneAlt />
                  </div>
                  <div>
                    <p className="text-sm text-gray-400 font-medium">Phone Number</p>
                    <a href="tel:+919889797908" className="text-white font-bold text-lg hover:text-electric transition-colors">+91 98897 97908</a>
                  </div>
                </li>
                
                <li className="flex items-start gap-4">
                  <div className="mt-1 w-10 h-10 rounded-full bg-steel flex items-center justify-center text-electric shrink-0">
                    <FaEnvelope />
                  </div>
                  <div className="overflow-hidden">
                    <p className="text-sm text-gray-400 font-medium">Email Address</p>
                    <a href="mailto:contact.prajaelectric@gmail.com" className="text-white font-bold hover:text-electric transition-colors truncate block">contact.prajaelectric@gmail.com</a>
                  </div>
                </li>
                
                <li className="flex items-start gap-4">
                  <div className="mt-1 w-10 h-10 rounded-full bg-steel flex items-center justify-center text-electric shrink-0">
                    <FaMapMarkerAlt />
                  </div>
                  <div>
                    <p className="text-sm text-gray-400 font-medium">Location</p>
                    <p className="text-white font-medium leading-snug">Shop No. 05, Near Pawan Crane Service,<br />Bhiwadi (Raj.) – 301019</p>
                  </div>
                </li>
                
                <li className="flex items-start gap-4">
                  <div className="mt-1 w-10 h-10 rounded-full bg-steel flex items-center justify-center text-electric shrink-0">
                    <FaFileInvoiceDollar />
                  </div>
                  <div>
                    <p className="text-sm text-gray-400 font-medium">GSTIN</p>
                    <p className="text-white font-bold font-mono tracking-wider">08FYBPP2111P1Z6</p>
                  </div>
                </li>
                

              </ul>
            </div>
          </motion.div>
          
        </div>
      </div>
    </section>
  );
}
