
"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import type { SavingsGoal } from "@/types/wallet";
import { PiggyBank } from "lucide-react";

interface AddToGoalDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  goal: SavingsGoal | null;
  onAddFundsToGoal: (goalId: string, amount: number) => void;
  currentWalletBalance: number;
}

export function AddToGoalDialog({ isOpen, onOpenChange, goal, onAddFundsToGoal, currentWalletBalance }: AddToGoalDialogProps) {
  const [amount, setAmount] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    if (!isOpen) {
      setAmount(""); // Reset amount when dialog is closed
    }
  }, [isOpen]);

  if (!goal) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numericAmount = parseFloat(amount);

    if (isNaN(numericAmount) || numericAmount <= 0) {
      toast({ title: "Invalid Amount", description: "Please enter a valid positive amount.", variant: "destructive" });
      return;
    }
    if (numericAmount > currentWalletBalance) {
      toast({ title: "Insufficient Wallet Balance", description: `You only have $${currentWalletBalance.toFixed(2)} USD in your main wallet.`, variant: "destructive" });
      return;
    }
    if (numericAmount > (goal.targetAmount - goal.currentAmount)) {
        const remaining = goal.targetAmount - goal.currentAmount;
        toast({ title: "Amount Exceeds Goal", description: `You only need $${remaining.toFixed(2)} USD more for this goal. Adjusting amount.`, variant: "default" });
        setAmount(remaining.toFixed(2)); // Auto-adjust, user can confirm or change
        // Potentially submit with remaining amount directly, or let user confirm. For now, just adjust and let them re-submit.
        return; 
    }


    onAddFundsToGoal(goal.id, numericAmount);
    toast({
      title: "Funds Added to Goal!",
      description: `$${numericAmount.toFixed(2)} USD added to "${goal.name}".`,
      className: "bg-accent text-accent-foreground"
    });
    setAmount("");
    onOpenChange(false);
  };
  
  const remainingForGoal = goal.targetAmount - goal.currentAmount;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center">
             {goal.emoji && <span className="mr-2 text-xl">{goal.emoji}</span>}
            Add Funds to "{goal.name}"
          </DialogTitle>
          <DialogDescription>
            Target: ${goal.targetAmount.toFixed(2)} USD | Current: ${goal.currentAmount.toFixed(2)} USD
            <br/>
            You need <span className="font-semibold text-primary">${remainingForGoal.toFixed(2)} USD</span> more to reach this goal.
            <br />
            Wallet Balance: <span className="font-semibold text-primary">${currentWalletBalance.toFixed(2)} USD</span>
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div>
            <Label htmlFor="goal-fund-amount">Amount to Add (USD)</Label>
            <div className="relative mt-1">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <span className="text-muted-foreground sm:text-sm">$</span>
              </div>
              <Input
                id="goal-fund-amount"
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                className="pl-7"
                required
                step="0.01"
                min="0.01"
                max={Math.max(0, remainingForGoal).toString()} // Suggest max needed
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" className="bg-primary hover:bg-primary/90">
                <PiggyBank className="mr-2 h-4 w-4"/> Add to Goal
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
