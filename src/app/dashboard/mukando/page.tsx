
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/shared/page-header";
import { GroupCard, type MukandoGroup } from "@/components/mukando/group-card";
import { CreateGroupForm } from "@/components/mukando/create-group-form";
import { PlusCircle } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import Image from "next/image";

const initialGroups: MukandoGroup[] = [
  {
    id: "1",
    name: "Sunset Savers",
    contributionAmount: 200,
    contributionFrequency: "weekly",
    members: 12,
    currentPool: 2400,
    targetPool: 10000,
    description: "Saving for year-end bonuses.",
  },
  {
    id: "2",
    name: "Business Boosters",
    contributionAmount: 1000,
    contributionFrequency: "monthly",
    members: 8,
    currentPool: 8000,
    targetPool: 50000,
    description: "Pooling funds for small business investments.",
  },
  {
    id: "3",
    name: "Community Chest",
    contributionAmount: 50,
    contributionFrequency: "weekly",
    members: 25,
    currentPool: 1250,
    description: "General savings for community needs.",
  },
];

export default function MukandoPage() {
  const [groups, setGroups] = useState<MukandoGroup[]>(initialGroups);
  const [isCreateGroupDialogOpen, setCreateGroupDialogOpen] = useState(false);

  const handleCreateGroup = (newGroup: MukandoGroup) => {
    setGroups((prevGroups) => [newGroup, ...prevGroups]);
  };

  const handleTrackContribution = (groupId: string, amount: number) => {
    setGroups(prevGroups => 
      prevGroups.map(g => 
        g.id === groupId ? { ...g, currentPool: g.currentPool + amount } : g
      )
    );
  };

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8">
      <PageHeader
        title="Mukando Groups"
        description="Manage your group savings and contributions."
        actions={
          <Dialog open={isCreateGroupDialogOpen} onOpenChange={setCreateGroupDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-primary hover:bg-primary/90">
                <PlusCircle className="mr-2 h-5 w-5" /> Create Group
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Create New Mukando Group</DialogTitle>
              </DialogHeader>
              <CreateGroupForm onGroupCreate={handleCreateGroup} setOpen={setCreateGroupDialogOpen} />
            </DialogContent>
          </Dialog>
        }
      />

      {groups.length === 0 ? (
        <Card className="mt-6 text-center">
          <CardHeader>
            <CardTitle>No Groups Yet</CardTitle>
            <CardDescription>Start by creating your first Mukando group.</CardDescription>
          </CardHeader>
          <CardContent>
            <Image src="https://placehold.co/300x200.png" alt="No groups placeholder" width={300} height={200} className="mx-auto rounded-md mb-4" data-ai-hint="empty state illustration" />
            <Button onClick={() => setCreateGroupDialogOpen(true)}>
              <PlusCircle className="mr-2 h-5 w-5" /> Create Your First Group
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {groups.map((group) => (
            <GroupCard key={group.id} group={group} onTrackContribution={handleTrackContribution} />
          ))}
        </div>
      )}
    </div>
  );
}
