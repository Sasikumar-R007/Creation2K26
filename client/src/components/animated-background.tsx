import { motion } from "framer-motion";

export function AnimatedBackground() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      {/* Base background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background to-background/95" />
      
      {/* Large animated blobs - main visual effect */}
      <motion.div
        className="absolute w-[600px] h-[600px] rounded-full blur-3xl opacity-40"
        style={{
          background: "radial-gradient(circle, rgba(168, 85, 247, 1) 0%, rgba(168, 85, 247, 0) 70%)",
          top: "-150px",
          left: "-150px",
          filter: "blur(80px)"
        }}
        animate={{
          y: [0, 100, 0],
          x: [0, 50, 0],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      
      <motion.div
        className="absolute w-[500px] h-[500px] rounded-full blur-3xl opacity-35"
        style={{
          background: "radial-gradient(circle, rgba(59, 130, 246, 1) 0%, rgba(59, 130, 246, 0) 70%)",
          top: "100px",
          right: "-200px",
          filter: "blur(80px)"
        }}
        animate={{
          y: [0, -80, 0],
          x: [0, -80, 0],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 0.5
        }}
      />
      
      <motion.div
        className="absolute w-[550px] h-[550px] rounded-full blur-3xl opacity-30"
        style={{
          background: "radial-gradient(circle, rgba(139, 92, 246, 1) 0%, rgba(139, 92, 246, 0) 70%)",
          bottom: "-100px",
          left: "200px",
          filter: "blur(80px)"
        }}
        animate={{
          y: [0, -120, 0],
          x: [0, 100, 0],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1
        }}
      />
      
      <motion.div
        className="absolute w-[480px] h-[480px] rounded-full blur-3xl opacity-25"
        style={{
          background: "radial-gradient(circle, rgba(168, 85, 247, 0.8) 0%, rgba(168, 85, 247, 0) 70%)",
          bottom: "50px",
          right: "100px",
          filter: "blur(80px)"
        }}
        animate={{
          y: [0, 90, 0],
          x: [0, -70, 0],
        }}
        transition={{
          duration: 14,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2
        }}
      />

      {/* Secondary smaller floating elements */}
      <motion.div
        className="absolute w-72 h-72 rounded-full blur-3xl opacity-20"
        style={{
          background: "conic-gradient(from 0deg, rgba(168, 85, 247, 0.5), rgba(59, 130, 246, 0.5), rgba(168, 85, 247, 0.5))",
          top: "30%",
          left: "10%",
          filter: "blur(70px)"
        }}
        animate={{
          rotate: [0, 360],
          scale: [1, 1.1, 1]
        }}
        transition={{
          rotate: { duration: 30, repeat: Infinity, ease: "linear" },
          scale: { duration: 10, repeat: Infinity, ease: "easeInOut" }
        }}
      />

      {/* Animated diagonal rays */}
      <div className="absolute inset-0 opacity-10 overflow-hidden">
        <motion.div
          className="absolute w-[2px] h-[150%] bg-gradient-to-b from-primary via-secondary to-transparent"
          style={{
            left: "20%",
            top: "-25%",
            transform: "rotate(-45deg)"
          }}
          animate={{
            opacity: [0.3, 0.7, 0.3],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute w-[2px] h-[150%] bg-gradient-to-b from-secondary via-primary to-transparent"
          style={{
            right: "20%",
            top: "-25%",
            transform: "rotate(45deg)"
          }}
          animate={{
            opacity: [0.2, 0.6, 0.2],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1
          }}
        />
      </div>

      {/* Grid pattern with animation */}
      <motion.div 
        className="absolute inset-0 opacity-[0.08]"
        style={{
          backgroundImage: `linear-gradient(0deg, transparent 24%, rgba(168, 85, 247, 0.1) 25%, rgba(168, 85, 247, 0.1) 26%, transparent 27%, transparent 74%, rgba(168, 85, 247, 0.1) 75%, rgba(168, 85, 247, 0.1) 76%, transparent 77%, transparent), 
                           linear-gradient(90deg, transparent 24%, rgba(168, 85, 247, 0.1) 25%, rgba(168, 85, 247, 0.1) 26%, transparent 27%, transparent 74%, rgba(168, 85, 247, 0.1) 75%, rgba(168, 85, 247, 0.1) 76%, transparent 77%, transparent)`,
          backgroundSize: "60px 60px"
        }}
        animate={{
          backgroundPosition: ["0px 0px", "60px 60px"],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear"
        }}
      />
      
      {/* Radial vignette */}
      <div 
        className="absolute inset-0 opacity-40"
        style={{
          background: "radial-gradient(circle 800px at center, transparent 0%, rgba(0, 0, 0, 0.9) 100%)"
        }}
      />

      {/* Top highlight glow */}
      <motion.div
        className="absolute top-0 left-1/2 w-[800px] h-[400px] -translate-x-1/2 rounded-full blur-3xl opacity-15"
        style={{
          background: "radial-gradient(circle, rgba(59, 130, 246, 0.4), transparent 70%)",
          filter: "blur(100px)"
        }}
        animate={{
          y: [-50, 50, -50],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
    </div>
  );
}
