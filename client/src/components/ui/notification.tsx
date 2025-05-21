import { useATM } from "@/contexts/atm-context";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect } from "react";

export function Notification() {
  const { notification, clearNotification } = useATM();

  // Clear notification after 3 seconds
  useEffect(() => {
    if (notification) {
      const timeout = setTimeout(() => {
        clearNotification();
      }, 3000);
      
      return () => clearTimeout(timeout);
    }
  }, [notification, clearNotification]);

  return (
    <AnimatePresence>
      {notification && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className={cn(
            "fixed top-4 right-4 left-4 z-50 bg-white rounded-lg shadow-lg p-4 max-w-md mx-auto border-l-4",
            notification.type === "success" && "border-success",
            notification.type === "error" && "border-error",
            notification.type === "info" && "border-primary"
          )}
        >
          {notification.message}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
