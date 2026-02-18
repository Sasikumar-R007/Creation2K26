import { useMemo, useState, useCallback, useRef, useEffect } from "react";
import { useTechnicalEvents, useNonTechnicalEvents, useEvents } from "@/hooks/useEvents";
import { useMyRegistrations } from "@/hooks/useRegistrations";
import { conflictsWithRegistered, getParticipationForEvent } from "@/lib/eventParticipation";
import type { EventData } from "@/hooks/useEvents";
import EventCard from "./EventCard";
import { Skeleton } from "@/components/ui/skeleton";
import { Cpu, Palette } from "lucide-react";

const EventsGrid = () => {
  const { data: technicalEvents, isLoading: loadingTech } = useTechnicalEvents();
  const { data: nonTechnicalEvents, isLoading: loadingNonTech } = useNonTechnicalEvents();
  const { data: allEvents = [] } = useEvents();
  const { data: myRegistrations = [] } = useMyRegistrations();
  const [selectedEvent, setSelectedEvent] = useState<EventData | null>(null);

  const registeredEventNames = useMemo(
    () => myRegistrations.map((r) => r.events?.name).filter((name): name is string => !!name),
    [myRegistrations]
  );

  const isEventConflicting = useMemo(
    () => (eventName: string) => conflictsWithRegistered(eventName, registeredEventNames),
    [registeredEventNames]
  );

  const { canParticipateIds, cannotParticipateIds } = useMemo(() => {
    if (!selectedEvent || allEvents.length === 0) {
      return { canParticipateIds: new Set<string>(), cannotParticipateIds: new Set<string>() };
    }
    const { can, cannot } = getParticipationForEvent(selectedEvent.name, allEvents);
    return {
      canParticipateIds: new Set(can.map((e) => e.id)),
      cannotParticipateIds: new Set(cannot.map((e) => e.id)),
    };
  }, [selectedEvent, allEvents]);

  const onModalOpen = useCallback((event: EventData) => setSelectedEvent(event), []);
  const onModalClose = useCallback(() => setSelectedEvent(null), []);

  // Sort non-technical events to put "Personality Contest" first - MUST be before useEffects that use it
  const sortedNonTechnicalEvents = useMemo(() => {
    if (!nonTechnicalEvents) return [];
    return [...nonTechnicalEvents].sort((a, b) => {
      if (a.name === "Personality Contest") return -1;
      if (b.name === "Personality Contest") return 1;
      return a.name.localeCompare(b.name);
    });
  }, [nonTechnicalEvents]);
  
  // Scroll tracking for pagination dots (2 dots: left/right)
  const [techScrollState, setTechScrollState] = useState({ canScrollLeft: false, canScrollRight: true });
  const [nonTechScrollState, setNonTechScrollState] = useState({ canScrollLeft: false, canScrollRight: true });
  const techScrollRef = useRef<HTMLDivElement>(null);
  const nonTechScrollRef = useRef<HTMLDivElement>(null);
  
  // Handle scroll for technical events
  useEffect(() => {
    const container = techScrollRef.current;
    if (!container || !technicalEvents || technicalEvents.length === 0) return;
    
    const handleScroll = () => {
      const scrollLeft = container.scrollLeft;
      const maxScroll = container.scrollWidth - container.clientWidth;
      const canScrollLeft = scrollLeft > 10; // 10px threshold
      const canScrollRight = scrollLeft < maxScroll - 10; // 10px threshold
      setTechScrollState({ canScrollLeft, canScrollRight });
    };
    
    // Initial calculation
    handleScroll();
    
    container.addEventListener('scroll', handleScroll, { passive: true });
    // Also check on resize
    window.addEventListener('resize', handleScroll, { passive: true });
    return () => {
      container.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, [technicalEvents]);
  
  // Handle scroll for non-technical events
  useEffect(() => {
    const container = nonTechScrollRef.current;
    if (!container || !sortedNonTechnicalEvents || sortedNonTechnicalEvents.length === 0) return;
    
    const handleScroll = () => {
      const scrollLeft = container.scrollLeft;
      const maxScroll = container.scrollWidth - container.clientWidth;
      const canScrollLeft = scrollLeft > 10; // 10px threshold
      const canScrollRight = scrollLeft < maxScroll - 10; // 10px threshold
      setNonTechScrollState({ canScrollLeft, canScrollRight });
    };
    
    // Initial calculation
    handleScroll();
    
    container.addEventListener('scroll', handleScroll, { passive: true });
    // Also check on resize
    window.addEventListener('resize', handleScroll, { passive: true });
    return () => {
      container.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, [sortedNonTechnicalEvents]);

  const isLoading = loadingTech || loadingNonTech;

  if (isLoading) {
    return (
      <div className="space-y-16">
        {/* Technical Events Skeleton */}
        <div>
          <div className="flex items-center gap-3 mb-8">
            <Skeleton className="w-10 h-10 rounded-xl" />
            <Skeleton className="h-8 w-48" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-64 rounded-xl" />
            ))}
          </div>
        </div>
        
        {/* Non-Technical Events Skeleton */}
        <div>
          <div className="flex items-center gap-3 mb-8">
            <Skeleton className="w-10 h-10 rounded-xl" />
            <Skeleton className="h-8 w-48" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-64 rounded-xl" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-16">
      {/* Technical Events */}
      <div>
        <div className="flex items-center gap-4 mb-12 relative group">
          <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/30 flex items-center justify-center transition-all duration-500 group-hover:scale-110 group-hover:border-primary/50 group-hover:shadow-[0_0_20px_hsl(var(--primary)_/_0.3)]">
            <Cpu className="w-7 h-7 text-primary transition-transform duration-500 group-hover:rotate-12" />
          </div>
          <div className="relative">
            <h3 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary via-primary to-cyan-300 bg-clip-text text-transparent transition-all duration-500 group-hover:drop-shadow-[0_0_15px_hsl(var(--primary)_/_0.5)]">
              Technical Events
            </h3>
            <p className="text-muted-foreground text-sm mt-1 group-hover:text-foreground/80 transition-colors duration-300">Showcase your technical prowess</p>
          </div>
        </div>
        
        {/* Horizontal Scrollable Container - Desktop, Vertical Stack - Mobile */}
        <div className="relative">
          {/* Desktop: Horizontal Scroll */}
          <div className="hidden md:block">
            <div ref={techScrollRef} className="overflow-x-auto scrollbar-hide pb-4 -mx-4 px-4">
              <div className="flex gap-6 min-w-max">
                {technicalEvents?.map((event, index) => (
                  <div key={event.id} className="flex-shrink-0 w-[300px]">
                    <EventCard
                      event={event}
                      index={index}
                      hasConflictWithRegistered={isEventConflicting(event.name)}
                      selectedEventId={selectedEvent?.id ?? null}
                      canParticipateIds={canParticipateIds}
                      cannotParticipateIds={cannotParticipateIds}
                      onModalOpen={onModalOpen}
                      onModalClose={onModalClose}
                    />
                  </div>
                ))}
              </div>
            </div>
            {/* Pagination Dots - Desktop (2 dots) */}
            {technicalEvents && technicalEvents.length > 0 && (
              <div className="flex justify-center items-center gap-2 mt-6">
                <div
                  className={`transition-all duration-300 ${
                    techScrollState.canScrollLeft
                      ? "w-8 h-2 rounded-full bg-primary"
                      : "w-2 h-2 rounded-full bg-muted-foreground/30"
                  }`}
                />
                <div
                  className={`transition-all duration-300 ${
                    techScrollState.canScrollRight
                      ? "w-8 h-2 rounded-full bg-primary"
                      : "w-2 h-2 rounded-full bg-muted-foreground/30"
                  }`}
                />
              </div>
            )}
            {/* Scroll hint gradient fade */}
            <div className="absolute right-0 top-0 bottom-4 w-20 bg-gradient-to-l from-background to-transparent pointer-events-none" />
          </div>
          
          {/* Mobile: Vertical Stack */}
          <div className="md:hidden grid grid-cols-1 gap-6">
            {technicalEvents?.map((event, index) => (
              <EventCard
                key={event.id}
                event={event}
                index={index}
                hasConflictWithRegistered={isEventConflicting(event.name)}
                selectedEventId={selectedEvent?.id ?? null}
                canParticipateIds={canParticipateIds}
                cannotParticipateIds={cannotParticipateIds}
                onModalOpen={onModalOpen}
                onModalClose={onModalClose}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Non-Technical Events */}
      <div>
        <div className="flex items-center gap-4 mb-12 relative group">
          <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-secondary/20 to-secondary/5 border border-secondary/30 flex items-center justify-center transition-all duration-500 group-hover:scale-110 group-hover:border-secondary/50 group-hover:shadow-[0_0_20px_hsl(var(--secondary)_/_0.3)]">
            <Palette className="w-7 h-7 text-secondary transition-transform duration-500 group-hover:rotate-12" />
          </div>
          <div className="relative">
            <h3 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-secondary via-secondary to-purple-300 bg-clip-text text-transparent transition-all duration-500 group-hover:drop-shadow-[0_0_15px_hsl(var(--secondary)_/_0.5)]">
              Non-Technical Events
            </h3>
            <p className="text-muted-foreground text-sm mt-1 group-hover:text-foreground/80 transition-colors duration-300">Unleash your creativity</p>
          </div>
        </div>
        
        {/* Horizontal Scrollable Container - Desktop, Vertical Stack - Mobile */}
        <div className="relative">
          {/* Desktop: Horizontal Scroll */}
          <div className="hidden md:block">
            <div ref={nonTechScrollRef} className="overflow-x-auto scrollbar-hide pb-4 -mx-4 px-4">
              <div className="flex gap-6 min-w-max">
                {sortedNonTechnicalEvents.map((event, index) => (
                  <div key={event.id} className="flex-shrink-0 w-[300px]">
                    <EventCard
                      event={event}
                      index={index}
                      hasConflictWithRegistered={isEventConflicting(event.name)}
                      selectedEventId={selectedEvent?.id ?? null}
                      canParticipateIds={canParticipateIds}
                      cannotParticipateIds={cannotParticipateIds}
                      onModalOpen={onModalOpen}
                      onModalClose={onModalClose}
                    />
                  </div>
                ))}
              </div>
            </div>
            {/* Pagination Dots - Desktop (2 dots) */}
            {sortedNonTechnicalEvents && sortedNonTechnicalEvents.length > 0 && (
              <div className="flex justify-center items-center gap-2 mt-6">
                <div
                  className={`transition-all duration-300 ${
                    nonTechScrollState.canScrollLeft
                      ? "w-8 h-2 rounded-full bg-secondary"
                      : "w-2 h-2 rounded-full bg-muted-foreground/30"
                  }`}
                />
                <div
                  className={`transition-all duration-300 ${
                    nonTechScrollState.canScrollRight
                      ? "w-8 h-2 rounded-full bg-secondary"
                      : "w-2 h-2 rounded-full bg-muted-foreground/30"
                  }`}
                />
              </div>
            )}
            {/* Scroll hint gradient fade */}
            <div className="absolute right-0 top-0 bottom-4 w-20 bg-gradient-to-l from-background to-transparent pointer-events-none" />
          </div>
          
          {/* Mobile: Vertical Stack */}
          <div className="md:hidden grid grid-cols-1 gap-6">
            {sortedNonTechnicalEvents.map((event, index) => (
              <EventCard
                key={event.id}
                event={event}
                index={index}
                hasConflictWithRegistered={isEventConflicting(event.name)}
                selectedEventId={selectedEvent?.id ?? null}
                canParticipateIds={canParticipateIds}
                cannotParticipateIds={cannotParticipateIds}
                onModalOpen={onModalOpen}
                onModalClose={onModalClose}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventsGrid;
