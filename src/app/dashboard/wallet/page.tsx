
"use client";

import { useState, useEffect } from "react";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AddFundsDialog } from "@/components/wallet/add-funds-dialog";
import { TransferFundsDialog } from "@/components/wallet/transfer-funds-dialog";
import { TransactionItem } from "@/components/wallet/transaction-item";
import { SavingsGoalCard } from "@/components/wallet/savings-goal-card";
import { CreateSavingsGoalDialog } from "@/components/wallet/create-savings-goal-dialog";
import { AddToGoalDialog } from "@/components/wallet/add-to-goal-dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { DollarSign, ListChecks, PlusCircle, Target as TargetIcon } from "lucide-react";
import Image from "next/image";
import type { Transaction, SavingsGoal } from "@/types/wallet";
import { useToast } from "@/hooks/use-toast";

const WALLET_STATE_KEY = "zimsave_wallet_state_v1"; // For balance and transactions
const SAVINGS_GOALS_KEY = "zimsave_savings_goals_v1";

interface WalletState {
  balance: number;
  transactions: Transaction[];
}

export default function WalletPage() {
  const [walletState, setWalletState] = useState<WalletState>({ balance: 20.50, transactions: [] });
  const [savingsGoals, setSavingsGoals] = useState<SavingsGoal[]>([]);
  const [isCreateGoalDialogOpen, setCreateGoalDialogOpen] = useState(false);
  const [selectedGoalToFund, setSelectedGoalToFund] = useState<SavingsGoal | null>(null);
  const { toast } = useToast();

  // Load state from localStorage
  useEffect(() => {
    const storedWalletState = localStorage.getItem(WALLET_STATE_KEY);
    if (storedWalletState) {
      try {
        setWalletState(JSON.parse(storedWalletState));
      } catch (e) { console.error("Error parsing wallet state:", e); }
    } else {
      // Initialize with mock transactions if nothing is stored
      setWalletState(prevState => ({
        ...prevState,
        transactions: [
          { id: "1", type: "deposit", amount: 50.00, description: "Initial Deposit", date: new Date(Date.now() - 86400000 * 2).toISOString(), status: "completed" },
          { id: "2", type: "mukando", amount: 5.00, description: "Sunrise Savers Contribution", date: new Date(Date.now() - 86400000).toISOString(), status: "completed" },
          { id: "3", type: "purchase", amount: 12.50, description: "Online Course Subscription", date: new Date(Date.now() - 86400000 / 2).toISOString(), status: "completed" },
        ]
      }));
    }

    const storedGoals = localStorage.getItem(SAVINGS_GOALS_KEY);
    if (storedGoals) {
      try {
        setSavingsGoals(JSON.parse(storedGoals));
      } catch (e) { console.error("Error parsing savings goals:", e); }
    }
  }, []);

  // Save state to localStorage
  useEffect(() => {
    localStorage.setItem(WALLET_STATE_KEY, JSON.stringify(walletState));
  }, [walletState]);

  useEffect(() => {
    localStorage.setItem(SAVINGS_GOALS_KEY, JSON.stringify(savingsGoals));
  }, [savingsGoals]);

  const handleAddTransaction = (transaction: Omit<Transaction, "id" | "date" | "status">) => {
    setWalletState(prev => ({
      ...prev,
      transactions: [
        { ...transaction, id: Date.now().toString(), date: new Date().toISOString(), status: "completed" },
        ...prev.transactions
      ]
    }));
  };

  const handleAddFunds = (amount: number) => {
    setWalletState(prev => ({
      ...prev,
      balance: prev.balance + amount,
    }));
    handleAddTransaction({ type: "deposit", amount, description: "Funds Added" });
  };

  const handleTransferFunds = (amount: number, recipient: string, purpose: string) => {
    setWalletState(prev => ({
      ...prev,
      balance: prev.balance - amount,
    }));
    let transactionType: Transaction['type'] = 'transfer_out';
    if (purpose === 'mukando') transactionType = 'mukando';
    // Note: "goal_contribution" is handled by handleAddFundsToGoal

    handleAddTransaction({ type: transactionType, amount, description: `Transfer for ${purpose} ${recipient ? `to ${recipient}` : ''}` });
  };

  const handleCreateGoal = (newGoal: SavingsGoal) => {
    setSavingsGoals(prev => [newGoal, ...prev.sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())]);
  };

  const handleAddFundsToGoal = (goalId: string, amount: number) => {
    if (walletState.balance < amount) {
      toast({ title: "Insufficient Wallet Balance", description: "Not enough funds in your main wallet.", variant: "destructive" });
      return;
    }

    setWalletState(prev => ({
      ...prev,
      balance: prev.balance - amount,
    }));

    setSavingsGoals(prevGoals =>
      prevGoals.map(g =>
        g.id === goalId ? { ...g, currentAmount: g.currentAmount + amount } : g
      )
    );
    const goal = savingsGoals.find(g => g.id === goalId);
    handleAddTransaction({ type: "goal_contribution", amount, description: `Contribution to "${goal?.name || 'Savings Goal'}"`, goalId });
    setSelectedGoalToFund(null); // Close dialog
  };


  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8">
      <PageHeader
        title="My Wallet"
        description="Manage your USD funds, transactions, and savings goals."
      />

      <Card className="mb-6 shadow-xl">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <div>
            <CardTitle className="text-lg font-medium text-primary">Current Balance</CardTitle>
            <CardDescription>Available funds in your main wallet.</CardDescription>
          </div>
          <DollarSign className="h-8 w-8 text-primary" />
        </CardHeader>
        <CardContent>
          <div className="text-4xl font-bold text-primary">
            ${walletState.balance.toFixed(2)} USD
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            <AddFundsDialog onAddFunds={handleAddFunds} />
            <TransferFundsDialog currentBalance={walletState.balance} onTransferFunds={handleTransferFunds} />
          </div>
        </CardContent>
      </Card>

      {/* Savings Goals Section */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-primary flex items-center">
            <TargetIcon className="mr-3 h-6 w-6" /> Savings Goals
          </h2>
          <Button variant="outline" onClick={() => setCreateGoalDialogOpen(true)}>
            <PlusCircle className="mr-2 h-4 w-4" /> Create Goal
          </Button>
        </div>
        {savingsGoals.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {savingsGoals.map(goal => (
              <SavingsGoalCard key={goal.id} goal={goal} onAddFundsClick={setSelectedGoalToFund} />
            ))}
          </div>
        ) : (
          <Card className="text-center py-8">
            <CardContent>
              <TargetIcon className="mx-auto h-12 w-12 text-muted-foreground mb-3" />
              <p className="text-muted-foreground">No savings goals yet.</p>
              <p className="text-sm text-muted-foreground">Click "Create Goal" to start saving for something important!</p>
            </CardContent>
          </Card>
        )}
      </div>
      
      <CreateSavingsGoalDialog 
        isOpen={isCreateGoalDialogOpen} 
        onOpenChange={setCreateGoalDialogOpen}
        onCreateGoal={handleCreateGoal}
      />
      
      {selectedGoalToFund && (
        <AddToGoalDialog
          isOpen={!!selectedGoalToFund}
          onOpenChange={() => setSelectedGoalToFund(null)}
          goal={selectedGoalToFund}
          onAddFundsToGoal={handleAddFundsToGoal}
          currentWalletBalance={walletState.balance}
        />
      )}


      <Card className="shadow-xl">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl text-primary">Transaction History</CardTitle>
              <CardDescription>Your recent wallet activity.</CardDescription>
            </div>
            <ListChecks className="h-6 w-6 text-primary" />
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <ScrollArea className="h-[300px] md:h-[400px]">
            {walletState.transactions.length > 0 ? (
              walletState.transactions.map((tx) => <TransactionItem key={tx.id} transaction={tx} />)
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
