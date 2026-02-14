import { useState, useMemo, useCallback, useEffect } from "react";
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
  Users,
  CreditCard,
  Upload,
  ImageIcon,
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
import { Tabs, TabsContent } from "@/components/ui/tabs";
import {
  EVENT_DATE,
  VENUE,
  MAX_EVENTS_PER_PARTICIPANT,
  getEventTeamSize,
} from "@/lib/constants";
import { useEvents } from "@/hooks/useEvents";
import { useSubmitGuestRegistration } from "@/hooks/useRegistrations";
import { eventsConflict } from "@/lib/eventParticipation";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";

const emailSchema = z.string().email("Please enter a valid email address");
const nameSchema = z.string().min(2, "Name must be at least 2 characters");

export type TeamMember = { name: string; email: string; whatsapp_phone: string };

const initialForm = {
  name: "",
  email: "",
  whatsapp_phone: "",
  department: "",
  college: "",
  event_1_id: "",
  event_2_id: "",
  event_1_team_size: 1,
  event_2_team_size: 1,
  event_1_team_members: [] as TeamMember[],
  event_2_team_members: [] as TeamMember[],
  payment_screenshot: null as File | null,
};

const STEPS = [
  { id: "registration", label: "Registration", number: 1 },
  { id: "team", label: "Team Details", number: 2 },
  { id: "payment", label: "Payment", number: 3 },
] as const;

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

const PAYMENT_QR_MAP: Record<number, { amount: number; image: string }> = {
  1: { amount: 250, image: "/250.png" },
  2: { amount: 500, image: "/500.png" },
  3: { amount: 750, image: "/750.png" },
  4: { amount: 1000, image: "/1000.png" },
  5: { amount: 1250, image: "/1250.png" },
};

