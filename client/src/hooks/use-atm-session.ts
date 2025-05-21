import { useEffect, useState } from "react";
import { apiRequest } from "@/lib/queryClient";
import { useATM } from "@/contexts/atm-context";

interface UseATMSessionOptions {
  redirectToLogin?: boolean;
  onSessionExpired?: () => void;
}

export function useATMSession(options: UseATMSessionOptions = {}) {
  const { redirectToLogin = true, onSessionExpired } = options;
  const { navigateTo } = useATM();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [timeRemaining, setTimeRemaining] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);

  // Check session status on mount
  useEffect(() => {
    const checkSession = async () => {
      try {
        const response = await fetch('/api/session/status');
        const data = await response.json();
        
        setIsAuthenticated(data.authenticated);
        setTimeRemaining(data.timeRemaining);
        
        // Redirect to login page if not authenticated
        if (!data.authenticated && redirectToLogin) {
          navigateTo('/');
        }
        
        setIsLoading(false);
      } catch (error) {
        console.error("Failed to check session status:", error);
        setIsLoading(false);
        setIsAuthenticated(false);
        
        if (redirectToLogin) {
          navigateTo('/');
        }
      }
    };
    
    checkSession();
  }, [navigateTo, redirectToLogin]);

  // Refresh session
  const refreshSession = async () => {
    try {
      await apiRequest('POST', '/api/session/refresh', {});
      setTimeRemaining(120); // Reset to 2 minutes
      return true;
    } catch (error) {
      console.error("Failed to refresh session:", error);
      return false;
    }
  };

  // End session
  const endSession = async () => {
    try {
      await apiRequest('POST', '/api/auth/logout', {});
      setIsAuthenticated(false);
      
      if (onSessionExpired) {
        onSessionExpired();
      } else if (redirectToLogin) {
        navigateTo('/session-ended');
      }
      
      return true;
    } catch (error) {
      console.error("Failed to end session:", error);
      return false;
    }
  };

  return {
    isAuthenticated,
    timeRemaining,
    isLoading,
    refreshSession,
    endSession
  };
}
