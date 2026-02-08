import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Sparkles, Instagram, Linkedin, Twitter, Mail, MapPin, Calendar, Lock } from "lucide-react";
import { VENUE, SOCIAL_LINKS, EVENT_DATE } from "@/lib/constants";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

const ADMIN_PIN = "1805";

const Footer = () => {
  const navigate = useNavigate();
  const [pinDialogOpen, setPinDialogOpen] = useState(false);
  const [pinValue, setPinValue] = useState("");
  const [pinError, setPinError] = useState("");

  const handleSparkleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setPinDialogOpen(true);
    setPinValue("");
    setPinError("");
  };

  const handlePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPinError("");
    if (pinValue.trim() === ADMIN_PIN) {
      setPinDialogOpen(false);
      setPinValue("");
      navigate("/admin-login");
    } else {
      setPinError("Incorrect PIN. Try again.");
    }
  };

  const formattedDate = EVENT_DATE.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <footer className="border-t border-border/50 bg-card/50 backdrop-blur-xl">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <button
                type="button"
                onClick={handleSparkleClick}
                className="p-1 rounded-lg hover:bg-primary/20 transition-colors focus:outline-none focus:ring-2 focus:ring-primary/50"
                aria-label="Admin access"
              >
                <Sparkles className="h-8 w-8 text-primary" />
              </button>
              <Link to="/" className="flex items-center gap-2">
                <span className="text-xl font-bold gradient-text">CREATION 2K26</span>
              </Link>
            </div>
            <p className="text-muted-foreground text-sm">
              Where Innovation Meets Imagination. Join us for an unforgettable symposium experience.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-4 text-foreground">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <a href="/#events" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                  Events
                </a>
              </li>
              <li>
                <a href="/#about" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                  About
                </a>
              </li>
              <li>
                <Link to="/register" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                  Register
                </Link>
              </li>
              <li>
                <a href="/#contact" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                  Contact
                </a>
              </li>
            </ul>
          </div>

          {/* Event Info */}
          <div>
            <h3 className="font-semibold mb-4 text-foreground">Event Info</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-2 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4 mt-0.5 text-primary shrink-0" />
                <span>{formattedDate}</span>
              </li>
              <li className="flex items-start gap-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4 mt-0.5 text-primary shrink-0" />
                <span>
                  {VENUE.name}<br />
                  {VENUE.college}<br />
                  {VENUE.address}
                </span>
              </li>
            </ul>
          </div>

          {/* Contact & Social */}
          <div>
            <h3 className="font-semibold mb-4 text-foreground">Connect With Us</h3>
            <div className="flex gap-3 mb-4">
              <a
                href={SOCIAL_LINKS.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg bg-muted hover:bg-primary/20 hover:text-primary transition-all"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href={SOCIAL_LINKS.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg bg-muted hover:bg-primary/20 hover:text-primary transition-all"
              >
                <Linkedin className="h-5 w-5" />
              </a>
              <a
                href={SOCIAL_LINKS.twitter}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg bg-muted hover:bg-primary/20 hover:text-primary transition-all"
              >
                <Twitter className="h-5 w-5" />
              </a>
            </div>
            <a
              href="mailto:contact@creation2k26.com"
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              <Mail className="h-4 w-4" />
              contact@creation2k26.com
            </a>
          </div>
        </div>

        {/* PIN dialog for admin access */}
        <Dialog open={pinDialogOpen} onOpenChange={(open) => { setPinDialogOpen(open); setPinError(""); setPinValue(""); }}>
          <DialogContent className="sm:max-w-sm">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Lock className="h-5 w-5 text-primary" />
                Enter PIN
              </DialogTitle>
            </DialogHeader>
            <p className="text-sm text-muted-foreground mb-4">
              Enter the PIN to access the admin sign-in page.
            </p>
            <form onSubmit={handlePinSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="admin-pin">PIN</Label>
                <Input
                  id="admin-pin"
                  type="password"
                  inputMode="numeric"
                  autoComplete="off"
                  placeholder="••••"
                  value={pinValue}
                  onChange={(e) => setPinValue(e.target.value)}
                  className="font-mono tracking-widest"
                  maxLength={6}
                />
                {pinError && <p className="text-sm text-destructive">{pinError}</p>}
              </div>
              <Button type="submit" className="w-full">
                Continue to Sign In
              </Button>
            </form>
          </DialogContent>
        </Dialog>

        {/* Bottom Bar */}
        <div className="border-t border-border/50 mt-8 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            © 2026 CREATION 2K26. All rights reserved.
          </p>
          <p className="text-sm text-muted-foreground">
            Made with <span className="text-primary">♥</span> by the CREATION Team
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
