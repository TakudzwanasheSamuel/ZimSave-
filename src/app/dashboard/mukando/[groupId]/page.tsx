
"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { Users, DollarSign, CalendarDays, Info, ArrowLeft, Hash, Edit3 } from "lucide-react";
import type { MukandoGroup } from "@/components/mukando/group-card"; // Assuming type is here
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const MUKANDO_GROUPS_STORAGE_KEY = "zimsave_mukando_groups_v1";

export default function MukandoGroupDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const groupId = params.groupId as string;

  const [group, setGroup] = useState<MukandoGroup | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!groupId) {
      setError("Group ID is missing.");
      setIsLoading(false);
      return;
    }

    try {
      const storedGroups = localStorage.getItem(MUKANDO_GROUPS_STORAGE_KEY);
      if (storedGroups) {
        const groupsArray: MukandoGroup[] = JSON.parse(storedGroups);
        const foundGroup = groupsArray.find(g => g.id === groupId);
        if (foundGroup) {
          setGroup(foundGroup);
        } else {
          setError("Mukando group not found.");
        }
      } else {
        setError("No Mukando groups found in storage.");
      }
    } catch (e) {
      console.error("Error loading group details from localStorage", e);
      setError("Failed to load group details. Please try again.");
    }
    setIsLoading(false);
  }, [groupId]);

  if (isLoading) {
    return (
      <div className="container mx-auto p-4 sm:p-6 lg:p-8">
        <PageHeader title="Loading Group Details..." />
        <Card className="shadow-lg">
          <CardHeader>
            <Skeleton className="h-8 w-3/4 mb-2" />
            <Skeleton className="h-4 w-1/2" />
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-10 w-1/3" />
          </CardContent>
          <CardFooter>
             <Skeleton className="h-10 w-24" />
          </CardFooter>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-4 sm:p-6 lg:p-8">
        <PageHeader title="Error" description="Could not load group details." />
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
        <Button onClick={() => router.back()} variant="outline" className="mt-4">
          <ArrowLeft className="mr-2 h-4 w-4" /> Go Back
        </Button>
      </div>
    );
  }

  if (!group) {
     return (
      <div className="container mx-auto p-4 sm:p-6 lg:p-8">
        <PageHeader title="Group Not Found" />
        <Card className="text-center py-8">
            <CardContent>
                <Info className="mx-auto h-12 w-12 text-muted-foreground mb-3" />
                <p className="text-muted-foreground">The Mukando group you are looking for does not exist or could not be found.</p>
                <Button asChild variant="link" className="mt-4">
                    <Link href="/dashboard/mukando">
                        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Mukando Groups
                    </Link>
                </Button>
            </CardContent>
        </Card>
      </div>
    );
  }
  
  const progress = group.targetPool ? (group.currentPool / group.targetPool) * 100 : 0;

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8">
      <PageHeader
        title={group.name}
        description={group.description || "Details for this Mukando group."}
        actions={
          <Button onClick={() => router.push('/dashboard/mukando')} variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" /> All Mukando Groups
          </Button>
        }
      />

      <Card className="shadow-xl">
        <CardHeader>
            <div className="flex items-center justify-between">
                 <CardTitle className="text-2xl text-primary">{group.name}</CardTitle>
                 {/* Placeholder for a group icon or image if available */}
            </div>
            {group.description && <CardDescription className="mt-1">{group.description}</CardDescription>}
        </CardHeader>
        <CardContent className="space-y-6">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="bg-muted/30">
                <CardHeader>
                    <CardTitle className="text-lg text-secondary flex items-center">
                        <DollarSign className="mr-2 h-5 w-5" /> Financials
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                    <p><strong>Contribution Amount:</strong> ${group.contributionAmount.toFixed(2)} USD</p>
                    <p><strong>Contribution Frequency:</strong> {group.contributionFrequency}</p>
                    <p className="font-semibold text-green-600"><strong>Current Pool:</strong> ${group.currentPool.toFixed(2)} USD</p>
                    {group.activeLoanAmount && group.activeLoanAmount > 0 && (
                        <p className="text-orange-600"><strong>Active Loans Disbursed:</strong> ${group.activeLoanAmount.toFixed(2)} USD</p>
                    )}
                </CardContent>
            </Card>

            <Card className="bg-muted/30">
                <CardHeader>
                    <CardTitle className="text-lg text-secondary flex items-center">
                        <Users className="mr-2 h-5 w-5" /> Membership & Structure
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                    <p><strong>Members:</strong> {group.members}</p>
                    {/* Add more details like member list if available in future */}
                    <p><strong>Group ID:</strong> <span className="font-mono text-xs bg-primary/10 text-primary p-1 rounded">{group.id}</span></p>
                </CardContent>
            </Card>
          </div>

          {group.targetPool && group.targetPool > 0 && (
            <div className="mt-4">
              <h3 className="text-md font-semibold mb-1 text-primary">Target Pool Progress</h3>
              <div className="flex justify-between text-sm text-muted-foreground mb-1">
                <span>Progress: ${group.currentPool.toFixed(2)} / ${group.targetPool.toFixed(2)}</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <Progress value={progress} className="h-3" />
            </div>
          )}

          {group.upcomingNeeds && (
            <div className="mt-4">
                <h3 className="text-md font-semibold mb-1 text-primary">Upcoming Needs</h3>
                <p className="text-sm text-muted-foreground p-3 bg-muted/30 rounded-md">{group.upcomingNeeds}</p>
            </div>
          )}
          
          {/* Placeholder for future actions like member list, transaction history for the group, etc. */}
          <div className="mt-6 border-t pt-6">
            <h3 className="text-md font-semibold mb-3 text-primary">Group Actions</h3>
            <div className="flex flex-wrap gap-2">
                <Button variant="outline" disabled>
                    <Edit3 className="mr-2 h-4 w-4" /> Edit Group (Soon)
                </Button>
                {/* More actions can be added here */}
            </div>
          </div>

        </CardContent>
         <CardFooter>
            <p className="text-xs text-muted-foreground">
                This information is based on the latest data stored in the app.
            </p>
        </CardFooter>
      </Card>
    </div>
  );
}

// Minimal AlertCircle for error display
function AlertCircle(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="12" />
      <line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
  );
}

