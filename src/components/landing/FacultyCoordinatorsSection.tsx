import { useState, useEffect } from "react";
import { GraduationCap } from "lucide-react";
import { GlassPanel } from "@/components/ui/glass-panel";

// Faculty coordinators
const FACULTY_COORDINATORS = [
  { 
    name: "Dr.James Manoharan. J", 
    image: "/Other photos/James.jpeg", 
    details: [
      "Assoc. Prof. & Head",
      "UG Department of Computer Applications,",
      "Bishop Heber College (Autonomous)",
      "Trichy"
    ]
  },
  { 
    name: "Dr. Jasmine Christina Magdalene J", 
    image: null, 
    details: [
      "Assistant Professor",
      "UG Department of Computer Applications,",
      "Bishop Heber College (Autonomous)",
      "Trichy"
    ]
  },
  { 
    name: "Dr.Solomon Praveen Kumar N", 
    image: null, 
    details: [
      "Assistant Professor",
      "UG Department of Computer Applications,",
      "Bishop Heber College (Autonomous)",
      "Trichy"
    ]
  },
];

const FacultyCoordinatorsSection = () => {
  const [scrollPosition, setScrollPosition] = useState(0);

  // Auto-scroll on mobile
  useEffect(() => {
    const isMobile = window.innerWidth < 768;
    if (!isMobile) return;

    const interval = setInterval(() => {
      setScrollPosition((prev) => {
        const container = document.getElementById('faculty-scroll-container');
        if (!container) return prev;
        const maxScroll = container.scrollWidth - container.clientWidth;
        const cardWidth = 280;
        const gap = 24;
        const nextPosition = prev + cardWidth + gap;
        if (nextPosition >= maxScroll) {
          return 0; // Reset to start
        }
        return nextPosition;
      });
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const container = document.getElementById('faculty-scroll-container');
    if (container && window.innerWidth < 768) {
      container.scrollTo({
        left: scrollPosition,
        behavior: 'smooth',
      });
    }
  }, [scrollPosition]);

  return (
    <section id="faculty-coordinators" className="py-24 relative">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            <span className="gradient-text">Faculty Coordinators</span>
          </h2>
          <p className="text-muted-foreground text-lg">
            The dedicated faculty members guiding and supporting CREATION 2K26.
          </p>
        </div>

        {/* Faculty Grid - Desktop / Auto-scroll Mobile */}
        <div className="max-w-6xl mx-auto">
          {/* Desktop Grid */}
          <div className="hidden md:grid grid-cols-3 gap-6 md:gap-8">
            {FACULTY_COORDINATORS.map((faculty, index) => (
              <div key={index} className="flex flex-col items-stretch">
                <GlassPanel
                  variant="hover"
                  className="w-full max-w-[320px] mx-auto h-full p-6 relative group border-primary/20 hover:border-primary/40 transition-all duration-300 flex flex-col"
                >
                  {/* Faculty Image or Placeholder */}
                  <div className="relative w-full aspect-square mb-4 rounded-lg overflow-hidden bg-muted/20 border-2 border-primary/20 group-hover:border-primary/40 transition-all duration-300">
                    {faculty.image ? (
                      <img
                        src={faculty.image}
                        alt={faculty.name}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/10 to-secondary/10">
                        <GraduationCap className="w-16 h-16 text-muted-foreground/30" />
                      </div>
                    )}
                  </div>

                  {/* Faculty Name and Details */}
                  <div className="text-center flex-1 flex flex-col justify-start">
                    <h3 className="text-lg md:text-xl font-bold text-foreground mb-2">
                      {faculty.name}
                    </h3>
                    {faculty.details && (
                      <div className="space-y-0.5">
                        {faculty.details.map((detail, idx) => (
                          <p key={idx} className="text-sm text-muted-foreground">
                            {detail}
                          </p>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Techy corner accents */}
                  <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-primary/20" />
                  <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-primary/20" />
                  <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-primary/20" />
                  <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-primary/20" />
                </GlassPanel>
              </div>
            ))}
          </div>

          {/* Mobile Auto-scroll */}
          <div 
            id="faculty-scroll-container"
            className="md:hidden flex gap-6 overflow-x-auto snap-x snap-mandatory pb-4"
            style={{ 
              scrollbarWidth: 'none', 
              msOverflowStyle: 'none',
              WebkitOverflowScrolling: 'touch'
            }}
          >
            {FACULTY_COORDINATORS.map((faculty, index) => (
              <div key={index} className="flex-shrink-0 w-[280px] snap-center">
                <GlassPanel
                  variant="hover"
                  className="w-full h-full p-6 relative group border-primary/20 hover:border-primary/40 transition-all duration-300 flex flex-col"
                >
                  {/* Faculty Image or Placeholder */}
                  <div className="relative w-full aspect-square mb-4 rounded-lg overflow-hidden bg-muted/20 border-2 border-primary/20 group-hover:border-primary/40 transition-all duration-300">
                    {faculty.image ? (
                      <img
                        src={faculty.image}
                        alt={faculty.name}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/10 to-secondary/10">
                        <GraduationCap className="w-16 h-16 text-muted-foreground/30" />
                      </div>
                    )}
                  </div>

                  {/* Faculty Name and Details */}
                  <div className="text-center flex-1 flex flex-col justify-start">
                    <h3 className="text-lg md:text-xl font-bold text-foreground mb-2">
                      {faculty.name}
                    </h3>
                    {faculty.details && (
                      <div className="space-y-0.5">
                        {faculty.details.map((detail, idx) => (
                          <p key={idx} className="text-sm text-muted-foreground">
                            {detail}
                          </p>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Techy corner accents */}
                  <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-primary/20" />
                  <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-primary/20" />
                  <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-primary/20" />
                  <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-primary/20" />
                </GlassPanel>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Background gradient effect */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-secondary/5 to-transparent pointer-events-none -z-10" />
    </section>
  );
};

export default FacultyCoordinatorsSection;

