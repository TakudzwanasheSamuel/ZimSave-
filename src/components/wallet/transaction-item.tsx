
import { cn } from "@/lib/utils";
import { ArrowDownLeft, ArrowUpRight, ShoppingCart, Users, PiggyBank, AlertTriangle } from "lucide-react";

export interface Transaction {
  id: string;
  type: "deposit" | "withdrawal" | "transfer_in" | "transfer_out" | "mukando" | "goal" | "purchase" | "fee";
  amount: number;
  description: string;
  date: string; 
  status: "completed" | "pending" | "failed";
}

interface TransactionItemProps {
  transaction: Transaction;
}

const getTransactionIcon = (type: Transaction["type"]) => {
  switch (type) {
    case "deposit":
    case "transfer_in":
      return <ArrowDownLeft className="h-5 w-5 text-green-500" />;
    case "withdrawal":
    case "transfer_out":
      return <ArrowUpRight className="h-5 w-5 text-red-500" />;
    case "mukando":
      return <Users className="h-5 w-5 text-blue-500" />;
    case "goal":
      return <PiggyBank className="h-5 w-5 text-purple-500" />;
    case "purchase":
      return <ShoppingCart className="h-5 w-5 text-orange-500" />;
    default:
      return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
  }
};

export function TransactionItem({ transaction }: TransactionItemProps) {
  const isCredit = transaction.type === "deposit" || transaction.type === "transfer_in";
  const amountColor = isCredit ? "text-green-600" : "text-red-600";
  const amountPrefix = isCredit ? "+" : "-";

  return (
    <div className="flex items-center justify-between p-4 border-b last:border-b-0 hover:bg-muted/50 transition-colors">
      <div className="flex items-center space-x-3">
        <div className="p-2 bg-muted rounded-full">
         {getTransactionIcon(transaction.type)}
        </div>
        <div>
          <p className="font-medium text-card-foreground">{transaction.description}</p>
          <p className="text-xs text-muted-foreground">{new Date(transaction.date).toLocaleDateString()} - {transaction.status}</p>
        </div>
      </div>
      <div className={cn("font-semibold", amountColor)}>
        {amountPrefix} ${transaction.amount.toFixed(2)} USD
      </div>
    </div>
  );
}
