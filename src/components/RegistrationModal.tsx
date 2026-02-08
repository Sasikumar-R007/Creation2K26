import { useState } from "react";
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
} from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { NeonButton } from "@/components/ui/neon-button";
import { useAuth } from "@/contexts/AuthContext";
import { useRegistrationModal } from "@/contexts/RegistrationModalContext";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
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

export function RegistrationModal() {
  const { isOpen, closeRegistrationModal, eventIdForRegistration } = useRegistrationModal();
  const { signUp, signIn } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [form, setForm] = useState(initialForm);
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

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
        if (signUpError.message?.includes("already registered") || signUpError.message?.includes("already been registered")) {
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

      if (eventIdForRegistration) {
        const { error: signInError } = await signIn(form.email, form.password);
        if (signInError) {
          toast({
            title: "Account created",
            description: "Check your email to confirm. You can register for events after confirming.",
          });
          closeRegistrationModal();
          setForm(initialForm);
          setIsSubmitting(false);
          return;
        }
        const { data: { user: newUser } } = await supabase.auth.getUser();
        if (newUser) {
          const { error: regError } = await supabase
            .from("event_registrations")
            .insert({ user_id: newUser.id, event_id: eventIdForRegistration });
          if (!regError) {
            queryClient.invalidateQueries({ queryKey: ["registrations"] });
            toast({
              title: "Registration successful! 🎉",
              description: "You're registered for the event. Check your email to confirm your account.",
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

      closeRegistrationModal();
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
    <Dialog open={isOpen} onOpenChange={(open) => !open && closeRegistrationModal()}>
      <DialogContent className="sm:max-w-md bg-card border-border">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            Register for CREATION 2K26
          </DialogTitle>
        </DialogHeader>
        <p className="text-sm text-muted-foreground">
          {eventIdForRegistration
            ? "Create an account and register for this event."
            : "Create an account to participate in events."}
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="reg-name">Full Name *</Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                id="reg-name"
                type="text"
                placeholder="John Doe"
                className="pl-10 bg-muted/50"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </div>
            {errors.name && <p className="text-destructive text-sm">{errors.name}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="reg-email">Email *</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                id="reg-email"
                type="email"
                placeholder="your@email.com"
                className="pl-10 bg-muted/50"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </div>
            {errors.email && <p className="text-destructive text-sm">{errors.email}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="reg-password">Password *</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                id="reg-password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                className="pl-10 pr-10 bg-muted/50"
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
            <Label htmlFor="reg-whatsapp">WhatsApp Phone Number</Label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                id="reg-whatsapp"
                type="tel"
                placeholder="+91 98765 43210"
                className="pl-10 bg-muted/50"
                value={form.whatsapp_phone}
                onChange={(e) => setForm({ ...form, whatsapp_phone: e.target.value })}
              />
            </div>
            <p className="text-xs text-muted-foreground">Include country code</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="reg-department">Department</Label>
              <div className="relative">
                <Building className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="reg-department"
                  type="text"
                  placeholder="BCA"
                  className="pl-10 bg-muted/50"
                  value={form.department}
                  onChange={(e) => setForm({ ...form, department: e.target.value })}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="reg-college">College</Label>
              <div className="relative">
                <GraduationCap className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="reg-college"
                  type="text"
                  placeholder="Bishop Heber College"
                  className="pl-10 bg-muted/50"
                  value={form.college}
                  onChange={(e) => setForm({ ...form, college: e.target.value })}
                />
              </div>
            </div>
          </div>

          <NeonButton type="submit" className="w-full" disabled={isSubmitting}>
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
      </DialogContent>
    </Dialog>
  );
}
