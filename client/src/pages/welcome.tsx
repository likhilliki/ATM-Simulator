import { useEffect } from "react";
import { Card } from "@/components/ui/card";
import { CardReader } from "@/components/ui/card-reader";
import { ATMLayout } from "@/components/ui/atm-layout";
import { useATM } from "@/contexts/atm-context";
import { apiRequest } from "@/lib/queryClient";

export default function WelcomePage() {
  const { navigateTo, setCardNumber } = useATM();
  
  // Reset any existing session when landing on welcome page
  useEffect(() => {
    const endPreviousSession = async () => {
      try {
        await apiRequest('POST', '/api/auth/logout', {});
      } catch (error) {
        console.error("Error ending previous session:", error);
      }
    };
    
    endPreviousSession();
  }, []);
  
  const handleCardInsert = async () => {
    try {
      // In a real ATM, this would read the card
      // Here we're simulating with a hard-coded card number
      const cardNumber = "4111111111111234";
      
      const response = await apiRequest('POST', '/api/auth/verify-card', { cardNumber });
      
      if (response.ok) {
        setCardNumber(cardNumber);
        navigateTo("/pin-entry");
      }
    } catch (error) {
      console.error("Error inserting card:", error);
    }
  };
  
  return (
    <ATMLayout>
      <div className="fade-in">
        <CardReader onCardInsert={handleCardInsert} />
        
        <div className="mt-8 p-4 bg-blue-50 rounded-lg">
          <h3 className="font-medium mb-2 text-primary">Demo Information</h3>
          <p className="text-sm text-gray-600">
            This is a demonstration of an ATM interface. You can simulate inserting a card, 
            enter a PIN, check balance, withdraw cash, and view transaction history.
          </p>
        </div>
      </div>
    </ATMLayout>
  );
}
