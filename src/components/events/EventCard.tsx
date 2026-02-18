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
    <div
      className={`
        group relative overflow-hidden rounded-2xl
        animate-slide-up opacity-0
        transition-all duration-300 ease-out
        bg-gradient-to-br from-card/80 via-card/60 to-card/40 backdrop-blur-md
        border-2 border-border/40
        shadow-lg shadow-black/20
        ${isDisabledBySelection ? "cursor-not-allowed opacity-40" : "cursor-pointer"}
        ${isHighlightedAsCan ? (isTechnical ? "ring-2 ring-primary/50" : "ring-2 ring-secondary/50") + " ring-offset-2 ring-offset-background" : ""}
        ${!isDisabledBySelection ? "hover:border-primary/60 hover:shadow-[0_0_30px_hsl(var(--primary)_/_0.3),0_8px_32px_rgba(0,0,0,0.3)] hover:scale-[1.02] hover:-translate-y-1" : ""}
        ${!isDisabledBySelection && !isTechnical ? "hover:border-secondary/60 hover:shadow-[0_0_30px_hsl(var(--secondary)_/_0.3),0_8px_32px_rgba(0,0,0,0.3)]" : ""}
      `}
      style={{
        animationDelay: `${index * 100}ms`,
        animationFillMode: "forwards",
      }}
      onClick={handleCardClick}
    >
      {/* 3D Glow Effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      {/* Content Container */}
      <div className="relative z-10 p-6 flex flex-col h-full min-h-[400px]">
        {/* Category Badge + Conflict Badge */}
        <div className="flex justify-between items-start mb-4">
          <Badge
            variant={isTechnical ? "default" : "secondary"}
            className={`
              text-xs font-semibold px-2 py-1
              ${isTechnical
                ? "bg-primary/20 text-primary border-primary/30"
                : "bg-secondary/20 text-secondary border-secondary/30"
              }
            `}
          >
            {isTechnical ? "Tech" : "Creative"}
          </Badge>
          {(hasConflictWithRegistered || isDisabledBySelection) && (
            <Badge variant="outline" className="text-xs border-destructive/50 text-destructive bg-destructive/10 px-2 py-1">
              Conflict
            </Badge>
          )}
          {isHighlightedAsCan && (
            <Badge
              variant="outline"
              className={`text-xs px-2 py-1 ${isTechnical ? "border-primary/50 text-primary bg-primary/10" : "border-secondary/50 text-secondary bg-secondary/10"}`}
            >
              ✓
            </Badge>
          )}
        </div>

        {/* Logo Container - 3D Style like character cards */}
        <div className="relative mb-6 flex items-center justify-center">
          <div 
            className={`
              relative w-32 h-32 sm:w-36 sm:h-36 rounded-2xl overflow-hidden
              transition-all duration-300 group-hover:scale-110 group-hover:rotate-2
              shadow-[0_8px_24px_rgba(0,0,0,0.3),inset_0_0_20px_rgba(255,255,255,0.1)]
              ${isTechnical 
                ? "bg-gradient-to-br from-primary/20 to-primary/5 border-2 border-primary/30" 
                : "bg-gradient-to-br from-secondary/20 to-secondary/5 border-2 border-secondary/30"
              }
            `}
          >
            {/* Glow effect behind logo */}
            <div className={`absolute inset-0 ${isTechnical ? "bg-primary/10" : "bg-secondary/10"} blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
            
            {logo ? (
              <img 
                src={logo} 
                alt={displayName} 
                className="w-full h-full object-cover rounded-2xl relative z-10"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center relative z-10">
                <DynamicIcon name={event.icon_name} className={`w-16 h-16 ${isTechnical ? "text-primary" : "text-secondary"}`} />
              </div>
            )}
            
            {/* Subtle shine overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-transparent rounded-2xl pointer-events-none" />
          </div>
        </div>

        {/* Title - centered like character cards */}
        <h3 className="text-xl sm:text-2xl font-bold mb-2 text-center text-foreground group-hover:text-primary transition-colors duration-300">
          {displayName}
        </h3>

        {/* Description - shorter for card style */}
        <p className="text-muted-foreground text-xs sm:text-sm line-clamp-2 mb-4 text-center leading-relaxed flex-grow">
          {event.description}
        </p>

        {/* IC Name - at bottom like rating */}
        {event.student_incharges && event.student_incharges.length > 0 && (
          <div className="text-xs text-muted-foreground text-center mt-auto pt-2 border-t border-border/20">
            <span className="opacity-70">IC: </span>
            <span className={`font-medium ${isTechnical ? "text-primary" : "text-secondary"}`}>
              {event.student_incharges[0].name}
            </span>
          </div>
        )}
      </div>
    </div>
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
