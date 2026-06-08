import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaBolt, 
  FaCheckCircle, 
  FaArrowLeft, 
  FaCogs, 
  FaIndustry, 
  FaFileAlt, 
  FaPhoneAlt, 
  FaEnvelope, 
  FaBuilding, 
  FaUser, 
  FaPaperPlane,
  FaShieldAlt,
  FaWrench,
  FaRegLightbulb,
  FaInfoCircle
} from 'react-icons/fa';

const panelsData = {
  'lt-panel': {
    title: 'LT Panel',
    desc: 'Low Tension Power Distribution Switchgear',
    longDesc: 'Engineered to distribute low-voltage power (up to 1000V AC) safely and efficiently across industrial and commercial installations. Perfect for main switchboards, sub-switchboards, and motor control circuits. The panel has been built using a modular framework with high customization support to match any layout or load requirement.',
    tagline: 'Reliable Low-Tension Power Distribution for Heavy Industrial Plants',
    image: '/products/panel-1.png',
    features: [
      'Up to 1000V AC rated insulation voltage for robust safety margins.',
      'Extensible modular design allowing easy future capacity scaling.',
      'Premium integrated Air Circuit Breakers (ACB) & MCCBs for short-circuit protection.',
      'Custom silver/tin-plated electrolytic copper busbars for minimal resistance.',
      'Fully compartmentalized design (Form 4b option) to protect operators.',
      'Anti-corrosion powder coating with custom IP protection grades.'
    ],
    specs: [
      { key: 'Rated Voltage', value: '415V AC / 50Hz' },
      { key: 'Rated Insulation Voltage', value: '1000V' },
      { key: 'Rated Current', value: 'Up to 6300A' },
      { key: 'Short-circuit Withstand', value: 'Up to 85kA / 1 sec' },
      { key: 'Protection Degree', value: 'IP42 / IP54 / IP55 / IP65' },
      { key: 'Busbar Material', value: '99.9% Pure Electrolytic Copper / Aluminum' },
      { key: 'Standard Compliance', value: 'IEC 61439-1 & 2, IS 8623' },
      { key: 'Operating Temp', value: '-5°C to 50°C' }
    ],
    apps: [
      'Steel Rolling Mills & Heavy Industry',
      'Large Scale Commercial Complexes & Malls',
      'Automotive Manufacturing Facilities',
      'Critical Data Centers & Cloud Farms',
      'Chemical & Petrochemical Processing Units'
    ]
  },
  'mcc-panel': {
    title: 'MCC Panel',
    desc: 'Motor Control Center',
    longDesc: 'Designed to house all motor control units, including DOL starters, Star-Delta starters, variable frequency drives (VFDs), soft starters, and programmable controllers. Offers centralized control, enhanced safety, and seamless integration with SCADA/DCS systems. The compartmental design keeps your processes insulated from starter faults.',
    tagline: 'Intelligent Motor Management & Protection Solutions',
    image: '/products/panel-2.png',
    features: [
      'Draw-out or fully-fixed type modular design for quick replacement and minimal downtime.',
      'Centralized mechanical/electrical interlocking systems.',
      'High-reliability protection relays with thermal, overcurrent, and phase-loss sensing.',
      'Seamless automation integration using Modbus, Profibus, or Ethernet communication.',
      'Individual drawer-type compartmental isolation preventing arc-fault propagation.',
      'Neat control terminal layout with transparent acrylic protection guards.'
    ],
    specs: [
      { key: 'Rated Voltage', value: '415V AC' },
      { key: 'Control Voltage', value: '110V AC / 24V DC / 230V AC' },
      { key: 'Starter Configuration', value: 'DOL, Star-Delta, VFD, Soft Starters' },
      { key: 'IP Rating', value: 'IP52 / IP54 / IP55' },
      { key: 'Busbar Current Rating', value: 'Up to 3200A' },
      { key: 'Enclosure Material', value: 'High-quality CRCA steel sheet (up to 2mm thickness)' },
      { key: 'Drawer Isolation', value: 'Fully test, service, and isolated positions' },
      { key: 'Cable Entry', value: 'Top or Bottom (Removable gland plates)' }
    ],
    apps: [
      'Cement & Concrete Batching Industries',
      'Water Treatment & Sewage Pumping Plants',
      'Paper & Pulp Mills',
      'Bulk Material Handling & Conveyor Networks',
      'Power Plants & Boiler Feed Control Systems'
    ]
  },
  'control-panel': {
    title: 'Control Panel',
    desc: 'Automation Control Systems',
    longDesc: 'Custom-engineered automation panels utilizing high-performance PLCs, HMIs, and intelligent sensors to streamline complex industrial processes. Features advanced diagnostic capabilities and real-time remote monitoring. Ideal for machinery OEMs and continuous-process automation plants.',
    tagline: 'Dynamic Automation & Precision PLC-SCADA Control Panels',
    image: '/products/panel-3.png',
    features: [
      'Equipped with leading international PLC brands (Siemens, Rockwell, Delta, Omron, ABB).',
      'Custom programmed HMI screens (4" to 15" TFT color touch) for user-friendly operation.',
      'Highly precise PID control loop wiring for pressure, level, flow, and temperature systems.',
      'Surge protective devices (SPD) protecting critical electronics from mains spikes.',
      'Clean wiring layout using premium wire ducts, DIN rails, and clearly printed ferrules.',
      'Active climate control with dynamic exhaust fans or air conditioning units.'
    ],
    specs: [
      { key: 'Controller Brands', value: 'Siemens S7-1200/1500, Allen-Bradley Micro800, Omron, Delta' },
      { key: 'HMI Interfaces', value: 'Modbus TCP/RTU, Profinet, EtherNet/IP, RS485' },
      { key: 'System Voltage', value: '240V AC / 24V DC control circuits' },
      { key: 'Enclosure Type', value: 'Double door CRCA / Stainless Steel (SS304/SS316) for corrosive settings' },
      { key: 'Standard Compliance', value: 'CE and UL 508A compliant wiring architecture' },
      { key: 'IP Protection', value: 'IP54 / IP55 / IP66' },
      { key: 'Mounting Style', value: 'Floor standing / Wall mounting / Pedestal options' },
      { key: 'Cooling System', value: 'Thermostat-controlled cooling fan / Air conditioner' }
    ],
    apps: [
      'Food & Beverage Processing Lines',
      'Packaging Automation & Sorting Plants',
      'Chemical Dosing & Batching Facilities',
      'HVAC Chiller & Air Handling Systems',
      'OEM Machinery & Automatic Testing Rigs'
    ]
  },
  'pcc-panel': {
    title: 'PCC Panel',
    desc: 'Power Control Center',
    longDesc: 'The core power distribution hub of any industrial facility, designed to receive power from the main transformer or generator and distribute it safely to sub-distribution boards. Features premium heavy-duty protection switchgears and comprehensive metering panels for total facility energy auditing.',
    tagline: 'Centralized High-Capacity Power Distribution Hub',
    image: '/products/panel-4.png',
    features: [
      'High-capacity power distribution with exceptional short-circuit withstand capabilities.',
      'Advanced power quality monitoring meters for real-time harmonic analysis.',
      'Optional Automatic Transfer Switches (ATS) for seamless generator changeovers.',
      'Arc flash safety venting and mechanical/electrical interlocking systems.',
      'Robust structural frame designed to withstand seismic vibrations.',
      'Neat and spacious busbar alleyways for cool running and easy thermal imaging.'
    ],
    specs: [
      { key: 'Rated Voltage', value: '415V AC / 690V AC' },
      { key: 'Rated Busbar Current', value: '1000A to 8000A' },
      { key: 'Short Circuit Rating', value: 'Up to 100kA for 1 sec / 3 sec' },
      { key: 'Busbar Material', value: 'tin-plated copper / silver-plated options' },
      { key: 'Form of Separation', value: 'Form 3b / Form 4a / Form 4b' },
      { key: 'Cable Entry', value: 'Rear access with spacious cable alleys' },
      { key: 'Degree of Protection', value: 'IP54 / IP55' },
      { key: 'Reference Standards', value: 'IEC 61439-1 & 2' }
    ],
    apps: [
      'Main Substation Installations',
      'Heavy Mechanical Manufacturing Plants',
      'Power Plants & Generating Stations',
      'Infrastructure & Mega Real Estate Projects',
      'Automotive and Assembly Facilities'
    ]
  },
  'ht-panel': {
    title: 'HT Panel',
    desc: 'High Tension Switchgear',
    longDesc: 'Heavy-duty switchgear designed for medium to high voltage applications (11kV to 33kV). Incorporates Vacuum Circuit Breakers (VCB) or SF6 gas-insulated breakers to offer reliable breaking capacity, robust grid protection, and lightning-impulse resilience. Safety interlocks prevent any operator errors during breaker racking.',
    tagline: 'Advanced High-Voltage Protection and Control (Up to 33kV)',
    image: '/products/panel-5.jpg',
    features: [
      'Equipped with state-of-the-art Vacuum Circuit Breakers (VCB) for zero-maintenance arc quenching.',
      'Intelligent Numerical protection relays for instant overcurrent, earth fault, and differential protection.',
      'Fully metal-clad, distinct compartments for Breaker, Busbar, and Cables for absolute isolation.',
      'Internal Arc Classification (IAC) tested for extreme emergency safety.',
      'Motorized spring charging mechanism with manual backup overrides.',
      'Earth switch with mechanical safety interlocking to prevent short circuits.'
    ],
    specs: [
      { key: 'Rated System Voltage', value: '11kV / 22kV / 33kV' },
      { key: 'Frequency', value: '50Hz / 60Hz' },
      { key: 'Rated Busbar Current', value: 'Up to 3150A' },
      { key: 'Breaking Capacity', value: 'Up to 40kA for 3 seconds' },
      { key: 'Basic Insulation Level (BIL)', value: '75kV / 95kV / 170kV peak impulse' },
      { key: 'IP Protection Class', value: 'IP4X (Enclosure) / IP2X (Between compartments)' },
      { key: 'Operation Type', value: 'Motorized / Manual / Remote SCADA integration' },
      { key: 'Cable Termination', value: 'Heat shrinkable kit terminations' }
    ],
    apps: [
      'Electrical Grid Substations',
      'Solar & Wind Power Farm Grid-tie Integration',
      'Heavy Metal Smelting & Furnace Operations',
      'Railways & Infrastructure Electrification Projects',
      'Large Scale Chemical and Fertilizer Refineries'
    ]
  },
  'sld-panel': {
    title: 'Single Line Diagram (SLD)',
    desc: 'SCADA Mimic Control & Interlock Mimic Systems',
    longDesc: 'A single-line diagram (SLD) is the structural blueprint of an electrical system. It represents the entire distribution path from main power sources (Transformers, Solar grids, and Diesel Generators) down to individual facility loads. Coupled with intelligent SCADA integration, this mimic display system provides real-time breaker status monitoring, active power flow vectors, and dynamic bus coupler feedback.',
    tagline: 'Real-time Electrical Grid Blueprinting & Remote Breaker Supervision',
    image: '/products/sld-panel.jpg',
    features: [
      'Dynamic tracking of transformer power (TRF, TRF2), diesel generators (DG1, DG2), and Solar inputs.',
      'Real-time Bus Coupler (BC) open/close status monitoring on a high-resolution mimic screen.',
      'Live telemetry of Phase Voltages (VLLav, VLNav), active current (ALLav), active power (KWav), and grid frequency (Hz).',
      'Pre-programmed SCADA alarm logs notifying of overcurrent, voltage sags, and reverse power conditions.',
      'Neat system layout showing interlocking schemes to prevent parallel source connection errors.',
      'Seamless integration with DCS, local PLCs, and remote telemetry units (RTUs).'
    ],
    specs: [
      { key: 'Monitored Sources', value: 'Transformer (TRF1/TRF2), Diesel Generator (DG1/DG2), Solar PV Grid' },
      { key: 'Interlocking Type', value: 'Electrical Solenoid & Mechanical Castell Key Interlocking' },
      { key: 'Mimic Interface', value: 'Custom 15" PC-based industrial HMI with capacitive touch' },
      { key: 'Telemetry Parameters', value: 'VLL, VLN, A, KW, Hz (Average & Per-phase values)' },
      { key: 'Communication Protocols', value: 'Modbus TCP/RTU, Profinet, IEC 61850 grid automation' },
      { key: 'Enclosure Protection', value: 'IP54 / IP55 powder-coated CRCA steel' },
      { key: 'Power Supply', value: 'Dual Redundant 24V DC auxiliary power inputs' },
      { key: 'Protection System', value: 'Integrated numerical protection relays with microsecond trips' }
    ],
    apps: [
      'Main Industrial Distribution Rooms',
      'Heavy Smelting & Metal Refineries',
      'Critical Grid Substations & Distribution Centers',
      'Large Scale Infrastructure & Mega Factories',
      'Solar & Wind Farm Grid-tie Control Rooms'
    ]
  },
  'parameter-panel': {
    title: 'All Parameter Monitoring',
    desc: 'SCADA Real-time Energy Monitoring & Trend Dashboard',
    longDesc: 'Advanced SCADA energy monitoring dashboard designed to capture, record, and plot every electrical parameter across your entire network. Enables deep power quality monitoring, historical trending, maximum demand analysis, and automatic report logging to ensure total energy efficiency.',
    tagline: 'Intelligent Real-time Energy Auditing, Trending & Diagnostics',
    image: '/products/parameter-panel.jpg',
    features: [
      'High-frequency trend charting showing real-time current, active power, and frequency fluctuations.',
      'Historical data logger storing up to 5 years of electrical telemetry in local SQL databases.',
      'Automatic calculation of total energy consumption (kWH, kVAH) and average power factor.',
      'Integrated alarms alerting managers of load imbalances or peak demand limit exceedance.',
      'Web-enabled SCADA dashboard allowing secure remote access via mobile and desktop browsers.',
      'Exportable CSV/PDF energy reports with customized time-range filters for regular energy audits.'
    ],
    specs: [
      { key: 'Dashboard Interface', value: '19" Full HD industrial-grade LCD touch console' },
      { key: 'Sampling Resolution', value: '1-second interval high-speed sampling and chart plot' },
      { key: 'Trending Variables', value: 'Active/Reactive Power, Current, Voltage, Frequency, Power Factor' },
      { key: 'Storage Capacity', value: '64GB onboard solid-state memory, expandable to local NAS or cloud SQL' },
      { key: 'Access Control', value: 'Role-based operator permissions (Admin, Engineer, Operator)' },
      { key: 'Connectivity Port', value: 'Gigabit Ethernet, RS485 loop, Wi-Fi gateway option' },
      { key: 'Alert Notification', value: 'SMS alerts, email reports, and local hooter warnings' },
      { key: 'Reference Standard', value: 'ISO 50001 Energy Management standard compliant software' }
    ],
    apps: [
      'Industrial Energy Management Offices',
      'Data Center Utility Wings & UPS Farms',
      'Green Energy Solar Substations',
      'Continuous Batching & Chemical Plants',
      'Commercial High-Rise Distribution Auditing'
    ]
  }
};

