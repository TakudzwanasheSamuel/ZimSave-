
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Target } from "lucide-react";
import type { SavingsGoal } from "@/types/wallet";
import { cn } from "@/lib/utils"; // Added missing import

interface CreateSavingsGoalDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onCreateGoal: (goal: SavingsGoal) => void;
}

// Simple emoji suggestions - can be expanded
const emojiSuggestions = ["💰", "🎯", "✈️", "🏠", "🎓", "🚗", "🎁", "💡"];

export function CreateSavingsGoalDialog({ isOpen, onOpenChange, onCreateGoal }: CreateSavingsGoalDialogProps) {
  const [name, setName] = useState("");
  const [targetAmount, setTargetAmount] = useState("");
  const [selectedEmoji, setSelectedEmoji] = useState<string | undefined>(emojiSuggestions[0]);
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numericTargetAmount = parseFloat(targetAmount);

    if (!name.trim()) {
      toast({ title: "Goal Name Required", description: "Please enter a name for your goal.", variant: "destructive" });
      return;
    }
    if (isNaN(numericTargetAmount) || numericTargetAmount <= 0) {
      toast({ title: "Invalid Target Amount", description: "Please enter a valid positive target amount.", variant: "destructive" });
      return;
    }

    const newGoal: SavingsGoal = {
      id: Date.now().toString(),
      name: name.trim(),
      targetAmount: numericTargetAmount,
      currentAmount: 0,
      createdAt: new Date().toISOString(),
      emoji: selectedEmoji,
    };

    onCreateGoal(newGoal);
    toast({
      title: "Goal Created!",
      description: `Your savings goal "${newGoal.name}" has been created.`,
      className: "bg-accent text-accent-foreground"
    });
    setName("");
    setTargetAmount("");
    setSelectedEmoji(emojiSuggestions[0]);
    onOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[450px]">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Target className="mr-2 h-5 w-5 text-primary" /> Create New Savings Goal
          </DialogTitle>
          <DialogDescription>
            Set a target and start saving for what matters to you.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div>
            <Label htmlFor="goal-name">Goal Name</Label>
            <Input
              id="goal-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Emergency Fund, New Laptop"
              required
            />
          </div>
          <div>
            <Label htmlFor="goal-target-amount">Target Amount (USD)</Label>
            <div className="relative mt-1">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <span className="text-muted-foreground sm:text-sm">$</span>
              </div>
              <Input
                id="goal-target-amount"
                type="number"
                value={targetAmount}
                onChange={(e) => setTargetAmount(e.target.value)}
                placeholder="0.00"
                className="pl-7"
                required
                step="0.01"
                min="0.01"
              />
            </div>
          </div>
          <div>
            <Label htmlFor="goal-emoji">Select an Emoji (Optional)</Label>
            <div className="mt-1 flex flex-wrap gap-2">
              {emojiSuggestions.map(emoji => (
                <Button
                  key={emoji}
                  type="button"
                  variant={selectedEmoji === emoji ? "default" : "outline"}
                  size="icon"
                  className={cn("text-xl", selectedEmoji === emoji && "ring-2 ring-primary")}
                  onClick={() => setSelectedEmoji(emoji)}
                >
                  {emoji}
                </Button>
              ))}
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" className="bg-primary hover:bg-primary/90">Create Goal</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
