
"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/shared/page-header";
import { GroupCard, type MukandoGroup } from "@/components/mukando/group-card";
import { CreateGroupForm } from "@/components/mukando/create-group-form";
import { PlusCircle } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import Image from "next/image";
import { Card, CardContent, CardDescription, CardHeader, CardTitle as ShadcnCardTitle } from "@/components/ui/card";
import type { Transaction } from "@/types/wallet";
import { useToast } from "@/hooks/use-toast";

const MUKANDO_GROUPS_STORAGE_KEY = "zimsave_mukando_groups_v1";
const WALLET_STATE_KEY = "zimsave_wallet_state_v1";

interface WalletState {
  balance: number;
  transactions: Transaction[];
}

const initialGroups: MukandoGroup[] = [
  {
    id: "1",
    name: "Sunrise Savers",
    contributionAmount: 5,
    contributionFrequency: "weekly",
    members: 10,
    currentPool: 50,
    targetPool: 200,
    description: "Saving for small personal goals.",
    upcomingNeeds: "School fees for next term.",
    activeLoanAmount: 0,
  },
  {
    id: "2",
    name: "Micro Venture Fund",
    contributionAmount: 10,
    contributionFrequency: "monthly",
    members: 5,
    currentPool: 50,
    targetPool: 250,
    description: "Pooling funds for tiny business ideas.",
    upcomingNeeds: "Purchase of new inventory.",
    activeLoanAmount: 0,
  },
  {
    id: "3",
    name: "Neighborly Support",
    contributionAmount: 2,
    contributionFrequency: "weekly",
    members: 15,
    currentPool: 30,
    description: "Small contributions for mutual support.",
    upcomingNeeds: "Community hall repairs.",
    activeLoanAmount: 0,
  },
];

export default function MukandoPage() {
  const [groups, setGroups] = useState<MukandoGroup[]>([]);
  const [isCreateGroupDialogOpen, setCreateGroupDialogOpen] = useState(false);
  const [userWalletBalance, setUserWalletBalance] = useState(0);
  const { toast } = useToast();

  useEffect(() => {
    const storedGroupsRaw = localStorage.getItem(MUKANDO_GROUPS_STORAGE_KEY);
    let userHasExistingGroups = false;

    if (storedGroupsRaw) {
      try {
        const parsedGroups = JSON.parse(storedGroupsRaw);
        if (Array.isArray(parsedGroups) && parsedGroups.length > 0) {
          setGroups(parsedGroups);
          userHasExistingGroups = true;
        }
        // If parsedGroups is an empty array, userHasExistingGroups remains false,
        // and it will fall through to set initialGroups.
      } catch (e) {
        console.error("Error parsing Mukando groups from localStorage, falling back to initial groups", e);
        // Fall through to set initialGroups if parsing fails
      }
    }

    if (!userHasExistingGroups) {
      setGroups(initialGroups);
      // Persist initialGroups if no valid user groups were found in localStorage,
      // or if localStorage was empty/invalid or contained an empty array.
      // This ensures the "default" groups are shown and saved for the next load.
      localStorage.setItem(MUKANDO_GROUPS_STORAGE_KEY, JSON.stringify(initialGroups));
    }

    // Load wallet balance (existing logic)
    const storedWalletState = localStorage.getItem(WALLET_STATE_KEY);
    if (storedWalletState) {
      try {
        const walletData: WalletState = JSON.parse(storedWalletState);
        setUserWalletBalance(walletData.balance);
      } catch (e) {
        console.error("Error parsing wallet state for balance", e);
      }
    }
  }, []); // Empty dependency array, runs once on mount

  // Save groups to localStorage whenever they change
  useEffect(() => {
    // This condition aims to avoid overwriting localStorage with an empty `groups` array
    // during the initial render cycle before the loading useEffect has populated `groups`.
    // After the first load, `groups` will either be user's groups or `initialGroups`.
    // So, any subsequent changes (add, delete, update group) will be saved.
    // If groups becomes an empty array due to user action (e.g., deleting all groups),
    // that empty array will be saved. On next load, the first useEffect will then
    // re-populate with initialGroups.
    if (groups.length > 0 || localStorage.getItem(MUKANDO_GROUPS_STORAGE_KEY)) {
      localStorage.setItem(MUKANDO_GROUPS_STORAGE_KEY, JSON.stringify(groups));
    }
  }, [groups]);


  const handleCreateGroup = (newGroupData: Omit<MukandoGroup, 'id' | 'members' | 'currentPool' | 'activeLoanAmount'>) => {
     const newGroupWithDefaults: MukandoGroup = {
      ...newGroupData,
      id: Date.now().toString(),
      members: 1, // Creator is the first member
      currentPool: 0,
      activeLoanAmount: 0,
    };
    setGroups((prevGroups) => [newGroupWithDefaults, ...prevGroups]);
  };

  const handleTrackContribution = (groupId: string, amount: number) => {
    setGroups(prevGroups =>
      prevGroups.map(g =>
        g.id === groupId ? { ...g, currentPool: g.currentPool + amount } : g
      )
    );
  };

  const handleRequestLoan = (groupId: string, loanAmount: number) => {
    let groupNameForToast = "";
    setGroups(prevGroups =>
      prevGroups.map(g => {
        if (g.id === groupId) {
          groupNameForToast = g.name;
          return { 
            ...g, 
            currentPool: g.currentPool - loanAmount,
            activeLoanAmount: (g.activeLoanAmount || 0) + loanAmount 
          };
        }
        return g;
      })
    );

    const storedWalletState = localStorage.getItem(WALLET_STATE_KEY);
    let currentWallet: WalletState = { balance: 0, transactions: [] };
    if (storedWalletState) {
      try {
        currentWallet = JSON.parse(storedWalletState);
      } catch (e) {
        console.error("Error parsing wallet state for loan disbursal", e);
        toast({ title: "Wallet Error", description: "Could not update wallet due to an error.", variant: "destructive" });
        return;
      }
    }
    
    const newBalance = currentWallet.balance + loanAmount;
    const newTransaction: Transaction = {
      id: Date.now().toString(),
      type: "loan_received",
      amount: loanAmount,
      description: `Loan received from "${groupNameForToast || 'Mukando Group'}"`,
      date: new Date().toISOString(),
      status: "completed",
    };

    const updatedWalletState: WalletState = {
      balance: newBalance,
      transactions: [newTransaction, ...currentWallet.transactions],
    };
    localStorage.setItem(WALLET_STATE_KEY, JSON.stringify(updatedWalletState));
    setUserWalletBalance(newBalance);

    toast({
        title: "Loan Disbursed",
        description: `$${loanAmount.toFixed(2)} USD from "${groupNameForToast}" added to your wallet. Group pool updated.`,
        className: "bg-accent text-accent-foreground",
    });
  };


  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8">
      <PageHeader
        title="Mukando Groups"
        description="Manage your group micro-savings and contributions. Borrow from your group pool."
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
            <ShadcnCardTitle>No Groups Yet</ShadcnCardTitle> 
            <CardDescription>Start by creating your first Mukando group or refresh if you expected default groups.</CardDescription>
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
            <GroupCard 
              key={group.id} 
              group={group} 
              onTrackContribution={handleTrackContribution}
              onRequestLoan={handleRequestLoan}
              userWalletBalance={userWalletBalance}
            />
          ))}
        </div>
      )}
    </div>
  );
}

