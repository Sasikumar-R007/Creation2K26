import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Menu, X, LogOut, LayoutDashboard, User } from "lucide-react";
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
    if (!user) return "/admin-login";
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
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 group">
              <img 
                src="/Logo 4.png" 
                alt="CREATION 2K26" 
                className="h-8 sm:h-9 md:h-10 w-auto object-contain transition-all duration-300 group-hover:scale-105"
              />
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-6">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className={`text-base font-medium transition-colors hover:text-primary ${
                    isActive(link.href) ? "text-blue-500 font-semibold" : "text-muted-foreground"
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
                    size="default"
                    onClick={() => navigate(getDashboardLink())}
                    className="gap-2 text-base"
                  >
                    <LayoutDashboard className="h-4 w-4" />
                    Dashboard
                  </Button>
                  <NeonButton
                    variant="outline"
                    size="default"
                    onClick={handleSignOut}
                    className="gap-2 text-base"
                  >
                    <LogOut className="h-4 w-4" />
                    Sign Out
                  </NeonButton>
                </>
              ) : (
                <NeonButton
                  size="default"
                  onClick={() => navigate("/register")}
                  className="text-base register-now-button"
                >
                  Register Now
                </NeonButton>
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
              <div className="flex flex-col gap-3 items-center">
                {navLinks.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className={`text-sm font-medium py-2 text-center transition-colors hover:text-primary ${
                      isActive(link.href) ? "text-blue-500 font-semibold" : "text-muted-foreground"
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
                    <NeonButton
                      onClick={() => {
                        navigate("/register");
                        setIsOpen(false);
                      }}
                      className="register-now-button"
                    >
                      Register Now
                    </NeonButton>
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
