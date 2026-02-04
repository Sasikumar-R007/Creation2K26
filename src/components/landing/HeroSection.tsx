import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Sparkles, Calendar, MapPin, ArrowDown } from "lucide-react";
import { NeonButton } from "@/components/ui/neon-button";
import { EVENT_DATE, VENUE } from "@/lib/constants";

const HeroSection = () => {
  const navigate = useNavigate();
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

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

  return (
    <section className="min-h-screen flex items-center justify-center relative overflow-hidden pt-24 pb-16">
      {/* Background Effects - wave colors */}
      <div className="absolute inset-0 overflow-hidden bg-background">
        {/* Animated iridescent wave gradient base */}
        <div 
          className="absolute inset-0 opacity-40 hero-wave-gradient"
          aria-hidden
        />
        {/* SVG wave layers with gradient fills */}
        <div className="absolute inset-0 opacity-30 hero-wave-shapes" aria-hidden>
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
        {/* Soft gradient orbs (kept subtle behind waves) */}
        <div className="absolute top-1/4 -left-1/4 w-96 h-96 bg-primary/15 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 -right-1/4 w-96 h-96 bg-secondary/15 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
        {/* Grid pattern */}
        <div 
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `linear-gradient(hsl(var(--primary) / 0.15) 1px, transparent 1px),
                              linear-gradient(90deg, hsl(var(--primary) / 0.15) 1px, transparent 1px)`,
            backgroundSize: "50px 50px",
          }}
        />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center max-w-4xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/30 mb-8 animate-fade-in">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">2026 Edition</span>
          </div>

          {/* Main Title */}
          <p className="hero-mind-marvel text-sm md:text-base uppercase tracking-[0.35em] mb-4 animate-fade-in" style={{ animationDelay: "80ms" }}>
            Make Mind Marvel
          </p>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6 animate-fade-in" style={{ animationDelay: "100ms" }}>
            <span className="hero-creation-text block">CREATION</span>
            <span className="hero-year-text block mt-2 text-4xl md:text-6xl lg:text-7xl tracking-tight">2K26</span>
          </h1>

          {/* Tagline */}
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 animate-fade-in" style={{ animationDelay: "200ms" }}>
            Where <span className="text-primary font-semibold">Innovation</span> Meets{" "}
            <span className="text-secondary font-semibold">Imagination</span>
          </p>

          {/* Event Info */}
          <div className="flex flex-wrap justify-center gap-6 mb-12 animate-fade-in" style={{ animationDelay: "300ms" }}>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Calendar className="w-5 h-5 text-primary" />
              <span>{formattedDate}</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <MapPin className="w-5 h-5 text-secondary" />
              <span>{VENUE.name}, {VENUE.college}</span>
            </div>
          </div>

          {/* Countdown Timer - premium */}
          <div className="flex flex-wrap justify-center items-end gap-3 md:gap-6 mb-12 animate-fade-in" style={{ animationDelay: "400ms" }}>
            {[
              { value: timeLeft.days, label: "Days" },
              { value: timeLeft.hours, label: "Hours" },
              { value: timeLeft.minutes, label: "Minutes" },
              { value: timeLeft.seconds, label: "Seconds" },
            ].map((item, index) => (
              <div key={item.label} className="flex flex-col items-center">
                <div
                  className="relative w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 rounded-2xl flex items-center justify-center overflow-hidden countdown-card group transition-transform duration-300 hover:scale-105"
                  style={{ animationDelay: `${index * 80}ms` }}
                >
                  {/* Gradient border glow */}
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/40 via-primary/20 to-secondary/30 opacity-80 group-hover:opacity-100 transition-opacity" />
                  <div className="absolute inset-[1px] rounded-2xl bg-card/95 backdrop-blur border border-white/5" />
                  {/* Inner glow */}
                  <div className="absolute inset-0 rounded-2xl shadow-[inset_0_0_30px_hsl(var(--primary)_/_0.15)]" />
                  <span
                    key={`${item.label}-${item.value}`}
                    className="relative text-3xl sm:text-4xl md:text-5xl font-bold tabular-nums text-transparent bg-clip-text bg-gradient-to-br from-primary via-primary to-secondary drop-shadow-[0_0_20px_hsl(var(--primary)_/_0.5)] countdown-digit"
                  >
                    {String(item.value).padStart(2, "0")}
                  </span>
                </div>
                <span className="mt-2 text-[10px] sm:text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground/90">
                  {item.label}
                </span>
              </div>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-wrap justify-center gap-4 animate-fade-in" style={{ animationDelay: "500ms" }}>
            <NeonButton
              variant="cyan"
              size="xl"
              onClick={() => navigate("/auth?tab=signup")}
              className="animate-glow-pulse"
            >
              <Sparkles className="w-5 h-5" />
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
    </section>
  );
};

export default HeroSection;
