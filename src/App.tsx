
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import Index from "./pages/Index";
import About from "./pages/About";
import NotFound from "./pages/NotFound";
import Statistics from "./pages/Statistics";
import Overview from "./pages/Overview";
import Matches from "./pages/Matches";
import Rankings from "./pages/Rankings";
import Promotions from "./pages/Promotions";
import Tournaments from "./pages/Tournaments";
import Settings from "./pages/settings/Settings";
import Profile from "./pages/settings/Profile";
import Security from "./pages/settings/Security";
import Privacy from "./pages/settings/Privacy";
import Language from "./pages/settings/Language";

const queryClient = new QueryClient();

// Handle email confirmation and automatic login
const ConfirmEmail = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleEmailConfirmation = async () => {
      const hash = window.location.hash;
      if (hash) {
        try {
          const { error } = await supabase.auth.getSession();
          if (error) throw error;
          navigate('/overview');
        } catch (error) {
          console.error('Error handling email confirmation:', error);
          navigate('/');
        }
      }
    };

    handleEmailConfirmation();
  }, [navigate]);

  return null;
};

const AuthenticatedApp = () => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    // Check initial auth state
    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsAuthenticated(!!session);
    });

    // Subscribe to auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setIsAuthenticated(!!session);
      if (event === 'SIGNED_IN') {
        navigate('/overview');
      }
      if (event === 'SIGNED_OUT') {
        navigate('/');
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  // Protected route component
  const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    const location = useLocation();

    if (isAuthenticated === null) {
      return null; // Loading state
    }

    if (!isAuthenticated) {
      return <Navigate to="/" state={{ from: location }} replace />;
    }

    return <>{children}</>;
  };

  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/about" element={<About />} />
      <Route path="/auth/confirm" element={<ConfirmEmail />} />
      
      {/* Protected routes */}
      <Route path="/statistics" element={
        <ProtectedRoute>
          <Statistics />
        </ProtectedRoute>
      } />
      <Route path="/overview" element={
        <ProtectedRoute>
          <Overview />
        </ProtectedRoute>
      } />
      <Route path="/matches" element={
        <ProtectedRoute>
          <Matches />
        </ProtectedRoute>
      } />
      <Route path="/rankings" element={
        <ProtectedRoute>
          <Rankings />
        </ProtectedRoute>
      } />
      <Route path="/promotions" element={
        <ProtectedRoute>
          <Promotions />
        </ProtectedRoute>
      } />
      <Route path="/tournaments" element={
        <ProtectedRoute>
          <Tournaments />
        </ProtectedRoute>
      } />
      {/* Settings Routes */}
      <Route path="/settings" element={
        <ProtectedRoute>
          <Settings />
        </ProtectedRoute>
      } />
      <Route path="/settings/profile" element={
        <ProtectedRoute>
          <Profile />
        </ProtectedRoute>
      } />
      <Route path="/settings/security" element={
        <ProtectedRoute>
          <Security />
        </ProtectedRoute>
      } />
      <Route path="/settings/privacy" element={
        <ProtectedRoute>
          <Privacy />
        </ProtectedRoute>
      } />
      <Route path="/settings/language" element={
        <ProtectedRoute>
          <Language />
        </ProtectedRoute>
      } />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthenticatedApp />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
