import { motion } from "framer-motion";

export function AnimatedBackground() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none bg-[#0a0a0f]">
      {/* Base background - darker for better contrast */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0f] via-[#0f0f16] to-[#0a0a0f]" />

      {/* Tech Grid - Main feature */}
      <div
        className="absolute inset-0 opacity-[0.1]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(168, 85, 247, 0.15) 1px, transparent 1px),
            linear-gradient(90deg, rgba(168, 85, 247, 0.15) 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
          transform: "perspective(500px) rotateX(20deg)",
          transformOrigin: "top"
        }}
      />

      <motion.div
        className="absolute inset-0 opacity-[0.08]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(59, 130, 246, 0.2) 1px, transparent 1px),
            linear-gradient(90deg, rgba(59, 130, 246, 0.2) 1px, transparent 1px)
          `,
          backgroundSize: "140px 140px"
        }}
        animate={{
          backgroundPosition: ["0px 0px", "140px 140px"],
        }}
        transition={{
          duration: 45,
          repeat: Infinity,
          ease: "linear"
        }}
      />

      {/* Large animated blobs - enhanced visibility */}
      <motion.div
        className="absolute w-[800px] h-[800px] rounded-full blur-[120px] opacity-30"
        style={{
          background: "radial-gradient(circle, rgba(168, 85, 247, 0.6) 0%, transparent 70%)",
          top: "-20%",
          left: "-10%",
        }}
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.4, 0.3],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />

      <motion.div
        className="absolute w-[600px] h-[600px] rounded-full blur-[100px] opacity-20"
        style={{
          background: "radial-gradient(circle, rgba(59, 130, 246, 0.7) 0%, transparent 70%)",
          bottom: "-10%",
          right: "-5%",
        }}
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.2, 0.3, 0.2],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />

      {/* Cyberpunk accent lines */}
      <div className="absolute inset-0">
        <motion.div
          className="absolute h-[1px] w-full bg-gradient-to-r from-transparent via-primary/50 to-transparent shadow-[0_0_10px_rgba(168,85,247,0.5)]"
          style={{ top: "30%" }}
          animate={{
            transform: ["translateX(-100%)", "translateX(100%)"],
            opacity: [0, 1, 0]
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "linear",
            delay: 2
          }}
        />
        <motion.div
          className="absolute h-[1px] w-full bg-gradient-to-r from-transparent via-secondary/50 to-transparent shadow-[0_0_10px_rgba(59,130,246,0.5)]"
          style={{ top: "70%" }}
          animate={{
            transform: ["translateX(100%)", "translateX(-100%)"],
            opacity: [0, 1, 0]
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "linear"
          }}
        />
      </div>

      {/* Matrix-like vertical streams (subtle) */}
      <div className="absolute inset-0 flex justify-around opacity-[0.03] pointer-events-none">
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className="w-[1px] h-full bg-gradient-to-b from-transparent via-primary to-transparent"
            animate={{
              backgroundPosition: ["0% -100%", "0% 200%"],
            }}
            transition={{
              duration: 5 + i * 2,
              repeat: Infinity,
              ease: "linear",
              delay: i
            }}
          />
        ))}
      </div>

      {/* Vignette for cinematic look */}
      <div
        className="absolute inset-0 opacity-60"
        style={{
          background: "radial-gradient(circle 800px at center, transparent 0%, rgba(5, 5, 10, 0.8) 100%)"
        }}
      />
    </div>
  );
}
