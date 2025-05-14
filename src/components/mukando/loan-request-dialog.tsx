
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import type { MukandoGroup } from "./group-card"; // Assuming MukandoGroup type is here
import { Landmark } from "lucide-react";

interface LoanRequestDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  group: MukandoGroup;
  onConfirmLoan: (groupId: string, amount: number) => void;
  userWalletBalance: number; // To inform the user, not to restrict loan from group
}

export function LoanRequestDialog({ isOpen, onOpenChange, group, onConfirmLoan, userWalletBalance }: LoanRequestDialogProps) {
  const [amount, setAmount] = useState("");
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numericAmount = parseFloat(amount);

    if (isNaN(numericAmount) || numericAmount <= 0) {
      toast({ title: "Invalid Loan Amount", description: "Please enter a valid positive amount.", variant: "destructive" });
      return;
    }
    if (numericAmount > group.currentPool) {
      toast({ title: "Insufficient Group Funds", description: `The group pool only has $${group.currentPool.toFixed(2)} USD available.`, variant: "destructive" });
      return;
    }

    onConfirmLoan(group.id, numericAmount);
    toast({
      title: "Loan Request Submitted",
      description: `Your request for $${numericAmount.toFixed(2)} USD from "${group.name}" has been submitted. (Simulated: Funds disbursed).`,
      className: "bg-accent text-accent-foreground",
      duration: 5000,
    });
    setAmount("");
    onOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Landmark className="mr-2 h-5 w-5 text-primary" />
            Request Loan from "{group.name}"
          </DialogTitle>
          <DialogDescription>
            Group Pool Available: <span className="font-semibold text-primary">${group.currentPool.toFixed(2)} USD</span>.
            <br />
            Your Wallet Balance: <span className="font-semibold text-primary">${userWalletBalance.toFixed(2)} USD</span>.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div>
            <Label htmlFor="loan-amount">Loan Amount (USD)</Label>
            <div className="relative mt-1">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <span className="text-muted-foreground sm:text-sm">$</span>
              </div>
              <Input
                id="loan-amount"
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                className="pl-7"
                required
                step="0.01"
                min="0.01"
                max={group.currentPool.toString()}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" className="bg-primary hover:bg-primary/90">Request Loan</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
