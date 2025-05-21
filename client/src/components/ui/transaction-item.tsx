import { Card, CardContent } from "@/components/ui/card";
import { formatDate } from "@/lib/utils";
import { Transaction } from "@shared/schema";

interface TransactionItemProps {
  transaction: Transaction;
}

export function TransactionItem({ transaction }: TransactionItemProps) {
  const isNegative = Number(transaction.amount) < 0;
  const formattedAmount = `${isNegative ? "" : "+"}$${Math.abs(Number(transaction.amount)).toFixed(2)}`;
  
  return (
    <Card className="border border-gray-200 rounded-lg bg-white">
      <CardContent className="p-3">
        <div className="flex justify-between items-start">
          <div>
            <div className="font-medium">{transaction.description}</div>
            <div className="text-xs text-gray-500">
              {formatDate(transaction.timestamp)}
            </div>
          </div>
          <div className="text-right">
            <div className={`font-medium ${isNegative ? "text-error" : "text-success"}`}>
              {formattedAmount}
            </div>
            <div className="text-xs text-gray-500">ID: {transaction.transactionId}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
