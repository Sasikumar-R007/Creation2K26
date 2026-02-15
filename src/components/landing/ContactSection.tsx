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

        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {steps.map(({ step, title, description, icon: Icon, iconClass }, index) => (
              <div key={step} className="relative">
                {/* Connection line for desktop */}
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-12 left-full w-full h-0.5 border-t-2 border-dashed border-primary/30 z-0" style={{ width: 'calc(100% - 3rem)' }} />
                )}
                
                <GlassPanel variant="hover" className="p-6 h-full relative z-10 border-primary/20 hover:border-primary/40 transition-all">
                  {/* Step number badge */}
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-14 h-14 rounded-lg flex items-center justify-center shrink-0 ${iconClass} border-2 border-primary/30 relative overflow-hidden`}>
                      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/10 to-transparent opacity-0 hover:opacity-100 transition-opacity" />
                      <Icon className="w-7 h-7 relative z-10" />
                    </div>
                    <span className="text-3xl font-mono font-bold text-primary/30">{String(step).padStart(2, '0')}</span>
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="text-lg font-bold text-foreground">{title}</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">{description}</p>
                  </div>
                  
                  {/* Techy corner accent */}
                  <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-primary/20" />
                </GlassPanel>
              </div>
            ))}
          </div>
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
