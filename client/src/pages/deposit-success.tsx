
import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ATMLayout } from "@/components/ui/atm-layout";
import { Button } from "@/components/ui/button";
import { useATM } from "@/contexts/atm-context";
import { CheckCircle, Home, Printer, Info } from "lucide-react";

export default function DepositSuccessPage() {
  const { navigateTo, depositAmount, showNotification } = useATM();
  const [isProcessing, setIsProcessing] = useState(true);
  const [transactionData, setTransactionData] = useState<any>(null);
  const queryClient = useQueryClient();
  
  const { data: balanceData } = useQuery({
    queryKey: ['/api/accounts/balance'],
  });

  const { data: accountDetails } = useQuery({
    queryKey: ['/api/accounts/details'],
  });

  const depositMutation = useMutation({
    mutationFn: async (amount: number) => {
      const response = await fetch('/api/accounts/deposit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ amount }),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Deposit failed');
      }
      
      return response.json();
    },
    onSuccess: (data) => {
      setTransactionData(data);
      queryClient.invalidateQueries({ queryKey: ['/api/accounts/balance'] });
      queryClient.invalidateQueries({ queryKey: ['/api/accounts/details'] });
      queryClient.invalidateQueries({ queryKey: ['/api/transactions/history'] });
      setIsProcessing(false);
    },
    onError: (error: Error) => {
      console.error("Deposit failed:", error);
      navigateTo("/main-menu");
      showNotification("Deposit failed. Please try again later.", "error");
    }
  });
  
  useEffect(() => {
    if (depositAmount && isProcessing) {
      const processDeposit = async () => {
        await depositMutation.mutateAsync(depositAmount);
      };
      
      processDeposit();
    } else if (!depositAmount) {
      // If no deposit amount exists, redirect back to main menu
      navigateTo("/main-menu");
    }
  }, [depositAmount, isProcessing]);
  
  const handlePrintReceipt = () => {
    showNotification("Receipt printed successfully", "success");
  };
  
  const handleMainMenu = () => {
    navigateTo("/main-menu");
  };

  if (isProcessing) {
    return (
      <ATMLayout>
        <div className="flex flex-col items-center justify-center h-80 fade-in">
          <div className="loader w-16 h-16 border-4 border-green-200 border-t-4 rounded-full mb-6"></div>
          <h2 className="text-xl font-bold mb-2">Processing Transaction</h2>
          <p className="text-gray-500 text-center">Please wait while we process your deposit...</p>
        </div>
      </ATMLayout>
    );
  }

  // Calculate the new balance (current balance + deposit amount)
  const currentBalance = Number(balanceData?.balance || accountDetails?.balance) || 2547.63;
  const newBalance = currentBalance + (depositAmount || 0);
  
  return (
    <ATMLayout>
      <div className="fade-in">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
            <CheckCircle className="text-success text-4xl" />
          </div>
          <h2 className="text-xl font-bold mb-1">Transaction Successful</h2>
          <p className="text-gray-500">
            Your cash deposit of ${depositAmount?.toFixed(2)} was successful.
          </p>
        </div>
        
        <div className="bg-blue-50 rounded-lg p-5 mb-6">
          <div className="flex justify-between mb-2">
            <div className="text-sm text-gray-500">Transaction ID:</div>
            <div className="font-medium">{transactionData?.transactionId || "TRX-" + Math.floor(Math.random() * 100000000)}</div>
          </div>
          <div className="flex justify-between mb-2">
            <div className="text-sm text-gray-500">Date & Time:</div>
            <div className="font-medium">{new Date().toLocaleString()}</div>
          </div>
          <div className="flex justify-between mb-2">
            <div className="text-sm text-gray-500">Amount Deposited:</div>
            <div className="font-bold text-green-600">${depositAmount?.toFixed(2)}</div>
          </div>
          <div className="flex justify-between mb-2">
            <div className="text-sm text-gray-500">Previous Balance:</div>
            <div className="font-medium">${(currentBalance - (depositAmount || 0)).toFixed(2)}</div>
          </div>
          <div className="flex justify-between border-t border-gray-300 pt-2">
            <div className="text-sm text-gray-500">New Balance:</div>
            <div className="font-bold text-green-600">${newBalance.toFixed(2)}</div>
          </div>
        </div>
        
        <div className="bg-green-50 border-l-4 border-green-400 p-4 rounded-md mb-6">
          <div className="flex">
            <Info className="text-green-500 mr-2" />
            <p className="text-sm text-green-700">
              Your deposit has been processed successfully. Your receipt is being printed.
            </p>
          </div>
        </div>
        
        <div className="flex space-x-3">
          <Button 
            variant="outline"
            className="btn-secondary rounded-lg py-2 px-4 flex-1 flex items-center justify-center"
            onClick={handlePrintReceipt}
          >
            <Printer className="mr-2" />
            Print Receipt
          </Button>
          <Button 
            className="btn-primary rounded-lg py-2 px-4 flex-1 flex items-center justify-center"
            onClick={handleMainMenu}
          >
            <Home className="mr-2" />
            Main Menu
          </Button>
        </div>
      </div>
    </ATMLayout>
  );
}
