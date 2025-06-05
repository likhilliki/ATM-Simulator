import { useState } from "react";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import BalanceInquiryPage from "./pages/balance-inquiry";
import WithdrawalPage from "./pages/withdrawal";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ATMLayout } from "@/components/ui/atm-layout";
import { CardReader } from "@/components/ui/card-reader";
import { PinPad } from "@/components/ui/pin-pad";
import { Button } from "@/components/ui/button";
import { 
  CreditCard, 
  Wallet, 
  Receipt, 
  Key, 
  LogOut,
  DollarSign,
  ArrowLeft,
  CheckCircle,
  Home,
  Printer,
  Timer,
  RefreshCw,
  Info,
  X
} from "lucide-react";

function App() {
  const [currentScreen, setCurrentScreen] = useState<string>("welcome");
  const [pin, setPin] = useState<string>("");
  const [pinError, setPinError] = useState<boolean>(false);
  const [withdrawalAmount, setWithdrawalAmount] = useState<number | null>(null);
  
  const navigateTo = (screenName: string) => {
    setCurrentScreen(screenName);
  };

  const handleCardInsert = () => {
    navigateTo("pin-entry");
  };
  
  const handlePinEnter = (enteredPin: string) => {
    // For demo, we'll just check if PIN is 1234
    if (enteredPin === "1234") {
      navigateTo("main-menu");
    } else {
      setPinError(true);
    }
  };
  
  const handleWithdrawalAmountSelect = (amount: number) => {
    setWithdrawalAmount(amount);
    navigateTo("withdrawal-confirmation");
  };
  
  const renderScreen = () => {
    switch (currentScreen) {
      case "welcome":
        return (
          <div className="fade-in">
            <CardReader onCardInsert={handleCardInsert} />
            
            <div className="mt-8 p-4 bg-blue-50 rounded-lg">
              <h3 className="font-medium mb-2 text-primary">Demo Information</h3>
              <p className="text-sm text-gray-600">
                This is a demonstration of an ATM interface. You can simulate inserting a card, 
                enter a PIN (use 1234), check balance, withdraw cash, and view transaction history.
              </p>
            </div>
          </div>
        );
        
      case "pin-entry":
        return (
          <div className="fade-in">
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-primary/10 rounded-full mb-2">
                <Key className="text-primary" size={24} />
              </div>
              <h2 className="text-xl font-bold">Enter Your PIN</h2>
              <p className="text-gray-500 text-sm mt-1">Please enter your 4-digit PIN code</p>
            </div>
            
            <PinPad 
              onPinEnter={handlePinEnter} 
              onCancel={() => navigateTo("welcome")} 
              showError={pinError}
              errorMessage="Incorrect PIN. Please try again."
            />
          </div>
        );
        
      case "main-menu":
        return (
          <div className="fade-in">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-xl font-bold">Main Menu</h2>
                <p className="text-gray-500 text-sm">Select a transaction</p>
              </div>
              <div className="text-right">
                <div className="text-sm text-gray-500">
                  Card: **** **** **** 1234
                </div>
                <div className="text-sm text-gray-500">{new Date().toLocaleDateString()}</div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <Button 
                className="btn-primary text-left p-4 rounded-lg flex items-center"
                onClick={() => navigateTo("balance-inquiry")}
              >
                <Wallet className="mr-3" />
                <div>
                  <div className="font-medium">Balance Inquiry</div>
                  <div className="text-sm text-blue-100">Check your account balance</div>
                </div>
              </Button>
              
              <Button 
                className="btn-primary text-left p-4 rounded-lg flex items-center"
                onClick={() => navigateTo("withdrawal")}
              >
                <DollarSign className="mr-3" />
                <div>
                  <div className="font-medium">Cash Withdrawal</div>
                  <div className="text-sm text-blue-100">Withdraw cash from your account</div>
                </div>
              </Button>
              
              <Button 
                className="btn-primary text-left p-4 rounded-lg flex items-center"
                onClick={() => navigateTo("transaction-history")}
              >
                <Receipt className="mr-3" />
                <div>
                  <div className="font-medium">Transaction History</div>
                  <div className="text-sm text-blue-100">View recent transactions</div>
                </div>
              </Button>
              
              <Button 
                className="btn-primary text-left p-4 rounded-lg flex items-center"
                onClick={() => navigateTo("change-pin")}
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
                onClick={() => navigateTo("exit-confirmation")}
              >
                <LogOut className="mr-2" />
                End Session
              </Button>
            </div>
            
            <div className="mt-6 bg-blue-50 p-3 rounded-lg text-center text-sm">
              <Timer className="text-primary text-sm align-middle inline-block mr-1" size={16} />
              <span className="text-gray-600">
                Session will timeout in <span id="timeout-counter">01:45</span>
              </span>
            </div>
          </div>
        );
        
      case "balance-inquiry":
        return <BalanceInquiryPage />;
        
      case "withdrawal":
        return <WithdrawalPage />;
        
      case "withdrawal-confirmation":
        return (
          <div className="fade-in">
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-primary/10 rounded-full mb-2">
                <DollarSign className="text-primary" size={24} />
              </div>
              <h2 className="text-xl font-bold mb-1">Confirm Withdrawal</h2>
              <p className="text-gray-500 text-sm">Please confirm the amount to withdraw</p>
            </div>
            
            <div className="bg-blue-50 rounded-lg p-5 mb-6 text-center">
              <div className="text-sm text-gray-500 mb-1">Withdrawal Amount</div>
              <div className="text-3xl font-bold text-primary">${withdrawalAmount?.toFixed(2)}</div>
              <div className="mt-3 text-sm text-gray-600">
                From account ending in <span>1234</span>
              </div>
            </div>
            
            <div className="border-t border-gray-200 py-4 mb-6">
              <div className="flex justify-between mb-1">
                <div className="text-sm text-gray-500">Current Balance:</div>
                <div className="font-medium">$2,547.63</div>
              </div>
              <div className="flex justify-between mb-1">
                <div className="text-sm text-gray-500">Withdrawal Amount:</div>
                <div className="font-medium text-primary">${withdrawalAmount?.toFixed(2)}</div>
              </div>
              <div className="flex justify-between pt-2 border-t border-dashed border-gray-300 mt-2">
                <div className="text-sm text-gray-500">New Balance:</div>
                <div className="font-medium">${(2547.63 - (withdrawalAmount || 0)).toFixed(2)}</div>
              </div>
            </div>
            
            <div className="flex space-x-3">
              <Button 
                variant="outline"
                className="btn-secondary rounded-lg py-2 px-4 flex-1 flex items-center justify-center"
                onClick={() => navigateTo("withdrawal")}
              >
                <ArrowLeft className="mr-2" />
                Back
              </Button>
              <Button 
                className="btn-primary rounded-lg py-2 px-4 flex-1 flex items-center justify-center"
                onClick={() => navigateTo("transaction-success")}
              >
                <CheckCircle className="mr-2" />
                Withdraw Cash
              </Button>
            </div>
          </div>
        );
        
      case "transaction-success":
        return (
          <div className="fade-in">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                <CheckCircle className="text-success text-4xl" />
              </div>
              <h2 className="text-xl font-bold mb-1">Transaction Successful</h2>
              <p className="text-gray-500">
                Your cash withdrawal of ${withdrawalAmount?.toFixed(2)} was successful.
              </p>
            </div>
            
            <div className="bg-blue-50 rounded-lg p-5 mb-6">
              <div className="flex justify-between mb-2">
                <div className="text-sm text-gray-500">Transaction ID:</div>
                <div className="font-medium">TRX-75841269</div>
              </div>
              <div className="flex justify-between mb-2">
                <div className="text-sm text-gray-500">Date & Time:</div>
                <div className="font-medium">{new Date().toLocaleString()}</div>
              </div>
              <div className="flex justify-between mb-2">
                <div className="text-sm text-gray-500">Amount:</div>
                <div className="font-bold text-primary">${withdrawalAmount?.toFixed(2)}</div>
              </div>
              <div className="flex justify-between">
                <div className="text-sm text-gray-500">New Balance:</div>
                <div className="font-medium">${(2547.63 - (withdrawalAmount || 0)).toFixed(2)}</div>
              </div>
            </div>
            
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-md mb-6">
              <div className="flex">
                <Info className="text-yellow-500 mr-2" />
                <p className="text-sm text-yellow-700">
                  Your cash is being dispensed. Please collect your cash and receipt.
                </p>
              </div>
            </div>
            
            <div className="flex space-x-3">
              <Button 
                variant="outline"
                className="btn-secondary rounded-lg py-2 px-4 flex-1 flex items-center justify-center"
              >
                <Printer className="mr-2" />
                Print Receipt
              </Button>
              <Button 
                className="btn-primary rounded-lg py-2 px-4 flex-1 flex items-center justify-center"
                onClick={() => navigateTo("main-menu")}
              >
                <Home className="mr-2" />
                Main Menu
              </Button>
            </div>
          </div>
        );
        
      case "transaction-history":
        return (
          <div className="fade-in">
            <div className="flex items-center mb-6">
              <Button variant="ghost" className="mr-3 p-2" onClick={() => navigateTo("main-menu")}>
                <ArrowLeft className="text-primary" />
              </Button>
              <h2 className="text-xl font-bold">Transaction History</h2>
            </div>
            
            <div className="bg-blue-50 rounded-lg p-4 mb-6">
              <div className="text-sm text-gray-500">Account Number</div>
              <div className="font-medium mb-2">
                **** **** **** 1234
              </div>
              <div className="flex justify-between">
                <div>
                  <div className="text-sm text-gray-500">Current Balance</div>
                  <div className="font-medium">
                    $2,547.63
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-500">Available Credit</div>
                  <div className="font-medium">
                    $5,000.00
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mb-4">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-lg font-medium">Recent Transactions</h3>
                <Button 
                  variant="outline" 
                  size="sm"
                  className="text-sm flex items-center"
                  onClick={() => {
                    alert("Transaction history downloaded successfully!");
                  }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                  Download
                </Button>
              </div>
              
              <div className="space-y-3">
                <div className="border border-gray-200 rounded-lg bg-white p-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="font-medium">Deposit</div>
                      <div className="text-xs text-gray-500">
                        {new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toLocaleString()}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium text-success">
                        +$650.00
                      </div>
                      <div className="text-xs text-gray-500">ID: TRX-75841269</div>
                    </div>
                  </div>
                </div>
                
                <div className="border border-gray-200 rounded-lg bg-white p-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="font-medium">Bill Payment - Electricity</div>
                      <div className="text-xs text-gray-500">
                        {new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toLocaleString()}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium text-error">
                        -$85.23
                      </div>
                      <div className="text-xs text-gray-500">ID: TRX-75841270</div>
                    </div>
                  </div>
                </div>
                
                <div className="border border-gray-200 rounded-lg bg-white p-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="font-medium">ATM Withdrawal</div>
                      <div className="text-xs text-gray-500">
                        {new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toLocaleString()}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium text-error">
                        -$200.00
                      </div>
                      <div className="text-xs text-gray-500">ID: TRX-75841271</div>
                    </div>
                  </div>
                </div>
                
                <div className="border border-gray-200 rounded-lg bg-white p-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="font-medium">Salary Deposit</div>
                      <div className="text-xs text-gray-500">
                        {new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toLocaleString()}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium text-success">
                        +$2,450.00
                      </div>
                      <div className="text-xs text-gray-500">ID: TRX-75841272</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex space-x-3">
              <Button 
                variant="outline"
                className="btn-secondary rounded-lg py-2 px-4 flex-1 flex items-center justify-center"
              >
                <Printer className="mr-2" />
                Print History
              </Button>
              <Button 
                className="btn-primary rounded-lg py-2 px-4 flex-1 flex items-center justify-center"
                onClick={() => navigateTo("main-menu")}
              >
                <Home className="mr-2" />
                Main Menu
              </Button>
            </div>
          </div>
        );
        
      case "exit-confirmation":
        return (
          <div className="fade-in">
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-primary/10 rounded-full mb-2">
                <LogOut className="text-primary" size={24} />
              </div>
              <h2 className="text-xl font-bold mb-1">End Your Session?</h2>
              <p className="text-gray-500 text-center">
                Are you sure you want to end your session and exit?
              </p>
            </div>
            
            <div className="mb-6 bg-blue-50 p-4 rounded-lg text-center">
              <p className="text-gray-600">
                Make sure you have completed all your transactions and collected any cash or receipts.
              </p>
            </div>
            
            <div className="flex space-x-3">
              <Button 
                variant="outline"
                className="btn-secondary rounded-lg py-3 px-4 flex-1 flex items-center justify-center"
                onClick={() => navigateTo("main-menu")}
              >
                <ArrowLeft className="mr-2" />
                Go Back
              </Button>
              <Button 
                className="btn-primary rounded-lg py-3 px-4 flex-1 flex items-center justify-center"
                onClick={() => navigateTo("session-ended")}
              >
                <LogOut className="mr-2" />
                Yes, End Session
              </Button>
            </div>
          </div>
        );
        
      case "change-pin":
        return (
          <div className="fade-in">
            <div className="flex items-center mb-6">
              <Button variant="ghost" className="mr-3 p-2" onClick={() => navigateTo("main-menu")}>
                <ArrowLeft className="text-primary" />
              </Button>
              <h2 className="text-xl font-bold">Change PIN</h2>
            </div>
            
            <div className="mb-6 text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-primary/10 rounded-full mb-2">
                <Key className="text-primary" size={24} />
              </div>
              <h3 className="font-medium mb-1">Enter Your New PIN</h3>
              <p className="text-sm text-gray-600">
                Your PIN must be 4 digits and should be kept confidential.
              </p>
            </div>
            
            <div className="mb-6">
              <div className="pin-display flex justify-center space-x-3 my-6">
                {Array.from({ length: 4 }).map((_, index) => (
                  <div 
                    key={index}
                    className="w-10 h-10 border-2 border-gray-300 rounded-md flex items-center justify-center"
                  >
                    {pin.length > index && "●"}
                  </div>
                ))}
              </div>
              
              <div className="num-pad grid grid-cols-3 gap-3 max-w-xs mx-auto">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
                  <Button
                    key={num}
                    variant="outline"
                    className="bg-white text-text-primary font-medium text-xl h-14 rounded-md shadow-sm border border-gray-200"
                    onClick={() => setPin(prev => prev.length < 4 ? prev + num : prev)}
                  >
                    {num}
                  </Button>
                ))}
                
                <Button
                  variant="outline"
                  className="bg-white text-error font-medium h-14 rounded-md shadow-sm border border-gray-200 flex items-center justify-center"
                  onClick={() => setPin(prev => prev.slice(0, -1))}
                >
                  <X size={20} />
                </Button>
                
                <Button
                  variant="outline"
                  className="bg-white text-text-primary font-medium text-xl h-14 rounded-md shadow-sm border border-gray-200"
                  onClick={() => setPin(prev => prev.length < 4 ? prev + "0" : prev)}
                >
                  0
                </Button>
                
                <Button
                  className="bg-primary text-white font-medium h-14 rounded-md shadow-sm flex items-center justify-center"
                  disabled={pin.length < 4}
                  onClick={() => {
                    if (pin.length === 4) {
                      alert("PIN changed successfully!");
                      setPin("");
                      navigateTo("main-menu");
                    }
                  }}
                >
                  <CheckCircle size={20} />
                </Button>
              </div>
            </div>
            
            <div className="flex space-x-3 mt-8">
              <Button 
                variant="outline"
                className="btn-secondary rounded-lg py-2 px-4 flex-1 flex items-center justify-center"
                onClick={() => {
                  setPin("");
                  navigateTo("main-menu");
                }}
              >
                <X className="mr-2" />
                Cancel
              </Button>
            </div>
          </div>
        );
        
      case "session-ended":
        return (
          <div className="text-center py-10 fade-in">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
              <CheckCircle className="text-success text-4xl" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Session Ended</h2>
            <p className="text-gray-500 mb-8">Thank you for using SecureBank ATM</p>
            
            <div className="bg-blue-50 p-4 rounded-lg text-center mb-8">
              <p className="text-gray-600">
                Don't forget to take your card, cash, and receipt.
              </p>
            </div>
            
            <Button 
              className="btn-primary rounded-lg py-3 px-6 font-medium flex items-center mx-auto"
              onClick={() => navigateTo("welcome")}
            >
              <RefreshCw className="mr-2" />
              Start New Session
            </Button>
          </div>
        );
        
      default:
        return <div>Screen not found</div>;
    }
  };

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <ATMLayout>
          {renderScreen()}
        </ATMLayout>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
