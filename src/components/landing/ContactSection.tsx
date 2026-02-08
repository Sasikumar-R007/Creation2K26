import { UserPlus, MailCheck, CalendarCheck } from "lucide-react";
import { GlassPanel } from "@/components/ui/glass-panel";
import { NeonButton } from "@/components/ui/neon-button";
import { useNavigate } from "react-router-dom";

const steps = [
  {
    step: 1,
    title: "Register",
    description: "Click Register Now and fill in your details to create an account.",
    icon: UserPlus,
    iconClass: "bg-primary/10 text-primary",
  },
  {
    step: 2,
    title: "Verify email",
    description: "Check your email to verify your account (if required).",
    icon: MailCheck,
    iconClass: "bg-secondary/10 text-secondary",
  },
  {
    step: 3,
    title: "Select events",
    description: "Choose events from the Events section. You can register for up to 2 events (subject to conflict rules).",
    icon: CalendarCheck,
    iconClass: "bg-accent/10 text-accent",
  },
];

const ContactSection = () => {
  const navigate = useNavigate();

  return (
    <section id="contact" className="py-24 relative">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            How to <span className="gradient-text">Register</span>
          </h2>
          <p className="text-muted-foreground text-lg">
            Follow these simple steps to register for CREATION 2K26 and participate in events.
          </p>
        </div>

        <div className="max-w-3xl mx-auto space-y-6">
          {steps.map(({ step, title, description, icon: Icon, iconClass }) => (
            <GlassPanel key={step} variant="hover" className="p-6">
              <div className="flex items-start gap-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${iconClass}`}>
                  <Icon className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Step {step}</span>
                    <h3 className="font-semibold text-foreground">{title}</h3>
                  </div>
                  <p className="text-muted-foreground text-sm">{description}</p>
                </div>
              </div>
            </GlassPanel>
          ))}
        </div>

        <div className="text-center mt-12">
          <NeonButton variant="cyan" size="lg" onClick={() => navigate("/register")}>
            <UserPlus className="w-5 h-5" />
            Register Now
          </NeonButton>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
