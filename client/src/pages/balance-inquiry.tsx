import { useQuery } from "@tanstack/react-query";
import { ATMLayout } from "@/components/ui/atm-layout";
import { Button } from "@/components/ui/button";
import { useATM } from "@/contexts/atm-context";
import { ArrowLeft, Printer, CheckCircle } from "lucide-react";

export default function BalanceInquiryPage() {
  const { navigateTo, showNotification } = useATM();
  
  const { data: accountDetails, isLoading } = useQuery({
    queryKey: ['/api/accounts/details'],
  });
  
  const { data: balanceData, isLoading: balanceLoading } = useQuery({
    queryKey: ['/api/accounts/balance'],
  });
  
  const handleBack = () => {
    navigateTo("/main-menu");
  };
  
  const handleDone = () => {
    navigateTo("/main-menu");
  };
  
  const handlePrintReceipt = () => {
    showNotification("Receipt printed successfully", "success");
  };
  
  const formattedBalance = (isLoading || balanceLoading) 
    ? "Loading..." 
    : `$${Number(balanceData?.balance || accountDetails?.balance).toFixed(2)}`;
  
  const formattedDateTime = new Date().toLocaleString('en-US', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit'
  });
  
  return (
    <ATMLayout>
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
            {formattedBalance}
          </div>
          <div className="text-sm text-gray-500 mt-3 mb-1">Account Number</div>
          <div className="font-medium">
            {accountDetails?.cardNumber || "**** **** **** 1234"}
          </div>
          <div className="mt-2 text-xs text-gray-500">
            Last updated: <span>{formattedDateTime}</span>
          </div>
        </div>
        
        <div className="border-t border-b border-gray-200 py-4 mb-6">
          <div className="flex justify-between mb-2">
            <div className="text-sm text-gray-500">Available Credit</div>
            <div className="font-medium">
              ${(isLoading || balanceLoading) ? "..." : Number(balanceData?.availableCredit || accountDetails?.availableCredit).toFixed(2)}
            </div>
          </div>
          <div className="flex justify-between">
            <div className="text-sm text-gray-500">Daily Withdrawal Limit</div>
            <div className="font-medium">
              ${(isLoading || balanceLoading) ? "..." : Number(balanceData?.withdrawalLimit || accountDetails?.withdrawalLimit).toFixed(2)}
            </div>
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
            onClick={handleDone}
          >
            <CheckCircle className="mr-2" />
            Done
          </Button>
        </div>
      </div>
    </ATMLayout>
  );
}
