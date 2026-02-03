import { useMemo } from "react";
import { useTechnicalEvents, useNonTechnicalEvents } from "@/hooks/useEvents";
import { useMyRegistrations } from "@/hooks/useRegistrations";
import { conflictsWithRegistered } from "@/lib/eventParticipation";
import EventCard from "./EventCard";
import { Skeleton } from "@/components/ui/skeleton";
import { Cpu, Palette } from "lucide-react";

const EventsGrid = () => {
  const { data: technicalEvents, isLoading: loadingTech } = useTechnicalEvents();
  const { data: nonTechnicalEvents, isLoading: loadingNonTech } = useNonTechnicalEvents();
  const { data: myRegistrations = [] } = useMyRegistrations();

  const registeredEventNames = useMemo(
    () => myRegistrations.map((r) => r.events?.name).filter((name): name is string => !!name),
    [myRegistrations]
  );

  const isEventConflicting = useMemo(
    () => (eventName: string) => conflictsWithRegistered(eventName, registeredEventNames),
    [registeredEventNames]
  );

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
        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
            <Cpu className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-glow-cyan">Technical Events</h3>
            <p className="text-muted-foreground text-sm">Showcase your technical prowess</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {technicalEvents?.map((event, index) => (
            <EventCard
              key={event.id}
              event={event}
              index={index}
              hasConflictWithRegistered={isEventConflicting(event.name)}
            />
          ))}
        </div>
      </div>

      {/* Non-Technical Events */}
      <div>
        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center">
            <Palette className="w-6 h-6 text-secondary" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-glow-purple">Non-Technical Events</h3>
            <p className="text-muted-foreground text-sm">Unleash your creativity</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {nonTechnicalEvents?.map((event, index) => (
            <EventCard
              key={event.id}
              event={event}
              index={index}
              hasConflictWithRegistered={isEventConflicting(event.name)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default EventsGrid;
