
"use client";

import type { SavingsGoal } from "@/types/wallet";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { PiggyBank, PlusCircle } from "lucide-react";
import { formatDistanceToNow } from 'date-fns';

interface SavingsGoalCardProps {
  goal: SavingsGoal;
  onAddFundsClick: (goal: SavingsGoal) => void;
}

export function SavingsGoalCard({ goal, onAddFundsClick }: SavingsGoalCardProps) {
  const progress = goal.targetAmount > 0 ? (goal.currentAmount / goal.targetAmount) * 100 : 0;
  const remainingAmount = goal.targetAmount - goal.currentAmount;
  const isCompleted = goal.currentAmount >= goal.targetAmount;

  return (
    <Card className="shadow-md hover:shadow-lg transition-shadow flex flex-col">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg text-primary flex items-center">
            {goal.emoji && <span className="mr-2 text-2xl">{goal.emoji}</span>}
            {goal.name}
          </CardTitle>
          {isCompleted && <CheckCircle className="h-6 w-6 text-green-500" />}
        </div>
        <CardDescription>
          Target: ${goal.targetAmount.toFixed(2)} USD
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow space-y-2">
        <div>
          <div className="flex justify-between text-sm text-muted-foreground mb-1">
            <span>Progress</span>
            <span className="font-semibold text-card-foreground">${goal.currentAmount.toFixed(2)} USD</span>
          </div>
          <Progress value={progress} className="h-3" />
          <p className="text-xs text-muted-foreground mt-1">
            {isCompleted ? "Goal Achieved!" : `$${remainingAmount.toFixed(2)} USD remaining`}
          </p>
        </div>
        <p className="text-xs text-muted-foreground">
          Created: {formatDistanceToNow(new Date(goal.createdAt), { addSuffix: true })}
        </p>
      </CardContent>
      <CardFooter>
        {!isCompleted ? (
          <Button size="sm" className="w-full bg-secondary hover:bg-secondary/90 text-secondary-foreground" onClick={() => onAddFundsClick(goal)}>
            <PlusCircle className="mr-2 h-4 w-4" /> Add Funds
          </Button>
        ) : (
           <Button size="sm" variant="outline" disabled className="w-full border-green-500 text-green-500">
             Achieved!
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}

// Helper component (can be in ui or here if only used here)
function CheckCircle(props: React.ComponentProps<typeof PiggyBank>) { // Using PiggyBank as a placeholder type
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
    </svg>
  );
}

