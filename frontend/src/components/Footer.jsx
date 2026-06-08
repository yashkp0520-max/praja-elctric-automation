import { Link } from 'react-router-dom';
import { FaBolt, FaPhoneAlt, FaEnvelope, FaMapMarkerAlt, FaArrowUp } from 'react-icons/fa';

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-steel/80 border-t border-white/10 relative overflow-hidden">
      {/* Decorative glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-1 bg-gradient-to-r from-transparent via-electric/50 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-6">
              <FaBolt className="text-electric text-2xl" />
              <div>
                <h3 className="font-orbitron font-bold text-white text-lg leading-none">PRAJA ELECTRIC</h3>
                <p className="text-gray-500 text-xs tracking-[0.3em] mt-1">& AUTOMATION</p>
              </div>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed mb-6">
              Pioneering advanced electrical & automation excellence for modern industries in Bhiwadi, Rajasthan.
            </p>
            <p className="text-gray-500 text-xs italic">
              "Smart Power · Smart Solutions"
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-orbitron font-bold text-white text-sm tracking-wider mb-6 flex items-center gap-2">
              <span className="w-6 h-px bg-electric" />
              QUICK LINKS
            </h4>
            <ul className="space-y-3">
              {[
                { to: '/', label: 'Home' },
                { to: '/panels', label: 'Panels' },
                { to: '/services', label: 'Services' },
                { to: '/about', label: 'About Us' },
              ].map(link => (
                <li key={link.to}>
                  <Link 
                    to={link.to} 
                    className="text-gray-400 hover:text-electric text-sm transition-colors hover:translate-x-1 inline-block transform duration-200"
                  >
                    → {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-orbitron font-bold text-white text-sm tracking-wider mb-6 flex items-center gap-2">
              <span className="w-6 h-px bg-electric" />
              SERVICES
            </h4>
            <ul className="space-y-3 text-gray-400 text-sm">
              <li>Panel Manufacturing</li>
              <li>PLC Programming</li>
              <li>SCADA Solutions</li>
              <li>VFD & Drive Installation</li>
              <li>Industrial Automation</li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-orbitron font-bold text-white text-sm tracking-wider mb-6 flex items-center gap-2">
              <span className="w-6 h-px bg-electric" />
              CONTACT
            </h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <FaPhoneAlt className="text-electric text-sm mt-1 shrink-0" />
                <span className="text-gray-400 text-sm">+91 9889797908</span>
              </li>
              <li className="flex items-start gap-3">
                <FaEnvelope className="text-electric text-sm mt-1 shrink-0" />
                <a href="mailto:contact.prajaelectric@gmail.com" className="text-gray-400 hover:text-electric text-sm transition-colors break-all">
                  contact.prajaelectric@gmail.com
                </a>
              </li>
              <li className="flex items-start gap-3">
                <FaMapMarkerAlt className="text-electric text-sm mt-1 shrink-0" />
                <span className="text-gray-400 text-sm">
                  Shop No. 05, Near Pawan Crane Service, Bhiwadi (Raj) - 301019
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-gray-500 text-xs tracking-wider">
            © {new Date().getFullYear()} PRAJA ELECTRIC & AUTOMATION. All rights reserved.
          </p>
          <p className="text-gray-600 text-xs">
            GSTIN: 08FYBPP2111P1Z6
          </p>
          <button 
            onClick={scrollToTop}
            className="bg-electric/10 hover:bg-electric hover:text-navy text-electric p-2.5 rounded-full transition-all border border-electric/30 hover:border-transparent shadow-[0_0_10px_rgba(0,212,255,0.15)] hover:shadow-[0_0_20px_rgba(0,212,255,0.4)]"
            title="Back to Top"
          >
            <FaArrowUp className="text-sm" />
          </button>
        </div>
      </div>
    </footer>
  );
}
