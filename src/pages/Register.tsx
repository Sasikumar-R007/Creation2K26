import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  Mail,
  User,
  Building,
  GraduationCap,
  Phone,
  Loader2,
  Sparkles,
  CheckCircle2,
  Calendar,
  MapPin,
  BookOpen,
  ArrowLeft,
  CalendarDays,
} from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { GlassPanel } from "@/components/ui/glass-panel";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { NeonButton } from "@/components/ui/neon-button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  EVENT_DATE,
  VENUE,
  MAX_EVENTS_PER_PARTICIPANT,
} from "@/lib/constants";
import { useEvents } from "@/hooks/useEvents";
import { useSubmitGuestRegistration } from "@/hooks/useRegistrations";
import { eventsConflict } from "@/lib/eventParticipation";
import { EventData } from "@/hooks/useEvents";
import { z } from "zod";

const emailSchema = z.string().email("Please enter a valid email address");
const nameSchema = z.string().min(2, "Name must be at least 2 characters");

const initialForm = {
  name: "",
  email: "",
  whatsapp_phone: "",
  department: "",
  college: "",
  event_1_id: "",
  event_2_id: "",
};

const conflictGroups = [
  {
    title: "Group A (choose one)",
    events: ["Quiz", "Personality Contest", "Memory Matrix", "AI Prompt Engineering", "Paper Presentation", "Debugging"],
  },
  {
    title: "Group B (choose one)",
    events: ["Web Design", "IPL Auction", "Ad Zap", "Movie Spoofing"],
  },
];

const EMPTY_VALUE = "__none__";

