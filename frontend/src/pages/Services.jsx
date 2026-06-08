import { motion } from 'framer-motion';
import HomeServices from '../components/HomeServices';

export default function Services() {
  return (
    <div className="bg-navy min-h-screen text-white font-sans">
      {/* Page Hero Banner */}
      <div className="relative pt-32 pb-16 bg-steel overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-electric/10 rounded-full blur-[120px]" />
          <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-blue-500/10 rounded-full blur-[100px]" />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="text-electric text-sm font-bold tracking-widest uppercase mb-3"
          >
            What We Offer
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl md:text-6xl font-orbitron font-bold text-white mb-4"
          >
            OUR <span className="text-electric">SERVICES</span>
          </motion.h1>
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="h-1 w-24 bg-electric mx-auto rounded-full mt-6"
          />
        </div>
      </div>

      {/* Services Grid */}
      <HomeServices />
    </div>
  );
}
