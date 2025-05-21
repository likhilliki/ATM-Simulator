import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { ATMLayout } from "@/components/ui/atm-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useATM } from "@/contexts/atm-context";
import { ArrowLeft, CheckCircle, X, DollarSign } from "lucide-react";

export default function WithdrawalPage() {
  const { navigateTo, setWithdrawalAmount, showNotification } = useATM();
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [customAmount, setCustomAmount] = useState<string>("");
  
  const { data: accountDetails, isLoading } = useQuery({
    queryKey: ['/api/accounts/details'],
  });
  
  const handleBack = () => {
    navigateTo("/main-menu");
  };
  
  const handleConfirm = () => {
    let amount: number | null = null;
    
    if (showCustomInput) {
      const parsed = parseInt(customAmount, 10);
      if (!parsed || isNaN(parsed) || parsed < 20 || parsed > 1000 || parsed % 20 !== 0) {
        showNotification("Please enter a valid amount (multiple of $20, maximum $1000)", "error");
        return;
      }
      amount = parsed;
    } else if (selectedAmount) {
      amount = selectedAmount;
    } else {
      showNotification("Please select an amount", "error");
      return;
    }
    
    // Check if sufficient funds
    if (accountDetails && amount > Number(accountDetails.balance)) {
      showNotification("Insufficient funds for this withdrawal", "error");
      return;
    }
    
    // Check withdrawal limit
    if (accountDetails && amount > Number(accountDetails.withdrawalLimit)) {
      showNotification("Amount exceeds your daily withdrawal limit", "error");
      return;
    }
    
    setWithdrawalAmount(amount);
    navigateTo("/withdrawal-confirmation");
  };
  
  const handleCancel = () => {
    navigateTo("/main-menu");
  };
  
  const handleAmountSelect = (amount: number) => {
    setSelectedAmount(amount);
    setShowCustomInput(false);
  };
  
  const handleCustomAmountClick = () => {
    setSelectedAmount(null);
    setShowCustomInput(true);
  };
  
  return (
    <ATMLayout>
      <div className="fade-in">
        <div className="flex items-center mb-6">
          <Button variant="ghost" className="mr-3 p-2" onClick={handleBack}>
            <ArrowLeft className="text-primary" />
          </Button>
          <h2 className="text-xl font-bold">Cash Withdrawal</h2>
        </div>
        
        <div className="text-sm text-gray-600 mb-4">
          Please select an amount to withdraw or enter a custom amount
        </div>
        
        <div className="grid grid-cols-2 gap-3 mb-6">
          {[20, 50, 100, 200, 500].map((amount) => (
            <Button
              key={amount}
              variant={selectedAmount === amount ? "default" : "outline"}
              className={`
                font-medium py-3 rounded-lg
                ${selectedAmount === amount ? 'bg-primary text-white' : 'bg-white border border-primary text-primary hover:bg-blue-50'}
              `}
              onClick={() => handleAmountSelect(amount)}
            >
              ${amount}
            </Button>
          ))}
          
          <Button
            variant={showCustomInput ? "default" : "outline"}
            className={`
              font-medium py-3 rounded-lg
              ${showCustomInput ? 'bg-primary text-white' : 'bg-white border border-primary text-primary hover:bg-blue-50'}
            `}
            onClick={handleCustomAmountClick}
          >
            Custom Amount
          </Button>
        </div>
        
        {showCustomInput && (
          <div className="mb-6">
            <label className="block text-sm text-gray-600 mb-2">Enter Amount ($):</label>
            <div className="flex items-center">
              <DollarSign className="text-gray-400 mr-2" />
              <Input
                type="number"
                value={customAmount}
                onChange={(e) => setCustomAmount(e.target.value)}
                placeholder="Enter amount"
                min="20"
                max="1000"
                step="20"
                className="border border-gray-300 rounded-lg py-2 px-3 w-full focus:border-primary focus:ring-1 focus:ring-primary outline-none"
              />
            </div>
            <div className="text-xs text-gray-500 mt-1">
              Amount must be in multiples of $20, maximum $1000
            </div>
          </div>
        )}
        
        <div className="bg-blue-50 rounded-lg p-3 mb-6">
          <div className="flex justify-between items-center">
            <div className="text-sm">Available Balance:</div>
            <div className="font-medium">
              ${isLoading ? "..." : Number(accountDetails?.balance).toFixed(2)}
            </div>
          </div>
          <div className="flex justify-between items-center mt-1">
            <div className="text-sm">Daily Withdrawal Limit:</div>
            <div className="font-medium">
              ${isLoading ? "..." : Number(accountDetails?.withdrawalLimit).toFixed(2)}
            </div>
          </div>
        </div>
        
        <div className="flex space-x-3">
          <Button 
            variant="outline"
            className="btn-secondary rounded-lg py-2 px-4 flex-1 flex items-center justify-center"
            onClick={handleCancel}
          >
            <X className="mr-2" />
            Cancel
          </Button>
          <Button 
            className="btn-primary rounded-lg py-2 px-4 flex-1 flex items-center justify-center"
            onClick={handleConfirm}
          >
            <CheckCircle className="mr-2" />
            Confirm
          </Button>
        </div>
      </div>
    </ATMLayout>
  );
}
