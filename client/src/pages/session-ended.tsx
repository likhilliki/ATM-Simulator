import { ATMLayout } from "@/components/ui/atm-layout";
import { Button } from "@/components/ui/button";
import { useATM } from "@/contexts/atm-context";
import { CheckCircle, RotateCcw } from "lucide-react";

export default function SessionEndedPage() {
  const { navigateTo } = useATM();
  
  const handleStartNewSession = () => {
    navigateTo("/");
  };
  
  return (
    <ATMLayout>
      <div className="text-center py-10 fade-in">
        <CheckCircle className="text-primary text-5xl mb-4 mx-auto" />
        <h2 className="text-2xl font-bold mb-2">Session Ended</h2>
        <p className="text-gray-500 mb-8">Thank you for using SecureBank ATM</p>
        
        <div className="bg-blue-50 p-4 rounded-lg text-center mb-8">
          <p className="text-gray-600">
            Don't forget to take your card, cash, and receipt.
          </p>
        </div>
        
        <Button 
          className="btn-primary rounded-lg py-3 px-6 font-medium flex items-center mx-auto"
          onClick={handleStartNewSession}
        >
          <RotateCcw className="mr-2" />
          Start New Session
        </Button>
      </div>
    </ATMLayout>
  );
}
