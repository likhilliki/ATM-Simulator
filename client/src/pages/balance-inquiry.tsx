import { useQuery } from "@tanstack/react-query";
import { ATMLayout } from "@/components/ui/atm-layout";
import { Button } from "@/components/ui/button";
import { useATM } from "@/contexts/atm-context";
import { ArrowLeft, Home, Printer } from "lucide-react";

export default function BalanceInquiryPage() {
  const { navigateTo } = useATM();

  const { data: accountDetails, isLoading } = useQuery({
    queryKey: ['/api/accounts/details'],
  });

  const { data: balanceData, isLoading: balanceLoading } = useQuery({
    queryKey: ['/api/accounts/balance'],
  });

  const handleBack = () => {
    navigateTo("main-menu");
  };

  const handlePrintReceipt = () => {
    alert("Receipt printed successfully!");
  };

  const balance = Number(balanceData?.balance || accountDetails?.balance) || 2547.63;
  const availableCredit = Number(balanceData?.availableCredit || accountDetails?.availableCredit) || 5000;
  const withdrawalLimit = Number(balanceData?.withdrawalLimit || accountDetails?.withdrawalLimit) || 1000;

  return (
    <div className="fade-in">
      <div className="flex items-center mb-6">
        <Button variant="ghost" className="mr-3 p-2" onClick={handleBack}>
          <ArrowLeft className="text-primary" />
        </Button>
        <h2 className="text-xl font-bold">Balance Inquiry</h2>
      </div>

      <div className="bg-blue-50 rounded-lg p-5 mb-6">
        <div className="text-sm text-gray-500 mb-1">Available Balance</div>
        <div className="text-3xl font-bold text-primary">
          ${isLoading || balanceLoading ? "..." : balance.toFixed(2)}
        </div>
        <div className="mt-3 text-sm text-gray-600">
          From account ending in <span>{accountDetails?.cardNumber?.slice(-4) || "1234"}</span>
        </div>
      </div>

      <div className="border-t border-gray-200 py-4 mb-6">
        <div className="flex justify-between mb-2">
          <div className="text-sm text-gray-500">Account Type:</div>
          <div className="font-medium">Checking</div>
        </div>
        <div className="flex justify-between mb-2">
          <div className="text-sm text-gray-500">Available Credit:</div>
          <div className="font-medium">${availableCredit.toFixed(2)}</div>
        </div>
        <div className="flex justify-between">
          <div className="text-sm text-gray-500">Daily Withdrawal Limit:</div>
          <div className="font-medium">${withdrawalLimit.toFixed(2)}</div>
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
          onClick={handleBack}
        >
          <Home className="mr-2" />
          Done
        </Button>
      </div>
    </div>
  );
}