import { useQuery } from "@tanstack/react-query";
import { ATMLayout } from "@/components/ui/atm-layout";
import { Button } from "@/components/ui/button";
import { SessionTimer } from "@/components/session-timer";
import { useATM } from "@/contexts/atm-context";
import { 
  CreditCard, 
  Wallet, 
  Receipt, 
  Key, 
  LogOut,
  DollarSign
} from "lucide-react";

export default function MainMenuPage() {
  const { navigateTo } = useATM();
  
  // Get account details for displaying card number
  const { data: accountDetails } = useQuery({
    queryKey: ['/api/accounts/details'],
  });
  
  const handleBalanceInquiry = () => {
    navigateTo("/balance-inquiry");
  };
  
  const handleWithdraw = () => {
    navigateTo("/withdrawal");
  };
  
  const handleTransactionHistory = () => {
    navigateTo("/transaction-history");
  };
  
  const handleChangePIN = () => {
    // This functionality is not implemented in this demo
    // but included in the UI for completeness
  };
  
  const handleExit = () => {
    navigateTo("/exit-confirmation");
  };
  
  const handleTimeout = () => {
    navigateTo("/timeout-warning");
  };
  
  const formattedDate = new Date().toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit'
  });
  
  return (
    <ATMLayout>
      <div className="fade-in">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-xl font-bold">Main Menu</h2>
            <p className="text-gray-500 text-sm">Select a transaction</p>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-500">
              Card: {accountDetails?.cardNumber || '**** **** **** 1234'}
            </div>
            <div className="text-sm text-gray-500">{formattedDate}</div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <Button 
            className="btn-primary text-left p-4 rounded-lg flex items-center"
            onClick={handleBalanceInquiry}
          >
            <Wallet className="mr-3" />
            <div>
              <div className="font-medium">Balance Inquiry</div>
              <div className="text-sm text-blue-100">Check your account balance</div>
            </div>
          </Button>
          
          <Button 
            className="btn-primary text-left p-4 rounded-lg flex items-center"
            onClick={handleWithdraw}
          >
            <DollarSign className="mr-3" />
            <div>
              <div className="font-medium">Cash Withdrawal</div>
              <div className="text-sm text-blue-100">Withdraw cash from your account</div>
            </div>
          </Button>
          
          <Button 
            className="btn-primary text-left p-4 rounded-lg flex items-center"
            onClick={handleTransactionHistory}
          >
            <Receipt className="mr-3" />
            <div>
              <div className="font-medium">Transaction History</div>
              <div className="text-sm text-blue-100">View recent transactions</div>
            </div>
          </Button>
          
          <Button 
            className="btn-primary text-left p-4 rounded-lg flex items-center"
            onClick={handleChangePIN}
          >
            <Key className="mr-3" />
            <div>
              <div className="font-medium">Change PIN</div>
              <div className="text-sm text-blue-100">Update your PIN number</div>
            </div>
          </Button>
        </div>
        
        <div className="mt-8 text-center">
          <Button 
            variant="outline"
            className="btn-secondary rounded-lg py-2 px-6 flex items-center mx-auto"
            onClick={handleExit}
          >
            <LogOut className="mr-2" />
            End Session
          </Button>
        </div>
        
        <SessionTimer onTimeout={handleTimeout} />
      </div>
    </ATMLayout>
  );
}
