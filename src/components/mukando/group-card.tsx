
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Users, DollarSign, CalendarDays, ArrowRight, Lightbulb, Loader2 } from "lucide-react";
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
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export interface MukandoGroup {
  id: string;
  name: string;
  contributionAmount: number;
  contributionFrequency: string;
  members: number;
  currentPool: number;
  targetPool?: number;
  description?: string;
  upcomingNeeds?: string; // Added for AI summary
}

interface GroupCardProps {
  group: MukandoGroup;
  onTrackContribution: (groupId: string, amount: number) => void;
}

export function GroupCard({ group, onTrackContribution }: GroupCardProps) {
  const { toast } = useToast();
  const [isLoadingSummary, setIsLoadingSummary] = useState(false);
  const [aiSummary, setAiSummary] = useState<string | null>(null);
  const [isSummaryDialogOpn, setIsSummaryDialogOpen] = useState(false);

  const progress = group.targetPool ? (group.currentPool / group.targetPool) * 100 : 0;

  const handleTrackContribution = () => {
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
      <CardFooter className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-2">
        <Button variant="outline" size="sm" className="w-full sm:w-auto">
          View Details <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
        <Button size="sm" onClick={handleTrackContribution} className="bg-secondary hover:bg-secondary/90 text-primary-foreground w-full sm:w-auto">
          Track Contribution
        </Button>
        <Button
            variant="outline"
            size="sm"
            onClick={handleGetAiSummary}
            disabled={isLoadingSummary}
            className="w-full sm:w-auto border-accent text-accent hover:bg-accent hover:text-accent-foreground"
        >
            {isLoadingSummary ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
                <Lightbulb className="mr-2 h-4 w-4" />
            )}
            AI Summary
        </Button>
      </CardFooter>

      {aiSummary && (
        <AlertDialog open={isSummaryDialogOpn} onOpenChange={setIsSummaryDialogOpen}>
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
    </Card>
  );
}
