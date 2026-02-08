import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  Mail,
  Lock,
  User,
  Building,
  GraduationCap,
  Phone,
  Eye,
  EyeOff,
  Loader2,
  Sparkles,
  CheckCircle2,
  Calendar,
  MapPin,
  BookOpen,
  ArrowLeft,
} from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { GlassPanel } from "@/components/ui/glass-panel";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { NeonButton } from "@/components/ui/neon-button";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  EVENT_DATE,
  VENUE,
  MAX_EVENTS_PER_PARTICIPANT,
} from "@/lib/constants";
import { useEvents } from "@/hooks/useEvents";
import { z } from "zod";

const emailSchema = z.string().email("Please enter a valid email address");
const passwordSchema = z.string().min(6, "Password must be at least 6 characters");
const nameSchema = z.string().min(2, "Name must be at least 2 characters");

const initialForm = {
  name: "",
  email: "",
  password: "",
  whatsapp_phone: "",
  department: "",
  college: "",
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

export default function Register() {
  const [searchParams] = useSearchParams();
  const eventIdFromQuery = searchParams.get("event") ?? null;
  const { data: events = [] } = useEvents();
  const eventFromQuery = eventIdFromQuery
    ? events.find((e) => e.id === eventIdFromQuery)
    : null;

  const { signUp, signIn } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [form, setForm] = useState(initialForm);
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const formattedDate = EVENT_DATE.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const validateField = (field: string, value: string) => {
    try {
      if (field === "email") emailSchema.parse(value);
      else if (field === "password") passwordSchema.parse(value);
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
    const passwordValid = validateField("password", form.password);
    if (!nameValid || !emailValid || !passwordValid) return;

    setIsSubmitting(true);
    try {
      const { error: signUpError } = await signUp(
        form.email,
        form.password,
        form.name,
        form.department || undefined,
        form.college || undefined,
        form.whatsapp_phone || undefined
      );

      if (signUpError) {
        if (
          signUpError.message?.includes("already registered") ||
          signUpError.message?.includes("already been registered")
        ) {
          toast({
            title: "Already registered",
            description: "This email is already registered. Use Admin Sign In if you are staff.",
            variant: "destructive",
          });
        } else {
          toast({
            title: "Registration failed",
            description: signUpError.message || "Please try again.",
            variant: "destructive",
          });
        }
        setIsSubmitting(false);
        return;
      }

      if (eventIdFromQuery) {
        const { error: signInError } = await signIn(form.email, form.password);
        if (signInError) {
          toast({
            title: "Account created",
            description: "Check your email to confirm. You can register for events after confirming.",
          });
          setForm(initialForm);
          setIsSubmitting(false);
          return;
        }
        const {
          data: { user: newUser },
        } = await supabase.auth.getUser();
        if (newUser) {
          const { error: regError } = await supabase
            .from("event_registrations")
            .insert({ user_id: newUser.id, event_id: eventIdFromQuery });
          if (!regError) {
            queryClient.invalidateQueries({ queryKey: ["registrations"] });
            toast({
              title: "Registration successful! 🎉",
              description: `You're registered for ${eventFromQuery?.name ?? "the event"}. Check your email to confirm your account.`,
            });
          } else {
            toast({
              title: "Account created",
              description: "Check your email to confirm. You can register for events from the dashboard.",
            });
          }
        } else {
          toast({
            title: "Account created",
            description: "Check your email to confirm your account.",
          });
        }
      } else {
        toast({
          title: "Registration received! 🎉",
          description: "Check your email to confirm your account. Your details are saved.",
        });
      }

      setForm(initialForm);
    } catch (err: any) {
      toast({
        title: "Something went wrong",
        description: err?.message || "Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background dark">
      {/* Background gradient and subtle grid */}
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
                BCA Department, Bishop Heber College. Register once and participate in up to two events.
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
                  <span>You can register for a <strong className="text-foreground">maximum of {MAX_EVENTS_PER_PARTICIPANT} events</strong> in total.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                  <span>Within each conflict group below, you may choose <strong className="text-foreground">only one event</strong>. Picking one blocks the others in that group.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                  <span>After registering, you can sign in and manage your events from the dashboard.</span>
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

          {/* Right: Form */}
          <GlassPanel className="p-6 md:p-8 border-primary/20" glow="cyan">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-5 h-5 text-primary" />
              <h2 className="text-xl font-bold">Create your account</h2>
            </div>
            {eventFromQuery && (
              <p className="text-sm text-primary mb-6">
                You're registering for: <strong>{eventFromQuery.name}</strong>
              </p>
            )}
            {!eventFromQuery && eventIdFromQuery && (
              <p className="text-sm text-muted-foreground mb-6">
                After creating your account you can register for events from the dashboard.
              </p>
            )}
            {!eventIdFromQuery && (
              <p className="text-sm text-muted-foreground mb-6">
                Fill in your details to participate in CREATION 2K26 events.
              </p>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
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
                <Label htmlFor="page-reg-password">Password *</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="page-reg-password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    className="pl-10 pr-10 bg-muted/50 border-primary/20 focus:border-primary/50"
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {errors.password && <p className="text-destructive text-sm">{errors.password}</p>}
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
                    Creating account...
                  </>
                ) : (
                  "Create account"
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
