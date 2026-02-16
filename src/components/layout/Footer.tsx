import { Link } from "react-router-dom";
import { Instagram, Mail, MapPin, Calendar } from "lucide-react";
import { VENUE, SOCIAL_LINKS, EVENT_DATE } from "@/lib/constants";

const Footer = () => {

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
              <Link to="/" className="flex items-center gap-2">
                <img
                  src="/Logo 4.png"
                  alt="CREATION 2K26"
                  className="h-12 w-auto object-contain"
                />
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
            <div className="flex gap-3">
              <a
                href={SOCIAL_LINKS.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg bg-muted hover:bg-primary/20 hover:text-primary transition-all"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href={`mailto:${SOCIAL_LINKS.email}`}
                className="p-2 rounded-lg bg-muted hover:bg-primary/20 hover:text-primary transition-all"
              >
                <Mail className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-border/50 mt-8 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            © 2026 <span className="font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">CREATION 2K26</span>. All rights reserved.
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
