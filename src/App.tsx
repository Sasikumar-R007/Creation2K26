import { useEffect, useRef, useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { LoadingScreen } from "@/components/LoadingScreen";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import ICDashboard from "./pages/ICDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./components/auth/ProtectedRoute";

const queryClient = new QueryClient();

const LOADING_SCREEN_MIN_MS = 500;

/** Shows LoadingScreen overlay when the route changes (client-side navigation). */
const NavigationLoader = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  const [isNavigating, setIsNavigating] = useState(false);
  const prevPathRef = useRef(location.pathname);
  const isFirstMount = useRef(true);

  useEffect(() => {
    if (isFirstMount.current) {
      isFirstMount.current = false;
      prevPathRef.current = location.pathname;
      return;
    }
    if (prevPathRef.current === location.pathname) return;

    prevPathRef.current = location.pathname;
    setIsNavigating(true);
    const t = setTimeout(() => setIsNavigating(false), LOADING_SCREEN_MIN_MS);
    return () => clearTimeout(t);
  }, [location.pathname]);

  return (
    <>
      {children}
      {isNavigating && (
        <div className="fixed inset-0 z-[9999] bg-background">
          <LoadingScreen
            error={null}
            loadingTitle="Loading…"
            loadingSubtitle="Getting real-time information"
          />
        </div>
      )}
    </>
  );
};

const AppContent = () => {
  const { loading } = useAuth();

  if (loading) {
    return (
      <LoadingScreen
        error={null}
        loadingTitle="Loading…"
        loadingSubtitle="Getting real-time information"
      />
    );
  }

  return (
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <NavigationLoader>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute allowedRoles={["participant", "student_incharge", "creation_admin"]}>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/ic-dashboard"
              element={
                <ProtectedRoute allowedRoles={["student_incharge", "creation_admin"]}>
                  <ICDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin"
              element={
                <ProtectedRoute allowedRoles={["creation_admin"]}>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </NavigationLoader>
      </BrowserRouter>
    </TooltipProvider>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
