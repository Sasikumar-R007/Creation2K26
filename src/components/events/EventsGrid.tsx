import { useMemo, useState, useCallback } from "react";
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {nonTechnicalEvents?.map((event, index) => (
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
  );
};

export default EventsGrid;
