import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { productService } from '../services/product.service';
import ProductCard from '../components/ProductCard';
import { FaCogs, FaServer, FaMicrochip, FaFan, FaLayerGroup } from 'react-icons/fa';

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const initialSearch = searchParams.get('search') || '';
  const [searchQuery, setSearchQuery] = useState(initialSearch);

  // Update search query if URL changes
  useEffect(() => {
    const currentSearch = new URLSearchParams(location.search).get('search') || '';
    setSearchQuery(currentSearch);
  }, [location.search]);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const data = await productService.getAllProducts();
        setProducts(data);
      } catch (error) {
        console.error("Failed to fetch products");
      } finally {
        setLoading(false);
      }
    };
    
    fetchProducts();
  }, []);

  const categories = [
    { id: 'all', name: 'All Products', icon: <FaLayerGroup /> },
    { id: 'panels', name: 'Control Panels', icon: <FaServer /> },
    { id: 'plc', name: 'PLC Systems', icon: <FaMicrochip /> },
    { id: 'sensors', name: 'Sensors', icon: <FaCogs /> },
    { id: 'drives', name: 'VFD Drives', icon: <FaFan /> },
  ];

  const filteredProducts = products.filter(p => {
    const matchesCategory = filter === 'all' || p.category === filter;
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          p.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-navy pt-24 pb-20 px-4 sm:px-6 lg:px-8 relative">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-full h-96 bg-gradient-to-b from-electric/5 to-transparent pointer-events-none"></div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-orbitron font-bold text-white mb-4"
          >
            OUR <span className="text-electric">PRODUCTS</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-gray-400 max-w-2xl mx-auto text-lg"
          >
            Industrial grade electrical components and automation solutions engineered for maximum reliability and performance.
          </motion.p>
        </div>

        {/* Search Bar in Products Page */}
        <div className="max-w-xl mx-auto mb-10">
          <div className="relative flex items-center">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter products by name or description..."
              className="w-full bg-navy/50 border border-electric/30 text-white rounded-full py-3 pl-6 pr-12 focus:outline-none focus:border-electric transition-colors shadow-[0_0_15px_rgba(0,212,255,0.1)]"
            />
            <span className="absolute right-4 text-gray-400 pointer-events-none">🔍</span>
          </div>
        </div>

        {/* Categories Filter */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setFilter(cat.id)}
              className={`flex items-center gap-2 px-6 py-3 rounded-full font-medium transition-all duration-300 ${
                filter === cat.id
                  ? 'bg-electric text-navy shadow-[0_0_15px_rgba(0,212,255,0.5)]'
                  : 'bg-steel text-gray-300 hover:bg-steel/80 border border-white/10 hover:border-electric/50'
              }`}
            >
              {cat.icon}
              {cat.name}
            </button>
          ))}
        </div>

        {/* Product Grid */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-electric"></div>
          </div>
        ) : filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredProducts.map((product, index) => (
              <motion.div
                key={product._id || index}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center bg-steel/50 border border-white/10 rounded-2xl p-12">
            <FaCogs className="text-6xl text-gray-500 mx-auto mb-4 opacity-50" />
            <h3 className="text-2xl font-bold text-white mb-2">No Products Found</h3>
            <p className="text-gray-400">
              {filter === 'all' 
                ? 'Your database is currently empty. Please run the seed.js script!' 
                : `No products available in the ${categories.find(c=>c.id === filter).name} category.`}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
