import { useEffect, useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { adminService } from '../services/admin.service';
import socket from '../services/socket';
import { 
  FaComments, 
  FaQuestionCircle, 
  FaUsers, 
  FaTrash, 
  FaSearch, 
  FaSignOutAlt, 
  FaTachometerAlt, 
  FaCog, 
  FaSpinner,
  FaBell,
  FaTimes
} from 'react-icons/fa';

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState({ users: 0, feedbacks: 0, enquiries: 0 });
  const [feedbacks, setFeedbacks] = useState([]);
  const [enquiries, setEnquiries] = useState([]);
  const [users, setUsers] = useState([]);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Real-time state
  const [socketConnected, setSocketConnected] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [badgeCounts, setBadgeCounts] = useState({ enquiries: 0, feedbacks: 0 });
  const [newItemIds, setNewItemIds] = useState(new Set());
  const pollIntervalRef = useRef(null);
  const notifIdRef = useRef(0);
  
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // ─── Data Loading ──────────────────────────────────────────
  const loadData = useCallback(async (showSpinner = true) => {
    if (showSpinner) setLoading(true);
    try {
      const [statsData, feedbacksData, enquiriesData, usersData] = await Promise.all([
        adminService.getStats(),
        adminService.getAllFeedbacks(),
        adminService.getAllEnquiries(),
        adminService.getAllUsers()
      ]);
      setStats(statsData);
      setFeedbacks(feedbacksData);
      setEnquiries(enquiriesData);
      setUsers(usersData);
      setError(null);
    } catch (err) {
      console.error("Error loading dashboard data:", err);
      if (showSpinner) {
        setError(err.response?.data?.error || err.message || "Failed to load dashboard data. Ensure backend is running.");
      }
    } finally {
      if (showSpinner) setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // ─── Notification Helpers ──────────────────────────────────
  const addNotification = useCallback((type, data) => {
    const id = ++notifIdRef.current;
    const notif = {
      id,
      type,
      title: type === 'enquiry' ? '📩 New Enquiry' : '💬 New Feedback',
      message: type === 'enquiry'
        ? `${data.name} sent an enquiry about ${data.product || 'General'}`
        : `${data.name} left ${data.rating ? data.rating + '★' : ''} feedback`,
      timestamp: new Date(),
    };
    setNotifications(prev => [notif, ...prev].slice(0, 20));

    // Auto-dismiss after 5 seconds
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 5000);
  }, []);

  const dismissNotification = useCallback((id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  // ─── Socket.IO Real-Time ───────────────────────────────────
  useEffect(() => {
    const handleConnect = () => {
      setSocketConnected(true);
      // Stop fallback polling when socket connects
      if (pollIntervalRef.current) {
        clearInterval(pollIntervalRef.current);
        pollIntervalRef.current = null;
      }
    };

    const handleDisconnect = () => {
      setSocketConnected(false);
      // Start fallback polling when socket disconnects
      if (!pollIntervalRef.current) {
        pollIntervalRef.current = setInterval(() => {
          loadData(false);
        }, 15000);
      }
    };

    const handleNewEnquiry = (enquiry) => {
      setEnquiries(prev => {
        // Avoid duplicates
        if (prev.some(e => e._id === enquiry._id)) return prev;
        return [enquiry, ...prev];
      });
      setStats(prev => ({ ...prev, enquiries: (prev.enquiries || 0) + 1 }));
      setBadgeCounts(prev => ({ ...prev, enquiries: prev.enquiries + 1 }));
      setNewItemIds(prev => new Set(prev).add(enquiry._id));
      addNotification('enquiry', enquiry);
    };

    const handleNewFeedback = (feedback) => {
      setFeedbacks(prev => {
        if (prev.some(f => f._id === feedback._id)) return prev;
        return [feedback, ...prev];
      });
      setStats(prev => ({ ...prev, feedbacks: (prev.feedbacks || 0) + 1 }));
      setBadgeCounts(prev => ({ ...prev, feedbacks: prev.feedbacks + 1 }));
      setNewItemIds(prev => new Set(prev).add(feedback._id));
      addNotification('feedback', feedback);
    };

    socket.on('connect', handleConnect);
    socket.on('disconnect', handleDisconnect);
    socket.on('new-enquiry', handleNewEnquiry);
    socket.on('new-feedback', handleNewFeedback);

    // Check initial connection state
    if (socket.connected) {
      setSocketConnected(true);
    } else {
      // Start polling as fallback until socket connects
      pollIntervalRef.current = setInterval(() => {
        loadData(false);
      }, 15000);
    }

    return () => {
      socket.off('connect', handleConnect);
      socket.off('disconnect', handleDisconnect);
      socket.off('new-enquiry', handleNewEnquiry);
      socket.off('new-feedback', handleNewFeedback);
      if (pollIntervalRef.current) {
        clearInterval(pollIntervalRef.current);
        pollIntervalRef.current = null;
      }
    };
  }, [loadData, addNotification]);

  // ─── Tab Switch — Clear Badges & Highlights ────────────────
  const handleTabSwitch = useCallback((tabId) => {
    setActiveTab(tabId);
    setSearchQuery('');
    if (tabId === 'enquiries') {
      setBadgeCounts(prev => ({ ...prev, enquiries: 0 }));
      // Clear new highlights for enquiry items after a short delay
      setTimeout(() => {
        setNewItemIds(prev => {
          const next = new Set(prev);
          enquiries.forEach(e => next.delete(e._id));
          return next;
        });
      }, 2000);
    } else if (tabId === 'feedbacks') {
      setBadgeCounts(prev => ({ ...prev, feedbacks: 0 }));
      setTimeout(() => {
        setNewItemIds(prev => {
          const next = new Set(prev);
          feedbacks.forEach(f => next.delete(f._id));
          return next;
        });
      }, 2000);
    }
  }, [enquiries, feedbacks]);

  // ─── CRUD Actions ──────────────────────────────────────────
  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleDeleteFeedback = async (id) => {
    if (!window.confirm('Are you sure you want to delete this feedback?')) return;
    try {
      await adminService.deleteFeedback(id);
      setFeedbacks(feedbacks.filter(f => f._id !== id));
      setStats(prev => ({ ...prev, feedbacks: Math.max(0, prev.feedbacks - 1) }));
      setNewItemIds(prev => { const next = new Set(prev); next.delete(id); return next; });
    } catch (err) {
      alert("Error deleting feedback: " + (err.response?.data?.error || err.message));
    }
  };

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
      setNewItemIds(prev => { const next = new Set(prev); next.delete(id); return next; });
    } catch (err) {
      alert("Error deleting enquiry: " + (err.response?.data?.error || err.message));
    }
  };

  // ─── Loading & Error States ────────────────────────────────
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
            onClick={() => loadData()}
            className="bg-electric text-navy font-bold px-6 py-2.5 rounded-lg hover:bg-white transition-colors"
          >
            Retry Connection
          </button>
        </div>
      </div>
    );
  }

  // ─── Sidebar tab config ────────────────────────────────────
  const sidebarTabs = [
    { id: 'overview', label: 'Overview', icon: FaTachometerAlt, badge: 0 },
    { id: 'enquiries', label: 'Enquiries', icon: FaQuestionCircle, badge: badgeCounts.enquiries },
    { id: 'feedbacks', label: 'Feedbacks', icon: FaComments, badge: badgeCounts.feedbacks },
  ];

  return (
    <div className="bg-navy min-h-screen text-white font-rajdhani flex flex-col md:flex-row relative overflow-hidden">
      {/* Background neon orb decor */}
      <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-electric/5 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-[400px] h-[400px] bg-electric/5 rounded-full blur-[100px] pointer-events-none"></div>

      {/* ═══ Toast Notifications ═══ */}
      <div className="fixed top-4 right-4 z-[100] flex flex-col gap-3 pointer-events-none" style={{ maxWidth: '380px' }}>
        <AnimatePresence>
          {notifications.map((notif) => (
            <motion.div
              key={notif.id}
              initial={{ opacity: 0, x: 80, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 80, scale: 0.9 }}
              transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              className={`pointer-events-auto bg-steel/95 backdrop-blur-xl border rounded-xl p-4 shadow-[0_0_30px_rgba(0,0,0,0.4)] cursor-pointer ${
                notif.type === 'enquiry'
                  ? 'border-amber-500/40 shadow-[0_0_20px_rgba(245,158,11,0.15)]'
                  : 'border-purple-500/40 shadow-[0_0_20px_rgba(168,85,247,0.15)]'
              }`}
              onClick={() => {
                dismissNotification(notif.id);
                handleTabSwitch(notif.type === 'enquiry' ? 'enquiries' : 'feedbacks');
              }}
            >
              <div className="flex items-start gap-3">
                <div className={`shrink-0 w-9 h-9 rounded-lg flex items-center justify-center text-sm ${
                  notif.type === 'enquiry'
                    ? 'bg-amber-500/20 text-amber-400'
                    : 'bg-purple-500/20 text-purple-400'
                }`}>
                  {notif.type === 'enquiry' ? <FaQuestionCircle /> : <FaComments />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-white">{notif.title}</p>
                  <p className="text-xs text-gray-400 mt-0.5 truncate">{notif.message}</p>
                </div>
                <button
                  onClick={(e) => { e.stopPropagation(); dismissNotification(notif.id); }}
                  className="shrink-0 text-gray-500 hover:text-white transition-colors"
                >
                  <FaTimes className="text-xs" />
                </button>
              </div>
              {/* Auto-dismiss progress bar */}
              <motion.div
                className={`h-0.5 rounded-full mt-3 ${
                  notif.type === 'enquiry' ? 'bg-amber-500/60' : 'bg-purple-500/60'
                }`}
                initial={{ width: '100%' }}
                animate={{ width: '0%' }}
                transition={{ duration: 5, ease: 'linear' }}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* ═══ Sidebar Navigation ═══ */}
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
            {sidebarTabs.map(tab => {
              const Icon = tab.icon;
              const active = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => handleTabSwitch(tab.id)}
                  className={`w-full flex items-center gap-4 px-4 py-3 rounded-lg text-base font-semibold transition-all relative ${
                    active 
                      ? 'bg-electric text-navy shadow-[0_0_15px_rgba(0,212,255,0.3)]' 
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Icon className="text-lg" />
                  <span>{tab.label}</span>
                  {/* Notification Badge */}
                  {tab.badge > 0 && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className={`absolute right-3 top-1/2 -translate-y-1/2 min-w-[20px] h-5 flex items-center justify-center rounded-full text-[10px] font-bold px-1.5 ${
                        active
                          ? 'bg-navy text-electric'
                          : 'bg-red-500 text-white shadow-[0_0_8px_rgba(239,68,68,0.5)]'
                      }`}
                    >
                      {tab.badge > 99 ? '99+' : tab.badge}
                    </motion.span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Connection Status & User Info */}
        <div>
          {/* Live Connection Indicator */}
          <div className="px-6 py-2 border-t border-white/5">
            <div className="flex items-center gap-2 text-[11px] uppercase tracking-widest">
              <span className={`w-2 h-2 rounded-full ${
                socketConnected 
                  ? 'bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.7)] animate-pulse' 
                  : 'bg-red-400 shadow-[0_0_6px_rgba(248,113,113,0.7)]'
              }`} />
              <span className={socketConnected ? 'text-emerald-400' : 'text-red-400'}>
                {socketConnected ? 'Live' : 'Polling'}
              </span>
            </div>
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
        </div>
      </aside>

      {/* ═══ Main Content Area ═══ */}
      <main className="flex-1 p-6 md:p-10 z-10 overflow-y-auto max-h-screen">
        <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-orbitron font-bold text-white uppercase tracking-wider">
              {activeTab} <span className="text-electric">Panel</span>
            </h1>
            <p className="text-sm text-gray-400">Manage your system variables, files, and queries.</p>
          </div>
          
          {/* Search */}
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
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[
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
                        <motion.p
                          key={item.count}
                          initial={{ scale: 1.3, color: '#00d4ff' }}
                          animate={{ scale: 1, color: '#ffffff' }}
                          transition={{ duration: 0.4 }}
                          className="text-4xl font-orbitron font-bold"
                        >
                          {item.count}
                        </motion.p>
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
                          <span className="text-gray-400">WebSocket Status</span>
                          <span className={`font-semibold flex items-center gap-1.5 ${socketConnected ? 'text-emerald-400' : 'text-red-400'}`}>
                            <span className={`w-2 h-2 rounded-full ${socketConnected ? 'bg-emerald-400 animate-pulse' : 'bg-red-400'}`}></span>
                            {socketConnected ? 'Connected' : 'Disconnected'}
                          </span>
                        </div>
                        <div className="flex justify-between py-1">
                          <span className="text-gray-400">Registered Admin</span>
                          <span className="text-electric font-semibold">{user?.email}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-6 pt-4 border-t border-white/5 flex gap-4">
                      <button 
                        onClick={() => handleTabSwitch('enquiries')}
                        className="flex-1 bg-steel border border-white/10 hover:border-electric/50 text-white font-semibold py-2.5 rounded-xl transition-all text-xs text-center uppercase tracking-wider"
                      >
                        Enquiries Queue
                      </button>
                      <button 
                        onClick={() => loadData()}
                        className="flex-1 bg-electric hover:bg-white text-navy font-bold py-2.5 rounded-xl transition-all text-xs text-center uppercase tracking-wider"
                      >
                        Refresh Console
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ═══ Enquiries Tab ═══ */}
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
                          .map((enq) => {
                            const isNew = newItemIds.has(enq._id);
                            return (
                              <motion.tr
                                key={enq._id}
                                initial={isNew ? { backgroundColor: 'rgba(245,158,11,0.15)' } : false}
                                animate={{ backgroundColor: 'rgba(245,158,11,0)' }}
                                transition={{ duration: 3 }}
                                className={`border-b border-white/5 hover:bg-white/5 transition-colors ${
                                  isNew ? 'border-l-2 border-l-amber-400' : ''
                                }`}
                              >
                                <td className="py-4 px-4 text-gray-400 whitespace-nowrap">
                                  {new Date(enq.createdAt).toLocaleDateString()}
                                  {isNew && (
                                    <span className="ml-2 inline-block bg-amber-500/20 text-amber-400 text-[10px] font-bold px-1.5 py-0.5 rounded uppercase">New</span>
                                  )}
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
                              </motion.tr>
                            );
                          })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {/* ═══ Feedbacks Tab ═══ */}
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
                          .map((fb) => {
                            const isNew = newItemIds.has(fb._id);
                            return (
                              <motion.tr
                                key={fb._id}
                                initial={isNew ? { backgroundColor: 'rgba(168,85,247,0.15)' } : false}
                                animate={{ backgroundColor: 'rgba(168,85,247,0)' }}
                                transition={{ duration: 3 }}
                                className={`border-b border-white/5 hover:bg-white/5 transition-colors ${
                                  isNew ? 'border-l-2 border-l-purple-400' : ''
                                }`}
                              >
                                <td className="py-4 px-4 text-gray-400 whitespace-nowrap">
                                  {new Date(fb.createdAt).toLocaleDateString()}
                                  {isNew && (
                                    <span className="ml-2 inline-block bg-purple-500/20 text-purple-400 text-[10px] font-bold px-1.5 py-0.5 rounded uppercase">New</span>
                                  )}
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
                              </motion.tr>
                            );
                          })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}
