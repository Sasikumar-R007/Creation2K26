import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import HeroSection from "@/components/landing/HeroSection";
import AboutSection from "@/components/landing/AboutSection";
import CoordinatorsSection from "@/components/landing/CoordinatorsSection";
import FacultyCoordinatorsSection from "@/components/landing/FacultyCoordinatorsSection";
import ContactSection from "@/components/landing/ContactSection";
import EventsGrid from "@/components/events/EventsGrid";

const Index = () => {
  return (
    <div className="min-h-screen bg-background dark relative">
      {/* Techy Background Animations - Non-square */}
      <div className="techy-bg-animation" />
      
      <Navbar />
      
      {/* Hero Section */}
      <section id="home">
        <HeroSection />
      </section>

      {/* Events Section */}
      <section id="events" className="py-24 relative">
        <div className="container mx-auto px-4">
          {/* Section Header - Modern Tech Style */}
          <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-20 relative group">
            <div className="relative">
              <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 transition-all duration-500 group-hover:scale-105">
                Explore Our <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent bg-[length:200%_auto] animate-gradient-shift">Events</span>
              </h2>
              
              {/* Prize Pool Badge - Back to original position */}
              <div className="absolute -top-4 -right-8 md:-right-12 lg:-right-20 transform rotate-[8deg] hover:rotate-[5deg] transition-transform duration-300 z-10 scale-75 sm:scale-100">
                <div className="relative bg-gradient-to-br from-yellow-500 via-amber-500 to-yellow-600 rounded-3xl p-4 md:p-5 shadow-[0_0_30px_rgba(251,191,36,0.6),0_0_60px_rgba(245,158,11,0.4),inset_0_0_20px_rgba(255,255,255,0.2)] border-2 border-yellow-300/60 hover:border-yellow-200 hover:shadow-[0_0_40px_rgba(251,191,36,0.8),0_0_80px_rgba(245,158,11,0.6)] transition-all duration-300 hover:scale-105">
                {/* Animated shine effect - like a biscuit */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/40 via-white/20 to-transparent rounded-3xl pointer-events-none animate-pulse" />
                {/* Rotating shine sweep - biscuit shimmer */}
                <div className="absolute inset-0 rounded-3xl pointer-events-none overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent transform -skew-x-12 animate-shimmer-sweep" />
                </div>
                {/* Inner golden glow - reduced */}
                <div className="absolute inset-0 bg-gradient-to-br from-yellow-300/20 via-amber-400/15 to-transparent rounded-3xl blur-xl" />
                {/* Outer golden aura - reduced glow */}
                <div className="absolute -inset-2 bg-gradient-to-br from-yellow-400/10 via-amber-500/8 to-yellow-600/10 rounded-3xl blur-2xl -z-10 animate-pulse" />
                
                <div className="relative z-10 text-center">
                  <div className="text-xs md:text-sm font-bold text-amber-950 uppercase tracking-wider mb-1 drop-shadow-md">
                    Prize Pool
                  </div>
                  <div className="text-2xl md:text-3xl font-extrabold text-amber-950 flex items-center justify-center gap-1 drop-shadow-lg">
                    <span className="text-yellow-50 drop-shadow-[0_0_8px_rgba(251,191,36,0.8)]">₹</span>
                    <span className="bg-gradient-to-b from-amber-950 via-amber-900 to-amber-950 bg-clip-text text-transparent drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)]">15,000</span>
                  </div>
                </div>
                
                {/* Biscuit texture - subtle dots for depth */}
                <div className="absolute inset-0 rounded-3xl opacity-20 pointer-events-none" style={{
                  backgroundImage: `radial-gradient(circle at 2px 2px, rgba(255,255,255,0.3) 1px, transparent 0)`,
                    backgroundSize: '8px 8px'
                  }} />
                </div>
              </div>
              
              <p className="text-muted-foreground text-base sm:text-lg group-hover:text-foreground/90 transition-colors duration-300 px-4">
                Choose from 10 exciting events spanning technical challenges and creative competitions.
                Register for multiple events and showcase your talents!
              </p>
              {/* Decorative line */}
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-transparent via-primary to-transparent group-hover:w-48 transition-all duration-700" />
            </div>
          </div>

          <EventsGrid />
        </div>
      </section>

      {/* About Section */}
      <AboutSection />

      {/* Faculty Coordinators Section */}
      <FacultyCoordinatorsSection />

      {/* Coordinators Section */}
      <CoordinatorsSection />

      {/* Contact Section */}
      <ContactSection />

      <Footer />
    </div>
  );
};

export default Index;
