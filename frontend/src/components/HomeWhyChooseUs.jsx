import { motion } from 'framer-motion';
import { FaHardHat, FaBolt, FaShieldAlt, FaMicroscope, FaHandshake } from 'react-icons/fa';

export default function HomeWhyChooseUs() {
  const reasons = [
    {
      id: 1,
      title: "Expert Engineers",
      description: "Certified professionals with deep electrical and automation knowledge and years of field experience.",
      icon: <FaHardHat />,
    },
    {
      id: 2,
      title: "Fast Response",
      description: "Emergency technical teams deployed rapidly across the region, minimizing industrial downtime.",
      icon: <FaBolt />,
    },
    {
      id: 3,
      title: "Safety First",
      description: "All installations comply with IS and IEC safety standards for zero-compromise industrial protection.",
      icon: <FaShieldAlt />,
    },
    {
      id: 4,
      title: "Modern Equipment",
      description: "Latest testing, commissioning and diagnostic tools ensuring precision in every delivered project.",
      icon: <FaMicroscope />,
    },
    {
      id: 5,
      title: "Long-Term Trust",
      description: "Long-term partnerships built on transparency, consistent quality and genuine client care.",
      icon: <FaHandshake />,
    }
  ];

  return (
    <section className="py-24 bg-navy relative border-t border-white/5">
      <div className="absolute top-1/2 left-0 w-1/3 h-1/2 bg-electric/5 rounded-full blur-[120px] pointer-events-none transform -translate-y-1/2"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-orbitron font-bold text-white mb-4"
          >
            WHY <span className="text-electric">CHOOSE US</span>
          </motion.h2>
          <motion.div 
            initial={{ opacity: 0, scaleX: 0 }}
            whileInView={{ opacity: 1, scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="h-1 w-24 bg-electric mx-auto rounded-full"
          ></motion.div>
        </div>

        <div className="flex flex-wrap justify-center gap-6">
          {reasons.map((reason, index) => (
            <motion.div 
              key={reason.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-steel/40 border border-white/10 rounded-2xl p-6 w-full md:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)] flex flex-col items-center text-center hover:bg-steel/80 hover:border-electric/40 transition-all duration-300 group"
            >
              <div className="w-20 h-20 rounded-full bg-navy border border-white/10 flex items-center justify-center text-3xl text-electric mb-6 group-hover:scale-110 group-hover:shadow-[0_0_20px_rgba(0,212,255,0.3)] transition-all duration-300">
                {reason.icon}
              </div>
              <h3 className="text-xl font-bold text-white mb-3 group-hover:text-electric transition-colors">
                {reason.title}
              </h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                {reason.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
