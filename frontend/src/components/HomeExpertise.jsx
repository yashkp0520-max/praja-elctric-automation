import { motion } from 'framer-motion';
import { FaHardHat, FaCheckDouble, FaCogs } from 'react-icons/fa';

export default function HomeExpertise() {
  return (
    <section className="py-24 relative overflow-hidden bg-navy">
      {/* Background Elements */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-steel/20 -skew-x-12 transform origin-top-right z-0" />
      <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-electric/10 rounded-full blur-[100px] z-0" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          
          {/* Image Section */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="w-full lg:w-1/2 relative"
          >
            <div className="relative rounded-2xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-white/10 group">
              {/* Electric border glow */}
              <div className="absolute inset-0 border-2 border-electric/40 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10 pointer-events-none" />
              
              <img 
                src="/engineer-working.jpg" 
                alt="Praja Electric Engineer performing on-site testing" 
                className="w-full h-auto object-cover md:h-[600px] transform group-hover:scale-105 transition-transform duration-700"
              />
              
              {/* Overlay Gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-navy/90 via-navy/20 to-transparent pointer-events-none" />
              
              {/* Badge */}
              <div className="absolute bottom-6 left-6 right-6 bg-steel/80 backdrop-blur-md border border-white/10 rounded-xl p-4 flex items-center gap-4 transform translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                <div className="w-12 h-12 bg-electric/20 rounded-full flex items-center justify-center shrink-0">
                  <FaHardHat className="text-electric text-xl" />
                </div>
                <div>
                  <h4 className="text-white font-orbitron font-bold text-sm tracking-wide">Certified Engineers</h4>
                  <p className="text-gray-400 text-xs">Rigorous site testing & safety compliance</p>
                </div>
              </div>
            </div>
            
            {/* Background Accent Box */}
            <div className="absolute -top-6 -left-6 w-full h-full border-2 border-electric/20 rounded-2xl -z-10" />
          </motion.div>

          {/* Content Section */}
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="w-full lg:w-1/2"
          >
            <span className="text-electric font-orbitron text-sm font-bold tracking-[0.25em] uppercase mb-4 block">
              Uncompromising Quality
            </span>
            <h2 className="text-4xl md:text-5xl font-orbitron font-black text-white mb-6 leading-tight">
              ON-SITE <span className="text-electric">TESTING &</span> COMMISSIONING
            </h2>
            <p className="text-gray-400 text-lg leading-relaxed mb-8">
              At Praja Electric, our commitment to excellence doesn't end at the factory floor. Our highly skilled field engineers conduct rigorous on-site testing, configuration, and commissioning to ensure your switchgear performs flawlessly under real-world industrial loads.
            </p>
            
            <div className="space-y-6 mb-10">
              <div className="flex items-start gap-4">
                <div className="mt-1 w-8 h-8 rounded-full bg-electric/10 flex items-center justify-center shrink-0 border border-electric/30">
                  <FaCheckDouble className="text-electric text-sm" />
                </div>
                <div>
                  <h4 className="text-white font-bold text-lg mb-1">Stringent Safety Protocols</h4>
                  <p className="text-gray-500 text-sm">Every panel undergoes comprehensive safety, insulation, and high-voltage testing before handover.</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="mt-1 w-8 h-8 rounded-full bg-electric/10 flex items-center justify-center shrink-0 border border-electric/30">
                  <FaCogs className="text-electric text-sm" />
                </div>
                <div>
                  <h4 className="text-white font-bold text-lg mb-1">Seamless SCADA Integration</h4>
                  <p className="text-gray-500 text-sm">Our experts configure PLCs and telemetry systems on-site, ensuring immediate integration with your plant's control room.</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-6 p-6 bg-steel/40 rounded-2xl border border-white/5 shadow-inner">
              <div className="text-center px-4 border-r border-white/10">
                <div className="text-3xl font-orbitron font-black text-electric mb-1">100%</div>
                <div className="text-xs text-gray-400 font-medium uppercase tracking-wider">Compliance</div>
              </div>
              <p className="text-sm text-gray-300 italic leading-relaxed">
                "Precision engineering validated through rigorous, real-time diagnostic trials."
              </p>
            </div>
            
          </motion.div>

        </div>
      </div>
    </section>
  );
}
