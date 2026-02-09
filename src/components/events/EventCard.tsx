import { useState } from "react";
import * as LucideIcons from "lucide-react";
import { GlassPanel } from "@/components/ui/glass-panel";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { EventData } from "@/hooks/useEvents";
import { getEventDisplay } from "@/lib/constants";
import EventModal from "./EventModal";

interface EventCardProps {
  event: EventData;
  index?: number;
  /** True when user has already registered for a conflicting event */
  hasConflictWithRegistered?: boolean;
  /** When an event modal is open, the id of that event */
  selectedEventId?: string | null;
  /** Event ids the user CAN participate in if they choose the selected event */
  canParticipateIds?: Set<string>;
  /** Event ids the user CANNOT participate in if they choose the selected event */
  cannotParticipateIds?: Set<string>;
  onModalOpen?: (event: EventData) => void;
  onModalClose?: () => void;
}

// Dynamic icon component
const DynamicIcon = ({ name, className }: { name: string; className?: string }) => {
  const Icon = (LucideIcons as any)[name] || LucideIcons.Sparkles;
  return <Icon className={className} />;
};

const EventCard = ({
  event,
  index = 0,
  hasConflictWithRegistered = false,
  selectedEventId = null,
  canParticipateIds,
  cannotParticipateIds,
  onModalOpen,
  onModalClose,
}: EventCardProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const isTechnical = event.category === "technical";
  const accentColor = isTechnical ? "cyan" : "purple";
  const { displayName, logo } = getEventDisplay(event.name);

  const isDisabledBySelection =
    selectedEventId && selectedEventId !== event.id && cannotParticipateIds?.has(event.id);
  const isHighlightedAsCan =
    selectedEventId && selectedEventId !== event.id && canParticipateIds?.has(event.id);

  const handleCardClick = () => {
    if (isDisabledBySelection) return;
    onModalOpen?.(event);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    onModalClose?.();
  };

  const card = (
    <GlassPanel
      variant="hover"
      glow={isTechnical ? "cyan" : "purple"}
      className={`
          p-6 card-hover group
          animate-slide-up opacity-0
          hover:border-${accentColor === "cyan" ? "primary" : "secondary"}/50
          ${isDisabledBySelection ? "cursor-not-allowed opacity-60" : "cursor-pointer"}
          ${isHighlightedAsCan ? (isTechnical ? "ring-2 ring-primary/50" : "ring-2 ring-secondary/50") + " ring-offset-2 ring-offset-background dark:ring-offset-background" : ""}
        `}
      style={{
        animationDelay: `${index * 100}ms`,
        animationFillMode: "forwards",
      }}
      onClick={handleCardClick}
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
        {(hasConflictWithRegistered || isDisabledBySelection) && (
          <Badge variant="outline" className="text-xs border-destructive/50 text-destructive bg-destructive/10">
            Conflict
          </Badge>
        )}
        {isHighlightedAsCan && (
          <Badge
            variant="outline"
            className={`text-xs ${isTechnical ? "border-primary/50 text-primary bg-primary/10" : "border-secondary/50 text-secondary bg-secondary/10"}`}
          >
            Can participate
          </Badge>
        )}
      </div>

        {/* Logo or Icon */}
        <div 
          className={`
            w-24 h-24 rounded-2xl flex items-center justify-center mb-4 overflow-hidden p-1
            transition-all duration-300 group-hover:scale-105
            ${isTechnical 
              ? "bg-primary/10 text-primary group-hover:bg-primary/20" 
              : "bg-secondary/10 text-secondary group-hover:bg-secondary/20"
            }
          `}
        >
          {logo ? (
            <img src={logo} alt="" className="w-full h-full object-contain" />
          ) : (
            <DynamicIcon name={event.icon_name} className="w-10 h-10" />
          )}
        </div>

        {/* Title: display name as heading, original name as subheading */}
        <h3 className={`
          text-xl font-bold mb-0.5 transition-colors
          ${isTechnical 
            ? "group-hover:text-primary" 
            : "group-hover:text-secondary"
          }
        `}>
          {displayName}
        </h3>
        <p className="text-xs text-muted-foreground mb-2">{event.name}</p>

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
      {hasConflictWithRegistered || isDisabledBySelection ? (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className={hasConflictWithRegistered ? "opacity-75 hover:opacity-90 transition-opacity" : undefined}>
                {card}
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>Can't register - time violates.</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ) : (
        card
      )}

      <EventModal
        event={event}
        isOpen={isModalOpen}
        onClose={handleModalClose}
      />
    </>
  );
};

export default EventCard;