export default function Register() {
  const { data: events = [] } = useEvents();
  const submitRegistration = useSubmitGuestRegistration();

  const [form, setForm] = useState(initialForm);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const formattedDate = EVENT_DATE.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const event1 = useMemo(
    () => events.find((e) => e.id === form.event_1_id),
    [events, form.event_1_id]
  );
  const event2 = useMemo(
    () => (form.event_2_id ? events.find((e) => e.id === form.event_2_id) : null),
    [events, form.event_2_id]
  );

  /** Events that conflict with Event 1 (for Event 2 dropdown: show but disable with TIME CONFLICT) */
  const conflictsWithEvent1 = useMemo(() => {
    if (!event1) return new Set<string>();
    const set = new Set<string>();
    events.forEach((ev) => {
      if (ev.id !== event1.id && eventsConflict(event1.name, ev.name)) set.add(ev.id);
    });
    return set;
  }, [event1, events]);

  /** Events that conflict with Event 2 (for Event 1 dropdown: show but disable with TIME CONFLICT) */
  const conflictsWithEvent2 = useMemo(() => {
    if (!event2) return new Set<string>();
    const set = new Set<string>();
    events.forEach((ev) => {
      if (ev.id !== event2.id && eventsConflict(event2.name, ev.name)) set.add(ev.id);
    });
    return set;
  }, [event2, events]);

  const validateField = (field: string, value: string) => {
    try {
      if (field === "email") emailSchema.parse(value);
      else if (field === "name") nameSchema.parse(value);
      setErrors((prev) => ({ ...prev, [field]: "" }));
      return true;
    } catch (err) {
      if (err instanceof z.ZodError) {
        setErrors((prev) => ({ ...prev, [field]: err.errors[0].message }));
      }
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const nameValid = validateField("name", form.name);
    const emailValid = validateField("email", form.email);
    if (!nameValid || !emailValid) return;

    if (!form.event_1_id) {
      setErrors((prev) => ({ ...prev, event_1_id: "Please select Event 1." }));
      return;
    }

    setIsSubmitting(true);
    try {
      await submitRegistration.mutateAsync({
        name: form.name,
        email: form.email,
        whatsapp_phone: form.whatsapp_phone || undefined,
        department: form.department || undefined,
        college: form.college || undefined,
        event_1_id: form.event_1_id,
        event_2_id: form.event_2_id || null,
      });
      setForm(initialForm);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background dark">
      <div className="fixed inset-0 overflow-hidden pointer-events-none" aria-hidden>
        <div className="absolute inset-0 bg-gradient-to-br from-background via-[hsl(260,25%,6%)] to-background opacity-100" />
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `
              linear-gradient(hsl(var(--primary)) 1px, transparent 1px),
              linear-gradient(90deg, hsl(var(--primary)) 1px, transparent 1px)
            `,
            backgroundSize: "60px 60px",
          }}
        />
        <div className="absolute top-0 left-0 w-full h-1/3 bg-gradient-to-b from-primary/5 to-transparent" />
        <div className="absolute bottom-0 right-0 w-1/2 h-1/2 bg-gradient-to-t from-secondary/5 to-transparent" />
      </div>

      <Navbar />

      <main className="relative container mx-auto px-4 pt-28 pb-20">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>

        <div className="grid lg:grid-cols-[1fr_1.1fr] gap-10 lg:gap-14 items-start max-w-6xl mx-auto">
          {/* Left: Rules */}
          <div className="space-y-8">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="w-6 h-6 text-primary" />
                <h1 className="text-2xl md:text-3xl font-bold">
                  <span className="gradient-text">CREATION 2K26</span>
                </h1>
              </div>
              <p className="text-muted-foreground text-lg">
                BCA Department, Bishop Heber College. Register for up to two events.
              </p>
            </div>

            <GlassPanel className="p-6 border-primary/20" glow="cyan">
              <h2 className="flex items-center gap-2 font-semibold text-lg mb-4 text-primary">
                <BookOpen className="w-5 h-5" />
                Participation rules
              </h2>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                  <span>You can register for a <strong className="text-foreground">maximum of {MAX_EVENTS_PER_PARTICIPANT} events</strong>.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                  <span>Within each conflict group below, you may choose <strong className="text-foreground">only one event</strong>. Conflicting options will show <strong className="text-destructive">TIME CONFLICT</strong> and cannot be selected.</span>
                </li>
              </ul>
            </GlassPanel>

            <GlassPanel className="p-6 border-secondary/20" glow="purple">
              <h2 className="font-semibold text-lg mb-4 text-secondary">Conflict groups</h2>
              <div className="space-y-4">
                {conflictGroups.map((group, i) => (
                  <div key={i}>
                    <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-2">
                      {group.title}
                    </p>
                    <p className="text-sm text-foreground/90">
                      {group.events.join(", ")}
                    </p>
                  </div>
                ))}
              </div>
            </GlassPanel>

            <GlassPanel className="p-6">
              <div className="flex items-start gap-3 text-sm">
                <Calendar className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-foreground">Date</p>
                  <p className="text-muted-foreground">{formattedDate}</p>
                </div>
              </div>
              <div className="flex items-start gap-3 text-sm mt-4">
                <MapPin className="w-5 h-5 text-secondary shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-foreground">Venue</p>
                  <p className="text-muted-foreground">
                    {VENUE.name}, {VENUE.college}
                  </p>
                </div>
              </div>
            </GlassPanel>
          </div>

          {/* Right: Registration form (events + contact) */}
          <GlassPanel className="p-6 md:p-8 border-primary/20" glow="cyan">
            <div className="flex items-center gap-2 mb-2">
              <CalendarDays className="w-5 h-5 text-primary" />
              <h2 className="text-xl font-bold">Event registration</h2>
            </div>
            <p className="text-sm text-muted-foreground mb-6">
              Choose up to two events. Options that conflict with your first choice will show <span className="text-destructive font-medium">TIME CONFLICT</span> and cannot be selected.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label>Event 1 *</Label>
                <Select
                  value={form.event_1_id || EMPTY_VALUE}
                  onValueChange={(v) => {
                    setForm((f) => ({
                      ...f,
                      event_1_id: v === EMPTY_VALUE ? "" : v,
                      event_2_id: v === EMPTY_VALUE ? "" : f.event_2_id,
                    }));
                  }}
                >
                  <SelectTrigger className="w-full bg-muted/50 border-primary/20">
                    <SelectValue placeholder="Select first event" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={EMPTY_VALUE} className="hidden" />
                    {events.map((ev) => {
                      const conflictWith2 = event2 && eventsConflict(ev.name, event2.name);
                      return (
                        <SelectItem
                          key={ev.id}
                          value={ev.id}
                          disabled={conflictWith2}
                          className={conflictWith2 ? "opacity-80 cursor-not-allowed" : ""}
                        >
                          {ev.name}
                          {conflictWith2 ? (
                            <span className="text-destructive font-medium ml-1">— TIME CONFLICT</span>
                          ) : null}
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
                {errors.event_1_id && <p className="text-destructive text-sm">{errors.event_1_id}</p>}
              </div>

              <div className="space-y-2">
                <Label>Event 2 (optional)</Label>
                <Select
                  value={form.event_2_id || EMPTY_VALUE}
                  onValueChange={(v) =>
                    setForm((f) => ({ ...f, event_2_id: v === EMPTY_VALUE ? "" : v }))
                  }
                >
                  <SelectTrigger className="w-full bg-muted/50 border-primary/20">
                    <SelectValue placeholder="Select second event" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={EMPTY_VALUE}>None</SelectItem>
                    {events.map((ev) => {
                      const conflictWith1 = event1 && eventsConflict(ev.name, event1.name);
                      const isEvent1 = ev.id === form.event_1_id;
                      const disabled = conflictWith1 || isEvent1;
                      return (
                        <SelectItem
                          key={ev.id}
                          value={ev.id}
                          disabled={disabled}
                          className={disabled ? "opacity-80 cursor-not-allowed" : ""}
                        >
                          {ev.name}
                          {isEvent1 ? (
                            <span className="text-muted-foreground ml-1">(same as Event 1)</span>
                          ) : conflictWith1 ? (
                            <span className="text-destructive font-medium ml-1">— TIME CONFLICT</span>
                          ) : null}
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              </div>

              <hr className="border-border my-6" />

              <p className="text-sm font-medium text-muted-foreground">Your details</p>

              <div className="space-y-2">
                <Label htmlFor="page-reg-name">Full Name *</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="page-reg-name"
                    type="text"
                    placeholder="John Doe"
                    className="pl-10 bg-muted/50 border-primary/20 focus:border-primary/50"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                  />
                </div>
                {errors.name && <p className="text-destructive text-sm">{errors.name}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="page-reg-email">Email *</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="page-reg-email"
                    type="email"
                    placeholder="your@email.com"
                    className="pl-10 bg-muted/50 border-primary/20 focus:border-primary/50"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                  />
                </div>
                {errors.email && <p className="text-destructive text-sm">{errors.email}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="page-reg-whatsapp">WhatsApp Phone Number</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="page-reg-whatsapp"
                    type="tel"
                    placeholder="+91 98765 43210"
                    className="pl-10 bg-muted/50 border-primary/20 focus:border-primary/50"
                    value={form.whatsapp_phone}
                    onChange={(e) => setForm({ ...form, whatsapp_phone: e.target.value })}
                  />
                </div>
                <p className="text-xs text-muted-foreground">Include country code</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="page-reg-department">Department</Label>
                  <div className="relative">
                    <Building className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="page-reg-department"
                      type="text"
                      placeholder="BCA"
                      className="pl-10 bg-muted/50 border-primary/20 focus:border-primary/50"
                      value={form.department}
                      onChange={(e) => setForm({ ...form, department: e.target.value })}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="page-reg-college">College</Label>
                  <div className="relative">
                    <GraduationCap className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="page-reg-college"
                      type="text"
                      placeholder="Bishop Heber College"
                      className="pl-10 bg-muted/50 border-primary/20 focus:border-primary/50"
                      value={form.college}
                      onChange={(e) => setForm({ ...form, college: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              <NeonButton type="submit" className="w-full mt-6" size="lg" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  "Submit registration"
                )}
              </NeonButton>
            </form>
          </GlassPanel>
        </div>
      </main>

      <Footer />
    </div>
  );
}
