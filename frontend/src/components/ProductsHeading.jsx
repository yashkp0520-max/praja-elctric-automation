import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaChevronDown, FaBolt, FaArrowRight } from 'react-icons/fa';

const productImages = [
  {
    src: '/products/panel-1.png',
    title: 'LT Panel',
    desc: 'Low Tension Power Distribution',
  },
  {
    src: '/products/panel-2.png',
    title: 'MCC Panel',
    desc: 'Motor Control Center',
  },
  {
    src: '/products/panel-3.png',
    title: 'Control Panel',
    desc: 'Automation Control Systems',
  },
  {
    src: '/products/panel-4.png',
    title: 'PCC Panel',
    desc: 'Power Control Center',
  },
  {
    src: '/products/panel-5.jpg',
    title: 'HT Panel',
    desc: 'High Tension Switchgear',
  },
];

export default function ProductsHeading() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const timeoutRef = useRef(null);

  const handleMouseEnter = () => {
    clearTimeout(timeoutRef.current);
    setIsOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setIsOpen(false);
    }, 200);
  };

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div
      className="relative"
      ref={dropdownRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 text-gray-300 hover:text-electric px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 hover:bg-electric/10 hover:shadow-[0_0_15px_rgba(0,212,255,0.15)]"
      >
        <FaBolt className="text-base" />
        Products
        <FaChevronDown
          className={`text-xs transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {/* Mega Menu Dropdown */}
      <div
        className={`absolute top-full left-1/2 -translate-x-1/2 mt-3 w-[700px] transition-all duration-300 origin-top ${
          isOpen
            ? 'opacity-100 scale-100 pointer-events-auto translate-y-0'
            : 'opacity-0 scale-95 pointer-events-none -translate-y-2'
        }`}
      >
        {/* Arrow indicator */}
        <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-[#0d1f3c] border-l border-t border-electric/30 rotate-45 z-10" />

        <div className="relative bg-[#0d1f3c]/95 backdrop-blur-xl border border-electric/20 rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.5),0_0_40px_rgba(0,212,255,0.1)] overflow-hidden">
          {/* Header */}
          <div className="px-6 pt-5 pb-3 border-b border-white/5">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-white font-orbitron font-bold text-base tracking-wide">
                  Our <span className="text-electric">Products</span>
                </h3>
                <p className="text-gray-500 text-xs mt-1">
                  Industrial electrical panels & switchgear solutions
                </p>
              </div>
              <Link
                to="/products"
                className="flex items-center gap-2 text-electric text-xs font-semibold hover:underline transition-all group"
                onClick={() => setIsOpen(false)}
              >
                View All
                <FaArrowRight className="text-[10px] group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>

          {/* Image Grid */}
          <div className="p-4 grid grid-cols-5 gap-3">
            {productImages.map((item, index) => (
              <Link
                to="/products"
                key={index}
                onClick={() => setIsOpen(false)}
                className="group relative rounded-xl overflow-hidden border border-white/5 hover:border-electric/40 transition-all duration-300 hover:shadow-[0_0_20px_rgba(0,212,255,0.15)] aspect-[3/4]"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                {/* Image */}
                <img
                  src={item.src}
                  alt={item.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />

                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-navy/95 via-navy/30 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-300" />

                {/* Electric glow on hover */}
                <div className="absolute inset-0 bg-electric/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                {/* Text content */}
                <div className="absolute bottom-0 left-0 right-0 p-2.5 transform transition-transform duration-300">
                  <h4 className="text-white text-xs font-bold leading-tight group-hover:text-electric transition-colors duration-300">
                    {item.title}
                  </h4>
                  <p className="text-gray-400 text-[10px] mt-0.5 leading-tight opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    {item.desc}
                  </p>
                </div>

                {/* Top accent line */}
                <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-electric to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
              </Link>
            ))}
          </div>

          {/* Footer CTA */}
          <div className="px-6 py-3 bg-steel/30 border-t border-white/5 flex items-center justify-between">
            <p className="text-gray-500 text-[11px]">
              <span className="text-electric">⚡</span> Customized solutions for every industrial need
            </p>
            <Link
              to="/about"
              onClick={() => setIsOpen(false)}
              className="text-[11px] text-gray-400 hover:text-electric transition-colors"
            >
              Request Quote →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
