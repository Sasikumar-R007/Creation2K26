import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import * as LucideIcons from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { NeonButton } from "@/components/ui/neon-button";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { EventData, useEvents } from "@/hooks/useEvents";
import { useMyRegistrations } from "@/hooks/useRegistrations";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import {
  getParticipationForEvent,
  conflictsWithRegistered,
} from "@/lib/eventParticipation";

interface EventModalProps {
  event: EventData;
  isOpen: boolean;
  onClose: () => void;
}

// Dynamic icon component
const DynamicIcon = ({ name, className }: { name: string; className?: string }) => {
  const Icon = (LucideIcons as any)[name] || LucideIcons.Sparkles;
  return <Icon className={className} />;
};

const EventModal = ({ event, isOpen, onClose }: EventModalProps) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isRegistering, setIsRegistering] = useState(false);

  const { data: allEvents = [] } = useEvents();
  const { data: myRegistrations = [] } = useMyRegistrations();

  const isTechnical = event.category === "technical";

  const { can: canParticipate, cannot: cannotParticipate } = useMemo(
    () => getParticipationForEvent(event.name, allEvents),
    [event.name, allEvents]
  );

  const registeredEventNames = useMemo(
    () =>
      (myRegistrations ?? [])
        .map((r) => r.events?.name)
        .filter((name): name is string => !!name),
    [myRegistrations]
  );

  const hasConflict = useMemo(
    () => conflictsWithRegistered(event.name, registeredEventNames),
    [event.name, registeredEventNames]
  );

  const isAlreadyRegistered = useMemo(
    () => myRegistrations?.some((r) => r.event_id === event.id),
    [myRegistrations, event.id]
  );

  const handleRegister = async () => {
    if (!user) {
      navigate("/auth?tab=signup");
      onClose();
      return;
    }

    if (hasConflict) {
      toast({
        title: "Event timing conflict",
        description: "You can only participate in one event from this time slot. You have already registered for a conflicting event.",
        variant: "destructive",
      });
      return;
    }

    if (isAlreadyRegistered) {
      toast({
        title: "Already Registered",
        description: "You are already registered for this event.",
        variant: "default",
      });
      return;
    }

    setIsRegistering(true);
    try {
      const { error } = await supabase
        .from("event_registrations")
        .insert({
          user_id: user.id,
          event_id: event.id,
        });

      if (error) {
        if (error.code === "23505") {
          toast({
            title: "Already Registered",
            description: "You are already registered for this event.",
            variant: "default",
          });
        } else {
          throw error;
        }
      } else {
        toast({
          title: "Registration Successful! 🎉",
          description: `You are now registered for ${event.name}.`,
        });
        queryClient.invalidateQueries({ queryKey: ["registrations"] });
      }
    } catch (error: any) {
      console.error("Registration error:", error);
      toast({
        title: "Registration Failed",
        description: error.message || "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsRegistering(false);
    }
  };

  // Parse rules into array
  const rulesArray = event.rules.split("\n").filter((rule) => rule.trim());

  const registerDisabled = isRegistering || hasConflict || isAlreadyRegistered;
  const registerButton = (
    <NeonButton
      variant={isTechnical ? "cyan" : "purple"}
      onClick={handleRegister}
      disabled={registerDisabled}
    >
      {isRegistering ? (
        <>
          <LucideIcons.Loader2 className="w-4 h-4 animate-spin" />
          Registering...
        </>
      ) : hasConflict ? (
        <>
          <LucideIcons.AlertCircle className="w-4 h-4" />
          Event conflict
        </>
      ) : isAlreadyRegistered ? (
        <>
          <LucideIcons.CheckCircle2 className="w-4 h-4" />
          Already registered
        </>
      ) : (
        <>
          <LucideIcons.UserPlus className="w-4 h-4" />
          {user ? "Register for Event" : "Sign Up to Register"}
        </>
      )}
    </NeonButton>
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-card border-border">
        <DialogHeader>
          <div className="flex items-start gap-4">
            <div
              className={`
                w-16 h-16 rounded-2xl flex items-center justify-center shrink-0
                ${isTechnical 
                  ? "bg-primary/10 text-primary" 
                  : "bg-secondary/10 text-secondary"
                }
              `}
            >
              <DynamicIcon name={event.icon_name} className="w-8 h-8" />
            </div>
            <div className="flex-1">
              <Badge
                variant={isTechnical ? "default" : "secondary"}
                className={`
                  text-xs font-medium mb-2
                  ${isTechnical 
                    ? "bg-primary/20 text-primary border-primary/30" 
                    : "bg-secondary/20 text-secondary border-secondary/30"
                  }
                `}
              >
                {isTechnical ? "Technical" : "Non-Technical"}
              </Badge>
              <DialogTitle className="text-2xl font-bold">
                {event.name}
              </DialogTitle>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {/* Description */}
          <div>
            <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-2">
              About
            </h4>
            <p className="text-foreground">{event.description}</p>
          </div>

          <Separator className="bg-border/50" />

          {/* Rules */}
          <div>
            <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">
              Rules & Guidelines
            </h4>
            <ul className="space-y-2">
              {rulesArray.map((rule, index) => (
                <li key={index} className="flex items-start gap-2 text-foreground">
                  <LucideIcons.CheckCircle2 
                    className={`w-5 h-5 shrink-0 mt-0.5 ${
                      isTechnical ? "text-primary" : "text-secondary"
                    }`} 
                  />
                  <span>{rule.replace(/^[•\-]\s*/, "")}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* IC Info */}
          {event.student_incharges && event.student_incharges.length > 0 && (
            <>
              <Separator className="bg-border/50" />
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                  <LucideIcons.User className="w-5 h-5 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Student Incharge</p>
                  <p className={`font-semibold ${isTechnical ? "text-primary" : "text-secondary"}`}>
                    {event.student_incharges[0].name}
                  </p>
                </div>
              </div>
            </>
          )}

          {/* Participation: Can / Cannot */}
          <Separator className="bg-border/50" />
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
              If you register for this event
            </h4>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-lg border border-primary/20 bg-primary/5 p-3">
                <p className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-primary">
                  <LucideIcons.CheckCircle2 className="h-4 w-4" />
                  You can also participate in
                </p>
                {canParticipate.length > 0 ? (
                  <ul className="space-y-1 text-sm text-foreground">
                    {canParticipate.map((e) => (
                      <li key={e.id}>• {e.name}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-muted-foreground">No other events in this slot.</p>
                )}
              </div>
              <div className="rounded-lg border border-destructive/20 bg-destructive/5 p-3">
                <p className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-destructive">
                  <LucideIcons.XCircle className="h-4 w-4" />
                  You cannot participate in
                </p>
                {cannotParticipate.length > 0 ? (
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    {cannotParticipate.map((e) => (
                      <li key={e.id}>• {e.name}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-muted-foreground">No conflicts.</p>
                )}
              </div>
            </div>
            {hasConflict && (
              <p className="text-xs text-destructive">
                You have already registered for an event that conflicts with this one. Event timing conflict.
              </p>
            )}
          </div>

          <Separator className="bg-border/50" />

          {/* Register Button */}
          <div className="flex justify-end gap-3">
            <NeonButton variant="ghost" onClick={onClose}>
              Close
            </NeonButton>
            {hasConflict ? (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>{registerButton}</TooltipTrigger>
                  <TooltipContent>
                    <p>Event timing conflict. You can only participate in one event from this time slot.</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            ) : (
              registerButton
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EventModal;