export default function PanelDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const panel = panelsData[id];

  const [activeTab, setActiveTab] = useState('overview');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Automatically scroll to top on mount or id parameter change
  useEffect(() => {
    window.scrollTo(0, 0);
    // Reset form states when panel changes
    setFormData({
      name: '',
      email: '',
      phone: '',
      company: '',
      message: `Dear Praja Electric Team,\n\nI am interested in receiving a customized quotation and engineering catalog for the ${panel?.title || 'Electrical Panel'}. Please provide lead time estimates and customization options for our facility.\n\nThank you.`
    });
    setSubmitSuccess(false);
    setActiveTab('overview');
  }, [id, panel?.title]);

  if (!panel) {
    return (
      <div className="min-h-screen bg-navy text-white flex flex-col items-center justify-center pt-24 px-4">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center bg-steel border border-white/10 p-8 sm:p-12 rounded-2xl max-w-lg shadow-[0_0_40px_rgba(0,212,255,0.1)]"
        >
          <FaBolt className="text-6xl text-electric mx-auto mb-6 animate-pulse" />
          <h2 className="text-3xl font-orbitron font-bold mb-4">Panel Not Found</h2>
          <p className="text-gray-400 mb-8">The electrical panel you are looking for does not exist or has been removed from our switchgear systems.</p>
          <Link 
            to="/" 
            className="inline-flex items-center gap-2 bg-electric text-navy font-bold px-6 py-3 rounded-lg hover:bg-white transition-all shadow-[0_0_15px_rgba(0,212,255,0.3)]"
          >
            <FaArrowLeft /> Return Home
          </Link>
        </motion.div>
      </div>
    );
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API request
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitSuccess(true);
    }, 1500);
  };

  // Get related panels (exclude the current active one)
  const relatedPanels = Object.keys(panelsData)
    .filter(key => key !== id)
    .map(key => ({ id: key, ...panelsData[key] }));

  return (
    <div className="min-h-screen bg-navy pt-28 pb-24 text-white overflow-hidden relative selection:bg-electric selection:text-navy">
      {/* Background decoration gradients */}
      <div className="absolute top-0 left-0 w-full h-[600px] bg-gradient-to-b from-electric/5 via-transparent to-transparent pointer-events-none z-0" />
      <div className="absolute top-1/4 right-0 w-[500px] h-[500px] bg-electric/5 rounded-full blur-[150px] pointer-events-none z-0" />
      <div className="absolute bottom-1/4 left-0 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[150px] pointer-events-none z-0" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Navigation Breadcrumb & Back Button */}
        <div className="mb-8">
          <Link 
            to="/"
            className="inline-flex items-center gap-2 text-gray-400 hover:text-electric font-medium transition-all group"
          >
            <FaArrowLeft className="group-hover:-translate-x-1 transition-transform" />
            <span>Back to Home</span>
          </Link>
        </div>

        {/* Hero Section Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start mb-20">
          
          {/* Left Column: Image Viewer */}
          <div className="lg:col-span-5 xl:col-span-6">
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="relative rounded-2xl overflow-hidden border border-white/10 bg-steel/50 backdrop-blur-md p-3 group shadow-[0_20px_50px_rgba(0,0,0,0.4)]"
            >
              {/* Electric Border Glow */}
              <div className="absolute inset-0 border border-electric/30 rounded-2xl opacity-50 group-hover:opacity-100 group-hover:scale-[1.01] transition-all duration-500 pointer-events-none" />
              
              <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-navy">
                <img 
                  src={panel.image} 
                  alt={panel.title} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-all duration-700 select-none"
                />
                
                {/* Decorative electric overlay on hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-navy via-transparent to-transparent opacity-40 group-hover:opacity-50 transition-opacity" />
                <div className="absolute inset-0 bg-electric/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                <div className="absolute top-4 left-4 bg-navy/95 border border-electric/40 px-3 py-1.5 rounded-full text-xs font-orbitron font-bold tracking-wider text-electric backdrop-blur-md flex items-center gap-2">
                  <FaBolt className="text-[10px] animate-pulse" />
                  HIGH SPEC
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right Column: Title & Key Details */}
          <div className="lg:col-span-7 xl:col-span-6 flex flex-col justify-center">
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <span className="text-electric font-orbitron text-sm font-bold tracking-[0.25em] uppercase mb-3 block">
                Switchgear Solutions
              </span>
              <h1 className="text-4xl sm:text-5xl font-orbitron font-black tracking-tight text-white mb-4">
                {panel.title}
              </h1>
              <p className="text-xl text-gray-300 font-rajdhani font-semibold tracking-wider leading-relaxed mb-6 border-l-2 border-electric pl-4">
                {panel.tagline}
              </p>
              <p className="text-gray-400 text-base leading-relaxed mb-8">
                {panel.longDesc}
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-4">
                <a 
                  href="#inquiry"
                  className="flex items-center gap-2 px-8 py-3.5 bg-electric text-navy font-bold rounded-lg shadow-[0_0_20px_rgba(0,212,255,0.3)] hover:shadow-[0_0_35px_rgba(0,212,255,0.6)] hover:bg-white transition-all transform hover:-translate-y-0.5 text-sm uppercase tracking-wider font-orbitron"
                >
                  <FaEnvelope /> Instant Quote Inquiry
                </a>
                <button 
                  onClick={() => {
                    const el = document.getElementById('details-section');
                    el?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="flex items-center gap-2 px-8 py-3.5 bg-steel/80 text-white font-bold rounded-lg border border-white/10 hover:border-electric/50 hover:bg-steel transition-all transform hover:-translate-y-0.5 text-sm uppercase tracking-wider font-orbitron"
                >
                  <FaCogs /> Full Specifications
                </button>
              </div>
            </motion.div>
          </div>

        </div>

        {/* Detailed Tabs Section */}
        <div id="details-section" className="mb-20 scroll-mt-24">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            
            {/* Tabs & Content Area (Left 8 Columns) */}
            <div className="lg:col-span-8">
              <div className="bg-steel/30 border border-white/5 rounded-2xl overflow-hidden shadow-2xl backdrop-blur-sm">
                
                {/* Tab Headers */}
                <div className="flex border-b border-white/5 bg-steel/50 overflow-x-auto whitespace-nowrap scrollbar-none">
                  {[
                    { id: 'overview', name: 'Overview', icon: <FaInfoCircle /> },
                    { id: 'features', name: 'Key Features', icon: <FaShieldAlt /> },
                    { id: 'specs', name: 'Specifications', icon: <FaFileAlt /> },
                    { id: 'apps', name: 'Applications', icon: <FaIndustry /> }
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex-1 md:flex-none flex items-center justify-center gap-2 py-4 px-4 sm:px-6 text-xs sm:text-sm font-semibold tracking-wider transition-all relative shrink-0 ${
                        activeTab === tab.id 
                          ? 'text-electric bg-[#0b1b33]/40' 
                          : 'text-gray-400 hover:text-white hover:bg-steel/20'
                      }`}
                    >
                      {tab.icon}
                      <span>{tab.name}</span>
                      {activeTab === tab.id && (
                        <motion.div 
                          layoutId="activeTabUnderline" 
                          className="absolute bottom-0 left-0 right-0 h-0.5 bg-electric"
                        />
                      )}
                    </button>
                  ))}
                </div>

                {/* Tab Body */}
                <div className="p-6 sm:p-8 min-h-[350px]">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={activeTab}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.3 }}
                    >
                      
                      {/* Overview Tab */}
                      {activeTab === 'overview' && (
                        <div className="space-y-6">
                          <h3 className="text-xl font-bold font-orbitron text-white">Switchgear Overview</h3>
                          <p className="text-gray-300 leading-relaxed">{panel.longDesc}</p>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                            <div className="flex items-start gap-3 bg-steel/40 p-4 rounded-xl border border-white/5 hover:border-electric/20 transition-all">
                              <FaShieldAlt className="text-electric text-lg shrink-0 mt-0.5" />
                              <div>
                                <h4 className="text-sm font-bold text-white mb-1">Max Safety Certified</h4>
                                <p className="text-gray-400 text-xs">Features physical interlocks, compartmental insulation, and robust structural isolation.</p>
                              </div>
                            </div>
                            <div className="flex items-start gap-3 bg-steel/40 p-4 rounded-xl border border-white/5 hover:border-electric/20 transition-all">
                              <FaWrench className="text-electric text-lg shrink-0 mt-0.5" />
                              <div>
                                <h4 className="text-sm font-bold text-white mb-1">High Customization</h4>
                                <p className="text-gray-400 text-xs">Engineered custom configurations to support top/bottom entry, sizing modifications, and exact auxiliary loops.</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Features Tab */}
                      {activeTab === 'features' && (
                        <div className="space-y-6">
                          <h3 className="text-xl font-bold font-orbitron text-white mb-4">Engineering Highlights</h3>
                          <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {panel.features.map((feature, i) => (
                              <li 
                                key={i}
                                className="flex items-start gap-3 bg-steel/30 p-4 rounded-xl border border-white/5 hover:border-electric/20 transition-all text-sm text-gray-300 leading-relaxed"
                              >
                                <span className="text-electric text-base shrink-0 mt-0.5">⚡</span>
                                <span>{feature}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Specifications Tab */}
                      {activeTab === 'specs' && (
                        <div className="space-y-6">
                          <h3 className="text-xl font-bold font-orbitron text-white mb-4">Technical Data Sheet</h3>
                          <div className="overflow-x-auto rounded-xl border border-white/5">
                            <table className="w-full text-left border-collapse text-sm">
                              <thead>
                                <tr className="bg-steel/80 text-electric font-semibold border-b border-white/10">
                                  <th className="p-4">Technical Parameter</th>
                                  <th className="p-4">Rated Value / Standard</th>
                                </tr>
                              </thead>
                              <tbody>
                                {panel.specs.map((spec, i) => (
                                  <tr 
                                    key={i} 
                                    className={`border-b border-white/5 hover:bg-steel/35 transition-colors ${i % 2 === 0 ? 'bg-steel/15' : 'bg-transparent'}`}
                                  >
                                    <td className="p-4 font-medium text-gray-300">{spec.key}</td>
                                    <td className="p-4 text-electric font-orbitron text-xs tracking-wide">{spec.value}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      )}

                      {/* Applications Tab */}
                      {activeTab === 'apps' && (
                        <div className="space-y-6">
                          <h3 className="text-xl font-bold font-orbitron text-white mb-4">Target Applications</h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {panel.apps.map((app, i) => (
                              <div 
                                key={i}
                                className="flex items-center gap-4 bg-steel/40 p-4 rounded-xl border border-white/5 hover:border-electric/20 transition-all"
                              >
                                <div className="h-10 w-10 bg-electric/10 rounded-lg flex items-center justify-center shrink-0 border border-electric/30">
                                  <FaIndustry className="text-electric text-sm" />
                                </div>
                                <span className="font-semibold text-gray-300 text-sm">{app}</span>
                              </div>
                            ))}
                          </div>
                          
                          {/* Info Banner */}
                          <div className="bg-electric/10 border border-electric/30 rounded-xl p-5 mt-6 flex items-start gap-4">
                            <FaRegLightbulb className="text-electric text-2xl shrink-0 mt-0.5 animate-bounce" />
                            <div>
                              <h4 className="text-sm font-bold text-electric mb-1">Custom Industrial Design</h4>
                              <p className="text-gray-400 text-xs leading-relaxed">
                                Don't see your specific application? Praja Electric specializes in engineering fully customized switchgear panels designed for bespoke operating parameters, seismic criteria, and marine or corrosive atmospheres. Reach out below to request consultation.
                              </p>
                            </div>
                          </div>
                        </div>
                      )}

                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>
            </div>

            {/* Quick Inquiry Form (Right 4 Columns) */}
            <div id="inquiry" className="lg:col-span-4 scroll-mt-24">
              <div className="bg-steel/65 border border-white/10 rounded-2xl p-6 shadow-2xl relative overflow-hidden backdrop-blur-md">
                
                {/* Form header glow line */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-electric to-transparent" />

                <AnimatePresence mode="wait">
                  {!submitSuccess ? (
                    <motion.div
                      key="form"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      <h3 className="text-lg font-orbitron font-bold text-white mb-2 flex items-center gap-2">
                        <FaBolt className="text-electric" /> Request Quote
                      </h3>
                      <p className="text-gray-400 text-xs mb-6">
                        Complete details below and our engineering team will get back to you within 24 business hours.
                      </p>

                      <form onSubmit={handleSubmit} className="space-y-4">
                        
                        {/* Name Input */}
                        <div>
                          <label className="block text-gray-400 text-xs font-semibold uppercase mb-1.5 tracking-wider">
                            Full Name
                          </label>
                          <div className="relative">
                            <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-gray-500">
                              <FaUser className="text-xs" />
                            </span>
                            <input 
                              type="text" 
                              name="name"
                              value={formData.name}
                              onChange={handleInputChange}
                              placeholder="e.g. Yash Prajapati"
                              required
                              className="w-full bg-navy/60 border border-white/15 focus:border-electric text-white text-sm rounded-lg pl-9 pr-4 py-2.5 outline-none transition-all placeholder:text-gray-600 focus:shadow-[0_0_12px_rgba(0,212,255,0.15)] font-medium"
                            />
                          </div>
                        </div>

                        {/* Email Input */}
                        <div>
                          <label className="block text-gray-400 text-xs font-semibold uppercase mb-1.5 tracking-wider">
                            Work Email
                          </label>
                          <div className="relative">
                            <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-gray-500">
                              <FaEnvelope className="text-xs" />
                            </span>
                            <input 
                              type="email" 
                              name="email"
                              value={formData.email}
                              onChange={handleInputChange}
                              placeholder="e.g. engineering@company.com"
                              required
                              className="w-full bg-navy/60 border border-white/15 focus:border-electric text-white text-sm rounded-lg pl-9 pr-4 py-2.5 outline-none transition-all placeholder:text-gray-600 focus:shadow-[0_0_12px_rgba(0,212,255,0.15)] font-medium"
                            />
                          </div>
                        </div>

                        {/* Phone Input */}
                        <div>
                          <label className="block text-gray-400 text-xs font-semibold uppercase mb-1.5 tracking-wider">
                            Contact Phone
                          </label>
                          <div className="relative">
                            <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-gray-500">
                              <FaPhoneAlt className="text-xs" />
                            </span>
                            <input 
                              type="tel" 
                              name="phone"
                              value={formData.phone}
                              onChange={handleInputChange}
                              placeholder="e.g. +91 9876543210"
                              required
                              className="w-full bg-navy/60 border border-white/15 focus:border-electric text-white text-sm rounded-lg pl-9 pr-4 py-2.5 outline-none transition-all placeholder:text-gray-600 focus:shadow-[0_0_12px_rgba(0,212,255,0.15)] font-medium"
                            />
                          </div>
                        </div>

                        {/* Company Input */}
                        <div>
                          <label className="block text-gray-400 text-xs font-semibold uppercase mb-1.5 tracking-wider">
                            Company Name
                          </label>
                          <div className="relative">
                            <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-gray-500">
                              <FaBuilding className="text-xs" />
                            </span>
                            <input 
                              type="text" 
                              name="company"
                              value={formData.company}
                              onChange={handleInputChange}
                              placeholder="e.g. Praja Electric & Automation"
                              required
                              className="w-full bg-navy/60 border border-white/15 focus:border-electric text-white text-sm rounded-lg pl-9 pr-4 py-2.5 outline-none transition-all placeholder:text-gray-600 focus:shadow-[0_0_12px_rgba(0,212,255,0.15)] font-medium"
                            />
                          </div>
                        </div>

                        {/* Inquiry Message */}
                        <div>
                          <label className="block text-gray-400 text-xs font-semibold uppercase mb-1.5 tracking-wider">
                            Specifications Request
                          </label>
                          <textarea 
                            name="message"
                            value={formData.message}
                            onChange={handleInputChange}
                            rows="4"
                            required
                            className="w-full bg-navy/60 border border-white/15 focus:border-electric text-white text-xs rounded-lg px-4 py-2.5 outline-none transition-all placeholder:text-gray-600 focus:shadow-[0_0_12px_rgba(0,212,255,0.15)] font-medium leading-relaxed resize-none"
                          />
                        </div>

                        {/* Submit Button */}
                        <button
                          type="submit"
                          disabled={isSubmitting}
                          className="w-full bg-electric text-navy font-bold py-3 rounded-lg flex items-center justify-center gap-2 hover:bg-white transition-all disabled:opacity-50 text-sm font-orbitron shadow-[0_0_15px_rgba(0,212,255,0.2)] hover:shadow-[0_0_25px_rgba(0,212,255,0.4)] disabled:hover:scale-100 disabled:hover:bg-electric transform hover:-translate-y-0.5 active:translate-y-0"
                        >
                          {isSubmitting ? (
                            <>
                              <div className="w-4 h-4 border-2 border-navy border-t-transparent rounded-full animate-spin" />
                              <span>Processing...</span>
                            </>
                          ) : (
                            <>
                              <FaPaperPlane className="text-xs" />
                              <span>Submit Inquiry</span>
                            </>
                          )}
                        </button>
                      </form>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="success"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0 }}
                      className="text-center py-8"
                    >
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                      >
                        <FaCheckCircle className="text-6xl text-emerald-400 mx-auto mb-6" />
                      </motion.div>
                      <h3 className="text-xl font-orbitron font-bold text-white mb-3">Inquiry Submitted!</h3>
                      <p className="text-gray-400 text-xs leading-relaxed px-2 mb-8">
                        Thank you for contacting Praja Electric. Your inquiry for the <span className="text-electric font-semibold">{panel.title}</span> has been logged. An application engineer will contact you shortly to review your technical specs.
                      </p>
                      <button
                        onClick={() => setSubmitSuccess(false)}
                        className="px-6 py-2 border border-white/20 text-gray-300 hover:text-white rounded-lg text-xs font-semibold transition-colors hover:border-white"
                      >
                        Send Another message
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

          </div>
        </div>

        {/* Related Panels Carousel Section */}
        <div>
          <div className="border-t border-white/5 pt-12 mb-8">
            <h2 className="text-2xl sm:text-3xl font-orbitron font-bold text-white">
              Explore Other <span className="text-electric">Switchgear Panels</span>
            </h2>
            <p className="text-gray-400 text-sm mt-2">
              Browse our full line of industrial low-voltage & high-tension electrical panels.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedPanels.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Link
                  to={`/panels/${item.id}`}
                  className="bg-steel/45 border border-white/5 hover:border-electric/30 rounded-xl overflow-hidden shadow-lg block group transition-all duration-300 hover:shadow-[0_10px_25px_rgba(0,212,255,0.1)] hover:-translate-y-1"
                >
                  <div className="relative aspect-[16/10] overflow-hidden bg-navy">
                    <img 
                      src={item.image} 
                      alt={item.title} 
                      className="w-full h-full object-cover opacity-75 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-navy/90 via-navy/20 to-transparent" />
                  </div>
                  <div className="p-5">
                    <h3 className="text-base font-bold text-white mb-1 group-hover:text-electric transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-gray-400 text-xs line-clamp-2 leading-relaxed">
                      {item.desc}
                    </p>
                    <div className="mt-4 flex items-center gap-1 text-[11px] font-bold text-electric font-orbitron group-hover:translate-x-1.5 transition-transform origin-left">
                      <span>View Specifications</span>
                      <span>→</span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
