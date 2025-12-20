import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { Menu, X, Calendar, Home, Layers, Bell } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export function Layout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const links = [
    { href: "/", label: "Home", icon: Home },
    { href: "/events", label: "Events", icon: Layers },
    { href: "/schedule", label: "Schedule", icon: Calendar },
    { href: "/announcements", label: "Updates", icon: Bell },
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col font-body text-foreground overflow-x-hidden">
      <nav className="fixed top-0 left-0 right-0 z-50 glass-card border-b border-white/5 h-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
              <span className="font-display font-bold text-white text-xl">C</span>
            </div>
            <span className="font-display font-bold text-lg tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">Creation 2K26</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            {links.map((link) => (
              <Link key={link.href} href={link.href} className={cn(
                "text-sm font-medium transition-colors hover:text-primary flex items-center gap-2",
                location === link.href ? "text-primary" : "text-muted-foreground"
              )}>
                <link.icon className="w-4 h-4" />
                {link.label}
              </Link>
            ))}
            <Link href="/admin/login">
               <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-white">Admin</Button>
            </Link>
          </div>

          {/* Mobile Menu Toggle */}
          <button 
            className="md:hidden text-foreground p-2"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden absolute top-16 left-0 right-0 glass-card border-b border-white/5 p-4 flex flex-col gap-4 animate-in slide-in-from-top-2">
            {links.map((link) => (
              <Link 
                key={link.href} 
                href={link.href} 
                className={cn(
                  "p-3 rounded-lg flex items-center gap-3 transition-colors",
                  location === link.href ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-white/5"
                )}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <link.icon className="w-5 h-5" />
                {link.label}
              </Link>
            ))}
             <Link href="/admin/login" onClick={() => setIsMobileMenuOpen(false)}>
               <div className="p-3 text-muted-foreground text-sm">Admin Access</div>
            </Link>
          </div>
        )}
      </nav>

      <main className="flex-1 pt-16">
        {children}
      </main>

      <footer className="bg-card border-t border-white/5 py-12 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-center md:text-left">
            <h3 className="font-display font-bold text-lg mb-2 bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">Creation 2K26</h3>
            <p className="text-muted-foreground text-sm">The ultimate national symposium for innovation and excellence.</p>
          </div>
          <div className="flex gap-6 text-sm text-muted-foreground">
            <a href="#" className="hover:text-primary transition-colors">Contact</a>
            <a href="#" className="hover:text-primary transition-colors">Rules</a>
            <a href="#" className="hover:text-primary transition-colors">Privacy</a>
          </div>
          <div className="text-sm text-muted-foreground">
            © 2024 Tech Symposium. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
