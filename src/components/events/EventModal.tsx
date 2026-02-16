import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import * as LucideIcons from "lucide-react";
import { X } from "lucide-react";
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
  getConflictingRegisteredEvents,
} from "@/lib/eventParticipation";
import { MAX_EVENTS_PER_PARTICIPANT, getEventDisplay, SOCIAL_LINKS } from "@/lib/constants";

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

// Get event-specific rules
const getEventRules = (eventName: string): string[] => {
  const normalizedName = eventName.trim().toUpperCase();
  
  const rulesMap: Record<string, string[]> = {
    "WEB DESIGN": [
      "Participants must design a web page UI/UX based on the theme announced at the start of the event.",
      "The total duration of the competition is 60 minutes, starting immediately after the theme announcement.",
      "Allowed tools: Figma, Adobe XD, Canva, or similar UI/UX design tools. Designs must be created from scratch during the event.",
      "Use of pre-built templates, previously created designs, or copied layouts is strictly prohibited.",
      "Evaluation will be based on UI/UX design, creativity, layout structure, visual consistency, and theme relevance; the judges' decision is final.",
    ],
    "PERSONALITY CONTEST": [
      "The event is open to individual participants only.",
      "Participants must bring their Curriculum Vitae (CV).",
      "Participants will be shortlisted after the prelims.",
      "The final round will be conducted on stage.",
      "Judge's decision is final.",
    ],
    "IPL AUCTION": [
      "Participants per team: 2",
      "Prior knowledge of IPL from 2008-2025",
      "Each team will be given a fixed virtual budget.",
      "Players are classified as capped, uncapped, and overseas.",
      "Participants are requested to maintain good conduct throughout the event.",
      "Decision of judges is final.",
    ],
    "AI PROMPT": [
      "The reference AI image will be shown once for 5 minutes only before the competition and will not be displayed again.",
      "The competition duration is 30 minutes, starting immediately after the image is removed.",
      "Participants may use mobile phones or laptops only for AI prompting and image generation. Capturing, saving, recording, or recreating the reference image in any form is strictly prohibited.",
      "Participants must remain seated inside the venue. No communication or prompt sharing with others is allowed.",
      "Any malpractice or rule violation will lead to immediate disqualification.",
      "Submissions will be judged based on similarity, accuracy of details, prompt quality, and creativity. Judges' decision is final.",
    ],
    "AI PROMPT ENGINEERING": [
      "The reference AI image will be shown once for 5 minutes only before the competition and will not be displayed again.",
      "The competition duration is 30 minutes, starting immediately after the image is removed.",
      "Participants may use mobile phones or laptops only for AI prompting and image generation. Capturing, saving, recording, or recreating the reference image in any form is strictly prohibited.",
      "Participants must remain seated inside the venue. No communication or prompt sharing with others is allowed.",
      "Any malpractice or rule violation will lead to immediate disqualification.",
      "Submissions will be judged based on similarity, accuracy of details, prompt quality, and creativity. Judges' decision is final.",
    ],
    "BUG SMASH": [
      "Participants per team: 2 members.",
      "Event Duration: 1 hour.",
      "Question is based on \"Python, Java, C++\" programming language.",
      "No of rounds: 2.",
    ],
    DEBUGGING: [
      "Participants per team: 2 members.",
      "Event Duration: 1 hour.",
      "Question is based on \"Python, Java, C++\" programming language.",
      "No of rounds: 2.",
    ],
    "AD-ZAP": [
      "Team Composition: Usually 3–5 members per team & one Team Per College.",
      "Time Management: Teams are typically given 3-5 minutes(preparation) to brainstorm and 2-7 minutes to perform their ad.",
      "On-the-Spot Topics: Product or service topics are usually provided immediately before the preparation time, demanding instant creativity.",
      "Originality & Content: Ads must be original. Plagiarism, vulgarity, or offensive content will lead to disqualification.",
      "Prohibited Items: Use of mobile phones, tablets, or other electronic devices is strictly prohibited.",
      "Props: Teams may be allowed to bring their own props, charts, or costumes, but organizers rarely provide them.",
      "Judging Criteria: Performance is judged on creativity, humor, brand name, tag line, and overall impact.",
      "Disqualification: Violation of rules, such as exceeding the time limit or using inappropriate content, results in disqualification.",
    ],
    "AD ZAP": [
      "Team Composition: Usually 3–5 members per team & one Team Per College.",
      "Time Management: Teams are typically given 3-5 minutes(preparation) to brainstorm and 2-7 minutes to perform their ad.",
      "On-the-Spot Topics: Product or service topics are usually provided immediately before the preparation time, demanding instant creativity.",
      "Originality & Content: Ads must be original. Plagiarism, vulgarity, or offensive content will lead to disqualification.",
      "Prohibited Items: Use of mobile phones, tablets, or other electronic devices is strictly prohibited.",
      "Props: Teams may be allowed to bring their own props, charts, or costumes, but organizers rarely provide them.",
      "Judging Criteria: Performance is judged on creativity, humor, brand name, tag line, and overall impact.",
      "Disqualification: Violation of rules, such as exceeding the time limit or using inappropriate content, results in disqualification.",
    ],
    "MEMORY MATRIX": [
      "2 persons per team and 1 team per department.",
      "1st round will be logical reasoning (50 question).",
      "6 teams will be shortlist.",
      "Multiple rounds of memory matrix.",
      "Based on the score, teams will be rewarded.",
    ],
    "PAPER PRESENTATION": [
      "Eligibility: UG Students",
      "Team size: 1-2",
      "Topics on: AI & ML | Data Science | Cyber Security | Cloud | IoT | Blockchain | Networks | OS | DBMS | Green & Emerging Tech",
      "Duration: 5-7 minutes + 3 minutes for Q&A",
      "PPT Slide: Maximum of 10 slides",
      `Submit slides in advance to: ${SOCIAL_LINKS.email}`,
    ],
    "MOVIE SPOOFING": [
      "Each team can have 2 to 5 participants.",
      "Participants must spoof a movie scene in a humorous and creative manner.",
      "Time limit: Maximum 5 minutes per performance (including setup).",
      "Use of offensive language, vulgarity, or political/religious content is strictly prohibited.",
      "The spoof should be clearly related to the chosen movie; random skits won't be considered.",
      "Participants may use simple props, but dangerous items are not allowed.",
      "Background audio or music (if any) must be submitted before the event.",
      "Teams must report at least 30 minutes before their scheduled slot.",
      "Judges' decision will be final and binding.",
      "Points will be awarded based on creativity, humor, coordination, and audience engagement.",
    ],
    "MOVIE SPOOF": [
      "Each team can have 2 to 5 participants.",
      "Participants must spoof a movie scene in a humorous and creative manner.",
      "Time limit: Maximum 5 minutes per performance (including setup).",
      "Use of offensive language, vulgarity, or political/religious content is strictly prohibited.",
      "The spoof should be clearly related to the chosen movie; random skits won't be considered.",
      "Participants may use simple props, but dangerous items are not allowed.",
      "Background audio or music (if any) must be submitted before the event.",
      "Teams must report at least 30 minutes before their scheduled slot.",
      "Judges' decision will be final and binding.",
      "Points will be awarded based on creativity, humor, coordination, and audience engagement.",
    ],
  };

  return rulesMap[normalizedName] || [];
};

