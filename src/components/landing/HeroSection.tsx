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
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Gradient orbs */}
        <div className="absolute top-1/4 -left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 -right-1/4 w-96 h-96 bg-secondary/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent/10 rounded-full blur-3xl" />
        
        {/* Grid pattern */}
        <div 
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `linear-gradient(hsl(var(--primary) / 0.1) 1px, transparent 1px),
                              linear-gradient(90deg, hsl(var(--primary) / 0.1) 1px, transparent 1px)`,
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
          <p className="text-sm md:text-base uppercase tracking-[0.35em] text-muted-foreground/90 mb-4 animate-fade-in" style={{ animationDelay: "80ms" }}>
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

          {/* Countdown Timer */}
          <div className="flex justify-center gap-4 md:gap-8 mb-12 animate-fade-in" style={{ animationDelay: "400ms" }}>
            {[
              { value: timeLeft.days, label: "Days" },
              { value: timeLeft.hours, label: "Hours" },
              { value: timeLeft.minutes, label: "Minutes" },
              { value: timeLeft.seconds, label: "Seconds" },
            ].map((item, index) => (
              <div key={item.label} className="text-center">
                <div className="w-16 h-16 md:w-20 md:h-20 rounded-xl bg-card/80 backdrop-blur border border-border/50 flex items-center justify-center mb-2 animate-glow-pulse" style={{ animationDelay: `${index * 200}ms` }}>
                  <span className="text-2xl md:text-3xl font-bold text-primary">
                    {String(item.value).padStart(2, "0")}
                  </span>
                </div>
                <span className="text-xs md:text-sm text-muted-foreground">{item.label}</span>
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
