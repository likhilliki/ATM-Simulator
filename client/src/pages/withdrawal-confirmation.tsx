import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ATMLayout } from "@/components/ui/atm-layout";
import { Button } from "@/components/ui/button";
import { useATM } from "@/contexts/atm-context";
import { ArrowLeft, CheckCircle, DollarSign } from "lucide-react";

export default function WithdrawalConfirmationPage() {
  const { navigateTo, withdrawalAmount, showNotification } = useATM();
  const queryClient = useQueryClient();
  
  const { data: accountDetails, isLoading } = useQuery({
    queryKey: ['/api/accounts/details'],
  });
  
  const { data: balanceData, isLoading: balanceLoading } = useQuery({
    queryKey: ['/api/accounts/balance'],
  });

  const withdrawalMutation = useMutation({
    mutationFn: async (amount: number) => {
      const response = await fetch('/api/transactions/withdraw', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ amount }),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Withdrawal failed');
      }
      
      return response.json();
    },
    onSuccess: () => {
      // Invalidate and refetch balance data
      queryClient.invalidateQueries({ queryKey: ['/api/accounts/balance'] });
      queryClient.invalidateQueries({ queryKey: ['/api/accounts/details'] });
      navigateTo("/transaction-success");
    },
    onError: (error: Error) => {
      showNotification(error.message, "error");
    },
  });
  
  const handleBack = () => {
    navigateTo("/withdrawal");
  };
  
  const handleProcessWithdrawal = () => {
    if (withdrawalAmount) {
      withdrawalMutation.mutate(withdrawalAmount);
    }
  };
  
  if (isLoading || balanceLoading) {
    return (
      <ATMLayout>
        <div className="flex flex-col items-center justify-center h-80">
          <div className="loader w-16 h-16 border-4 border-blue-200 border-t-4 rounded-full mb-6"></div>
          <h2 className="text-xl font-bold mb-2">Loading Account Details</h2>
          <p className="text-gray-500 text-center">Please wait...</p>
        </div>
      </ATMLayout>
    );
  }
  
  // Calculate new balance
  const currentBalance = Number(balanceData?.balance || accountDetails?.balance) || 0;
  const newBalance = currentBalance - (withdrawalAmount || 0);
  
  return (
    <ATMLayout>
      <div className="text-center mb-6 fade-in">
        <DollarSign className="text-primary text-4xl mb-2 mx-auto" />
        <h2 className="text-xl font-bold mb-1">Confirm Withdrawal</h2>
        <p className="text-gray-500 text-sm">Please confirm the amount to withdraw</p>
      </div>
      
      <div className="bg-blue-50 rounded-lg p-5 mb-6 text-center">
        <div className="text-sm text-gray-500 mb-1">Withdrawal Amount</div>
        <div className="text-3xl font-bold text-primary">${withdrawalAmount?.toFixed(2)}</div>
        <div className="mt-3 text-sm text-gray-600">
          From account ending in <span>{accountDetails?.cardNumber?.slice(-4) || "1234"}</span>
        </div>
      </div>
      
      <div className="border-t border-gray-200 py-4 mb-6">
        <div className="flex justify-between mb-1">
          <div className="text-sm text-gray-500">Current Balance:</div>
          <div className="font-medium">${currentBalance.toFixed(2)}</div>
        </div>
        <div className="flex justify-between mb-1">
          <div className="text-sm text-gray-500">Withdrawal Amount:</div>
          <div className="font-medium text-primary">${withdrawalAmount?.toFixed(2)}</div>
        </div>
        <div className="flex justify-between pt-2 border-t border-dashed border-gray-300 mt-2">
          <div className="text-sm text-gray-500">New Balance:</div>
          <div className="font-medium">${newBalance.toFixed(2)}</div>
        </div>
      </div>
      
      <div className="mt-4">
        <p className="text-sm text-gray-500 mb-4">
          Transaction fee: <span className="font-medium">$0.00</span> (Fee waived for account holders)
        </p>
      </div>
      
      <div className="flex space-x-3">
        <Button 
          variant="outline"
          className="btn-secondary rounded-lg py-2 px-4 flex-1 flex items-center justify-center"
          onClick={handleBack}
        >
          <ArrowLeft className="mr-2" />
          Back
        </Button>
        <Button 
          className="btn-primary rounded-lg py-2 px-4 flex-1 flex items-center justify-center"
          onClick={handleProcessWithdrawal}
          disabled={withdrawalMutation.isPending}
        >
          <CheckCircle className="mr-2" />
          {withdrawalMutation.isPending ? "Processing..." : "Withdraw Cash"}
        </Button>
      </div>
    </ATMLayout>
  );
}
