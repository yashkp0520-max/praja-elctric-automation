import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaBolt, FaArrowRight, FaShieldAlt, FaCogs, FaTools, FaCheck } from 'react-icons/fa';

const panelsList = [
  {
    id: 'lt-panel',
    title: 'LT Panel',
    desc: 'Low Tension Power Distribution Switchgear',
    longDesc: 'Engineered to distribute low-voltage power (up to 1000V AC) safely and efficiently across industrial and commercial installations.',
    image: '/products/panel-1.png',
    tagline: 'Reliable Low-Tension Power Distribution for Heavy Industrial Plants',
    specs: 'Up to 6300A | 415V AC | IP42 - IP65'
  },
  {
    id: 'mcc-panel',
    title: 'MCC Panel',
    desc: 'Motor Control Center',
    longDesc: 'Centralized control and protection of electric motors with draw-out or fixed compartments and seamless SCADA/DCS interface.',
    image: '/products/panel-2.png',
    tagline: 'Intelligent Motor Management & Protection Solutions',
    specs: 'Centralized Control | DOL, Star-Delta, VFD | CRCA Steel'
  },
  {
    id: 'control-panel',
    title: 'Control Panel',
    desc: 'Automation Control Systems',
    longDesc: 'Custom industrial automation panels utilizing high-performance PLCs, HMIs, and precise sensors to optimize automated lines.',
    image: '/products/panel-3.png',
    tagline: 'Dynamic Automation & Precision PLC-SCADA Control Panels',
    specs: 'PLC (Siemens, Rockwell) | HMI Color Touchscreens | CE Compliant'
  },
  {
    id: 'pcc-panel',
    title: 'PCC Panel',
    desc: 'Power Control Center',
    longDesc: 'The robust main power distribution hub for factories, incorporating heavy-duty circuit breakers and precise energy meters.',
    image: '/products/panel-4.png',
    tagline: 'Centralized High-Capacity Power Distribution Hub',
    specs: '1000A to 8000A | Short Circuit up to 100kA | Form 4b'
  },
  {
    id: 'ht-panel',
    title: 'HT Panel',
    desc: 'High Tension Switchgear',
    longDesc: 'Heavy-duty switchgear panels engineered for medium to high voltage applications, utilizing Vacuum Circuit Breakers (VCB) or SF6.',
    image: '/products/panel-5.jpg',
    tagline: 'Advanced High-Voltage Protection and Control (Up to 33kV)',
    specs: '11kV / 22kV / 33kV | Vacuum Breakers (VCB) | 40kA 3s'
  },
  {
    id: 'sld-panel',
    title: 'Single Line Diagram (SLD)',
    desc: 'SCADA Mimic Systems',
    longDesc: 'Real-time mimic tracking representation of power sources (Transformers, Solar, and DG sets) with intelligent bus coupler interlocks.',
    image: '/products/sld-panel.jpg',
    tagline: 'Real-time Electrical Grid Blueprinting & Remote Breaker Supervision',
    specs: 'Transformer/DG/Solar mimicing | Real-time breaker interlocks'
  },
  {
    id: 'parameter-panel',
    title: 'All Parameter Monitoring',
    desc: 'SCADA Energy Management Systems',
    longDesc: 'High-speed energy analytics dashboard capturing and charting per-phase electrical metrics (VLL, VLN, A, KW, Hz) and history logging.',
    image: '/products/parameter-panel.jpg',
    tagline: 'Intelligent Real-time Energy Auditing, Trending & Diagnostics',
    specs: 'Historical Trend Charts | 1-sec sampling resolution | ISO 50001'
  }
];

