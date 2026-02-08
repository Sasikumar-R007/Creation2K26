import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, Lock, Loader2, Shield } from "lucide-react";
import { GlassPanel } from "@/components/ui/glass-panel";
import { NeonButton } from "@/components/ui/neon-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";

const emailSchema = z.string().email("Please enter a valid email address");
const passwordSchema = z.string().min(6, "Password must be at least 6 characters");

const AdminLogin = () => {
  const navigate = useNavigate();
  const { user, signIn, loading: authLoading } = useAuth();
  const { toast } = useToast();

  const [form, setForm] = useState({ email: "", password: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (user && !authLoading) {
      const path =
        user.role === "creation_admin"
          ? "/admin"
          : user.role === "student_incharge"
            ? "/ic-dashboard"
            : "/dashboard";
      navigate(path, { replace: true });
    }
  }, [user, authLoading, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    try {
      emailSchema.parse(form.email);
      passwordSchema.parse(form.password);
    } catch (err) {
      if (err instanceof z.ZodError) {
        setErrors({
          email: err.errors.find((e) => e.path[0] === "email")?.message ?? "",
          password: err.errors.find((e) => e.path[0] === "password")?.message ?? "",
        });
      }
      return;
    }

    setIsSubmitting(true);
    const { error } = await signIn(form.email, form.password);
    setIsSubmitting(false);

    if (error) {
      toast({
        title: "Sign in failed",
        description:
          error.message === "Invalid login credentials"
            ? "Invalid email or password."
            : error.message,
        variant: "destructive",
      });
      return;
    }

    toast({ title: "Signed in", description: "Redirecting..." });
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <GlassPanel className="w-full max-w-md p-6">
        <div className="flex items-center gap-2 mb-6">
          <Shield className="w-5 h-5 text-primary" />
          <h1 className="text-xl font-bold">Admin / IC Sign In</h1>
        </div>
        <p className="text-sm text-muted-foreground mb-6">
          For symposium admins and event in-charges only.
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="admin-email">Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                id="admin-email"
                type="email"
                placeholder="admin@creation2k26.com"
                className="pl-10 bg-muted/50"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </div>
            {errors.email && <p className="text-destructive text-sm">{errors.email}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="admin-password">Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                id="admin-password"
                type="password"
                placeholder="••••••••"
                className="pl-10 bg-muted/50"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
              />
            </div>
            {errors.password && <p className="text-destructive text-sm">{errors.password}</p>}
          </div>
          <NeonButton type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Signing in...
              </>
            ) : (
                "Sign In"
              )}
          </NeonButton>
        </form>
        <p className="mt-6 text-center">
          <a href="/" className="text-sm text-muted-foreground hover:text-primary">
            ← Back to Home
          </a>
        </p>
      </GlassPanel>
    </div>
  );
};

export default AdminLogin;
