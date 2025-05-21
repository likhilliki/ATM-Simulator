import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import WelcomePage from "@/pages/welcome";
import PinEntryPage from "@/pages/pin-entry";
import MainMenuPage from "@/pages/main-menu";
import BalanceInquiryPage from "@/pages/balance-inquiry";
import WithdrawalPage from "@/pages/withdrawal";
import WithdrawalConfirmationPage from "@/pages/withdrawal-confirmation";
import TransactionSuccessPage from "@/pages/transaction-success";
import TransactionHistoryPage from "@/pages/transaction-history";
import ExitConfirmationPage from "@/pages/exit-confirmation";
import TimeoutWarningPage from "@/pages/timeout-warning";
import SessionEndedPage from "@/pages/session-ended";
import { ATMProvider } from "./contexts/atm-context";
import { Notification } from "./components/ui/notification";

function Router() {
  return (
    <Switch>
      <Route path="/" component={WelcomePage} />
      <Route path="/pin-entry" component={PinEntryPage} />
      <Route path="/main-menu" component={MainMenuPage} />
      <Route path="/balance-inquiry" component={BalanceInquiryPage} />
      <Route path="/withdrawal" component={WithdrawalPage} />
      <Route path="/withdrawal-confirmation" component={WithdrawalConfirmationPage} />
      <Route path="/transaction-success" component={TransactionSuccessPage} />
      <Route path="/transaction-history" component={TransactionHistoryPage} />
      <Route path="/exit-confirmation" component={ExitConfirmationPage} />
      <Route path="/timeout-warning" component={TimeoutWarningPage} />
      <Route path="/session-ended" component={SessionEndedPage} />
      
      {/* Fallback to 404 */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
