import { motion } from 'framer-motion';
import { FaProjectDiagram, FaSmile, FaCalendarCheck, FaHeadset } from 'react-icons/fa';

export default function HomeStats() {
  const stats = [
    { id: 1, number: '200+', label: 'Projects Completed', icon: <FaProjectDiagram /> },
    { id: 2, number: '150+', label: 'Happy Clients', icon: <FaSmile /> },
    { id: 3, number: '10+', label: 'Years Experience', icon: <FaCalendarCheck /> },
    { id: 4, number: '24/7', label: 'Support Available', icon: <FaHeadset /> },
  ];

  return (
    <section className="py-20 bg-navy relative overflow-hidden border-t border-white/5">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-electric/5 via-navy to-navy pointer-events-none"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="flex flex-col items-center justify-center p-6 bg-steel/30 rounded-2xl border border-white/10 backdrop-blur-sm hover:border-electric/30 hover:bg-steel/50 transition-all group"
            >
              <div className="text-4xl text-electric mb-4 group-hover:scale-110 transition-transform duration-300 drop-shadow-[0_0_8px_rgba(0,212,255,0.5)]">
                {stat.icon}
              </div>
              <h3 className="text-3xl md:text-4xl font-orbitron font-bold text-white mb-2">
                {stat.number}
              </h3>
              <p className="text-gray-400 text-sm md:text-base font-medium text-center">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
