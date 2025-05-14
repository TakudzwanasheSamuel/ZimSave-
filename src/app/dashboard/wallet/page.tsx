
"use client";

import { useState } from "react";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AddFundsDialog } from "@/components/wallet/add-funds-dialog";
import { TransferFundsDialog } from "@/components/wallet/transfer-funds-dialog";
import { TransactionItem, type Transaction } from "@/components/wallet/transaction-item";
import { ScrollArea } from "@/components/ui/scroll-area";
import { DollarSign, ListChecks } from "lucide-react";
import Image from "next/image";

const mockTransactions: Transaction[] = [
  { id: "1", type: "deposit", amount: 5000, description: "Salary Deposit", date: new Date(Date.now() - 86400000 * 2).toISOString(), status: "completed" },
  { id: "2", type: "mukando", amount: 500, description: "Sunset Savers Contribution", date: new Date(Date.now() - 86400000).toISOString(), status: "completed" },
  { id: "3", type: "purchase", amount: 1200, description: "Groceries at OK Zimbabwe", date: new Date(Date.now() - 86400000 / 2).toISOString(), status: "completed" },
  { id: "4", type: "transfer_out", amount: 200, description: "Sent to J. Doe", date: new Date().toISOString(), status: "pending" },
  { id: "5", type: "goal", amount: 1000, description: "School Fees Goal", date: new Date(Date.now() - 86400000 * 3).toISOString(), status: "completed" },
];

export default function WalletPage() {
  const [balance, setBalance] = useState(3100.00); // Initial simulated balance
  const [transactions, setTransactions] = useState<Transaction[]>(mockTransactions);

  const handleAddFunds = (amount: number) => {
    setBalance((prev) => prev + amount);
    setTransactions((prev) => [
      {
        id: Date.now().toString(),
        type: "deposit",
        amount,
        description: "Funds Added via Top-Up",
        date: new Date().toISOString(),
        status: "completed",
      },
      ...prev,
    ]);
  };

  const handleTransferFunds = (amount: number, recipient: string, purpose: string) => {
    setBalance((prev) => prev - amount);
    let type: Transaction['type'] = 'transfer_out';
    if (purpose === 'mukando') type = 'mukando';
    if (purpose === 'savings_goal') type = 'goal';

    setTransactions((prev) => [
      {
        id: Date.now().toString(),
        type: type,
        amount,
        description: `Transfer for ${purpose} ${recipient ? `to ${recipient}`: ''}`,
        date: new Date().toISOString(),
        status: "completed",
      },
      ...prev,
    ]);
  };

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8">
      <PageHeader
        title="My Wallet"
        description="Manage your funds and view transaction history."
      />

      <Card className="mb-6 shadow-xl">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <div>
            <CardTitle className="text-lg font-medium text-primary">Current Balance</CardTitle>
            <CardDescription>Available funds in your wallet.</CardDescription>
          </div>
           <DollarSign className="h-8 w-8 text-primary" />
        </CardHeader>
        <CardContent>
          <div className="text-4xl font-bold text-primary">
            ZWL {balance.toFixed(2)}
          </div>
          <div className="mt-4 flex space-x-3">
            <AddFundsDialog onAddFunds={handleAddFunds} />
            <TransferFundsDialog currentBalance={balance} onTransferFunds={handleTransferFunds} />
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-xl">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl text-primary">Transaction History</CardTitle>
              <CardDescription>Your recent wallet activity.</CardDescription>
            </div>
            <ListChecks className="h-6 w-6 text-primary"/>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <ScrollArea className="h-[300px] md:h-[400px]"> {/* Adjust height as needed */}
            {transactions.length > 0 ? (
              transactions.map((tx) => <TransactionItem key={tx.id} transaction={tx} />)
            ) : (
              <div className="p-6 text-center text-muted-foreground">
                <Image src="https://placehold.co/300x200.png" alt="No transactions placeholder" width={300} height={200} className="mx-auto rounded-md mb-4" data-ai-hint="empty transaction" />
                <p>No transactions yet.</p>
                <p>Add funds or make a transfer to get started.</p>
              </div>
            )}
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}