export default function Register() {
  const { data: events = [] } = useEvents();
  const submitRegistration = useSubmitGuestRegistration();

  const [form, setForm] = useState(initialForm);
  const [activeTab, setActiveTab] = useState("registration");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { toast } = useToast();

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

  const maxTeamSize1 = event1 ? getEventTeamSize(event1.name) : 1;
  const maxTeamSize2 = event2 ? getEventTeamSize(event2.name) : 1;

  const totalTeamMembersNeeded = useMemo(() => {
    const n1 = form.event_1_team_size || 1;
    const n2 = form.event_2_id ? (form.event_2_team_size || 1) : 0;
    return Math.max(n1, n2);
  }, [form.event_1_team_size, form.event_2_team_size, form.event_2_id]);

  const event1AdditionalCount = Math.max(0, (form.event_1_team_size || 1) - 1);
  const event2AdditionalCount = form.event_2_id
    ? Math.max(0, (form.event_2_team_size || 1) - 1)
    : 0;

  const syncEvent1TeamMembers = useCallback((count: number) => {
    setForm((f) => {
      const current = f.event_1_team_members;
      const next: TeamMember[] = Array.from({ length: count }, (_, i) =>
        current[i] ?? { name: "", email: "", whatsapp_phone: "" }
      );
      return { ...f, event_1_team_members: next };
    });
  }, []);

  const syncEvent2TeamMembers = useCallback((count: number) => {
    setForm((f) => {
      const current = f.event_2_team_members;
      const next: TeamMember[] = Array.from({ length: count }, (_, i) =>
        current[i] ?? { name: "", email: "", whatsapp_phone: "" }
      );
      return { ...f, event_2_team_members: next };
    });
  }, []);

  useEffect(() => {
    if (form.event_1_team_members.length !== event1AdditionalCount) {
      syncEvent1TeamMembers(event1AdditionalCount);
    }
  }, [event1AdditionalCount, syncEvent1TeamMembers]);

  useEffect(() => {
    if (form.event_2_team_members.length !== event2AdditionalCount) {
      syncEvent2TeamMembers(event2AdditionalCount);
    }
  }, [event2AdditionalCount, syncEvent2TeamMembers]);

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

    if (!form.payment_screenshot) {
      setErrors((prev) => ({ ...prev, payment_screenshot: "Please upload your payment screenshot." }));
      setActiveTab("payment");
      return;
    }

    setIsSubmitting(true);
    try {
      let paymentUrl: string | null = null;
      if (form.payment_screenshot) {
        const ext = form.payment_screenshot.name.split(".").pop() || "png";
        const path = `${crypto.randomUUID()}.${ext}`;
        const { error: uploadError } = await supabase.storage
          .from("payment-screenshots")
          .upload(path, form.payment_screenshot, {
            cacheControl: "3600",
            upsert: false,
          });
        if (uploadError) {
          toast({
            title: "Upload failed",
            description: uploadError.message || "Could not upload payment screenshot.",
            variant: "destructive",
          });
          setIsSubmitting(false);
          return;
        }
        const { data: urlData } = supabase.storage.from("payment-screenshots").getPublicUrl(path);
        paymentUrl = urlData.publicUrl;
      }

      await submitRegistration.mutateAsync({
        name: form.name,
        email: form.email,
        whatsapp_phone: form.whatsapp_phone || undefined,
        department: form.department || undefined,
        college: form.college || undefined,
        event_1_id: form.event_1_id,
        event_2_id: form.event_2_id || null,
        event_1_team_size: form.event_1_team_size,
        event_2_team_size: form.event_2_id ? form.event_2_team_size : null,
        team_members: {
          event_1: form.event_1_team_members,
          event_2: form.event_2_team_members,
        },
        payment_screenshot_url: paymentUrl,
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

      <main className="relative min-h-[calc(100vh-4rem)] w-full px-4 sm:px-6 lg:px-8 pt-24 pb-16">
        <div className="max-w-4xl mx-auto">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>

          <div className="mb-8">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-6 h-6 text-primary" />
              <h1 className="text-2xl sm:text-3xl font-bold">
                <span className="gradient-text">CREATION 2K26</span>
              </h1>
            </div>
            <p className="text-muted-foreground">
              BCA Department, Bishop Heber College. Register for up to two events.
            </p>
          </div>

          {/* Step progress indicator */}
          <div className="mb-8 sm:mb-10">
            <div className="flex items-center justify-between w-full">
              {STEPS.map((step, index) => {
                const isActive = activeTab === step.id;
                const stepIndex = STEPS.findIndex((s) => s.id === activeTab);
                const isCompleted = index < stepIndex;
                return (
                  <div key={step.id} className="flex flex-1 items-center">
                    <div className="flex flex-col items-center flex-1">
                      <button
                        type="button"
                        onClick={() => setActiveTab(step.id)}
                        className={`
                          w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center text-sm font-semibold
                          transition-colors touch-manipulation
                          ${isActive
                            ? "bg-primary text-primary-foreground ring-2 ring-primary/30"
                            : isCompleted
                              ? "bg-primary/80 text-primary-foreground"
                              : "bg-muted/80 text-muted-foreground border border-border"
                          }
                        `}
                      >
                        {isCompleted ? <CheckCircle2 className="w-5 h-5 sm:w-6 sm:h-6" /> : step.number}
                      </button>
                      <span
                        className={`mt-2 text-xs sm:text-sm font-medium text-center max-w-[80px] ${
                          isActive ? "text-foreground" : "text-muted-foreground"
                        }`}
                      >
                        {step.label}
                      </span>
                    </div>
                    {index < STEPS.length - 1 && (
                      <div
                        className={`flex-1 h-0.5 mx-1 sm:mx-2 border-t-2 border-dashed ${
                          index < stepIndex ? "border-primary" : "border-muted-foreground/30"
                        }`}
                      />
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Full-width registration form */}
          <GlassPanel className="p-6 sm:p-8 lg:p-10 border-primary/20 w-full min-h-[400px]" glow="cyan">
            <div className="flex items-center gap-2 mb-2">
              <CalendarDays className="w-5 h-5 text-primary shrink-0" />
              <h2 className="text-lg sm:text-xl font-bold">Event registration</h2>
            </div>
            <p className="text-sm text-muted-foreground mb-6">
              Choose up to two events. Options that conflict with your first choice will show <span className="text-destructive font-medium">TIME CONFLICT</span> and cannot be selected.
            </p>
            <details className="mb-6 rounded-lg border border-primary/20 bg-muted/10 p-4">
              <summary className="cursor-pointer text-sm font-medium text-foreground">View participation rules & conflict groups</summary>
              <div className="mt-4 space-y-3 text-sm text-muted-foreground">
                <p>• Maximum of {MAX_EVENTS_PER_PARTICIPANT} events. Within each conflict group, choose only one.</p>
                <p><strong className="text-foreground">Group A:</strong> {conflictGroups[0].events.join(", ")}</p>
                <p><strong className="text-foreground">Group B:</strong> {conflictGroups[1].events.join(", ")}</p>
                <p className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  {formattedDate} · {VENUE.name}
                </p>
              </div>
            </details>

            <form onSubmit={handleSubmit} className="space-y-4">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsContent value="registration" className="space-y-4 mt-0">
                  <div className="space-y-2">
                    <Label>Event 1 *</Label>
                    <Select
                      value={form.event_1_id || EMPTY_VALUE}
                      onValueChange={(v) => {
                        const evId = v === EMPTY_VALUE ? "" : v;
                        const ev = events.find((e) => e.id === evId);
                        const maxSize = ev ? getEventTeamSize(ev.name) : 1;
                        const newTeamSize1 = Math.min(form.event_1_team_size, maxSize) || 1;
                        setForm((f) => ({
                          ...f,
                          event_1_id: evId,
                          event_2_id: evId === "" ? "" : f.event_2_id,
                          event_1_team_size: newTeamSize1,
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

                  {form.event_1_id && (
                    <div className="space-y-2">
                      <Label>Number of Participants — Event 1</Label>
                      <Select
                        value={String(form.event_1_team_size)}
                        onValueChange={(v) => {
                          const n = parseInt(v, 10);
                          setForm((f) => ({ ...f, event_1_team_size: n }));
                        }}
                      >
                        <SelectTrigger className="w-full bg-muted/50 border-primary/20">
                          <SelectValue placeholder="SELECT NUMBER OF TEAM MEMBERS" />
                        </SelectTrigger>
                        <SelectContent>
                          {Array.from({ length: maxTeamSize1 }, (_, i) => i + 1).map((n) => (
                            <SelectItem key={n} value={String(n)}>
                              {n} {n === 1 ? "member" : "members"}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label>Event 2 (optional)</Label>
                    <Select
                      value={form.event_2_id || EMPTY_VALUE}
                      onValueChange={(v) => {
                        const evId = v === EMPTY_VALUE ? "" : v;
                        const ev = evId ? events.find((e) => e.id === evId) : null;
                        const maxSize = ev ? getEventTeamSize(ev.name) : 1;
                        setForm((f) => ({
                          ...f,
                          event_2_id: evId,
                          event_2_team_size: evId ? (Math.min(f.event_2_team_size, maxSize) || 1) : 1,
                          event_2_team_members: evId ? f.event_2_team_members : [],
                        }));
                      }}
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

                  {form.event_2_id && (
                    <div className="space-y-2">
                      <Label>Number of Participants — Event 2</Label>
                      <Select
                        value={String(form.event_2_team_size)}
                        onValueChange={(v) => {
                          const n = parseInt(v, 10);
                          setForm((f) => ({ ...f, event_2_team_size: n }));
                        }}
                      >
                        <SelectTrigger className="w-full bg-muted/50 border-primary/20">
                          <SelectValue placeholder="SELECT NUMBER OF TEAM MEMBERS" />
                        </SelectTrigger>
                        <SelectContent>
                          {Array.from({ length: maxTeamSize2 }, (_, i) => i + 1).map((n) => (
                            <SelectItem key={n} value={String(n)}>
                              {n} {n === 1 ? "member" : "members"}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}

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
                </TabsContent>

                <TabsContent value="team" className="space-y-6 mt-0">
                  {event1AdditionalCount === 0 && event2AdditionalCount === 0 ? (
                    <p className="text-sm text-muted-foreground py-4">
                      No additional team members required. You (the primary registrant) are the only participant for both events.
                    </p>
                  ) : (
                    <div className="space-y-8">
                      {event1AdditionalCount > 0 && (
                        <div>
                          <h3 className="text-base font-semibold text-primary mb-3 flex items-center gap-2">
                            <Users className="w-4 h-4" />
                            Event 1 — {event1?.name} ({form.event_1_team_size} {form.event_1_team_size === 1 ? "participant" : "participants"})
                          </h3>
                          <p className="text-sm text-muted-foreground mb-4">
                            Add {event1AdditionalCount} team member(s) for Event 1. You (the primary registrant) are already counted.
                          </p>
                          <div className="space-y-4">
                            {form.event_1_team_members.map((member, idx) => (
                              <div key={idx} className="rounded-lg border border-border/50 p-4 space-y-3 bg-muted/20">
                                <h4 className="text-sm font-medium text-foreground">Team member {idx + 1}</h4>
                                <div className="grid gap-3 sm:grid-cols-1">
                                  <div className="space-y-2">
                                    <Label>Full Name *</Label>
                                    <Input
                                      placeholder="Full name"
                                      className="bg-muted/50 border-primary/20"
                                      value={member.name}
                                      onChange={(e) =>
                                        setForm((f) => {
                                          const next = [...f.event_1_team_members];
                                          next[idx] = { ...next[idx], name: e.target.value };
                                          return { ...f, event_1_team_members: next };
                                        })
                                      }
                                    />
                                  </div>
                                  <div className="space-y-2">
                                    <Label>Email *</Label>
                                    <Input
                                      type="email"
                                      placeholder="email@example.com"
                                      className="bg-muted/50 border-primary/20"
                                      value={member.email}
                                      onChange={(e) =>
                                        setForm((f) => {
                                          const next = [...f.event_1_team_members];
                                          next[idx] = { ...next[idx], email: e.target.value };
                                          return { ...f, event_1_team_members: next };
                                        })
                                      }
                                    />
                                  </div>
                                  <div className="space-y-2">
                                    <Label>WhatsApp Phone</Label>
                                    <Input
                                      type="tel"
                                      placeholder="+91 98765 43210"
                                      className="bg-muted/50 border-primary/20"
                                      value={member.whatsapp_phone}
                                      onChange={(e) =>
                                        setForm((f) => {
                                          const next = [...f.event_1_team_members];
                                          next[idx] = { ...next[idx], whatsapp_phone: e.target.value };
                                          return { ...f, event_1_team_members: next };
                                        })
                                      }
                                    />
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      {event2AdditionalCount > 0 && (
                        <div>
                          <h3 className="text-base font-semibold text-secondary mb-3 flex items-center gap-2">
                            <Users className="w-4 h-4" />
                            Event 2 — {event2?.name} ({form.event_2_team_size} {form.event_2_team_size === 1 ? "participant" : "participants"})
                          </h3>
                          <p className="text-sm text-muted-foreground mb-4">
                            Add {event2AdditionalCount} team member(s) for Event 2. You (the primary registrant) are already counted.
                          </p>
                          <div className="space-y-4">
                            {form.event_2_team_members.map((member, idx) => (
                              <div key={idx} className="rounded-lg border border-border/50 p-4 space-y-3 bg-muted/20">
                                <h4 className="text-sm font-medium text-foreground">Team member {idx + 1}</h4>
                                <div className="grid gap-3 sm:grid-cols-1">
                                  <div className="space-y-2">
                                    <Label>Full Name *</Label>
                                    <Input
                                      placeholder="Full name"
                                      className="bg-muted/50 border-primary/20"
                                      value={member.name}
                                      onChange={(e) =>
                                        setForm((f) => {
                                          const next = [...f.event_2_team_members];
                                          next[idx] = { ...next[idx], name: e.target.value };
                                          return { ...f, event_2_team_members: next };
                                        })
                                      }
                                    />
                                  </div>
                                  <div className="space-y-2">
                                    <Label>Email *</Label>
                                    <Input
                                      type="email"
                                      placeholder="email@example.com"
                                      className="bg-muted/50 border-primary/20"
                                      value={member.email}
                                      onChange={(e) =>
                                        setForm((f) => {
                                          const next = [...f.event_2_team_members];
                                          next[idx] = { ...next[idx], email: e.target.value };
                                          return { ...f, event_2_team_members: next };
                                        })
                                      }
                                    />
                                  </div>
                                  <div className="space-y-2">
                                    <Label>WhatsApp Phone</Label>
                                    <Input
                                      type="tel"
                                      placeholder="+91 98765 43210"
                                      className="bg-muted/50 border-primary/20"
                                      value={member.whatsapp_phone}
                                      onChange={(e) =>
                                        setForm((f) => {
                                          const next = [...f.event_2_team_members];
                                          next[idx] = { ...next[idx], whatsapp_phone: e.target.value };
                                          return { ...f, event_2_team_members: next };
                                        })
                                      }
                                    />
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="payment" className="space-y-4 mt-0">
                  {(() => {
                    const participants = Math.max(1, Math.min(5, totalTeamMembersNeeded));
                    const qr = PAYMENT_QR_MAP[participants];
                    return (
                      <div className="rounded-lg border border-primary/20 bg-muted/10 p-6 flex flex-col items-center">
                        <p className="text-sm font-medium text-foreground mb-1">
                          {participants} {participants === 1 ? "participant" : "participants"} — ₹{qr.amount}
                        </p>
                        <p className="text-xs text-muted-foreground mb-4">
                          Scan the QR code to complete payment
                        </p>
                        <div className="flex justify-center">
                          <img
                            src={qr.image}
                            alt={`Payment QR - ₹${qr.amount}`}
                            className="w-44 h-44 sm:w-52 sm:h-52 object-contain rounded-lg border border-border/50"
                          />
                        </div>
                      </div>
                    );
                  })()}
                  <p className="text-sm text-muted-foreground">
                    Upload a screenshot of your payment confirmation.
                  </p>
                  <div className="space-y-2">
                    <Label htmlFor="payment-upload">Payment screenshot *</Label>
                    <div className="flex flex-col gap-3">
                      <label
                        htmlFor="payment-upload"
                        className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-primary/30 rounded-lg cursor-pointer bg-muted/30 hover:bg-muted/50 transition-colors"
                      >
                        {form.payment_screenshot ? (
                          <div className="flex flex-col items-center gap-2 p-2">
                            <ImageIcon className="w-10 h-10 text-primary" />
                            <span className="text-sm font-medium">{form.payment_screenshot.name}</span>
                            <span className="text-xs text-muted-foreground">Click to change</span>
                          </div>
                        ) : (
                          <div className="flex flex-col items-center gap-2 p-2">
                            <Upload className="w-10 h-10 text-muted-foreground" />
                            <span className="text-sm text-muted-foreground">Click to upload (PNG, JPG, WebP)</span>
                          </div>
                        )}
                        <input
                          id="payment-upload"
                          type="file"
                          accept="image/png,image/jpeg,image/webp"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) setForm((f) => ({ ...f, payment_screenshot: file }));
                          }}
                        />
                      </label>
                    </div>
                    {errors.payment_screenshot && (
                      <p className="text-destructive text-sm">{errors.payment_screenshot}</p>
                    )}
                  </div>
                </TabsContent>
              </Tabs>

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
