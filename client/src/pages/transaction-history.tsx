import { useQuery } from "@tanstack/react-query";
import { ATMLayout } from "@/components/ui/atm-layout";
import { Button } from "@/components/ui/button";
import { TransactionItem } from "@/components/ui/transaction-item";
import { useATM } from "@/contexts/atm-context";
import { ArrowLeft, Printer, Home } from "lucide-react";

export default function TransactionHistoryPage() {
  const { navigateTo, showNotification } = useATM();
  
  const { 
    data: historyData, 
    isLoading 
  } = useQuery({
    queryKey: ['/api/transactions/history'],
  });
  
  const handleBack = () => {
    navigateTo("/main-menu");
  };
  
  const handleDone = () => {
    navigateTo("/main-menu");
  };
  
  const handlePrintHistory = () => {
    showNotification("Transaction history printed successfully", "success");
  };
  
  return (
    <ATMLayout>
      <div className="fade-in">
        <div className="flex items-center mb-6">
          <Button variant="ghost" className="mr-3 p-2" onClick={handleBack}>
            <ArrowLeft className="text-primary" />
          </Button>
          <h2 className="text-xl font-bold">Transaction History</h2>
        </div>
        
        <div className="bg-blue-50 rounded-lg p-4 mb-6">
          <div className="text-sm text-gray-500">Account Number</div>
          <div className="font-medium mb-2">
            {historyData?.accountDetails?.cardNumber || "**** **** **** 1234"}
          </div>
          <div className="flex justify-between">
            <div>
              <div className="text-sm text-gray-500">Current Balance</div>
              <div className="font-medium">
                ${isLoading ? "..." : Number(historyData?.accountDetails?.balance).toFixed(2)}
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-500">Available Credit</div>
              <div className="font-medium">
                ${isLoading ? "..." : Number(historyData?.accountDetails?.availableCredit).toFixed(2)}
              </div>
            </div>
          </div>
        </div>
        
        <div className="mb-4">
          <h3 className="text-lg font-medium mb-2">Recent Transactions</h3>
          
          {isLoading ? (
            <div className="space-y-2">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="h-16 bg-gray-100 rounded-lg animate-pulse"></div>
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              {historyData?.transactions?.map((transaction: any) => (
                <TransactionItem key={transaction.id} transaction={transaction} />
              ))}
              
              {historyData?.transactions?.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  No transactions found.
                </div>
              )}
            </div>
          )}
        </div>
        
        <div className="flex space-x-3">
          <Button 
            variant="outline"
            className="btn-secondary rounded-lg py-2 px-4 flex-1 flex items-center justify-center"
            onClick={handlePrintHistory}
          >
            <Printer className="mr-2" />
            Print History
          </Button>
          <Button 
            className="btn-primary rounded-lg py-2 px-4 flex-1 flex items-center justify-center"
            onClick={handleDone}
          >
            <Home className="mr-2" />
            Main Menu
          </Button>
        </div>
      </div>
    </ATMLayout>
  );
}
