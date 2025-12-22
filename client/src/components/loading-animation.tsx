import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import { ParticlesBackground } from "./particles-background";

const SYSTEM_LOGS = [
    "INITIALIZING KERNEL...",
    "LOADING NEURAL NETWORKS...",
    "BYPASSING FIREWALLS...",
    "OPTIMIZING ASSETS...",
    "CONNECTING TO MAINFRAME...",
    "DECRYPTING SECURE DATA...",
    "ALLOCATING MEMORY BLOCKS...",
    "CHECKING INTEGRITY...",
    "SYSTEM OPTIMAL.",
    "LAUNCHING INTERFACE..."
];

export function LoadingAnimation({ onComplete }: { onComplete: () => void }) {
    const [progress, setProgress] = useState(0);
    const [logs, setLogs] = useState<string[]>([]);
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
    const containerRef = useRef<HTMLDivElement>(null);

    // Handle Mouse Move for Parallax
    const handleMouseMove = (e: React.MouseEvent) => {
        if (!containerRef.current) return;
        const { clientX, clientY } = e;
        const { innerWidth, innerHeight } = window;
        setMousePos({
            x: (clientX / innerWidth - 0.5) * 20, // -10 to 10
            y: (clientY / innerHeight - 0.5) * 20
        });
    };

    useEffect(() => {
        // Progress bar animation
        const interval = setInterval(() => {
            setProgress((prev) => {
                if (prev >= 100) {
                    clearInterval(interval);
                    setTimeout(onComplete, 800);
                    return 100;
                }
                return prev + Math.random() * 2; // Slower, more "loading" feel
            });
        }, 50);

        return () => clearInterval(interval);
    }, [onComplete]);

    useEffect(() => {
        // Log generation
        const logInterval = setInterval(() => {
            if (logs.length < SYSTEM_LOGS.length) {
                setLogs(prev => [...prev, SYSTEM_LOGS[prev.length]]);
            }
        }, 400);
        return () => clearInterval(logInterval);
    }, [logs]);

    return (
        <motion.div
            ref={containerRef}
            onMouseMove={handleMouseMove}
            className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black overflow-hidden font-mono cursor-crosshair"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.1, filter: "blur(20px)", transition: { duration: 0.8 } }}
        >
            <ParticlesBackground />

            {/* Background Grid - subtle overlay */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,255,0.03)_1px,transparent_1px)] bg-[size:50px_50px] pointer-events-none" />

            {/* Central Content */}
            <div className="relative z-10 flex flex-col items-center gap-8 w-full max-w-2xl px-4">

                {/* Main Title with Parallax */}
                <motion.div
                    className="relative text-center"
                    animate={{ x: mousePos.x * -1, y: mousePos.y * -1 }}
                    transition={{ type: "spring", stiffness: 100, damping: 10 }}
                >
                    <motion.h1
                        className="text-6xl md:text-9xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-400 select-none"
                        animate={{
                            textShadow: [
                                "0 0 0px cyan",
                                "4px 0px 0px cyan",
                                "-4px 0px 0px magenta",
                                "0 0 0px cyan"
                            ],
                            skewX: [0, 5, -5, 0],
                        }}
                        transition={{
                            duration: 3,
                            repeat: Infinity,
                            repeatType: "mirror",
                            repeatDelay: 2
                        }}
                    >
                        CREATION
                    </motion.h1>
                    <motion.div
                        className="text-2xl md:text-5xl font-bold text-cyan-500 tracking-[0.5em] text-center mt-2"
                        initial={{ opacity: 0, letterSpacing: "1em" }}
                        animate={{ opacity: 1, letterSpacing: "0.5em" }}
                        transition={{ delay: 0.5, duration: 1 }}
                    >
                        2K26
                    </motion.div>
                </motion.div>

                {/* Techy Progress Container */}
                <div className="w-full max-w-md space-y-2">
                    <div className="flex justify-between text-xs text-cyan-500/80 font-bold uppercase tracking-widest">
                        <span>System Status: ONLINE</span>
                        <span>{Math.min(100, Math.floor(progress))}%</span>
                    </div>

                    <div className="w-full h-1 bg-gray-900 overflow-hidden relative">
                        {/* Scanner line effect */}
                        <motion.div
                            className="absolute top-0 bottom-0 w-20 bg-gradient-to-r from-transparent via-white/50 to-transparent z-20"
                            animate={{ left: ["-20%", "120%"] }}
                            transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                        />
                        <motion.div
                            className="h-full bg-cyan-500 shadow-[0_0_15px_cyan]"
                            initial={{ width: "0%" }}
                            animate={{ width: `${progress}%` }}
                            transition={{ type: "tween", ease: "linear", duration: 0.1 }}
                        />
                    </div>
                </div>

                {/* Terminal / Logs Box */}
                <div className="w-full max-w-md h-32 bg-black/50 border border-white/10 p-4 font-mono text-xs overflow-hidden relative rounded-lg backdrop-blur-sm">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-500 to-purple-500 opacity-50" />
                    <div className="flex flex-col justify-end h-full gap-1">
                        {logs.map((log, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="text-green-500/80"
                            >
                                {">"} {log}
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Override Button */}
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={onComplete}
                    className="px-6 py-2 border border-cyan-500/30 text-cyan-500 text-xs tracking-widest hover:bg-cyan-500/10 transition-colors uppercase backdrop-blur-md"
                >
                    [ CLICK TO INITIALIZE ]
                </motion.button>

            </div>

            {/* Corner Decorations */}
            <div className="absolute top-0 left-0 p-8">
                <div className="w-24 h-24 border-t border-l border-white/20" />
            </div>
            <div className="absolute bottom-0 right-0 p-8">
                <div className="w-24 h-24 border-b border-r border-white/20" />
            </div>

        </motion.div>
    );
}
