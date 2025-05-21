import { useEffect, useState } from "react";
import { ATMLayout } from "@/components/ui/atm-layout";
import { Button } from "@/components/ui/button";
import { useATM } from "@/contexts/atm-context";
import { Timer, LogOut, RefreshCw } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";

export default function TimeoutWarningPage() {
  const { navigateTo } = useATM();
  const [timeLeft, setTimeLeft] = useState(30);
  
  // Countdown timer
  useEffect(() => {
    if (timeLeft <= 0) {
      handleEndSessionNow();
      return;
    }
    
    const timer = setTimeout(() => {
      setTimeLeft(timeLeft - 1);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, [timeLeft]);
  
  const handleEndSessionNow = async () => {
    try {
      await apiRequest('POST', '/api/auth/logout', {});
      navigateTo("/session-ended");
    } catch (error) {
      console.error("Error ending session:", error);
      // Still navigate to session ended even if there's an error
      navigateTo("/session-ended");
    }
  };
  
  const handleContinueSession = async () => {
    try {
      await apiRequest('POST', '/api/session/refresh', {});
      navigateTo("/main-menu");
    } catch (error) {
      console.error("Error refreshing session:", error);
      handleEndSessionNow();
    }
  };
  
  return (
    <ATMLayout>
      <div className="fade-in">
        <div className="text-center mb-6">
          <Timer className="text-error text-4xl mb-2 mx-auto" />
          <h2 className="text-xl font-bold mb-1">Session Timeout Warning</h2>
          <p className="text-gray-500 text-center">
            Your session will end in {timeLeft} seconds due to inactivity
          </p>
        </div>
        
        <div className="mb-8 bg-yellow-50 p-4 rounded-lg text-center">
          <p className="text-gray-600">
            To protect your security, your session will automatically end if no action is taken.
          </p>
        </div>
        
        <div className="flex space-x-3">
          <Button 
            variant="outline"
            className="btn-secondary rounded-lg py-3 px-4 flex-1 flex items-center justify-center"
            onClick={handleEndSessionNow}
          >
            <LogOut className="mr-2" />
            End Session Now
          </Button>
          <Button 
            className="btn-primary rounded-lg py-3 px-4 flex-1 flex items-center justify-center"
            onClick={handleContinueSession}
          >
            <RefreshCw className="mr-2" />
            Continue Session
          </Button>
        </div>
      </div>
    </ATMLayout>
  );
}
