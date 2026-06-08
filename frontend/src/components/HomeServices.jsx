import { motion } from 'framer-motion';
import { FaBolt, FaPlug, FaRobot, FaWrench, FaSearch, FaShieldAlt } from 'react-icons/fa';

export default function HomeServices() {
  const services = [
    {
      id: 1,
      title: "LT Panel Services",
      description: "Low Tension panel design, manufacturing, installation and maintenance for industrial and commercial power distribution applications.",
      icon: <FaBolt />,
    },
    {
      id: 2,
      title: "HT Panel Services",
      description: "High Tension switchgear, metering panels, VCB panels and ring main units for high-voltage industrial and utility facilities.",
      icon: <FaPlug />,
    },
    {
      id: 3,
      title: "Electrical Automation",
      description: "PLC/SCADA systems, VFD drives, motor control centers and smart industrial automation solutions for modern factories.",
      icon: <FaRobot />,
    },
    {
      id: 4,
      title: "AMC Services",
      description: "Annual Maintenance Contracts with scheduled servicing, preventive maintenance and emergency breakdown response support.",
      icon: <FaWrench />,
    },
    {
      id: 5,
      title: "Testing & Commissioning",
      description: "Professional electrical testing, relay coordination, load flow analysis and complete system commissioning for new installations.",
      icon: <FaSearch />,
    },
    {
      id: 6,
      title: "Technical Support",
      description: "On-call expert engineers for fault diagnosis, troubleshooting and emergency electrical support for minimal downtime.",
      icon: <FaShieldAlt />,
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  return (
    <section id="services" className="py-24 bg-navy relative">
      <div className="absolute top-0 right-0 w-1/3 h-1/2 bg-electric/5 rounded-full blur-[150px] pointer-events-none"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <motion.p 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-gray-400 max-w-3xl mx-auto text-lg"
          >
            Comprehensive electrical and automation solutions engineered for industrial excellence across all sectors.
          </motion.p>
        </div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {services.map((service) => (
            <motion.div 
              key={service.id}
              variants={itemVariants}
              className="bg-steel/60 border border-white/10 rounded-2xl p-8 hover:bg-steel hover:border-electric/50 transition-all duration-300 group hover:-translate-y-2 shadow-lg"
            >
              <div className="w-16 h-16 bg-navy rounded-xl flex items-center justify-center text-2xl text-electric mb-6 border border-white/5 group-hover:shadow-[0_0_20px_rgba(0,212,255,0.4)] transition-all">
                {service.icon}
              </div>
              <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-electric transition-colors">
                {service.title}
              </h3>
              <p className="text-gray-400 leading-relaxed">
                {service.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
