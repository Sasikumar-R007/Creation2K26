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
          <div className="text-center max-w-3xl mx-auto mb-20 relative group">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 transition-all duration-500 group-hover:scale-105">
              Explore Our <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent bg-[length:200%_auto] animate-gradient-shift">Events</span>
            </h2>
            <p className="text-muted-foreground text-lg group-hover:text-foreground/90 transition-colors duration-300">
              Choose from 10 exciting events spanning technical challenges and creative competitions.
              Register for multiple events and showcase your talents!
            </p>
            {/* Decorative line */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-transparent via-primary to-transparent group-hover:w-48 transition-all duration-700" />
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
