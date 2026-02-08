import { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { AppRole } from "@/types";

interface ProtectedRouteProps {
  children: ReactNode;
  allowedRoles: AppRole[];
}

const ProtectedRoute = ({ children, allowedRoles }: ProtectedRouteProps) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen bg-background dark flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    // Redirect to auth page, but save the intended destination
    return <Navigate to="/admin-login" state={{ from: location }} replace />;
  }

  if (!allowedRoles.includes(user.role)) {
    // User doesn't have the required role, redirect to their appropriate dashboard
    const redirectPath = 
      user.role === "creation_admin" ? "/admin" :
      user.role === "student_incharge" ? "/ic-dashboard" :
      "/dashboard";
    
    return <Navigate to={redirectPath} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
