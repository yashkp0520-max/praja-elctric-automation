import { useRef } from 'react';
import { useFrame, Canvas } from '@react-three/fiber';
import { OrbitControls, Stars, Float, Sphere, Trail, Grid, Sparkles } from '@react-three/drei';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';



function ElectricalCore() {
  return (
    <group>      {/* Electrical Sparks Floating */}
      <Sparkles count={150} scale={8} size={2} speed={0.8} opacity={0.6} color="#00d4ff" />
      <Sparkles count={80} scale={8} size={3} speed={1.2} opacity={0.4} color="#FFD700" />
    </group>
  );
}

function Resistor(props) {
  return (
    <Float speed={2} rotationIntensity={1} floatIntensity={2} {...props}>
      <group>
        <mesh rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.2, 0.2, 1.5, 16]} />
          <meshStandardMaterial color="#d4b483" />
        </mesh>
        <mesh position={[-0.4, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.21, 0.21, 0.1, 16]} />
          <meshStandardMaterial color="#cc0000" />
        </mesh>
        <mesh position={[0, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.21, 0.21, 0.1, 16]} />
          <meshStandardMaterial color="#000000" />
        </mesh>
        <mesh position={[0.4, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.21, 0.21, 0.1, 16]} />
          <meshStandardMaterial color="#ffd700" />
        </mesh>
        <mesh position={[-1.2, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.05, 0.05, 1, 16]} />
          <meshStandardMaterial color="#c0c0c0" />
        </mesh>
        <mesh position={[1.2, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.05, 0.05, 1, 16]} />
          <meshStandardMaterial color="#c0c0c0" />
        </mesh>
      </group>
    </Float>
  );
}

function Capacitor(props) {
  return (
    <Float speed={2} rotationIntensity={1.5} floatIntensity={2} {...props}>
      <group>
        <mesh>
          <cylinderGeometry args={[0.4, 0.4, 1, 32]} />
          <meshStandardMaterial color="#0055ff" metalness={0.5} roughness={0.2} />
        </mesh>
        <mesh position={[0, 0.51, 0]}>
          <cylinderGeometry args={[0.4, 0.4, 0.02, 32]} />
          <meshStandardMaterial color="#c0c0c0" />
        </mesh>
        <mesh position={[-0.15, -0.75, 0]}>
          <cylinderGeometry args={[0.05, 0.05, 0.5, 16]} />
          <meshStandardMaterial color="#c0c0c0" />
        </mesh>
        <mesh position={[0.15, -0.75, 0]}>
          <cylinderGeometry args={[0.05, 0.05, 0.5, 16]} />
          <meshStandardMaterial color="#c0c0c0" />
        </mesh>
      </group>
    </Float>
  );
}

function Microchip(props) {
  return (
    <Float speed={1.5} rotationIntensity={0.5} floatIntensity={1} {...props}>
      <group>
        <mesh>
          <boxGeometry args={[1.5, 0.2, 1.5]} />
          <meshStandardMaterial color="#222222" metalness={0.8} roughness={0.5} />
        </mesh>
        {[...Array(4)].map((_, i) => (
          <mesh key={`pin-left-${i}`} position={[-0.8, -0.1, -0.6 + i * 0.4]}>
            <boxGeometry args={[0.2, 0.05, 0.1]} />
            <meshStandardMaterial color="#c0c0c0" metalness={1} roughness={0} />
          </mesh>
        ))}
        {[...Array(4)].map((_, i) => (
          <mesh key={`pin-right-${i}`} position={[0.8, -0.1, -0.6 + i * 0.4]}>
            <boxGeometry args={[0.2, 0.05, 0.1]} />
            <meshStandardMaterial color="#c0c0c0" metalness={1} roughness={0} />
          </mesh>
        ))}
        {[...Array(4)].map((_, i) => (
          <mesh key={`pin-top-${i}`} position={[-0.6 + i * 0.4, -0.1, -0.8]}>
            <boxGeometry args={[0.1, 0.05, 0.2]} />
            <meshStandardMaterial color="#c0c0c0" metalness={1} roughness={0} />
          </mesh>
        ))}
        {[...Array(4)].map((_, i) => (
          <mesh key={`pin-bottom-${i}`} position={[-0.6 + i * 0.4, -0.1, 0.8]}>
            <boxGeometry args={[0.1, 0.05, 0.2]} />
            <meshStandardMaterial color="#c0c0c0" metalness={1} roughness={0} />
          </mesh>
        ))}
        <mesh position={[-0.5, 0.11, -0.5]}>
          <cylinderGeometry args={[0.1, 0.1, 0.01, 16]} />
          <meshStandardMaterial color="#111111" />
        </mesh>
      </group>
    </Float>
  );
}

