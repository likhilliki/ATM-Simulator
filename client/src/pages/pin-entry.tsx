import { useState } from "react";
import { ATMLayout } from "@/components/ui/atm-layout";
import { PinPad } from "@/components/ui/pin-pad";
import { useATM } from "@/contexts/atm-context";
import { Lock } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";

export default function PinEntryPage() {
  const { navigateTo, showNotification } = useATM();
  const [pinError, setPinError] = useState<boolean>(false);
  
  const handlePinEnter = async (pin: string) => {
    try {
      const response = await apiRequest('POST', '/api/auth/verify-pin', { pin });
      
      if (response.ok) {
        navigateTo("/main-menu");
      } else {
        setPinError(true);
      }
    } catch (error) {
      console.error("Error verifying PIN:", error);
      setPinError(true);
    }
  };
  
  const handleCancel = () => {
    navigateTo("/");
  };
  
  return (
    <ATMLayout>
      <div className="text-center mb-6 fade-in">
        <Lock className="text-primary text-4xl mb-2 mx-auto" />
        <h2 className="text-xl font-bold">Enter Your PIN</h2>
        <p className="text-gray-500 text-sm mt-1">Please enter your 4-digit PIN code</p>
      </div>
      
      <PinPad 
        onPinEnter={handlePinEnter} 
        onCancel={handleCancel} 
        showError={pinError}
        errorMessage="Incorrect PIN. Please try again."
      />
    </ATMLayout>
  );
}
