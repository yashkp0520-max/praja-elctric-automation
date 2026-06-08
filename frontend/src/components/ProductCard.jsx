import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaShoppingCart, FaInfoCircle } from 'react-icons/fa';

export default function ProductCard({ product }) {
  const FALLBACK = 'https://images.unsplash.com/photo-1581092335397-9583eb92d232?auto=format&fit=crop&q=80&w=800';
  
  // Use a fallback image if no image is available
  const image = product.images && product.images.length > 0 
    ? product.images[0] 
    : FALLBACK;

  return (
    <motion.div
      whileHover={{ y: -10 }}
      className="bg-steel/80 backdrop-blur-md border border-white/10 rounded-xl overflow-hidden shadow-lg group hover:shadow-[0_10px_30px_rgba(0,212,255,0.2)] transition-all duration-300"
    >
      <div className="relative h-48 overflow-hidden bg-navy">
        <img 
          src={image} 
          alt={product.name} 
          onError={(e) => { e.target.onerror = null; e.target.src = FALLBACK; }}
          className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-500"
        />
        <div className="absolute top-3 right-3 bg-navy/90 border border-electric/50 text-electric text-xs font-bold px-2 py-1 rounded uppercase tracking-wider backdrop-blur-md">
          {product.category}
        </div>
      </div>
      
      <div className="p-5">
        <h3 className="text-xl font-bold text-white mb-2 line-clamp-1 group-hover:text-electric transition-colors">
          {product.name}
        </h3>
        <p className="text-gray-400 text-sm mb-4 line-clamp-2 min-h-[40px]">
          {product.description}
        </p>
        
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/10">
          <div className="text-2xl font-orbitron font-bold text-white">
            ₹{product.price.toLocaleString('en-IN')}
          </div>
          <div className="flex gap-2">
            <Link 
              to={`/products/${product._id}`}
              className="p-2 bg-navy hover:bg-electric hover:text-navy text-gray-300 rounded-lg transition-colors border border-white/10 hover:border-transparent"
              title="View Details"
            >
              <FaInfoCircle />
            </Link>
            <button 
              className="p-2 bg-electric text-navy hover:bg-blue-400 rounded-lg transition-colors shadow-[0_0_10px_rgba(0,212,255,0.3)] hover:shadow-[0_0_15px_rgba(0,212,255,0.6)]"
              title="Add to Cart"
            >
              <FaShoppingCart />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