function Inductor(props) {
  return (
    <Float speed={2.5} rotationIntensity={2} floatIntensity={1.5} {...props}>
      <group rotation={[Math.PI / 2, 0, 0]}>
        <mesh>
          <cylinderGeometry args={[0.15, 0.15, 1.2, 16]} />
          <meshStandardMaterial color="#444444" />
        </mesh>
        {[...Array(8)].map((_, i) => (
          <mesh key={`coil-${i}`} position={[0, -0.45 + i * 0.13, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.2, 0.05, 16, 32]} />
            <meshStandardMaterial color="#b87333" metalness={0.6} roughness={0.4} />
          </mesh>
        ))}
      </group>
    </Float> 
  );
}

function Diode(props) {
  return (
    <Float speed={2.2} rotationIntensity={1.2} floatIntensity={1.8} {...props}>
      <group>
        <mesh rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.15, 0.15, 1, 16]} />
          <meshStandardMaterial color="#111111" metalness={0.8} roughness={0.2} />
        </mesh>
        <mesh position={[0.3, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.16, 0.16, 0.15, 16]} />
          <meshStandardMaterial color="#c0c0c0" />
        </mesh>
        <mesh position={[-0.9, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.05, 0.05, 0.8, 16]} />
          <meshStandardMaterial color="#c0c0c0" />
        </mesh>
        <mesh position={[0.9, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.05, 0.05, 0.8, 16]} />
          <meshStandardMaterial color="#c0c0c0" />
        </mesh>
      </group>
    </Float>
  );
}

