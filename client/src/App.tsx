import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";

import Home from "@/pages/home";
import Events from "@/pages/events";
import Schedule from "@/pages/schedule";
import Announcements from "@/pages/announcements";

// Admin Pages
import AdminLogin from "@/pages/admin/login";
import AdminDashboard from "@/pages/admin/dashboard";
import AdminEvents from "@/pages/admin/events";
import AdminRegistrations from "@/pages/admin/registrations";
import { useState } from "react";
import { LoadingAnimation } from "@/components/loading-animation";
import { AnimatePresence } from "framer-motion";

function Router() {
  return (
    <Switch>
      {/* Public Routes */}
      <Route path="/" component={Home} />
      <Route path="/events" component={Events} />
      <Route path="/schedule" component={Schedule} />
      <Route path="/announcements" component={Announcements} />

      {/* Admin Routes */}
      <Route path="/admin/login" component={AdminLogin} />
      <Route path="/admin/dashboard" component={AdminDashboard} />
      <Route path="/admin/events" component={AdminEvents} />
      <Route path="/admin/registrations" component={AdminRegistrations} />

      {/* Fallback */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <AnimatePresence mode="wait">
          {isLoading ? (
            <LoadingAnimation key="loader" onComplete={() => setIsLoading(false)} />
          ) : (
            <Router key="router" />
          )}
        </AnimatePresence>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
