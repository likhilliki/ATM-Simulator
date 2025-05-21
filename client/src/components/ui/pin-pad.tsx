import { useState, useEffect } from "react";
import { Delete, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface PinPadProps {
  onPinEnter: (pin: string) => void;
  onCancel: () => void;
  showError?: boolean;
  errorMessage?: string;
}

export function PinPad({ onPinEnter, onCancel, showError = false, errorMessage = "Incorrect PIN. Please try again." }: PinPadProps) {
  const [pin, setPin] = useState<string>("");
  
  // Reset PIN when component mounts or showError changes
  useEffect(() => {
    if (showError) {
      setPin("");
    }
  }, [showError]);

  const handleNumberClick = (number: number) => {
    if (pin.length < 4) {
      setPin(prev => prev + number);
    }
  };

  const handleClear = () => {
    setPin(prev => prev.slice(0, -1));
  };

  const handleEnter = () => {
    if (pin.length === 4) {
      onPinEnter(pin);
    }
  };

  // Automatically submit when PIN is 4 digits
  useEffect(() => {
    if (pin.length === 4) {
      const timer = setTimeout(() => {
        handleEnter();
      }, 500);
      
      return () => clearTimeout(timer);
    }
  }, [pin]);

  return (
    <div>
      <div className="pin-display flex justify-center space-x-3 my-6">
        {Array.from({ length: 4 }).map((_, index) => (
          <div 
            key={index}
            className={cn(
              "w-10 h-10 border-2 border-gray-300 rounded-md flex items-center justify-center",
              pin.length > index && "border-primary"
            )}
          >
            {pin.length > index && "●"}
          </div>
        ))}
      </div>
      
      {showError && (
        <div className="text-error text-center mb-4 flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
          {errorMessage}
        </div>
      )}
      
      <div className="num-pad grid grid-cols-3 gap-3 max-w-xs mx-auto">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
          <Button
            key={num}
            variant="outline"
            className="bg-white text-text-primary font-medium text-xl h-14 rounded-md shadow-sm border border-gray-200"
            onClick={() => handleNumberClick(num)}
          >
            {num}
          </Button>
        ))}
        
        <Button
          variant="outline"
          className="bg-white text-error font-medium h-14 rounded-md shadow-sm border border-gray-200 flex items-center justify-center"
          onClick={handleClear}
        >
          <Delete />
        </Button>
        
        <Button
          variant="outline"
          className="bg-white text-text-primary font-medium text-xl h-14 rounded-md shadow-sm border border-gray-200"
          onClick={() => handleNumberClick(0)}
        >
          0
        </Button>
        
        <Button
          className="bg-primary text-white font-medium h-14 rounded-md shadow-sm flex items-center justify-center"
          onClick={handleEnter}
          disabled={pin.length < 4}
        >
          <Check />
        </Button>
      </div>
      
      <div className="mt-6 text-center">
        <Button 
          variant="ghost" 
          className="text-gray-500 text-sm flex items-center justify-center mx-auto"
          onClick={onCancel}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
          Cancel Transaction
        </Button>
      </div>
      
      <div className="absolute bottom-0 right-0 left-0 p-2 text-xs text-gray-400 text-center">
        For demo: PIN is 1234
      </div>
    </div>
  );
}
