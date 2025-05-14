
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Users, DollarSign, CalendarDays, ArrowRight, Lightbulb, Loader2, Landmark } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { summarizeGroupSavings, type SummarizeGroupSavingsOutput } from "@/ai/flows/summarize-group-savings";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { LoanRequestDialog } from "./loan-request-dialog"; // Import the new dialog

export interface MukandoGroup {
  id: string;
  name: string;
  contributionAmount: number;
  contributionFrequency: string;
  members: number;
  currentPool: number;
  targetPool?: number;
  description?: string;
  upcomingNeeds?: string; 
  activeLoanAmount?: number; // Simplified: just the total amount loaned out from this group
}

interface GroupCardProps {
  group: MukandoGroup;
  onTrackContribution: (groupId: string, amount: number) => void;
  onRequestLoan: (groupId: string, loanAmount: number) => void; // New prop for loan request
  userWalletBalance: number;
}

export function GroupCard({ group, onTrackContribution, onRequestLoan, userWalletBalance }: GroupCardProps) {
  const { toast } = useToast();
  const [isLoadingSummary, setIsLoadingSummary] = useState(false);
  const [aiSummary, setAiSummary] = useState<string | null>(null);
  const [isSummaryDialogOpen, setIsSummaryDialogOpen] = useState(false);
  const [isLoanRequestDialogOpen, setIsLoanRequestDialogOpen] = useState(false);

  const progress = group.targetPool ? (group.currentPool / group.targetPool) * 100 : 0;

  const handleTrackContributionClick = () => {
    onTrackContribution(group.id, group.contributionAmount);
    toast({
      title: "Contribution Tracked",
      description: `Contribution of $${group.contributionAmount.toFixed(2)} USD for "${group.name}" recorded.`,
      className: "bg-accent text-accent-foreground"
    });
  };

  const handleGetAiSummary = async () => {
    setIsLoadingSummary(true);
    setAiSummary(null);
    try {
      const summaryInput = {
        groupName: group.name,
        currentSavings: group.currentPool,
        upcomingNeeds: group.upcomingNeeds || "Not specified",
        contributionAmount: group.contributionAmount,
        contributionFrequency: group.contributionFrequency,
      };
      const result: SummarizeGroupSavingsOutput = await summarizeGroupSavings(summaryInput);
      setAiSummary(result.summary);
      setIsSummaryDialogOpen(true);
    } catch (error) {
      console.error("Failed to get AI summary:", error);
      toast({
        title: "AI Summary Error",
        description: "Could not generate summary. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoadingSummary(false);
    }
  };

  const handleConfirmLoanRequest = (groupId: string, loanAmount: number) => {
    onRequestLoan(groupId, loanAmount);
    // Toast is handled in the parent MukandoPage after state updates
  };

  return (
    <Card className="shadow-lg hover:shadow-xl transition-shadow flex flex-col justify-between">
      <CardHeader>
        <CardTitle className="text-xl text-primary">{group.name}</CardTitle>
        {group.description && <CardDescription>{group.description}</CardDescription>}
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center text-sm">
          <DollarSign className="mr-2 h-4 w-4 text-secondary" />
          <span>Contribution: ${group.contributionAmount.toFixed(2)} USD</span>
        </div>
        <div className="flex items-center text-sm">
          <CalendarDays className="mr-2 h-4 w-4 text-secondary" />
          <span>Frequency: {group.contributionFrequency}</span>
        </div>
        <div className="flex items-center text-sm">
          <Users className="mr-2 h-4 w-4 text-secondary" />
          <span>Members: {group.members}</span>
        </div>
        <div className="flex items-center text-sm font-semibold">
          <DollarSign className="mr-2 h-4 w-4 text-green-600" />
          <span>Current Pool: ${group.currentPool.toFixed(2)} USD</span>
        </div>
        {group.activeLoanAmount && group.activeLoanAmount > 0 && (
          <div className="flex items-center text-sm text-orange-600">
            <Landmark className="mr-2 h-4 w-4" />
            <span>Active Loans: ${group.activeLoanAmount.toFixed(2)} USD</span>
          </div>
        )}
        {group.targetPool && (
          <div>
            <div className="flex justify-between text-xs text-muted-foreground mb-1">
              <span>Progress</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-2" />
            <p className="text-xs text-muted-foreground mt-1">Target: ${group.targetPool.toFixed(2)} USD</p>
          </div>
        )}
        {group.upcomingNeeds && (
          <p className="text-xs text-muted-foreground italic">Upcoming needs: {group.upcomingNeeds}</p>
        )}
      </CardContent>
      <CardFooter className="grid grid-cols-2 gap-2 pt-4">
        <Button variant="outline" size="sm" className="w-full">
          View Details <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
        <Button size="sm" onClick={handleTrackContributionClick} className="bg-secondary hover:bg-secondary/90 text-primary-foreground w-full">
          Track Contribution
        </Button>
        <Button
            variant="outline"
            size="sm"
            onClick={handleGetAiSummary}
            disabled={isLoadingSummary}
            className="w-full border-accent text-accent hover:bg-accent hover:text-accent-foreground"
        >
            {isLoadingSummary ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
                <Lightbulb className="mr-2 h-4 w-4" />
            )}
            AI Summary
        </Button>
        <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setIsLoanRequestDialogOpen(true)}
            className="w-full border-primary text-primary hover:bg-primary/10"
            disabled={group.currentPool <= 0} // Disable if pool is empty
        >
            <Landmark className="mr-2 h-4 w-4" /> Request Loan
        </Button>
      </CardFooter>

      {aiSummary && (
        <AlertDialog open={isSummaryDialogOpen} onOpenChange={setIsSummaryDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>AI Summary for {group.name}</AlertDialogTitle>
              <AlertDialogDescription className="whitespace-pre-wrap">
                {aiSummary}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogAction onClick={() => setIsSummaryDialogOpen(false)}>Got it!</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
      
      <LoanRequestDialog
        isOpen={isLoanRequestDialogOpen}
        onOpenChange={setIsLoanRequestDialogOpen}
        group={group}
        onConfirmLoan={handleConfirmLoanRequest}
        userWalletBalance={userWalletBalance}
      />
    </Card>
  );
}
