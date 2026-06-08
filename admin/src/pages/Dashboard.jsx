import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { adminService } from '../services/admin.service';
import { 
  FaBoxOpen, 
  FaComments, 
  FaQuestionCircle, 
  FaUsers, 
  FaPlus, 
  FaEdit, 
  FaTrash, 
  FaTimes, 
  FaSearch, 
  FaSignOutAlt, 
  FaTachometerAlt, 
  FaCog, 
  FaPlusCircle, 
  FaCheck, 
  FaSpinner, 
  FaArrowLeft, 
  FaFolder, 
  FaDollarSign,
  FaFileAlt
} from 'react-icons/fa';

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState({ products: 0, users: 0, feedbacks: 0, enquiries: 0 });
  const [products, setProducts] = useState([]);
  const [feedbacks, setFeedbacks] = useState([]);
  const [enquiries, setEnquiries] = useState([]);
  const [users, setUsers] = useState([]);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // Product CRUD states
  const [showProductModal, setShowProductModal] = useState(false); // false | 'create' | 'edit'
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [productForm, setProductForm] = useState({
    name: '',
    description: '',
    price: '',
    category: 'panels',
    imageUrl: '',
    specifications: [{ key: '', value: '' }],
    stock: 0,
    isActive: true
  });

  const categoryLabels = {
    panels: 'Control Panels',
    plc: 'PLC Systems',
    sensors: 'Sensors',
    drives: 'VFD Drives',
    components: 'Components'
  };

  const loadData = async () => {
    setLoading(true);
    try {
      const [statsData, productsData, feedbacksData, enquiriesData, usersData] = await Promise.all([
        adminService.getStats(),
        adminService.getAllProducts(),
        adminService.getAllFeedbacks(),
        adminService.getAllEnquiries(),
        adminService.getAllUsers()
      ]);
      setStats(statsData);
      setProducts(productsData);
      setFeedbacks(feedbacksData);
      setEnquiries(enquiriesData);
      setUsers(usersData);
      setError(null);
    } catch (err) {
      console.error("Error loading dashboard data:", err);
      setError(err.response?.data?.error || err.message || "Failed to load dashboard data. Ensure backend is running.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Feedback Actions
  const handleDeleteFeedback = async (id) => {
    if (!window.confirm('Are you sure you want to delete this feedback?')) return;
    try {
      await adminService.deleteFeedback(id);
      setFeedbacks(feedbacks.filter(f => f._id !== id));
      setStats(prev => ({ ...prev, feedbacks: Math.max(0, prev.feedbacks - 1) }));
    } catch (err) {
      alert("Error deleting feedback: " + (err.response?.data?.error || err.message));
    }
  };

  // Enquiry Actions
  const handleUpdateEnquiryStatus = async (id, status) => {
    try {
      const updated = await adminService.updateEnquiryStatus(id, status);
      setEnquiries(enquiries.map(e => e._id === id ? updated : e));
    } catch (err) {
      alert("Error updating enquiry status: " + (err.response?.data?.error || err.message));
    }
  };

  const handleDeleteEnquiry = async (id) => {
    if (!window.confirm('Are you sure you want to delete this enquiry?')) return;
    try {
      await adminService.deleteEnquiry(id);
      setEnquiries(enquiries.filter(e => e._id !== id));
      setStats(prev => ({ ...prev, enquiries: Math.max(0, prev.enquiries - 1) }));
    } catch (err) {
      alert("Error deleting enquiry: " + (err.response?.data?.error || err.message));
    }
  };

  // Product CRUD Handlers
  const openCreateModal = () => {
    setSelectedProduct(null);
    setProductForm({
      name: '',
      description: '',
      price: '',
      category: 'panels',
      imageUrl: '',
      specifications: [{ key: '', value: '' }],
      stock: 0,
      isActive: true
    });
    setShowProductModal('create');
  };

  const openEditModal = (product) => {
    setSelectedProduct(product);
    setProductForm({
      name: product.name || '',
      description: product.description || '',
      price: product.price || '',
      category: product.category || 'panels',
      imageUrl: (product.images && product.images[0]) || '',
      specifications: product.specifications && product.specifications.length > 0 
        ? product.specifications.map(s => ({ key: s.key, value: s.value }))
        : [{ key: '', value: '' }],
      stock: product.stock ?? 0,
      isActive: product.isActive ?? true
    });
    setShowProductModal('edit');
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    try {
      await adminService.deleteProduct(id);
      setProducts(products.filter(p => p._id !== id));
      setStats(prev => ({ ...prev, products: Math.max(0, prev.products - 1) }));
    } catch (err) {
      alert("Error deleting product: " + (err.response?.data?.error || err.message));
    }
  };

  const handleAddSpecField = () => {
    setProductForm(prev => ({
      ...prev,
      specifications: [...prev.specifications, { key: '', value: '' }]
    }));
  };

  const handleRemoveSpecField = (index) => {
    setProductForm(prev => ({
      ...prev,
      specifications: prev.specifications.filter((_, i) => i !== index)
    }));
  };

  const handleSpecChange = (index, field, value) => {
    const updatedSpecs = [...productForm.specifications];
    updatedSpecs[index][field] = value;
    setProductForm(prev => ({
      ...prev,
      specifications: updatedSpecs
    }));
  };

  const handleSubmitProduct = async (e) => {
    e.preventDefault();
    if (!productForm.name.trim()) return alert("Product Name is required");
    
    const formattedData = {
      ...productForm,
      price: Number(productForm.price) || 0,
      stock: Number(productForm.stock) || 0,
      images: productForm.imageUrl ? [productForm.imageUrl] : [],
      specifications: productForm.specifications.filter(spec => spec.key.trim() && spec.value.trim())
    };

    try {
      if (showProductModal === 'create') {
        const created = await adminService.createProduct(formattedData);
        setProducts([created, ...products]);
        setStats(prev => ({ ...prev, products: prev.products + 1 }));
      } else {
        const updated = await adminService.updateProduct(selectedProduct._id, formattedData);
        setProducts(products.map(p => p._id === selectedProduct._id ? updated : p));
      }
      setShowProductModal(false);
    } catch (err) {
      alert("Error saving product: " + (err.response?.data?.error || err.message));
    }
  };

  if (loading) {
    return (
      <div className="bg-navy min-h-screen text-white p-10 flex flex-col items-center justify-center font-rajdhani">
        <FaSpinner className="animate-spin text-electric text-5xl mb-4" />
        <div className="text-xl tracking-wider uppercase font-orbitron">Loading Admin Suite...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-navy min-h-screen text-white p-10 flex flex-col items-center justify-center font-rajdhani">
        <div className="border border-red-500/30 bg-red-500/10 rounded-2xl p-8 max-w-md text-center">
          <h2 className="text-red-400 font-orbitron font-bold text-2xl mb-4">Connection Failed</h2>
          <p className="text-gray-400 text-sm leading-relaxed mb-6">{error}</p>
          <button 
            onClick={loadData}
            className="bg-electric text-navy font-bold px-6 py-2.5 rounded-lg hover:bg-white transition-colors"
          >
            Retry Connection
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-navy min-h-screen text-white font-rajdhani flex flex-col md:flex-row relative overflow-hidden">
      {/* Background neon orb decor */}
      <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-electric/5 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-[400px] h-[400px] bg-electric/5 rounded-full blur-[100px] pointer-events-none"></div>

      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 bg-steel/65 backdrop-blur-md border-b md:border-b-0 md:border-r border-white/10 flex flex-col justify-between shrink-0 z-20">
        <div>
          {/* Logo / Brand */}
          <div className="p-6 border-b border-white/10">
            <h2 className="text-2xl font-orbitron font-bold tracking-wider text-white">
              PRAJA <span className="text-electric">ELECTRIC</span>
            </h2>
            <p className="text-xs text-gray-400 uppercase tracking-widest mt-1">Control Console</p>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1">
            {[
              { id: 'overview', label: 'Overview', icon: FaTachometerAlt },
              { id: 'products', label: 'Products', icon: FaBoxOpen },
              { id: 'enquiries', label: 'Enquiries', icon: FaQuestionCircle },
              { id: 'feedbacks', label: 'Feedbacks', icon: FaComments },
            ].map(tab => {
              const Icon = tab.icon;
              const active = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => { setActiveTab(tab.id); setSearchQuery(''); }}
                  className={`w-full flex items-center gap-4 px-4 py-3 rounded-lg text-base font-semibold transition-all ${
                    active 
                      ? 'bg-electric text-navy shadow-[0_0_15px_rgba(0,212,255,0.3)]' 
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Icon className="text-lg" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* User Info & Logout */}
        <div className="p-4 border-t border-white/10 bg-black/10">
          <div className="flex items-center justify-between">
            <div className="truncate pr-2">
              <p className="text-sm font-semibold text-white truncate">{user?.name || 'Administrator'}</p>
              <p className="text-xs text-gray-500 truncate">{user?.email}</p>
            </div>
            <button
              onClick={handleLogout}
              title="Logout"
              className="p-2.5 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white transition-all"
            >
              <FaSignOutAlt />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-6 md:p-10 z-10 overflow-y-auto max-h-screen">
        <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-orbitron font-bold text-white uppercase tracking-wider">
              {activeTab} <span className="text-electric">Panel</span>
            </h1>
            <p className="text-sm text-gray-400">Manage your system variables, files, and queries.</p>
          </div>
          
          {/* Action or Search */}
          {activeTab !== 'overview' && (
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <div className="relative flex-1 sm:w-64">
                <input
                  type="text"
                  placeholder={`Search ${activeTab}...`}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-steel/50 border border-white/10 text-white rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-electric transition-colors"
                />
                <FaSearch className="absolute left-3.5 top-3 text-gray-400 text-sm" />
              </div>
              {activeTab === 'products' && (
                <button
                  onClick={openCreateModal}
                  className="bg-electric text-navy font-bold px-4 py-2 rounded-lg hover:bg-white transition-all flex items-center gap-2 text-sm whitespace-nowrap shadow-[0_0_15px_rgba(0,212,255,0.2)]"
                >
                  <FaPlus /> Add Product
                </button>
              )}
            </div>
          )}
        </header>

        {/* Tab Switcher Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.25 }}
          >
            {activeTab === 'overview' && (
              <div className="space-y-8">
                {/* Stats Cards Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {[
                    { label: 'Products In Catalog', count: stats.products, icon: FaBoxOpen, color: 'text-electric', bg: 'from-electric/10' },
                    { label: 'Registered Accounts', count: stats.users, icon: FaUsers, color: 'text-emerald-400', bg: 'from-emerald-500/10' },
                    { label: 'Customer Enquiries', count: stats.enquiries, icon: FaQuestionCircle, color: 'text-amber-400', bg: 'from-amber-500/10' },
                    { label: 'User Feedbacks', count: stats.feedbacks, icon: FaComments, color: 'text-purple-400', bg: 'from-purple-500/10' },
                  ].map((item, idx) => (
                    <div 
                      key={idx} 
                      className={`bg-steel/50 border border-white/10 rounded-2xl p-6 flex items-center justify-between bg-gradient-to-br ${item.bg} to-transparent shadow-lg`}
                    >
                      <div>
                        <p className="text-gray-400 text-sm font-medium uppercase tracking-wider mb-1">{item.label}</p>
                        <p className="text-4xl font-orbitron font-bold text-white">{item.count}</p>
                      </div>
                      <item.icon className={`${item.color} text-4xl opacity-80`} />
                    </div>
                  ))}
                </div>

                {/* Dashboard Sub-content */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Recent Users List */}
                  <div className="bg-steel/50 border border-white/10 rounded-2xl p-6 shadow-lg">
                    <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2 border-b border-white/10 pb-3">
                      <FaUsers className="text-electric" /> Recent Registrations
                    </h3>
                    {users.length === 0 ? (
                      <p className="text-gray-400 text-sm">No registered users found.</p>
                    ) : (
                      <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2">
                        {users.slice(0, 5).map(u => (
                          <div key={u._id} className="flex justify-between items-center bg-black/10 border border-white/5 rounded-xl p-3 hover:border-electric/30 transition-colors">
                            <div>
                              <p className="text-sm font-semibold text-white">{u.name}</p>
                              <p className="text-xs text-gray-500">{u.email}</p>
                            </div>
                            <span className={`text-xs px-2.5 py-1 rounded-full uppercase tracking-wider ${
                              u.role === 'admin' ? 'bg-electric/10 text-electric border border-electric/30' : 'bg-white/10 text-gray-400'
                            }`}>
                              {u.role}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* System Overview Details */}
                  <div className="bg-steel/50 border border-white/10 rounded-2xl p-6 shadow-lg flex flex-col justify-between">
                    <div>
                      <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2 border-b border-white/10 pb-3">
                        <FaCog className="text-electric" /> Control Server Status
                      </h3>
                      <div className="space-y-3 text-sm">
                        <div className="flex justify-between py-1 border-b border-white/5">
                          <span className="text-gray-400">Database Engine</span>
                          <span className="text-emerald-400 font-semibold flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span> MongoDB Connected
                          </span>
                        </div>
                        <div className="flex justify-between py-1 border-b border-white/5">
                          <span className="text-gray-400">API Gateway Port</span>
                          <span className="text-white font-medium">5000</span>
                        </div>
                        <div className="flex justify-between py-1 border-b border-white/5">
                          <span className="text-gray-400">Node Environment</span>
                          <span className="text-white font-medium">Development</span>
                        </div>
                        <div className="flex justify-between py-1">
                          <span className="text-gray-400">Registered Admin</span>
                          <span className="text-electric font-semibold">{user?.email}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-6 pt-4 border-t border-white/5 flex gap-4">
                      <button 
                        onClick={() => { setActiveTab('enquiries'); }}
                        className="flex-1 bg-steel border border-white/10 hover:border-electric/50 text-white font-semibold py-2.5 rounded-xl transition-all text-xs text-center uppercase tracking-wider"
                      >
                        Enquiries Queue
                      </button>
                      <button 
                        onClick={loadData}
                        className="flex-1 bg-electric hover:bg-white text-navy font-bold py-2.5 rounded-xl transition-all text-xs text-center uppercase tracking-wider"
                      >
                        Refresh Console
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Products Tab */}
            {activeTab === 'products' && (
              <div className="bg-steel/40 border border-white/10 rounded-2xl p-6 shadow-lg">
                {products.length === 0 ? (
                  <div className="text-center py-10 text-gray-400">
                    <p className="mb-4">No products found. Start by listing a new product.</p>
                    <button 
                      onClick={openCreateModal}
                      className="bg-electric text-navy font-bold px-5 py-2 rounded-lg hover:bg-white transition-colors text-sm"
                    >
                      Create First Product
                    </button>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="border-b border-white/10 text-gray-400 text-sm tracking-wider uppercase">
                          <th className="py-4 px-4 font-semibold">Image</th>
                          <th className="py-4 px-4 font-semibold">Product Name</th>
                          <th className="py-4 px-4 font-semibold">Category</th>
                          <th className="py-4 px-4 font-semibold">Price</th>
                          <th className="py-4 px-4 font-semibold">Stock</th>
                          <th className="py-4 px-4 font-semibold">Status</th>
                          <th className="py-4 px-4 font-semibold text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="text-sm">
                        {products
                          .filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.category.toLowerCase().includes(searchQuery.toLowerCase()))
                          .map((prod) => (
                            <tr key={prod._id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                              <td className="py-3 px-4">
                                <img 
                                  src={prod.images?.[0] || 'https://images.unsplash.com/photo-1581092335397-9583eb92d232?auto=format&fit=crop&q=80&w=100'} 
                                  alt="" 
                                  className="w-12 h-12 object-cover rounded-lg bg-navy border border-white/10"
                                  onError={(e) => { e.target.onerror = null; e.target.src = 'https://images.unsplash.com/photo-1581092335397-9583eb92d232?auto=format&fit=crop&q=80&w=100'; }}
                                />
                              </td>
                              <td className="py-3 px-4 font-semibold text-white text-base">{prod.name}</td>
                              <td className="py-3 px-4 text-gray-300 uppercase text-xs tracking-wider">
                                <span className="bg-steel border border-white/10 px-2 py-1 rounded">
                                  {categoryLabels[prod.category] || prod.category}
                                </span>
                              </td>
                              <td className="py-3 px-4 text-electric font-semibold text-base">₹{prod.price?.toLocaleString('en-IN')}</td>
                              <td className="py-3 px-4 text-gray-300">{prod.stock} items</td>
                              <td className="py-3 px-4">
                                <span className={`inline-flex items-center gap-1 text-xs px-2.5 py-0.5 rounded-full ${
                                  prod.isActive ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'
                                }`}>
                                  {prod.isActive ? 'Active' : 'Draft'}
                                </span>
                              </td>
                              <td className="py-3 px-4 text-right">
                                <div className="flex justify-end gap-2">
                                  <button
                                    onClick={() => openEditModal(prod)}
                                    className="p-2 rounded bg-electric/10 text-electric hover:bg-electric hover:text-navy transition-all"
                                    title="Edit Product"
                                  >
                                    <FaEdit />
                                  </button>
                                  <button
                                    onClick={() => handleDeleteProduct(prod._id)}
                                    className="p-2 rounded bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white transition-all"
                                    title="Delete Product"
                                  >
                                    <FaTrash />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {/* Enquiries Tab */}
            {activeTab === 'enquiries' && (
              <div className="bg-steel/40 border border-white/10 rounded-2xl p-6 shadow-lg">
                {enquiries.length === 0 ? (
                  <p className="text-gray-400 py-6 text-center">No contact enquiries received yet.</p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="border-b border-white/10 text-gray-400 text-sm tracking-wider uppercase">
                          <th className="py-4 px-4 font-semibold">Date</th>
                          <th className="py-4 px-4 font-semibold">Client Info</th>
                          <th className="py-4 px-4 font-semibold">Interest</th>
                          <th className="py-4 px-4 font-semibold">Message</th>
                          <th className="py-4 px-4 font-semibold">Status</th>
                          <th className="py-4 px-4 font-semibold text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="text-sm">
                        {enquiries
                          .filter(e => e.name.toLowerCase().includes(searchQuery.toLowerCase()) || e.email.toLowerCase().includes(searchQuery.toLowerCase()) || e.message.toLowerCase().includes(searchQuery.toLowerCase()))
                          .map((enq) => (
                            <tr key={enq._id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                              <td className="py-4 px-4 text-gray-400 whitespace-nowrap">
                                {new Date(enq.createdAt).toLocaleDateString()}
                              </td>
                              <td className="py-4 px-4">
                                <p className="font-semibold text-white">{enq.name}</p>
                                <p className="text-electric text-xs">
                                  <a href={`mailto:${enq.email}`}>{enq.email}</a>
                                </p>
                                {enq.phone && <p className="text-gray-500 text-xs">{enq.phone}</p>}
                              </td>
                              <td className="py-4 px-4">
                                <span className="text-white bg-steel border border-white/10 px-2 py-1 rounded text-xs uppercase">
                                  {enq.product || 'General'}
                                </span>
                              </td>
                              <td className="py-4 px-4 text-gray-300 min-w-[200px] max-w-sm leading-relaxed">
                                {enq.message}
                              </td>
                              <td className="py-4 px-4">
                                <select
                                  value={enq.status || 'new'}
                                  onChange={(e) => handleUpdateEnquiryStatus(enq._id, e.target.value)}
                                  className={`border rounded-lg px-2.5 py-1 text-xs font-semibold focus:outline-none focus:border-electric transition-colors bg-navy ${
                                    enq.status === 'new' 
                                      ? 'text-electric border-electric/30' 
                                      : enq.status === 'contacted'
                                      ? 'text-amber-400 border-amber-500/30'
                                      : 'text-green-400 border-green-500/30'
                                  }`}
                                >
                                  <option value="new">🆕 New</option>
                                  <option value="contacted">📞 Contacted</option>
                                  <option value="resolved">✅ Resolved</option>
                                </select>
                              </td>
                              <td className="py-4 px-4 text-right">
                                <button
                                  onClick={() => handleDeleteEnquiry(enq._id)}
                                  className="p-2 rounded bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white transition-all text-sm"
                                  title="Delete Enquiry"
                                >
                                  <FaTrash />
                                </button>
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {/* Feedbacks Tab */}
            {activeTab === 'feedbacks' && (
              <div className="bg-steel/40 border border-white/10 rounded-2xl p-6 shadow-lg">
                {feedbacks.length === 0 ? (
                  <p className="text-gray-400 py-6 text-center">No feedbacks received yet.</p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="border-b border-white/10 text-gray-400 text-sm tracking-wider uppercase">
                          <th className="py-4 px-4 font-semibold">Date</th>
                          <th className="py-4 px-4 font-semibold">User Info</th>
                          <th className="py-4 px-4 font-semibold">Rating</th>
                          <th className="py-4 px-4 font-semibold">Message</th>
                          <th className="py-4 px-4 font-semibold text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="text-sm">
                        {feedbacks
                          .filter(f => f.name.toLowerCase().includes(searchQuery.toLowerCase()) || f.email.toLowerCase().includes(searchQuery.toLowerCase()) || f.message.toLowerCase().includes(searchQuery.toLowerCase()))
                          .map((fb) => (
                            <tr key={fb._id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                              <td className="py-4 px-4 text-gray-400 whitespace-nowrap">
                                {new Date(fb.createdAt).toLocaleDateString()}
                              </td>
                              <td className="py-4 px-4">
                                <p className="font-semibold text-white">{fb.name}</p>
                                <p className="text-electric text-xs">
                                  <a href={`mailto:${fb.email}`}>{fb.email}</a>
                                </p>
                              </td>
                              <td className="py-4 px-4 whitespace-nowrap">
                                <span className="text-gold tracking-widest text-base">
                                  {'★'.repeat(fb.rating)}{'☆'.repeat(5 - fb.rating)}
                                </span>
                              </td>
                              <td className="py-4 px-4 text-gray-300 min-w-[200px] leading-relaxed">
                                {fb.message}
                              </td>
                              <td className="py-4 px-4 text-right">
                                <button
                                  onClick={() => handleDeleteFeedback(fb._id)}
                                  className="p-2 rounded bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white transition-all text-sm"
                                  title="Delete Feedback"
                                >
                                  <FaTrash />
                                </button>
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Product Creator/Editor Dialog Modal */}
      <AnimatePresence>
        {showProductModal && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-steel border border-white/10 w-full max-w-3xl rounded-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
            >
              {/* Modal Header */}
              <header className="p-6 border-b border-white/10 flex justify-between items-center bg-black/10 shrink-0">
                <h3 className="text-xl font-orbitron font-bold text-white uppercase tracking-wider">
                  {showProductModal === 'create' ? 'Add New Product' : 'Edit Product'}
                </h3>
                <button 
                  onClick={() => setShowProductModal(false)}
                  className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-all"
                >
                  <FaTimes />
                </button>
              </header>

              {/* Modal Form Content */}
              <form onSubmit={handleSubmitProduct} className="flex-1 overflow-y-auto p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Product Name */}
                  <div className="space-y-2">
                    <label className="text-xs uppercase tracking-wider text-gray-400 font-semibold block">Product Name *</label>
                    <input
                      type="text"
                      required
                      value={productForm.name}
                      onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                      placeholder="e.g. Siemens PLC S7-1200"
                      className="w-full bg-navy border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-electric text-sm"
                    />
                  </div>

                  {/* Product Category */}
                  <div className="space-y-2">
                    <label className="text-xs uppercase tracking-wider text-gray-400 font-semibold block">Category *</label>
                    <select
                      value={productForm.category}
                      onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                      className="w-full bg-navy border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-electric text-sm"
                    >
                      {Object.entries(categoryLabels).map(([val, name]) => (
                        <option key={val} value={val}>{name}</option>
                      ))}
                    </select>
                  </div>

                  {/* Pricing (INR) */}
                  <div className="space-y-2">
                    <label className="text-xs uppercase tracking-wider text-gray-400 font-semibold block">Price (INR) *</label>
                    <input
                      type="number"
                      required
                      min="0"
                      value={productForm.price}
                      onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                      placeholder="e.g. 15000"
                      className="w-full bg-navy border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-electric text-sm"
                    />
                  </div>

                  {/* Inventory Stock */}
                  <div className="space-y-2">
                    <label className="text-xs uppercase tracking-wider text-gray-400 font-semibold block">Stock Qty *</label>
                    <input
                      type="number"
                      required
                      min="0"
                      value={productForm.stock}
                      onChange={(e) => setProductForm({ ...productForm, stock: e.target.value })}
                      className="w-full bg-navy border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-electric text-sm"
                    />
                  </div>
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-wider text-gray-400 font-semibold block">Product Description</label>
                  <textarea
                    rows="3"
                    value={productForm.description}
                    onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                    placeholder="Provide technical descriptors, scope, and product applications..."
                    className="w-full bg-navy border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-electric text-sm"
                  />
                </div>

                {/* Image URL */}
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-wider text-gray-400 font-semibold block">Image URL</label>
                  <input
                    type="url"
                    value={productForm.imageUrl}
                    onChange={(e) => setProductForm({ ...productForm, imageUrl: e.target.value })}
                    placeholder="https://images.unsplash.com/... or relative path"
                    className="w-full bg-navy border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-electric text-sm"
                  />
                </div>

                {/* Dynamic Specifications */}
                <div className="space-y-4">
                  <div className="flex justify-between items-center border-b border-white/10 pb-2">
                    <label className="text-xs uppercase tracking-wider text-gray-400 font-semibold">Technical Specifications</label>
                    <button
                      type="button"
                      onClick={handleAddSpecField}
                      className="text-electric hover:text-white transition-all text-xs font-semibold flex items-center gap-1.5"
                    >
                      <FaPlusCircle /> Add Spec Row
                    </button>
                  </div>

                  {productForm.specifications.length === 0 ? (
                    <p className="text-xs text-gray-500">No specifications defined for this product.</p>
                  ) : (
                    <div className="space-y-2 max-h-[180px] overflow-y-auto pr-1">
                      {productForm.specifications.map((spec, i) => (
                        <div key={i} className="flex gap-2 items-center">
                          <input
                            type="text"
                            placeholder="Specification Key (e.g., Voltage)"
                            value={spec.key}
                            onChange={(e) => handleSpecChange(i, 'key', e.target.value)}
                            className="flex-1 bg-navy border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-electric text-xs"
                          />
                          <input
                            type="text"
                            placeholder="Value (e.g., 230V AC)"
                            value={spec.value}
                            onChange={(e) => handleSpecChange(i, 'value', e.target.value)}
                            className="flex-1 bg-navy border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-electric text-xs"
                          />
                          <button
                            type="button"
                            onClick={() => handleRemoveSpecField(i)}
                            className="p-2 bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white rounded-lg transition-all text-xs"
                          >
                            <FaTrash />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Status Options */}
                <div className="flex items-center gap-4 bg-black/10 p-3 rounded-xl border border-white/5">
                  <span className="text-xs uppercase tracking-wider text-gray-400 font-semibold">Availability Status:</span>
                  <label className="flex items-center gap-2 text-sm cursor-pointer">
                    <input
                      type="checkbox"
                      checked={productForm.isActive}
                      onChange={(e) => setProductForm({ ...productForm, isActive: e.target.checked })}
                      className="accent-electric"
                    />
                    <span>Visible in Product Catalog (Active)</span>
                  </label>
                </div>

                {/* Modal Actions Footer */}
                <footer className="pt-4 border-t border-white/10 flex justify-end gap-3 shrink-0">
                  <button
                    type="button"
                    onClick={() => setShowProductModal(false)}
                    className="bg-navy border border-white/10 hover:bg-white/5 text-white font-semibold px-5 py-2.5 rounded-xl transition-all text-sm"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-electric hover:bg-white text-navy font-bold px-6 py-2.5 rounded-xl transition-all text-sm shadow-[0_0_15px_rgba(0,212,255,0.2)] flex items-center gap-2"
                  >
                    <FaCheck /> {showProductModal === 'create' ? 'Create Product' : 'Save Changes'}
                  </button>
                </footer>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
