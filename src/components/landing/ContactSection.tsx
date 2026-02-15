import { UserPlus, ListChecks, Send } from "lucide-react";
import { GlassPanel } from "@/components/ui/glass-panel";
import { NeonButton } from "@/components/ui/neon-button";
import { useNavigate } from "react-router-dom";

const steps = [
  {
    step: 1,
    title: "Go to registration",
    description: "Click Register Now to open the event registration page. No account or sign-in needed.",
    icon: UserPlus,
    iconClass: "bg-primary/10 text-primary",
  },
  {
    step: 2,
    title: "Fill details & pick events",
    description: "Enter your name, email, and college details. Select Event 1 and Event 2 from the dropdowns. Options that clash in time show TIME CONFLICT and cannot be selected—you can register for up to 2 events.",
    icon: ListChecks,
    iconClass: "bg-secondary/10 text-secondary",
  },
  {
    step: 3,
    title: "Submit",
    description: "Hit Submit registration. Your choices are saved and visible to the admin. That’s it—no email verification or login required.",
    icon: Send,
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
            Follow these steps to register for up to two events. No account or sign-in required.
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
          <NeonButton variant="cyan" size="lg" onClick={() => navigate("/register")} className="register-now-button">
            <UserPlus className="w-5 h-5" />
            Register Now
          </NeonButton>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
