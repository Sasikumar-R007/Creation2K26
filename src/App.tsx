import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
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
