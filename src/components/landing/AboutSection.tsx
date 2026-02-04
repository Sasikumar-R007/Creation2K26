import { FileText } from "lucide-react";
import { GlassPanel } from "@/components/ui/glass-panel";

const generalRules = [
  "The competition is open to all UG students from Engineering and Arts and Science colleges.",
  "Online registration opens from 5.2.2026. Limited spot registration will be entertained until 10:00 AM on the day of the event.",
  "A registration fee of Rs. 250 per participant must be paid online during the registration.",
  "Entry is restricted to college students only. Carrying a valid college ID card is compulsory for all participants.",
  "The Overall Championship will be calculated department-wise and not college-wise.",
  "Lunch and refreshments will be provided.",
  "The decision of the judges will be final.",
  "Participation certificates will be given to all participants.",
  "Any team found violating the rules will not be considered for further proceedings.",
  "Travelling allowance and accommodation will not be provided.",
];

const AboutSection = () => {
  return (
    <section id="about" className="py-24 relative">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            About <span className="gradient-text">CREATION 2K26</span>
          </h2>
          <p className="text-muted-foreground text-lg">
            CREATION 2K26 is the flagship technical and cultural symposium that brings together
            the brightest minds to compete, collaborate, and create. Join us for a day filled
            with innovation, creativity, and unforgettable experiences.
          </p>
        </div>

        {/* General Instructions */}
        <GlassPanel variant="hover" className="p-8 mb-16">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <FileText className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-xl md:text-2xl font-bold">General Instructions of Creation 2K26</h3>
          </div>
          <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-4">General Rules</h4>
          <ul className="space-y-3 text-foreground">
            {generalRules.map((rule, index) => (
              <li key={index} className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0 mt-2" />
                <span>{rule}</span>
              </li>
            ))}
          </ul>
        </GlassPanel>

        {/* Features */}
        <div className="grid md:grid-cols-2 gap-8">
          <GlassPanel variant="hover" className="p-8">
            <h3 className="text-xl font-bold mb-4 text-primary">Technical Events</h3>
            <p className="text-muted-foreground mb-4">
              Put your coding skills to the test with our technical events. From debugging
              challenges to web design competitions, showcase your technical expertise and
              win exciting prizes.
            </p>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                Quiz - Test your knowledge
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                Paper Presentation - Present your research
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                Debugging - Find and fix bugs
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                Web Design - Create stunning websites
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                AI Prompt Engineering - Master AI prompts
              </li>
            </ul>
          </GlassPanel>

          <GlassPanel variant="hover" className="p-8">
            <h3 className="text-xl font-bold mb-4 text-secondary">Non-Technical Events</h3>
            <p className="text-muted-foreground mb-4">
              Let your creativity shine with our non-technical events. From ad creation
              to movie spoofing, these events are designed to bring out your artistic
              side and entertainment skills.
            </p>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-secondary" />
                Ad Zap - Creative advertising
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-secondary" />
                Personality Contest - Showcase yourself
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-secondary" />
                Memory Matrix - Test your memory
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-secondary" />
                IPL Auction - Strategic bidding game
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-secondary" />
                Movie Spoofing - Entertainment and fun
              </li>
            </ul>
          </GlassPanel>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
