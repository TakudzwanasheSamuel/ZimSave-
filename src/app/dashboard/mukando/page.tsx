
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/shared/page-header";
import { GroupCard, type MukandoGroup } from "@/components/mukando/group-card";
import { CreateGroupForm } from "@/components/mukando/create-group-form";
import { PlusCircle } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import Image from "next/image";
import { Card, CardContent, CardDescription, CardHeader, CardTitle as ShadcnCardTitle } from "@/components/ui/card";


const initialGroups: MukandoGroup[] = [
  {
    id: "1",
    name: "Sunrise Savers", // Renamed
    contributionAmount: 5, // USD
    contributionFrequency: "weekly",
    members: 10,
    currentPool: 50, // USD
    targetPool: 200, // USD
    description: "Saving for small personal goals.",
  },
  {
    id: "2",
    name: "Micro Venture Fund", // Renamed
    contributionAmount: 10, // USD
    contributionFrequency: "monthly",
    members: 5,
    currentPool: 50, // USD
    targetPool: 250, // USD
    description: "Pooling funds for tiny business ideas.",
  },
  {
    id: "3",
    name: "Neighborly Support", // Renamed
    contributionAmount: 2, // USD
    contributionFrequency: "weekly",
    members: 15,
    currentPool: 30, // USD
    description: "Small contributions for mutual support.",
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
        description="Manage your group micro-savings and contributions."
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
            <ShadcnCardTitle>No Groups Yet</ShadcnCardTitle> {/* Explicitly use ShadcnCardTitle if needed */}
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
        <div className="grid grid-cols-1 gap-6 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
          {groups.map((group) => (
            <GroupCard key={group.id} group={group} onTrackContribution={handleTrackContribution} />
          ))}
        </div>
      )}
    </div>
  );
}