const EventModal = ({ event, isOpen, onClose }: EventModalProps) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isRegistering, setIsRegistering] = useState(false);
  const [isSwitching, setIsSwitching] = useState(false);

  const { data: allEvents = [] } = useEvents();
  const { data: myRegistrations = [] } = useMyRegistrations();

  const isTechnical = event.category === "technical";
  const { displayName, logo } = getEventDisplay(event.name);

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

  const conflictingEventNames = useMemo(
    () => getConflictingRegisteredEvents(event.name, registeredEventNames),
    [event.name, registeredEventNames]
  );

  const showConflict = hasConflict && registeredEventNames.length > 0;

  const isAlreadyRegistered = useMemo(
    () => myRegistrations?.some((r) => r.event_id === event.id),
    [myRegistrations, event.id]
  );

  const atMaxEvents = (myRegistrations?.length ?? 0) >= MAX_EVENTS_PER_PARTICIPANT;

  const conflictingRegistrations = useMemo(
    () =>
      (myRegistrations ?? []).filter((r) =>
        r.events?.name && conflictingEventNames.includes(r.events.name)
      ),
    [myRegistrations, conflictingEventNames]
  );

  const handleSwitchToThisEvent = async () => {
    if (!user || conflictingRegistrations.length === 0) return;
    setIsSwitching(true);
    try {
      for (const reg of conflictingRegistrations) {
        const { error } = await supabase
          .from("event_registrations")
          .delete()
          .eq("user_id", user.id)
          .eq("event_id", reg.event_id);
        if (error) throw error;
      }
      const { error } = await supabase.from("event_registrations").insert({
        user_id: user.id,
        event_id: event.id,
      });
      if (error) throw error;
      toast({
        title: "Switched event",
        description: `You're now registered for ${event.name} instead.`,
      });
      queryClient.invalidateQueries({ queryKey: ["registrations"] });
      onClose();
    } catch (err: unknown) {
      console.error("Switch error:", err);
      toast({
        title: "Couldn't switch",
        description: err instanceof Error ? err.message : "Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSwitching(false);
    }
  };

  const handleRegister = async () => {
    if (!user) {
      onClose();
      navigate(`/register?event=${encodeURIComponent(event.id)}`);
      return;
    }

    if (atMaxEvents && !isAlreadyRegistered) {
      toast({
        title: "Maximum events reached",
        description: `You can participate in only ${MAX_EVENTS_PER_PARTICIPANT} events.`,
        variant: "destructive",
      });
      return;
    }

    if (hasConflict) {
      toast({
        title: "Can't register - time violates",
        description: "This event conflicts with one you're already registered for.",
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

  // Get event-specific rules
  const rulesArray = getEventRules(event.name);
  const hasCustomRules = rulesArray.length > 0;
  const fallbackRules = hasCustomRules ? [] : event.rules.split("\n").filter((rule) => rule.trim());

  const registerDisabled =
    isRegistering ||
    showConflict ||
    isAlreadyRegistered ||
    (atMaxEvents && !isAlreadyRegistered);
  const registerButton = (
    <NeonButton
      variant={isTechnical ? "cyan" : "purple"}
      onClick={handleRegister}
      disabled={registerDisabled}
      className={`text-sm ${!registerDisabled && !isRegistering && !showConflict && !isAlreadyRegistered && !atMaxEvents ? 'register-now-button' : ''}`}
    >
      {isRegistering ? (
        <>
          <LucideIcons.Loader2 className="w-4 h-4 animate-spin" />
          Registering...
        </>
      ) : showConflict ? (
        <>
          <LucideIcons.AlertCircle className="w-4 h-4" />
          Can't register - time violates
        </>
      ) : atMaxEvents && !isAlreadyRegistered ? (
        <>
          <LucideIcons.AlertCircle className="w-4 h-4" />
          Max 2 events only
        </>
      ) : isAlreadyRegistered ? (
        <>
          <LucideIcons.CheckCircle2 className="w-4 h-4" />
          Already registered
        </>
      ) : (
        <>
          <LucideIcons.UserPlus className="w-4 h-4" />
          Register Now
        </>
      )}
    </NeonButton>
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto bg-gradient-to-br from-background via-background to-muted/20 border-2 border-border/50 shadow-2xl backdrop-blur-sm p-4 sm:p-6 [&>button]:hidden sm:[&>button]:hidden">
        {/* Custom Close button - visible on mobile only */}
        <button
          onClick={onClose}
          className="md:hidden absolute right-4 top-4 z-50 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 bg-background/80 backdrop-blur-sm p-2 border border-border/50"
          aria-label="Close"
        >
          <X className="h-5 w-5" />
        </button>
        <DialogHeader>
          <div className="flex flex-col sm:flex-row items-start justify-between gap-4 sm:gap-6 mb-6">
            <div className="flex items-start gap-3 sm:gap-4 flex-1 w-full sm:w-auto">
              <div className="w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center shrink-0 overflow-hidden">
                {logo ? (
                  <img src={logo} alt="" className="w-full h-full object-contain" />
                ) : (
                  <DynamicIcon 
                    name={event.icon_name} 
                    className={`w-12 h-12 ${
                      isTechnical ? "text-primary" : "text-secondary"
                    }`} 
                  />
                )}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <Badge
                    variant={isTechnical ? "default" : "secondary"}
                    className={`
                      text-xs font-semibold px-2.5 py-0.5
                      ${isTechnical 
                        ? "bg-primary/20 text-primary border border-primary/40 shadow-lg shadow-primary/20" 
                        : "bg-secondary/20 text-secondary border border-secondary/40 shadow-lg shadow-secondary/20"
                      }
                    `}
                  >
                    {isTechnical ? "Technical" : "Non-Technical"}
                  </Badge>
                </div>
                <DialogTitle className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent mb-1">
                  {displayName}
                </DialogTitle>
                <p className="text-xs sm:text-sm text-muted-foreground font-mono">{event.name}</p>
              </div>
            </div>
            <div className="flex-shrink-0 w-full sm:w-auto">
              {showConflict ? (
                <NeonButton
                  variant={isTechnical ? "cyan" : "purple"}
                  onClick={handleSwitchToThisEvent}
                  disabled={isSwitching}
                  className="text-sm"
                >
                  {isSwitching ? (
                    <>
                      <LucideIcons.Loader2 className="w-4 h-4 animate-spin" />
                      Switching...
                    </>
                  ) : (
                    <>
                      <LucideIcons.RefreshCw className="w-4 h-4" />
                      Switch to {event.name}
                    </>
                  )}
                </NeonButton>
              ) : (atMaxEvents && !isAlreadyRegistered) ? (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>{registerButton}</TooltipTrigger>
                    <TooltipContent>
                      <p>You can participate in only {MAX_EVENTS_PER_PARTICIPANT} events.</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              ) : (
                registerButton
              )}
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-4 sm:space-y-6 mt-2">
          {/* Description */}
          <div className="relative">
            <div className={`absolute inset-0 bg-gradient-to-r ${
              isTechnical 
                ? "from-primary/5 to-transparent" 
                : "from-secondary/5 to-transparent"
            } rounded-lg blur-xl`} />
            <div className="relative p-3 sm:p-4 rounded-lg border border-border/30 bg-card/50">
              <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2 sm:mb-3 flex items-center gap-2">
                <LucideIcons.Info className="w-4 h-4" />
                About
              </h4>
              <p className="text-sm sm:text-base text-foreground leading-relaxed">{event.description}</p>
            </div>
          </div>

          <Separator className="bg-gradient-to-r from-transparent via-border/50 to-transparent" />

          {/* Rules */}
          <div className="relative">
            <div className={`absolute inset-0 bg-gradient-to-r ${
              isTechnical 
                ? "from-primary/5 to-transparent" 
                : "from-secondary/5 to-transparent"
            } rounded-lg blur-xl`} />
            <div className="relative p-3 sm:p-4 rounded-lg border border-border/30 bg-card/50">
              <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3 sm:mb-4 flex items-center gap-2">
                <LucideIcons.FileText className="w-4 h-4" />
                Rules & Guidelines
              </h4>
              <ul className="space-y-2 sm:space-y-3">
                {hasCustomRules ? (
                  rulesArray.map((rule, index) => (
                    <li key={index} className="flex items-start gap-3 text-foreground group">
                      <LucideIcons.CheckCircle2 className={`mt-0.5 w-4 h-4 sm:w-5 sm:h-5 shrink-0 ${
                        isTechnical 
                          ? "text-primary" 
                          : "text-secondary"
                      }`} />
                      <span className="flex-1 text-sm sm:text-base leading-relaxed">{rule}</span>
                    </li>
                  ))
                ) : (
                  fallbackRules.map((rule, index) => (
                    <li key={index} className="flex items-start gap-3 text-foreground group">
                      <LucideIcons.CheckCircle2 className={`mt-0.5 w-4 h-4 sm:w-5 sm:h-5 shrink-0 ${
                        isTechnical 
                          ? "text-primary" 
                          : "text-secondary"
                      }`} />
                      <span className="flex-1 text-sm sm:text-base leading-relaxed">{rule.replace(/^[•\-]\s*/, "")}</span>
                    </li>
                  ))
                )}
              </ul>
            </div>
          </div>

          {/* IC Info */}
          {event.student_incharges && event.student_incharges.length > 0 && (
            <>
              <Separator className="bg-gradient-to-r from-transparent via-border/50 to-transparent" />
              <div className="relative">
                <div className={`absolute inset-0 bg-gradient-to-r ${
                  isTechnical 
                    ? "from-primary/5 to-transparent" 
                    : "from-secondary/5 to-transparent"
                } rounded-lg blur-xl`} />
                <div className="relative p-4 rounded-lg border border-border/30 bg-card/50 flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                    isTechnical 
                      ? "bg-primary/10 border border-primary/30" 
                      : "bg-secondary/10 border border-secondary/30"
                  }`}>
                    <LucideIcons.User className={`w-6 h-6 ${
                      isTechnical ? "text-primary" : "text-secondary"
                    }`} />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">
                      Student Incharge
                    </p>
                    <p className={`font-bold text-lg ${
                      isTechnical ? "text-primary" : "text-secondary"
                    }`}>
                      {event.student_incharges[0].name}
                    </p>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Participation: Can / Cannot */}
          <Separator className="bg-gradient-to-r from-transparent via-border/50 to-transparent" />
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
              <LucideIcons.Link className="w-4 h-4" />
              If you register for this event
            </h4>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="relative">
                <div className="absolute inset-0 bg-primary/5 rounded-lg blur-xl" />
                <div className="relative rounded-lg border border-primary/30 bg-primary/5 p-4 backdrop-blur-sm">
                  <p className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-primary">
                    <LucideIcons.CheckCircle2 className="h-4 w-4" />
                    You can also participate in
                  </p>
                  {canParticipate.length > 0 ? (
                    <ul className="space-y-1.5 text-sm text-foreground">
                      {canParticipate.map((e) => (
                        <li key={e.id} className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                          <span>{e.name}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-muted-foreground">No other events in this slot.</p>
                  )}
                </div>
              </div>
              <div className="relative">
                <div className="absolute inset-0 bg-destructive/5 rounded-lg blur-xl" />
                <div className="relative rounded-lg border border-destructive/30 bg-destructive/5 p-4 backdrop-blur-sm">
                  <p className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-destructive">
                    <LucideIcons.XCircle className="h-4 w-4" />
                    You cannot participate in
                  </p>
                  {cannotParticipate.length > 0 ? (
                    <ul className="space-y-1.5 text-sm text-muted-foreground">
                      {cannotParticipate.map((e) => (
                        <li key={e.id} className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-destructive" />
                          <span>{e.name}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-muted-foreground">No conflicts.</p>
                  )}
                </div>
              </div>
            </div>
            {showConflict && (
              <div className="relative">
                <div className="absolute inset-0 bg-amber-500/10 rounded-lg blur-xl" />
                <div className="relative rounded-lg border border-amber-500/30 bg-amber-500/10 p-4 space-y-2 backdrop-blur-sm">
                  <p className="text-xs text-amber-200">
                    You're registered for <strong>{conflictingEventNames.length === 1 ? conflictingEventNames[0] : conflictingEventNames.join(", ")}</strong> (same time slot). You can switch to <strong>{event.name}</strong> instead.
                  </p>
                  <p className="text-xs text-muted-foreground">
                    If you didn't register for any event, refresh the page.
                  </p>
                </div>
              </div>
            )}
            {atMaxEvents && !isAlreadyRegistered && (
              <p className="text-xs text-destructive">
                You can participate in only {MAX_EVENTS_PER_PARTICIPANT} events. Unregister from one to add this event.
              </p>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EventModal;