export default function Hero3D() {
  return (
    <section 
      className="relative h-screen flex items-center overflow-hidden bg-navy bg-cover bg-center"
      style={{ backgroundImage: "linear-gradient(to right, rgba(10, 25, 47, 0.85), rgba(10, 25, 47, 0.5)), url('/hero-bg.png')" }}
    >
      {/* 3D Background */}
      <div className="absolute inset-0 z-0">
        <Canvas camera={{ position: [0, 0, 7] }}>
          <fog attach="fog" args={['#0a192f', 5, 20]} />
          <ambientLight intensity={0.2} />
          <pointLight position={[0, 0, 0]} color="#00d4ff" intensity={4} distance={10} />
          
          <group position={[0, 0, -1]}>
            <ElectricalCore />
            <Resistor position={[-4, 2, -3]} rotation={[Math.PI / 4, Math.PI / 4, 0]} scale={0.6} />
            <Capacitor position={[4, -1, -4]} rotation={[-Math.PI / 4, 0, Math.PI / 6]} scale={0.7} />
            <Microchip position={[3, 3, -5]} rotation={[0, Math.PI / 3, Math.PI / 4]} scale={0.8} />
            <Inductor position={[-3, -2, -2]} rotation={[Math.PI / 6, -Math.PI / 4, 0]} scale={0.9} />
            <Diode position={[0, -3, -3]} rotation={[0, Math.PI / 6, Math.PI / 4]} scale={0.7} />
            <Resistor position={[2, 1, -2]} rotation={[-Math.PI / 3, -Math.PI / 4, Math.PI / 2]} scale={0.4} />
            <Capacitor position={[-2, 3, -4]} rotation={[Math.PI / 3, Math.PI / 2, 0]} scale={0.5} />
          </group>

          {/* Futuristic Circuit Grid Floor */}
          <Grid 
            position={[0, -3.5, 0]} 
            args={[30, 30]} 
            cellSize={0.5} 
            cellThickness={1} 
            cellColor="#00d4ff" 
            sectionSize={2} 
            sectionThickness={1.5} 
            sectionColor="#0033aa" 
            fadeDistance={15} 
            fadeStrength={1.5} 
          />
          
          <Stars radius={100} depth={50} count={2000} factor={3} saturation={0} opacity={0.3} />
          <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={0.3} maxPolarAngle={Math.PI / 1.8} minPolarAngle={Math.PI / 3} />
        </Canvas>
      </div>
      
      {/* Content - Centered */}
      <div className="relative z-10 text-center px-8 md:px-16 lg:px-24 max-w-7xl mx-auto w-full flex flex-col items-center justify-center pt-20 pointer-events-none">
        {/* Top Tagline */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-steel/50 border border-white/10 backdrop-blur-md mb-8 shadow-lg pointer-events-auto"
        >
          <span className="text-electric">⚡</span>
          <span className="text-gray-300 text-xs sm:text-sm font-medium tracking-wide uppercase">Smart Power · Smart Solutions · Bhiwadi, Rajasthan</span>
        </motion.div>

        {/* Main Heading */}
        <motion.h1
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="font-orbitron text-3xl sm:text-5xl md:text-7xl lg:text-8xl font-black text-white mb-8 tracking-tighter leading-none flex flex-col items-center gap-2 md:gap-4 pointer-events-auto"
        >
          <span>PRAJA <span className="text-electric drop-shadow-[0_0_20px_rgba(0,212,255,0.6)]">ELECTRIC</span></span>
          <span className="text-lg sm:text-3xl md:text-5xl lg:text-6xl text-gray-300 drop-shadow-md tracking-widest">& AUTOMATION</span>
        </motion.h1>

        {/* Subtitles */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="space-y-6 mb-12 max-w-4xl pointer-events-auto"
        >
          <h2 className="text-base sm:text-xl md:text-3xl text-gray-200 font-rajdhani font-bold leading-tight uppercase tracking-[0.2em] px-2">
            Pioneering <span className="text-electric">Advanced Electrical</span> & <span className="text-electric">Automation</span><br /> Excellence for Modern Industries
          </h2>
          <p className="text-gray-400 text-sm sm:text-lg md:text-xl font-light tracking-wide leading-relaxed italic max-w-2xl mx-auto px-4">
            Empowering industrial frontiers with high-precision engineering and smart, future-ready power solutions.
          </p>
        </motion.div>

        {/* Call to Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-6 pointer-events-auto"
        >
          <Link 
            to="/services"
            className="flex items-center justify-center gap-3 px-10 py-4 min-w-[220px] bg-electric text-navy font-black rounded-lg shadow-[0_0_25px_rgba(0,212,255,0.4)] hover:shadow-[0_0_40px_rgba(0,212,255,0.7)] hover:bg-white transition-all duration-300 transform hover:-translate-y-1 uppercase tracking-widest text-sm"
          >
            ⚡ Our Services
          </Link>
          <Link 
            to="/about"
            className="flex items-center justify-center gap-3 px-10 py-4 min-w-[220px] bg-steel/80 text-white font-bold rounded-lg border border-white/10 hover:border-electric hover:bg-steel transition-all duration-300 backdrop-blur-md transform hover:-translate-y-1 uppercase tracking-widest text-sm"
          >
            Contact Us <span className="text-electric">→</span>
          </Link>
        </motion.div>
      </div>

    </section>
  );
}
