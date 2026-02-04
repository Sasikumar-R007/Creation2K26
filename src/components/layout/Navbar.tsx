import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Menu, X, LogIn, LogOut, User, LayoutDashboard } from "lucide-react";
import { GlassPanel } from "@/components/ui/glass-panel";
import { NeonButton } from "@/components/ui/neon-button";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, signOut, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  const getDashboardLink = () => {
    if (!user) return "/auth";
    switch (user.role) {
      case "creation_admin":
        return "/admin";
      case "student_incharge":
        return "/ic-dashboard";
      default:
        return "/dashboard";
    }
  };

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/#events", label: "Events" },
    { href: "/#about", label: "About" },
    { href: "/#contact", label: "Contact" },
  ];

  const isActive = (href: string) => {
    if (href === "/") return location.pathname === "/";
    return location.pathname.startsWith(href.replace("/#", "/"));
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50">
      <GlassPanel className="mx-4 mt-4 rounded-2xl">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Logo – same text style as hero (gradient, gloss) */}
            <Link to="/" className="flex items-center gap-2 group">
              <span className="hero-creation-text text-xl font-bold tracking-tight sm:text-2xl">
                CREATION 2K26
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-6">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className={`text-sm font-medium transition-colors hover:text-primary ${
                    isActive(link.href) ? "text-primary" : "text-muted-foreground"
                  }`}
                >
                  {link.label}
                </a>
              ))}
            </div>

            {/* Auth Buttons */}
            <div className="hidden md:flex items-center gap-3">
              {loading ? (
                <div className="h-10 w-24 bg-muted animate-pulse rounded-lg" />
              ) : user ? (
                <>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => navigate(getDashboardLink())}
                    className="gap-2"
                  >
                    <LayoutDashboard className="h-4 w-4" />
                    Dashboard
                  </Button>
                  <NeonButton
                    variant="outline"
                    size="sm"
                    onClick={handleSignOut}
                    className="gap-2"
                  >
                    <LogOut className="h-4 w-4" />
                    Sign Out
                  </NeonButton>
                </>
              ) : (
                <>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => navigate("/auth")}
                    className="gap-2"
                  >
                    <LogIn className="h-4 w-4" />
                    Sign In
                  </Button>
                  <NeonButton
                    size="sm"
                    onClick={() => navigate("/auth?tab=signup")}
                  >
                    Register Now
                  </NeonButton>
                </>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden p-2 text-foreground hover:text-primary transition-colors"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>

          {/* Mobile Navigation */}
          {isOpen && (
            <div className="md:hidden mt-4 pb-4 border-t border-border/50 pt-4 animate-fade-in">
              <div className="flex flex-col gap-3">
                {navLinks.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className={`text-sm font-medium py-2 transition-colors hover:text-primary ${
                      isActive(link.href) ? "text-primary" : "text-muted-foreground"
                    }`}
                  >
                    {link.label}
                  </a>
                ))}
                <div className="border-t border-border/50 pt-3 mt-2 flex flex-col gap-2">
                  {user ? (
                    <>
                      <Button
                        variant="ghost"
                        onClick={() => {
                          navigate(getDashboardLink());
                          setIsOpen(false);
                        }}
                        className="justify-start gap-2"
                      >
                        <User className="h-4 w-4" />
                        {user.profile?.name || "Dashboard"}
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => {
                          handleSignOut();
                          setIsOpen(false);
                        }}
                        className="justify-start gap-2"
                      >
                        <LogOut className="h-4 w-4" />
                        Sign Out
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button
                        variant="ghost"
                        onClick={() => {
                          navigate("/auth");
                          setIsOpen(false);
                        }}
                        className="justify-start gap-2"
                      >
                        <LogIn className="h-4 w-4" />
                        Sign In
                      </Button>
                      <NeonButton
                        onClick={() => {
                          navigate("/auth?tab=signup");
                          setIsOpen(false);
                        }}
                      >
                        Register Now
                      </NeonButton>
                    </>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </GlassPanel>
    </nav>
  );
};

export default Navbar;
