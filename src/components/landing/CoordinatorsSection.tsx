import React, { useState, useEffect, useCallback, useRef } from "react";
import { ChevronLeft, ChevronRight, Volume2, VolumeX } from "lucide-react";
import { GlassPanel } from "@/components/ui/glass-panel";

// Student images in alphabetical order (as in folder)
const STUDENT_IMAGES = [
  { name: "Abi", image: "/Students ID/Abi.png" },
  { name: "Dharsha", image: "/Students ID/Dharsha.png" },
  { name: "Dharshith", image: "/Students ID/Dharshith.png" },
  { name: "Dheena", image: "/Students ID/Dheena.png" },
  { name: "Hafee", image: "/Students ID/Hafee.png" },
  { name: "Hari", image: "/Students ID/Hari.png" },
  { name: "Koli", image: "/Students ID/Koli.png" },
  { name: "Magitha", image: "/Students ID/Magitha.png" },
  { name: "Mallesh", image: "/Students ID/Mallesh.png" },
  { name: "Rishi", image: "/Students ID/Rishi.png" },
  { name: "Sasi", image: "/Students ID/Sasi.png" },
  { name: "Shivani", image: "/Students ID/Shivani.png" },
  { name: "Sujai", image: "/Students ID/Sujai.png" },
];

const CoordinatorsSection = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasUserInteracted, setHasUserInteracted] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Auto-play functionality - always running
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % STUDENT_IMAGES.length);
    }, 3000); // Change slide every 3 seconds

    return () => clearInterval(interval);
  }, []); // Empty dependency array - always runs

  // Track user interaction anywhere on the page (click, scroll, touch, keypress)
  useEffect(() => {
    const handleUserInteraction = () => {
      setHasUserInteracted(true);
    };

    // Listen for various user interactions - don't use once:true so we catch interactions anytime
    const events = ['click', 'scroll', 'touchstart', 'keydown', 'mousedown', 'wheel'];
    events.forEach(event => {
      window.addEventListener(event, handleUserInteraction, { passive: true });
    });

    return () => {
      events.forEach(event => {
        window.removeEventListener(event, handleUserInteraction);
      });
    };
  }, []);

  // BGM Audio - auto-play when section is visible (after user has interacted with page)
  useEffect(() => {
    const section = document.getElementById('coordinators');
    if (!section) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && hasUserInteracted && audioRef.current) {
            // Section is visible and user has interacted - try to play audio
            const playPromise = audioRef.current.play();
            if (playPromise !== undefined) {
              playPromise
                .then(() => {
                  setIsPlaying(true);
                })
                .catch((err) => {
                  console.log('Audio play error:', err);
                  setIsPlaying(false);
                });
            }
          } else if (!entry.isIntersecting && audioRef.current) {
            // Section is not visible - pause audio
            audioRef.current.pause();
            setIsPlaying(false);
          }
        });
      },
      { threshold: 0.3 } // Trigger when 30% of section is visible
    );

    observer.observe(section);

    return () => {
      observer.disconnect();
    };
  }, [hasUserInteracted]);

  const goToPrevious = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + STUDENT_IMAGES.length) % STUDENT_IMAGES.length);
  }, []);

  const goToNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % STUDENT_IMAGES.length);
  }, []);

  // Handle audio play/pause (manual control)
  const handleAudioToggle = async () => {
    if (!audioRef.current) return;
    
    try {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        await audioRef.current.play();
        setIsPlaying(true);
        setHasUserInteracted(true);
      }
    } catch (error) {
      console.error('Audio play error:', error);
    }
  };

  const getVisibleIndices = () => {
    const indices = [];
    const total = STUDENT_IMAGES.length;
    
    // Get previous, current, and next indices
    for (let i = -2; i <= 2; i++) {
      const index = (currentIndex + i + total) % total;
      indices.push({ index, offset: i });
    }
    
    return indices;
  };

  return (
    <section id="coordinators" className="py-24 relative overflow-hidden">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Meet Our <span className="gradient-text">Coordinators</span>
          </h2>
          <p className="text-muted-foreground text-lg">
            The students working behind CREATION 2K26 to make this symposium a grand success.
          </p>
        </div>

        {/* 3D Carousel Container */}
        <div className="relative max-w-6xl mx-auto">
          <div className="relative h-[500px] md:h-[600px] flex items-center justify-center perspective-1000" style={{ perspective: '1000px' }}>
            {/* Navigation Arrows */}
            <button
              onClick={goToPrevious}
              className="absolute left-0 md:left-4 z-20 w-12 h-12 md:w-14 md:h-14 rounded-full bg-background/80 backdrop-blur-xl border-2 border-primary/50 hover:border-primary text-primary hover:bg-primary/10 transition-all duration-300 flex items-center justify-center shadow-lg hover:scale-110 active:scale-95"
              aria-label="Previous coordinator"
            >
              <ChevronLeft className="w-6 h-6 md:w-7 md:h-7" />
            </button>

            <button
              onClick={goToNext}
              className="absolute right-0 md:right-4 z-20 w-12 h-12 md:w-14 md:h-14 rounded-full bg-background/80 backdrop-blur-xl border-2 border-primary/50 hover:border-primary text-primary hover:bg-primary/10 transition-all duration-300 flex items-center justify-center shadow-lg hover:scale-110 active:scale-95"
              aria-label="Next coordinator"
            >
              <ChevronRight className="w-6 h-6 md:w-7 md:h-7" />
            </button>

            {/* Carousel Cards */}
            <div className="relative w-full h-full flex items-center justify-center">
              {getVisibleIndices().map(({ index, offset }) => {
                const student = STUDENT_IMAGES[index];
                const isActive = offset === 0;
                const isLeft = offset < 0;
                const isRight = offset > 0;
                
                // Calculate transform based on position
                const translateX = offset * 120; // Horizontal spacing
                const translateZ = -Math.abs(offset) * 100; // Depth effect
                const scale = isActive ? 1 : 0.7 - Math.abs(offset) * 0.15;
                const opacity = isActive ? 1 : 0.4 - Math.abs(offset) * 0.15;
                const blur = isActive ? 0 : Math.abs(offset) * 8;
                const rotateY = offset * 15; // 3D rotation

                return (
                  <div
                    key={`${student.name}-${index}`}
                    className="absolute transition-all duration-700 ease-in-out will-change-transform"
                    style={{
                      transform: `
                        translateX(${translateX}px) 
                        translateZ(${translateZ}px) 
                        scale(${scale}) 
                        rotateY(${rotateY}deg)
                      `,
                      opacity: Math.max(opacity, 0.1),
                      filter: `blur(${blur}px)`,
                      transformStyle: 'preserve-3d',
                      zIndex: isActive ? 10 : 5 - Math.abs(offset),
                      pointerEvents: isActive ? 'auto' : 'auto',
                    }}
                  >
                    <GlassPanel
                      variant="hover"
                      className={`w-[280px] md:w-[320px] h-[400px] md:h-[480px] overflow-hidden relative group transition-all duration-300 ${
                        isActive ? 'cursor-default' : 'cursor-pointer hover:scale-105'
                      }`}
                      onClick={() => {
                        if (!isActive) {
                          if (isLeft) goToPrevious();
                          else goToNext();
                        }
                      }}
                    >
                      {/* Card Content */}
                      <div className="relative w-full h-full flex items-center justify-center p-4">
                        {/* Student Image - Full height, fit to container */}
                        <div className="relative w-full h-full rounded-lg overflow-hidden bg-muted/20 border-2 border-primary/20 group-hover:border-primary/40 transition-all duration-300">
                          <img
                            src={student.image}
                            alt={student.name}
                            className="w-full h-full object-cover"
                            loading="lazy"
                          />
                          {/* Gradient overlay for depth */}
                          <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        </div>

                        {/* Active indicator */}
                        {isActive && (
                          <div className="absolute top-4 right-4 w-3 h-3 rounded-full bg-primary animate-pulse shadow-lg shadow-primary/50" />
                        )}
                      </div>

                      {/* Techy corner accents */}
                      <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-primary/30" />
                      <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-primary/30" />
                      <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-primary/30" />
                      <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-primary/30" />
                    </GlassPanel>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Dots Indicator */}
          <div className="flex justify-center gap-2 mt-8">
            {STUDENT_IMAGES.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  setCurrentIndex(index);
                }}
                className={`transition-all duration-300 rounded-full ${
                  index === currentIndex
                    ? "w-8 h-2 bg-primary"
                    : "w-2 h-2 bg-muted-foreground/30 hover:bg-muted-foreground/50"
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Background gradient effect */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent pointer-events-none -z-10" />
      
      {/* BGM Audio - only plays when section is visible and user has interacted */}
      <audio
        ref={audioRef}
        src="/bgm.mpeg"
        loop
        preload="metadata"
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
      />
    </section>
  );
};

export default CoordinatorsSection;

