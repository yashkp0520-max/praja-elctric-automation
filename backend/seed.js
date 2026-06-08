const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const path = require('path');
const Product = require('./models/Product');
const User = require('./models/User');

// Load .env from the backend folder itself
dotenv.config({ path: path.join(__dirname, '.env') });

const sampleProducts = [
  {
    name: "Industrial Control Panel V-200",
    description: "High-capacity automation control panel suitable for manufacturing lines.",
    price: 375000,
    category: "panels",
    images: ["https://images.unsplash.com/photo-1581092334651-ddf26d9a09d0?auto=format&fit=crop&q=80&w=800"],
    specifications: [{ key: "Voltage", value: "480V AC" }, { key: "Rating", value: "IP65" }],
    stock: 12,
    isActive: true
  },
  {
    name: "Siemens S7-1200 PLC",
    description: "Compact controller for flexible automation solutions.",
    price: 71000,
    category: "plc",
    images: ["https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=800"],
    specifications: [{ key: "I/O count", value: "14 DI / 10 DQ" }, { key: "Memory", value: "75 KB" }],
    stock: 25,
    isActive: true
  },
  {
    name: "Omron Proximity Sensor E2E",
    description: "Standard inductive proximity sensor for reliable object detection.",
    price: 3750,
    category: "sensors",
    images: ["https://images.unsplash.com/photo-1558346490-a72e53ae2d4f?auto=format&fit=crop&q=80&w=800"],
    specifications: [{ key: "Sensing Distance", value: "2mm" }, { key: "Output", value: "NPN/PNP" }],
    stock: 150,
    isActive: true
  },
  {
    name: "ABB ACS380 Variable Frequency Drive",
    description: "Machinery drive for precise motor control in harsh environments.",
    price: 99900,
    category: "drives",
    images: ["https://images.unsplash.com/photo-1563770660941-20978e870e26?auto=format&fit=crop&q=80&w=800"],
    specifications: [{ key: "Power", value: "4.0 kW" }, { key: "Phase", value: "3-Phase" }],
    stock: 8,
    isActive: true
  },
  {
    name: "LT Power Distribution Panel",
    description: "Low-tension power distribution board for safe and efficient power routing in factories.",
    price: 285000,
    category: "panels",
    images: ["https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&q=80&w=800"],
    specifications: [{ key: "Voltage", value: "415V AC" }, { key: "Busbar Rating", value: "800A" }],
    stock: 6,
    isActive: true
  },
  {
    name: "Allen Bradley MicroLogix 1100 PLC",
    description: "Versatile PLC for small to mid-size automation with built-in Ethernet connectivity.",
    price: 58500,
    category: "plc",
    images: ["https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=800"],
    specifications: [{ key: "I/O", value: "10 DI / 6 DO" }, { key: "Protocol", value: "EtherNet/IP" }],
    stock: 18,
    isActive: true
  },
  {
    name: "Schneider ATV320 VFD",
    description: "Compact variable speed drive for conveyor belts, pumps and fans.",
    price: 65000,
    category: "drives",
    images: ["https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?auto=format&fit=crop&q=80&w=800"],
    specifications: [{ key: "Power", value: "2.2 kW" }, { key: "Supply", value: "3-Phase 415V" }],
    stock: 15,
    isActive: true
  },
  {
    name: "Ultrasonic Level Sensor",
    description: "Non-contact ultrasonic sensor for liquid and solid level measurement in tanks.",
    price: 8900,
    category: "sensors",
    images: ["https://images.unsplash.com/photo-1625314887424-9f190599bd56?auto=format&fit=crop&q=80&w=800"],
    specifications: [{ key: "Range", value: "0.3m – 5m" }, { key: "Output", value: "4–20mA / RS485" }],
    stock: 60,
    isActive: true
  },
  {
    name: "HT Metering Panel",
    description: "High-tension metering cubicle with energy meters and current transformers.",
    price: 520000,
    category: "panels",
    images: ["https://images.unsplash.com/photo-1611117775350-ac3950990985?auto=format&fit=crop&q=80&w=800"],
    specifications: [{ key: "Voltage", value: "11 kV" }, { key: "CT Ratio", value: "200/5A" }],
    stock: 3,
    isActive: true
  },
  {
    name: "Delta DVP Series PLC",
    description: "Cost-effective PLC for general automation, packaging and textile industries.",
    price: 22500,
    category: "plc",
    images: ["https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=800"],
    specifications: [{ key: "I/O", value: "16 DI / 12 DO" }, { key: "Scan Time", value: "0.24 µs/step" }],
    stock: 30,
    isActive: true
  },
  {
    name: "Infrared Temperature Sensor",
    description: "Non-contact IR temperature sensor for monitoring motors and electrical panels.",
    price: 5200,
    category: "sensors",
    images: ["https://images.unsplash.com/photo-1563770660941-20978e870e26?auto=format&fit=crop&q=80&w=800"],
    specifications: [{ key: "Range", value: "-20°C to 500°C" }, { key: "Accuracy", value: "±1°C" }],
    stock: 80,
    isActive: true
  },
  {
    name: "Mitsubishi FR-E800 VFD",
    description: "Energy-saving drive with built-in PLC functionality for smart factory integration.",
    price: 82000,
    category: "drives",
    images: ["https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?auto=format&fit=crop&q=80&w=800"],
    specifications: [{ key: "Power", value: "7.5 kW" }, { key: "Control", value: "Vector / V/F" }],
    stock: 10,
    isActive: true
  },
  {
    name: "APFC Panel (Automatic Power Factor Correction)",
    description: "Automatic panel to maintain power factor above 0.99 and reduce electricity bills.",
    price: 145000,
    category: "panels",
    images: ["https://images.unsplash.com/photo-1581092334651-ddf26d9a09d0?auto=format&fit=crop&q=80&w=800"],
    specifications: [{ key: "Voltage", value: "415V, 3-Phase" }, { key: "Steps", value: "8 Capacitor Steps" }],
    stock: 5,
    isActive: true
  },
  {
    name: "Photoelectric Beam Sensor",
    description: "Long-range photoelectric sensor ideal for object detection on conveyor lines.",
    price: 6800,
    category: "sensors",
    images: ["https://images.unsplash.com/photo-1558346490-a72e53ae2d4f?auto=format&fit=crop&q=80&w=800"],
    specifications: [{ key: "Range", value: "Up to 15m" }, { key: "Type", value: "Through-beam" }],
    stock: 95,
    isActive: true
  }
];

async function seedDatabase() {
  try {
    console.log("Connecting to Database...");
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected Successfully.");

    // Seed admin user
    console.log("Creating admin user...");
    const existingAdmin = await User.findOne({ email: 'admin@prajaelectric.com' });
    if (!existingAdmin) {
      await User.create({
        name: 'Admin',
        email: 'admin@prajaelectric.com',
        password: 'admin123',
        role: 'admin',
      });
      console.log("Admin user created: admin@prajaelectric.com / admin123");
    } else {
      console.log("Admin user already exists.");
    }

    console.log("Clearing existing products...");
    await Product.deleteMany({});

    console.log("Inserting new dummy products...");
    await Product.insertMany(sampleProducts);

    console.log("Database Seeded Successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Error Seeding Database:", error);
    process.exit(1);
  }
}

seedDatabase();
