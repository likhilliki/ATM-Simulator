import { 
  createContext, 
  useContext, 
  useState, 
  ReactNode,
  useCallback 
} from "react";
import { useLocation } from "wouter";

type NotificationType = "success" | "error" | "info";

interface NotificationState {
  message: string;
  type: NotificationType;
}

interface ATMContextType {
  cardNumber: string | null;
  setCardNumber: (cardNumber: string | null) => void;
  currentScreen: string;
  navigateTo: (path: string) => void;
  withdrawalAmount: number | null;
  setWithdrawalAmount: (amount: number | null) => void;
  notification: NotificationState | null;
  showNotification: (message: string, type: NotificationType) => void;
  clearNotification: () => void;
  showWarning: () => void;
}

const ATMContext = createContext<ATMContextType | undefined>(undefined);

export function ATMProvider({ children }: { children: ReactNode }) {
  const [, setLocation] = useLocation();
  const [cardNumber, setCardNumber] = useState<string | null>(null);
  const [currentScreen, setCurrentScreen] = useState<string>("welcome");
  const [withdrawalAmount, setWithdrawalAmount] = useState<number | null>(null);
  const [notification, setNotification] = useState<NotificationState | null>(null);

  const navigateTo = useCallback((path: string) => {
    setLocation(path);
    setCurrentScreen(path.replace("/", "") || "welcome");
  }, [setLocation]);

  const showNotification = useCallback((message: string, type: NotificationType = "info") => {
    setNotification({ message, type });
  }, []);

  const clearNotification = useCallback(() => {
    setNotification(null);
  }, []);

  const showWarning = useCallback(() => {
    navigateTo('/timeout-warning');
  }, [navigateTo]);

  return (
    <ATMContext.Provider
      value={{
        cardNumber,
        setCardNumber,
        currentScreen,
        navigateTo,
        withdrawalAmount,
        setWithdrawalAmount,
        notification,
        showNotification,
        clearNotification,
        showWarning
      }}
    >
      {children}
    </ATMContext.Provider>
  );
}

export function useATM() {
  const context = useContext(ATMContext);
  if (context === undefined) {
    throw new Error("useATM must be used within an ATMProvider");
  }
  return context;
}
