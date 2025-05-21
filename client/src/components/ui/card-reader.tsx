import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CreditCard, Hand } from "lucide-react";
import { motion } from "framer-motion";

interface CardReaderProps {
  onCardInsert: () => void;
}

export function CardReader({ onCardInsert }: CardReaderProps) {
  const [isHovering, setIsHovering] = useState(false);

  return (
    <div className="text-center py-8">
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="inline-block"
      >
        <CreditCard 
          className="text-primary text-6xl mb-4" 
          size={64}
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
        />
      </motion.div>
      <h2 className="text-2xl font-bold mb-2">Welcome to SecureBank</h2>
      <p className="text-gray-600 mb-8">Please insert your card or tap to begin</p>
      
      <Button 
        className="rounded-lg py-3 px-6 font-medium flex items-center mx-auto"
        onClick={onCardInsert}
      >
        <Hand className="mr-2" />
        Simulate Card Insert
      </Button>
    </div>
  );
}
