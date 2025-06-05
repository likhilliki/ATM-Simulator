import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { useATM } from "@/contexts/atm-context";
import { ArrowLeft, CheckCircle, DollarSign } from "lucide-react";

export default function DepositConfirmationPage() {
  const { navigateTo, depositAmount, showNotification } = useATM();
  const queryClient = useQueryClient();

  const { data: accountDetails, isLoading } = useQuery({
    queryKey: ['/api/accounts/details'],
  });

  const { data: balanceData, isLoading: balanceLoading } = useQuery({
    queryKey: ['/api/accounts/balance'],
  });

  const depositMutation = useMutation({
    mutationFn: async (amount: number) => {
      const response = await fetch("/api/transactions/deposit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ amount }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Deposit failed");
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/accounts/balance'] });
      queryClient.invalidateQueries({ queryKey: ['/api/accounts/details'] });
      queryClient.invalidateQueries({ queryKey: ['/api/transactions/history'] });
      navigateTo("deposit-success");
    },
    onError: (error: Error) => {
      console.error("Deposit failed:", error);
      showNotification(`Deposit failed: ${error.message}`, "error");
    }
  });

  const handleBack = () => {
    navigateTo("deposit");
  };

  const handleProcessDeposit = () => {
    if (depositAmount) {
      depositMutation.mutate(depositAmount);
    }
  };

  if (!depositAmount) {
    navigateTo("/deposit");
    return null;
  }

  const currentBalance = Number(balanceData?.balance || accountDetails?.balance) || 0;
  const newBalance = currentBalance + depositAmount;

  return (
    <div className="text-center mb-6 fade-in">
      <DollarSign className="text-primary text-4xl mb-2 mx-auto" />
      <h2 className="text-xl font-bold mb-1">Confirm Deposit</h2>
      <p className="text-gray-500 text-sm">Please confirm the amount to deposit</p>

      <div className="bg-green-50 rounded-lg p-5 mb-6 text-center">
        <div className="text-sm text-gray-500 mb-1">Deposit Amount</div>
        <div className="text-3xl font-bold text-green-600">${depositAmount.toFixed(2)}</div>
        <div className="mt-3 text-sm text-gray-600">
          To account ending in <span>{accountDetails?.cardNumber?.slice(-4) || "1234"}</span>
        </div>
      </div>

      <div className="border-t border-gray-200 py-4 mb-6">
        <div className="flex justify-between mb-1">
          <div className="text-sm text-gray-500">Current Balance:</div>
          <div className="font-medium">${currentBalance.toFixed(2)}</div>
        </div>
        <div className="flex justify-between mb-1">
          <div className="text-sm text-gray-500">Deposit Amount:</div>
          <div className="font-medium text-green-600">${depositAmount.toFixed(2)}</div>
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
          onClick={handleProcessDeposit}
          disabled={depositMutation.isPending}
        >
          <CheckCircle className="mr-2" />
          {depositMutation.isPending ? "Processing..." : "Deposit Cash"}
        </Button>
      </div>
    </div>
  );
}