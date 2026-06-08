import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { productService } from '../services/product.service';
import { FaArrowLeft, FaShoppingCart, FaBoxOpen, FaCog, FaBolt } from 'react-icons/fa';

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeImage, setActiveImage] = useState(0);

  const FALLBACK = 'https://images.unsplash.com/photo-1581092335397-9583eb92d232?auto=format&fit=crop&q=80&w=800';

  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchProduct = async () => {
      try {
        const data = await productService.getProductById(id);
        setProduct(data);
      } catch (err) {
        setError('Product not found');
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-navy flex items-center justify-center pt-24">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-electric"></div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-navy flex flex-col items-center justify-center pt-24 text-white">
        <FaBoxOpen className="text-6xl text-gray-600 mb-4" />
        <h2 className="text-2xl font-orbitron font-bold mb-2">Product Not Found</h2>
        <p className="text-gray-400 mb-6">The product you're looking for doesn't exist or was removed.</p>
        <Link to="/products" className="bg-electric text-navy font-bold px-6 py-3 rounded-lg hover:bg-white transition-colors">
          ← Back to Products
        </Link>
      </div>
    );
  }

  const images = product.images && product.images.length > 0 ? product.images : [FALLBACK];
  const categoryLabels = {
    panels: 'Control Panels',
    plc: 'PLC Systems',
    sensors: 'Sensors',
    drives: 'VFD Drives',
    components: 'Components'
  };

  return (
    <div className="min-h-screen bg-navy pt-24 pb-20 px-4 sm:px-6 lg:px-8 relative">
      {/* Background */}
      <div className="absolute top-0 right-0 w-full h-96 bg-gradient-to-b from-electric/5 to-transparent pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
        >
          <Link 
            to="/products" 
            className="inline-flex items-center gap-2 text-gray-400 hover:text-electric transition-colors mb-8 text-sm font-medium"
          >
            <FaArrowLeft /> Back to Products
          </Link>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Image Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="bg-steel/50 border border-white/10 rounded-2xl overflow-hidden shadow-lg">
              <div className="relative aspect-square overflow-hidden bg-navy">
                <img 
                  src={images[activeImage]} 
                  alt={product.name}
                  onError={(e) => { e.target.onerror = null; e.target.src = FALLBACK; }}
                  className="w-full h-full object-cover"
                />
                {/* Category Badge */}
                <div className="absolute top-4 right-4 bg-navy/90 border border-electric/50 text-electric text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wider backdrop-blur-md">
                  {categoryLabels[product.category] || product.category}
                </div>
              </div>
              
              {/* Thumbnail Strip */}
              {images.length > 1 && (
                <div className="flex gap-2 p-4">
                  {images.map((img, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveImage(i)}
                      className={`w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                        i === activeImage ? 'border-electric shadow-[0_0_10px_rgba(0,212,255,0.4)]' : 'border-white/10 opacity-60 hover:opacity-100'
                      }`}
                    >
                      <img src={img} alt="" className="w-full h-full object-cover" onError={(e) => { e.target.onerror = null; e.target.src = FALLBACK; }} />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </motion.div>

          {/* Details Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-col"
          >
            {/* Title & Category */}
            <div className="mb-6">
              <p className="text-electric text-xs font-bold tracking-widest uppercase mb-2 flex items-center gap-2">
                <FaBolt /> {categoryLabels[product.category] || product.category}
              </p>
              <h1 className="text-3xl md:text-4xl font-orbitron font-bold text-white leading-tight mb-4">
                {product.name}
              </h1>
              <p className="text-gray-400 text-base leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Price */}
            <div className="bg-steel/60 border border-white/10 rounded-xl p-6 mb-6">
              <p className="text-gray-400 text-xs uppercase tracking-wider mb-1">Price</p>
              <p className="text-4xl font-orbitron font-bold text-white">
                ₹{product.price?.toLocaleString('en-IN')}
              </p>
              <div className="flex items-center gap-3 mt-3">
                <span className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full ${
                  product.stock > 0 
                    ? 'bg-green-500/10 text-green-400 border border-green-500/30'
                    : 'bg-red-500/10 text-red-400 border border-red-500/30'
                }`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${product.stock > 0 ? 'bg-green-400' : 'bg-red-400'}`} />
                  {product.stock > 0 ? `${product.stock} In Stock` : 'Out of Stock'}
                </span>
              </div>
            </div>

            {/* Specifications */}
            {product.specifications && product.specifications.length > 0 && (
              <div className="mb-6">
                <h3 className="text-white font-bold text-sm uppercase tracking-wider mb-4 flex items-center gap-2">
                  <FaCog className="text-electric" /> Specifications
                </h3>
                <div className="bg-steel/40 border border-white/10 rounded-xl overflow-hidden">
                  {product.specifications.map((spec, i) => (
                    <div 
                      key={i}
                      className={`flex items-center justify-between px-5 py-3 ${
                        i < product.specifications.length - 1 ? 'border-b border-white/5' : ''
                      }`}
                    >
                      <span className="text-gray-400 text-sm">{spec.key}</span>
                      <span className="text-white font-medium text-sm">{spec.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4 mt-auto pt-4">
              <button className="flex-1 flex items-center justify-center gap-3 bg-electric hover:bg-white text-navy font-bold py-4 rounded-xl transition-all shadow-[0_0_20px_rgba(0,212,255,0.3)] hover:shadow-[0_0_35px_rgba(0,212,255,0.5)] text-sm uppercase tracking-wider">
                <FaShoppingCart /> Enquire Now
              </button>
              <Link 
                to="/about"
                className="flex-1 flex items-center justify-center gap-3 bg-steel/80 hover:bg-steel text-white font-bold py-4 rounded-xl border border-white/10 hover:border-electric transition-all text-sm uppercase tracking-wider"
              >
                Contact Us →
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
