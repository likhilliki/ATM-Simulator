import { ATMLayout } from "@/components/ui/atm-layout";
import { Button } from "@/components/ui/button";
import { useATM } from "@/contexts/atm-context";
import { HelpCircle, ArrowLeft, LogOut } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";

export default function ExitConfirmationPage() {
  const { navigateTo } = useATM();
  
  const handleGoBack = () => {
    navigateTo("/main-menu");
  };
  
  const handleEndSession = async () => {
    try {
      await apiRequest('POST', '/api/auth/logout', {});
      navigateTo("/session-ended");
    } catch (error) {
      console.error("Error ending session:", error);
      // Still navigate to session ended even if there's an error
      navigateTo("/session-ended");
    }
  };
  
  return (
    <ATMLayout>
      <div className="fade-in">
        <div className="text-center mb-6">
          <HelpCircle className="text-primary text-4xl mb-2 mx-auto" />
          <h2 className="text-xl font-bold mb-1">End Your Session?</h2>
          <p className="text-gray-500 text-center">
            Are you sure you want to end your session and exit?
          </p>
        </div>
        
        <div className="mb-6 bg-blue-50 p-4 rounded-lg text-center">
          <p className="text-gray-600">
            Make sure you have completed all your transactions and collected any cash or receipts.
          </p>
        </div>
        
        <div className="flex space-x-3">
          <Button 
            variant="outline"
            className="btn-secondary rounded-lg py-3 px-4 flex-1 flex items-center justify-center"
            onClick={handleGoBack}
          >
            <ArrowLeft className="mr-2" />
            Go Back
          </Button>
          <Button 
            className="btn-primary rounded-lg py-3 px-4 flex-1 flex items-center justify-center"
            onClick={handleEndSession}
          >
            <LogOut className="mr-2" />
            Yes, End Session
          </Button>
        </div>
      </div>
    </ATMLayout>
  );
}
