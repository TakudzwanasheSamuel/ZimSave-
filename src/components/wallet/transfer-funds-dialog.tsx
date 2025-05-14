
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { ArrowRightLeft } from "lucide-react";

interface TransferFundsDialogProps {
  currentBalance: number;
  onTransferFunds: (amount: number, recipient: string, purpose: string) => void;
}

export function TransferFundsDialog({ currentBalance, onTransferFunds }: TransferFundsDialogProps) {
  const [amount, setAmount] = useState("");
  const [recipient, setRecipient] = useState("");
  const [purpose, setPurpose] = useState("mukando");
  const [notes, setNotes] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numericAmount = parseFloat(amount);
    if (isNaN(numericAmount) || numericAmount <= 0) {
      toast({ title: "Invalid Amount", description: "Please enter a valid positive amount.", variant: "destructive" });
      return;
    }
    if (numericAmount > currentBalance) {
      toast({ title: "Insufficient Funds", description: "You do not have enough funds for this transfer.", variant: "destructive" });
      return;
    }
    if (!recipient && purpose !== 'other_internal') {
      toast({ title: "Missing Recipient", description: "Please specify a recipient.", variant: "destructive" });
      return;
    }

    onTransferFunds(numericAmount, recipient, purpose);
    toast({
      title: "Transfer Successful",
      description: `ZWL ${numericAmount.toFixed(2)} transferred.`,
      className: "bg-accent text-accent-foreground"
    });
    setAmount("");
    setRecipient("");
    setNotes("");
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="secondary" className="text-primary-foreground hover:bg-secondary/90">
          <ArrowRightLeft className="mr-2 h-4 w-4" /> Transfer Funds
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Transfer Funds</DialogTitle>
          <DialogDescription>
            Move funds from your wallet. Current Balance: ZWL {currentBalance.toFixed(2)}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div>
            <Label htmlFor="amount-transfer">Amount (ZWL)</Label>
             <div className="relative mt-1">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <span className="text-muted-foreground sm:text-sm">ZWL</span>
                </div>
                <Input
                    id="amount-transfer"
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="0.00"
                    className="pl-12" 
                    required
                    step="any"
                />
            </div>
          </div>
          <div>
            <Label htmlFor="purpose">Purpose</Label>
            <Select value={purpose} onValueChange={setPurpose}>
              <SelectTrigger id="purpose">
                <SelectValue placeholder="Select purpose" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="mukando">Mukando Contribution</SelectItem>
                <SelectItem value="savings_goal">Savings Goal</SelectItem>
                <SelectItem value="peer_transfer">Peer Transfer</SelectItem>
                <SelectItem value="bill_payment">Bill Payment</SelectItem>
                <SelectItem value="other_internal">Internal Allocation</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {purpose !== "other_internal" && (
            <div>
              <Label htmlFor="recipient">Recipient</Label>
              <Input
                id="recipient"
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                placeholder={purpose === "peer_transfer" ? "Recipient's Phone or Email" : "Group Name / Goal Name"}
                required={purpose !== "other_internal"}
              />
            </div>
          )}
          <div>
            <Label htmlFor="notes">Notes (Optional)</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add a short note for the transfer."
            />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" className="bg-secondary hover:bg-secondary/90 text-primary-foreground">Transfer</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