export default function Panels() {
  // Always scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-navy pt-28 pb-20 text-white overflow-hidden relative selection:bg-electric selection:text-navy">
      {/* Dynamic light effects in background */}
      <div className="absolute top-0 right-0 w-full h-[600px] bg-gradient-to-b from-electric/5 via-transparent to-transparent pointer-events-none z-0" />
      <div className="absolute top-[20%] left-[-100px] w-[500px] h-[500px] bg-electric/5 rounded-full blur-[180px] pointer-events-none z-0" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Page Header */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-steel/60 border border-white/10 backdrop-blur-md mb-6 shadow-md"
          >
            <span className="text-electric animate-pulse">⚡</span>
            <span className="text-gray-300 text-xs font-bold tracking-[0.15em] uppercase font-orbitron">Praja Engineering Catalog</span>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl sm:text-5xl md:text-6xl font-orbitron font-black text-white mb-6 leading-tight"
          >
            OUR INDUSTRIAL <span className="text-electric drop-shadow-[0_0_20px_rgba(0,212,255,0.3)]">PANELS</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-gray-400 text-base sm:text-lg leading-relaxed font-sans"
          >
            Explore our line-up of custom-engineered switchgears, motor controllers, and automation consoles designed for maximum safety, operational longevity, and regulatory compliance.
          </motion.p>
        </div>

        {/* Responsive Grid Layout of Panels */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 xl:gap-10 mb-24">
          {panelsList.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <div 
                className="group flex flex-col h-full bg-steel/40 backdrop-blur-md border border-white/10 hover:border-electric/40 rounded-2xl overflow-hidden shadow-lg transition-all duration-500 relative"
              >
                {/* Accent neon top-line */}
                <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-transparent via-electric to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
                
                {/* Image Section */}
                <div className="relative aspect-[16/11] overflow-hidden bg-navy">
                  <img 
                    src={item.image} 
                    alt={item.title} 
                    className="w-full h-full object-cover opacity-80 transition-all duration-700 select-none"
                  />
                  
                  {/* Dark transparent gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/10 to-transparent opacity-80" />
                  <div className="absolute inset-0 bg-electric/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                  
                  {/* Category Pill */}
                  <div className="absolute top-4 right-4 bg-navy/90 border border-electric/40 px-3 py-1 rounded-full text-[10px] font-orbitron font-bold tracking-wider text-electric backdrop-blur-md">
                    SWITCHGEAR
                  </div>
                </div>

                {/* Content Section */}
                <div className="p-6 flex flex-col flex-grow">
                  <span className="text-electric/80 font-orbitron text-[10px] font-bold tracking-[0.2em] uppercase mb-1">
                    {item.desc}
                  </span>
                  <h3 className="text-2xl font-bold font-orbitron text-white mb-3">
                    {item.title}
                  </h3>
                  <p className="text-gray-400 text-sm leading-relaxed mb-6 flex-grow">
                    {item.longDesc}
                  </p>
                  
                  {/* Specifications micro banner */}
                  <div className="bg-[#0b1625] border border-white/5 rounded-xl px-4 py-2.5 mb-5 text-[11px] font-semibold text-gray-300 font-orbitron tracking-wide flex items-center gap-2">
                    <span className="text-electric font-bold">⚡</span>
                    <span className="truncate">{item.specs}</span>
                  </div>

                  {/* Actions Area */}
                  <div className="flex items-center justify-between border-t border-white/5 pt-4">
                    <span className="text-xs font-semibold text-gray-500">
                      Fully Customizable
                    </span>
                    <Link 
                      to={`/panels/${item.id}`}
                      className="flex items-center gap-1.5 text-xs font-bold text-electric font-orbitron tracking-wider hover:gap-3 transition-all duration-300"
                    >
                      View Specs <FaArrowRight className="text-[10px]" />
                    </Link>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Quality Banner & Custom Solutions Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="bg-steel/30 border border-white/10 rounded-3xl p-8 sm:p-12 relative overflow-hidden backdrop-blur-sm"
        >
          {/* Subtle neon glowing orb in center */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] bg-electric/5 rounded-full blur-[80px] pointer-events-none" />
          
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8">
              <h2 className="text-3xl sm:text-4xl font-orbitron font-black mb-4">
                NEED A CUSTOM <span className="text-electric">SWITCHGEAR SOLUTION</span>?
              </h2>
              <p className="text-gray-400 text-sm sm:text-base leading-relaxed mb-6 max-w-2xl">
                Every manufacturing facility has unique physical layout constraints and voltage loads. Our engineers specialize in designing bespoke panels conforming to specific mechanical and electrical configurations.
              </p>
              
              {/* Feature check list */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-gray-300 font-sans">
                <div className="flex items-center gap-2">
                  <FaCheck className="text-electric text-xs shrink-0" />
                  <span>Seismic & Thermal Calculation Tests</span>
                </div>
                <div className="flex items-center gap-2">
                  <FaCheck className="text-electric text-xs shrink-0" />
                  <span>IEC 61439-1 & 2 Global Compliance</span>
                </div>
                <div className="flex items-center gap-2">
                  <FaCheck className="text-electric text-xs shrink-0" />
                  <span>Form 4b Drawer Compartment Isolation</span>
                </div>
                <div className="flex items-center gap-2">
                  <FaCheck className="text-electric text-xs shrink-0" />
                  <span>Integrated DCS / Remote SCADA Protocols</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-4 flex justify-start lg:justify-end">
              <Link 
                to="/about"
                className="px-8 py-4 bg-electric text-navy font-bold rounded-lg shadow-[0_0_20px_rgba(0,212,255,0.3)] hover:shadow-[0_0_35px_rgba(0,212,255,0.6)] hover:bg-white transition-all transform hover:-translate-y-1 text-sm uppercase tracking-wider font-orbitron"
              >
                ⚡ Consult Our Engineers
              </Link>
            </div>
          </div>
        </motion.div>

      </div>
    </div>
  );
}
