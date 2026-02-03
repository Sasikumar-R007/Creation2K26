import { useState } from "react";
import * as LucideIcons from "lucide-react";
import { GlassPanel } from "@/components/ui/glass-panel";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { EventData } from "@/hooks/useEvents";
import EventModal from "./EventModal";

interface EventCardProps {
  event: EventData;
  index?: number;
  /** True when user has already registered for a conflicting event */
  hasConflictWithRegistered?: boolean;
}

// Dynamic icon component
const DynamicIcon = ({ name, className }: { name: string; className?: string }) => {
  const Icon = (LucideIcons as any)[name] || LucideIcons.Sparkles;
  return <Icon className={className} />;
};

const EventCard = ({ event, index = 0, hasConflictWithRegistered = false }: EventCardProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const isTechnical = event.category === "technical";
  const accentColor = isTechnical ? "cyan" : "purple";

  const card = (
    <GlassPanel
      variant="hover"
      glow={isTechnical ? "cyan" : "purple"}
        className={`
          p-6 cursor-pointer card-hover group
          animate-slide-up opacity-0
          hover:border-${accentColor === "cyan" ? "primary" : "secondary"}/50
        `}
      style={{
        animationDelay: `${index * 100}ms`,
        animationFillMode: "forwards",
      }}
      onClick={() => setIsModalOpen(true)}
    >
      {/* Category Badge + Conflict Badge */}
      <div className="flex justify-between items-start mb-4">
        <Badge
          variant={isTechnical ? "default" : "secondary"}
          className={`
            text-xs font-medium
            ${isTechnical
              ? "bg-primary/20 text-primary border-primary/30"
              : "bg-secondary/20 text-secondary border-secondary/30"
            }
          `}
        >
          {isTechnical ? "Technical" : "Non-Technical"}
        </Badge>
        {hasConflictWithRegistered && (
          <Badge variant="outline" className="text-xs border-destructive/50 text-destructive bg-destructive/10">
            Conflict
          </Badge>
        )}
      </div>

        {/* Icon */}
        <div 
          className={`
            w-16 h-16 rounded-2xl flex items-center justify-center mb-4
            transition-all duration-300 group-hover:scale-110
            ${isTechnical 
              ? "bg-primary/10 text-primary group-hover:bg-primary/20" 
              : "bg-secondary/10 text-secondary group-hover:bg-secondary/20"
            }
          `}
        >
          <DynamicIcon name={event.icon_name} className="w-8 h-8" />
        </div>

        {/* Title */}
        <h3 className={`
          text-xl font-bold mb-2 transition-colors
          ${isTechnical 
            ? "group-hover:text-primary" 
            : "group-hover:text-secondary"
          }
        `}>
          {event.name}
        </h3>

        {/* Description Preview */}
        <p className="text-muted-foreground text-sm line-clamp-2 mb-4">
          {event.description}
        </p>

        {/* IC Name */}
        {event.student_incharges && event.student_incharges.length > 0 && (
          <div className="text-xs text-muted-foreground">
            <span className="opacity-70">IC:</span>{" "}
            <span className={isTechnical ? "text-primary" : "text-secondary"}>
              {event.student_incharges[0].name}
            </span>
          </div>
        )}

      {/* Hover Indicator */}
      <div className={`
          mt-4 text-sm font-medium flex items-center gap-2
          opacity-0 group-hover:opacity-100 transition-opacity
          ${isTechnical ? "text-primary" : "text-secondary"}
        `}>
        View Details
        <LucideIcons.ArrowRight className="w-4 h-4" />
      </div>
    </GlassPanel>
  );

  return (
    <>
      {hasConflictWithRegistered ? (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="opacity-75 hover:opacity-90 transition-opacity">{card}</div>
            </TooltipTrigger>
            <TooltipContent>
              <p>Event timing conflict. You can only participate in one event from this time slot.</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ) : (
        card
      )}

      <EventModal
        event={event}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
};

export default EventCard;
