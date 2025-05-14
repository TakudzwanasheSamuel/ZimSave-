
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Users, DollarSign, CalendarDays, ArrowRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export interface MukandoGroup {
  id: string;
  name: string;
  contributionAmount: number;
  contributionFrequency: string;
  members: number;
  currentPool: number;
  targetPool?: number; 
  description?: string;
}

interface GroupCardProps {
  group: MukandoGroup;
  onTrackContribution: (groupId: string, amount: number) => void;
}

export function GroupCard({ group, onTrackContribution }: GroupCardProps) {
  const { toast } = useToast();
  const progress = group.targetPool ? (group.currentPool / group.targetPool) * 100 : 0;

  const handleTrackContribution = () => {
    onTrackContribution(group.id, group.contributionAmount);
    toast({
      title: "Contribution Tracked",
      description: `Contribution of $${group.contributionAmount.toFixed(2)} USD for "${group.name}" recorded.`,
      className: "bg-accent text-accent-foreground"
    });
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
      </CardContent>
      <CardFooter className="flex justify-end space-x-2">
        <Button variant="outline" size="sm">
          View Details <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
        <Button size="sm" onClick={handleTrackContribution} className="bg-secondary hover:bg-secondary/90 text-primary-foreground">
          Track Contribution
        </Button>
      </CardFooter>
    </Card>
  );
}
