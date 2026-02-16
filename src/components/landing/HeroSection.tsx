import { useEffect, useState, useMemo, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Calendar, MapPin, ArrowDown } from "lucide-react";
import { NeonButton } from "@/components/ui/neon-button";
import { EVENT_DATE, VENUE } from "@/lib/constants";

const PARTICLE_COUNT = 20; // Reduced from 28 for better performance
const PARTICLE_COLORS = [
  "hsl(var(--primary) / 0.35)",
  "hsl(var(--secondary) / 0.3)",
  "rgba(255, 107, 157, 0.25)",
  "rgba(0, 188, 212, 0.2)",
];

const HeroSection = () => {
  const navigate = useNavigate();
  const [mouse, setMouse] = useState({ x: 50, y: 50 });
  const [isLoaded, setIsLoaded] = useState(false);
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const rafRef = useRef<number | null>(null);
  const mouseRef = useRef({ x: 50, y: 50 });

  const particles = useMemo(
    () =>
      Array.from({ length: PARTICLE_COUNT }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        top: Math.random() * 100,
        size: 4 + Math.random() * 8,
        delay: Math.random() * 4,
        duration: 6 + Math.random() * 6,
        color: PARTICLE_COLORS[i % PARTICLE_COLORS.length],
      })),
    []
  );

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = EVENT_DATE.getTime() - new Date().getTime();

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(timer);
  }, []);

  const formattedDate = EVENT_DATE.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  // Optimized mouse tracking with requestAnimationFrame
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    mouseRef.current = { x, y };

    if (!rafRef.current) {
      rafRef.current = requestAnimationFrame(() => {
        setMouse(mouseRef.current);
        rafRef.current = null;
      });
    }
  }, []);

  // Preload logo image
  useEffect(() => {
    const img = new Image();
    img.src = "/Logo 7.png";
    img.onload = () => setIsLoaded(true);
    img.onerror = () => setIsLoaded(true); // Set loaded even on error to prevent blocking
  }, []);

  return (
    <section
      className="min-h-screen flex items-center justify-center relative overflow-hidden pt-32 pb-16"
      onMouseMove={handleMouseMove}
    >
      {/* Mouse-follow spotlight - disabled on mobile for performance */}
      <div
        className="absolute inset-0 pointer-events-none opacity-0 md:opacity-30 transition-opacity duration-300 hidden md:block"
        aria-hidden
        style={{
          background: `radial-gradient(circle 40vmax at ${mouse.x}% ${mouse.y}%, hsl(var(--primary) / 0.12) 0%, transparent 50%)`,
        }}
      />

      {/* Floating particles - lazy loaded after initial render, fewer on mobile */}
      {isLoaded && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden>
          {particles.map((p) => (
            <div
              key={p.id}
              className="absolute rounded-full hero-particle-float hidden md:block"
              style={{
                left: `${p.left}%`,
                top: `${p.top}%`,
                width: p.size,
                height: p.size,
                background: p.color,
                animationDelay: `${p.delay}s`,
                animationDuration: `${p.duration}s`,
                willChange: 'transform',
              }}
            />
          ))}
          {/* Reduced particles for mobile */}
          {particles.slice(0, 10).map((p) => (
            <div
              key={`mobile-${p.id}`}
              className="absolute rounded-full hero-particle-float md:hidden"
              style={{
                left: `${p.left}%`,
                top: `${p.top}%`,
                width: p.size,
                height: p.size,
                background: p.color,
                animationDelay: `${p.delay}s`,
                animationDuration: `${p.duration}s`,
                willChange: 'transform',
              }}
            />
          ))}
        </div>
      )}

      {/* Background Effects - cleaner, more subtle */}
      <div className="absolute inset-0 overflow-hidden bg-background">
        {/* Subtle animated gradient base - reduced opacity */}
        <div
          className="absolute inset-0 opacity-20 hero-wave-gradient"
          aria-hidden
        />
        {/* SVG wave layers - more subtle, reduced opacity on mobile */}
        <div className="absolute inset-0 opacity-10 md:opacity-15 hero-wave-shapes" aria-hidden>
          <svg className="absolute bottom-0 left-0 w-full h-1/2 animate-wave-slow" viewBox="0 0 1200 400" preserveAspectRatio="none">
            <defs>
              <linearGradient id="hero-wave-grad-1" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#ff8c42" stopOpacity="0.6" />
                <stop offset="50%" stopColor="#e040fb" stopOpacity="0.5" />
                <stop offset="100%" stopColor="#00bcd4" stopOpacity="0.6" />
              </linearGradient>
            </defs>
            <path fill="url(#hero-wave-grad-1)" d="M0,200 Q300,80 600,200 T1200,200 L1200,400 L0,400 Z" />
          </svg>
          <svg className="absolute bottom-0 left-0 w-full h-1/2 animate-wave-slower" viewBox="0 0 1200 400" preserveAspectRatio="none" style={{ animationDelay: "-1.5s" }}>
            <defs>
              <linearGradient id="hero-wave-grad-2" x1="100%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#7c4dff" stopOpacity="0.5" />
                <stop offset="50%" stopColor="#ff6b9d" stopOpacity="0.5" />
                <stop offset="100%" stopColor="#69f0ae" stopOpacity="0.4" />
              </linearGradient>
            </defs>
            <path fill="url(#hero-wave-grad-2)" d="M0,250 Q400,120 800,250 T1600,250 L1600,400 L0,400 Z" />
          </svg>
          <svg className="absolute top-0 left-0 w-full h-1/3 animate-wave-slow" viewBox="0 0 1200 300" preserveAspectRatio="none" style={{ animationDelay: "-0.5s" }}>
            <defs>
              <linearGradient id="hero-wave-grad-3" x1="0%" y1="100%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#26c6da" stopOpacity="0.35" />
                <stop offset="100%" stopColor="#e040fb" stopOpacity="0.35" />
              </linearGradient>
            </defs>
            <path fill="url(#hero-wave-grad-3)" d="M0,100 Q600,0 1200,100 L1200,300 L0,300 Z" />
          </svg>
        </div>
        {/* Subtle gradient orbs - more techy, smaller on mobile */}
        <div className="absolute top-1/4 -left-1/4 w-48 h-48 md:w-96 md:h-96 bg-primary/8 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 -right-1/4 w-48 h-48 md:w-96 md:h-96 bg-secondary/8 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
        {/* Tech grid pattern - more subtle */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(hsl(var(--primary) / 0.1) 1px, transparent 1px),
                              linear-gradient(90deg, hsl(var(--primary) / 0.1) 1px, transparent 1px)`,
            backgroundSize: "50px 50px",
          }}
        />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center max-w-4xl mx-auto">
          {/* Make Mind Marvel - White Bold Text above logo */}
          <p className="hero-mind-marvel-text text-lg md:text-xl lg:text-2xl font-bold text-white uppercase tracking-[0.2em] mb-6 animate-fade-in relative z-10" style={{ animationDelay: "80ms" }}>
            Make Mind Marvel
          </p>

          <div className="mb-6 animate-fade-in flex flex-col justify-center relative min-h-[45vh] items-center" style={{ animationDelay: "100ms" }}>

            {/* THUNDER LINES SECTION - Multiple lightning strikes around logo area */}
            {/* 
              THUNDER LINE LOCATIONS:
              1. Main Lightning Strikes (2 lines) - Lines 170-220: Two main jagged lightning paths at different angles
              2. Thinner Lightning Strikes (8 lines) - Lines 222-267: Eight thinner lightning paths at various angles
              3. Lightning Strike Effects (4 lines) - Lines 204-215: Four rotating vertical lightning beams around logo container
              
              TO REMOVE ANY THUNDER LINES:
              - Remove main strikes: Delete the Array(2).map() block (lines 170-220)
              - Remove thinner strikes: Delete the Array(8).map() block (lines 222-267)  
              - Remove rotating beams: Delete the Array(4).map() block (lines 204-215)
            */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
              {/* Main lightning strikes - 2 only (THUNDER LINES GROUP 1) */}
              {/* {[...Array(2)].map((_, i) => {
                // Use fixed seed for consistent randomness per lightning
                const seed = i * 7;
                const angle = (i * 90) + (seed % 20) - 10;
                const startX = 50 + Math.cos((angle * Math.PI) / 180) * 30;
                const startY = 50 + Math.sin((angle * Math.PI) / 180) * 30;
                const endX = 50 + Math.cos((angle * Math.PI) / 180) * 45;
                const endY = 50 + Math.sin((angle * Math.PI) / 180) * 45;
                const gradientId = `lightningGradient-${i}`;
                // Create jagged lightning path with fixed offsets
                const offset1 = ((seed * 3) % 4) - 2;
                const offset2 = ((seed * 5) % 6) - 3;
                const offset3 = ((seed * 7) % 4) - 2;
                const offset4 = ((seed * 11) % 4) - 2;
                return (
                  <svg
                    key={i}
                    className="hero-lightning-strike-svg absolute"
                    style={{
                      width: '100%',
                      height: '100%',
                      animationDelay: `${i * 0.8 + (seed % 10) * 0.1}s`,
                      animationDuration: `${4 + (seed % 4) * 0.5}s`,
                    }}
                    viewBox="0 0 100 100"
                    preserveAspectRatio="none"
                  >
                    <defs>
                      <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0" />
                        <stop offset="50%" stopColor="hsl(var(--primary))" stopOpacity="1" />
                        <stop offset="100%" stopColor="hsl(var(--secondary))" stopOpacity="0.8" />
                      </linearGradient>
                    </defs>
                    <path
                      d={`M ${startX} ${startY} 
                          L ${startX + (endX - startX) * 0.2} ${startY + (endY - startY) * 0.2 + offset1} 
                          L ${startX + (endX - startX) * 0.4} ${startY + (endY - startY) * 0.4 + offset2} 
                          L ${startX + (endX - startX) * 0.6} ${startY + (endY - startY) * 0.6 + offset3} 
                          L ${startX + (endX - startX) * 0.8} ${startY + (endY - startY) * 0.8 + offset4} 
                          L ${endX} ${endY}`}
                      stroke={`url(#${gradientId})`}
                      strokeWidth="0.6"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="hero-lightning-path"
                    />
                  </svg>
                );
              })} */}
              {/* Thinner lightning strikes - reduced to 6 for performance (THUNDER LINES GROUP 2) */}
              {isLoaded && [...Array(6)].map((_, i) => {
                const seed = (i + 10) * 7;
                const angle = (i * 45) + (seed % 15) - 7.5;
                const startX = 50 + Math.cos((angle * Math.PI) / 180) * 25;
                const startY = 50 + Math.sin((angle * Math.PI) / 180) * 25;
                const endX = 50 + Math.cos((angle * Math.PI) / 180) * 40;
                const endY = 50 + Math.sin((angle * Math.PI) / 180) * 40;
                const gradientId = `lightningGradient-thin-${i}`;
                const offset1 = ((seed * 3) % 3) - 1.5;
                const offset2 = ((seed * 5) % 4) - 2;
                const offset3 = ((seed * 7) % 3) - 1.5;
                return (
                  <svg
                    key={`thin-${i}`}
                    className="hero-lightning-strike-svg absolute opacity-60"
                    style={{
                      width: '100%',
                      height: '100%',
                      animationDelay: `${i * 0.5 + (seed % 8) * 0.1}s`,
                      animationDuration: `${3 + (seed % 3) * 0.4}s`,
                    }}
                    viewBox="0 0 100 100"
                    preserveAspectRatio="none"
                  >
                    <defs>
                      <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0" />
                        <stop offset="50%" stopColor="hsl(var(--primary))" stopOpacity="0.6" />
                        <stop offset="100%" stopColor="hsl(var(--secondary))" stopOpacity="0.4" />
                      </linearGradient>
                    </defs>
                    <path
                      d={`M ${startX} ${startY} 
                          L ${startX + (endX - startX) * 0.3} ${startY + (endY - startY) * 0.3 + offset1} 
                          L ${startX + (endX - startX) * 0.6} ${startY + (endY - startY) * 0.6 + offset2} 
                          L ${endX} ${endY + offset3}`}
                      stroke={`url(#${gradientId})`}
                      strokeWidth="0.3"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="hero-lightning-path"
                    />
                  </svg>
                );
              })}
            </div>

            {/* Stars/Sparks instead of circular particles - lazy loaded, reduced on mobile */}
            {isLoaded && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                {/* Desktop stars */}
                {[...Array(15)].map((_, i) => {
                  const angle = (i * 360) / 20;
                  const radius = 150 + Math.random() * 150;
                  const x = Math.cos((angle * Math.PI) / 180) * radius;
                  const y = Math.sin((angle * Math.PI) / 180) * radius;
                  const size = 3 + Math.random() * 4;
                  return (
                    <div
                      key={`desktop-${i}`}
                      className="hero-star-spark absolute hidden md:block"
                      style={{
                        animationDelay: `${i * 0.15}s`,
                        animationDuration: `${2 + Math.random() * 2}s`,
                        left: `calc(50% + ${x}px)`,
                        top: `calc(50% + ${y}px)`,
                        transform: 'translate(-50%, -50%)',
                        width: `${size}px`,
                        height: `${size}px`,
                      }}
                    >
                      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                          d="M12 2L14.09 8.26L20 9.27L15 14.14L16.18 20.02L12 16.77L7.82 20.02L9 14.14L4 9.27L9.91 8.26L12 2Z"
                          fill="hsl(var(--primary))"
                          className="hero-star-path"
                        />
                      </svg>
                    </div>
                  );
                })}
                {/* Mobile stars - fewer */}
                {[...Array(8)].map((_, i) => {
                  const angle = (i * 360) / 20;
                  const radius = 150 + Math.random() * 150;
                  const x = Math.cos((angle * Math.PI) / 180) * radius;
                  const y = Math.sin((angle * Math.PI) / 180) * radius;
                  const size = 3 + Math.random() * 4;
                  return (
                    <div
                      key={`mobile-star-${i}`}
                      className="hero-star-spark absolute md:hidden"
                      style={{
                        animationDelay: `${i * 0.15}s`,
                        animationDuration: `${2 + Math.random() * 2}s`,
                        left: `calc(50% + ${x}px)`,
                        top: `calc(50% + ${y}px)`,
                        transform: 'translate(-50%, -50%)',
                        width: `${size}px`,
                        height: `${size}px`,
                      }}
                    >
                      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                          d="M12 2L14.09 8.26L20 9.27L15 14.14L16.18 20.02L12 16.77L7.82 20.02L9 14.14L4 9.27L9.91 8.26L12 2Z"
                          fill="hsl(var(--primary))"
                          className="hero-star-path"
                        />
                      </svg>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Main logo with thunder/storm effects */}
            <div className="relative z-10 hero-logo-container">
              {/* Lightning strike effects around logo - lazy loaded */}
              {/* Hide only the first two thick lines (vertical and horizontal cross) on mobile */}
              {isLoaded && [...Array(4)].map((_, i) => {
                // First two (i=0, i=1) are the vertical and horizontal thick lines of the cross - hide on mobile
                // Last two (i=2, i=3) are diagonal - keep visible
                const isThickCrossLine = i === 3 || i === 1;
                return (
                  <div
                    key={i}
                    className={`hero-lightning-strike absolute ${isThickCrossLine ? 'thick-cross-line-mobile' : ''}`}
                    style={{
                      animationDelay: `${i * 1.5 + Math.random() * 1}s`,
                      animationDuration: `${4 + Math.random() * 2}s`,
                      transform: `rotate(${i * 90}deg)`,
                      transformOrigin: 'center',
                      ...(isThickCrossLine ? { display: 'none' } : {}),
                    }}
                  />
                );
              })}

              <img
                src="/Logo 7.png"
                alt="CREATION 2K26"
                loading="eager"
                fetchPriority="high"
                className={`hero-logo-main w-[90vw] sm:w-[75vw] max-w-[650px] h-auto object-contain transition-all duration-500 ${isLoaded ? 'opacity-100' : 'opacity-0'
                  }`}
                style={{ willChange: 'transform' }}
              />
            </div>
          </div>

          {/* Tagline */}
          <div className="text-xl md:text-2xl text-muted-foreground mb-8 animate-fade-in" style={{ animationDelay: "200ms" }}>
            <p className="text-primary font-semibold">Bachelor of Computer Applications</p>
            <p className="text-secondary font-semibold">Bishop Heber College, Trichy</p>
          </div>

          {/* Event Info - floating pills */}
          <div className="flex flex-wrap justify-center gap-6 mb-12 animate-fade-in" style={{ animationDelay: "300ms" }}>
            <div className="hero-pill-float flex items-center gap-2 px-4 py-2 rounded-full bg-primary/5 border border-primary/20 text-muted-foreground">
              <Calendar className="w-5 h-5 text-primary" />
              <span>{formattedDate}</span>
            </div>
            <div className="hero-pill-float flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/5 border border-secondary/20 text-muted-foreground" style={{ animationDelay: "0.5s" }}>
              <MapPin className="w-5 h-5 text-secondary" />
              <span className="text-center sm:text-left">
                <span className="sm:inline">{VENUE.name}</span>
                <span className="sm:hidden"><br /></span>
                <span className="hidden sm:inline">, </span>
                {VENUE.college}
              </span>
            </div>
          </div>

          {/* Countdown Timer - Square with Loading Line Effect */}
          <div className="flex flex-wrap justify-center items-end gap-3 md:gap-5 mb-12 animate-fade-in" style={{ animationDelay: "400ms" }}>
            {[
              { value: timeLeft.days, label: "DAYS", max: 365 },
              { value: timeLeft.hours, label: "HOURS", max: 24 },
              { value: timeLeft.minutes, label: "MINUTES", max: 60 },
              { value: timeLeft.seconds, label: "SECONDS", max: 60 },
            ].map((item, index) => {
              // Progress fills as time decreases (full when max, empty when 0)
              const progress = (item.value / item.max) * 100;
              return (
                <div key={item.label} className="flex flex-col items-center">
                  <div
                    className="relative w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 rounded-lg border-2 border-primary/40 bg-background/80 backdrop-blur-sm overflow-hidden techy-timer-square"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    {/* Corner accents */}
                    <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-primary/60" />
                    <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-primary/60" />
                    <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-primary/60" />
                    <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-primary/60" />

                    {/* Loading line effect - fills from bottom */}
                    <div
                      className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-primary/40 via-primary/30 to-primary/20 transition-all duration-1000 ease-out"
                      style={{ height: `${progress}%` }}
                    >
                      {/* Animated shimmer on loading line */}
                      <div className="absolute inset-0 bg-gradient-to-t from-transparent via-white/20 to-transparent animate-shimmer-line" />
                    </div>

                    {/* Grid pattern overlay */}
                    <div
                      className="absolute inset-0 opacity-5"
                      style={{
                        backgroundImage: `
                          linear-gradient(hsl(var(--primary)) 1px, transparent 1px),
                          linear-gradient(90deg, hsl(var(--primary)) 1px, transparent 1px)
                        `,
                        backgroundSize: "8px 8px",
                      }}
                    />

                    {/* Number */}
                    <div className="relative w-full h-full flex items-center justify-center z-10">
                      <span
                        key={`${item.label}-${item.value}`}
                        className="text-2xl sm:text-3xl md:text-4xl font-mono font-bold tabular-nums text-primary drop-shadow-[0_0_8px_hsl(var(--primary)/0.5)]"
                      >
                        {String(item.value).padStart(2, "0")}
                      </span>
                    </div>

                    {/* Subtle scanline effect */}
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent animate-pulse" />
                  </div>
                  <span className="mt-2 text-[10px] sm:text-xs font-mono font-semibold uppercase tracking-[0.3em] text-muted-foreground">
                    {item.label}
                  </span>
                </div>
              );
            })}
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-wrap justify-center gap-4 animate-fade-in" style={{ animationDelay: "500ms" }}>
            <NeonButton
              variant="cyan"
              size="xl"
              onClick={() => navigate("/register")}
              className="register-now-button"
            >
              Register Now
            </NeonButton>
            <NeonButton
              variant="outline"
              size="xl"
              onClick={() => document.getElementById("events")?.scrollIntoView({ behavior: "smooth" })}
            >
              Explore Events
            </NeonButton>
          </div>

          {/* Scroll Indicator */}
          <div className="mt-16 animate-bounce">
            <a href="#events" className="inline-flex flex-col items-center gap-2 text-muted-foreground hover:text-primary transition-colors">
              <span className="text-sm">Scroll to explore</span>
              <ArrowDown className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>

      {/* Marquee strip - continuous scrolling */}
      <div className="absolute bottom-0 left-0 right-0 py-3 overflow-hidden border-t border-white/5 bg-background/50 backdrop-blur-sm">
        <div className="hero-marquee-track flex gap-12 whitespace-nowrap text-xs uppercase tracking-[0.25em] text-muted-foreground/70">
          <span className="flex gap-12 shrink-0">
            CREATION 2K26 · REGISTER NOW · 10 EVENTS · BACHELOR OF COMPUTER APPLICATIONS · BISHOP HEBER COLLEGE, TRICHY ·
          </span>
          <span className="flex gap-12 shrink-0">
            CREATION 2K26 · REGISTER NOW · 10 EVENTS · BACHELOR OF COMPUTER APPLICATIONS · BISHOP HEBER COLLEGE, TRICHY ·
          </span>
          <span className="flex gap-12 shrink-0">
            CREATION 2K26 · REGISTER NOW · 10 EVENTS · BACHELOR OF COMPUTER APPLICATIONS · BISHOP HEBER COLLEGE, TRICHY ·
          </span>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
