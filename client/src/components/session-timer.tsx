import { useEffect, useState } from "react";
import { useATM } from "@/contexts/atm-context";
import { apiRequest } from "@/lib/queryClient";

interface SessionTimerProps {
  onTimeout?: () => void;
}

// Custom hook for setting interval
function useInterval(callback: () => void, delay: number | null) {
  useEffect(() => {
    if (delay !== null) {
      const id = setInterval(callback, delay);
      return () => clearInterval(id);
    }
    return undefined;
  }, [callback, delay]);
}

export function SessionTimer({ onTimeout }: SessionTimerProps) {
  const { showWarning, navigateTo } = useATM();
  const [seconds, setSeconds] = useState<number>(120); // 2 minutes default
  const [isActive, setIsActive] = useState<boolean>(true);

  // Fetch initial session status
  useEffect(() => {
    const fetchSessionStatus = async () => {
      try {
        const res = await fetch('/api/session/status');
        const data = await res.json();
        
        if (data.authenticated) {
          setSeconds(data.timeRemaining);
          setIsActive(true);
        } else {
          setIsActive(false);
        }
      } catch (error) {
        console.error("Failed to fetch session status:", error);
      }
    };
    
    fetchSessionStatus();
  }, []);

  // Refresh session periodically to prevent timeout
  useEffect(() => {
    const refreshSession = async () => {
      try {
        await apiRequest('POST', '/api/session/refresh', {});
        // Reset timer
        setSeconds(120);
      } catch (error) {
        console.error("Failed to refresh session:", error);
      }
    };
    
    // Call once when component mounts
    refreshSession();
    
    // Setup interval for refreshing (every 60 seconds)
    const interval = setInterval(refreshSession, 60000);
    return () => clearInterval(interval);
  }, []);

  // Countdown timer
  useInterval(() => {
    if (isActive && seconds > 0) {
      setSeconds(seconds - 1);
      
      // Show warning at 30 seconds
      if (seconds === 30) {
        showWarning();
        
        if (onTimeout) {
          onTimeout();
        }
      }
      
      // End session at 0 seconds
      if (seconds === 1) {
        navigateTo('/session-ended');
      }
    }
  }, isActive ? 1000 : null);

  // Format seconds to MM:SS
  const formatTime = () => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="mt-6 bg-blue-50 p-3 rounded-lg text-center text-sm">
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary text-sm align-middle inline-block mr-1"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
      <span className="text-gray-600">
        Session will timeout in <span id="timeout-counter">{formatTime()}</span>
      </span>
    </div>
  );
}
