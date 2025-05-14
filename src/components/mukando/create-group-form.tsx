
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

interface CreateGroupFormProps {
  onGroupCreate: (group: any) => void; // Replace 'any' with a proper group type
  setOpen: (open: boolean) => void;
}

export function CreateGroupForm({ onGroupCreate, setOpen }: CreateGroupFormProps) {
  const [groupName, setGroupName] = useState("");
  const [contributionAmount, setContributionAmount] = useState("");
  const [contributionFrequency, setContributionFrequency] = useState("weekly");
  const [description, setDescription] = useState("");
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!groupName || !contributionAmount) {
      toast({
        title: "Missing Information",
        description: "Please fill in group name and contribution amount.",
        variant: "destructive",
      });
      return;
    }
    const newGroup = {
      id: Date.now().toString(), // Simulated ID
      name: groupName,
      contributionAmount: parseFloat(contributionAmount),
      contributionFrequency,
      description,
      members: 1, // Admin is the first member
      currentPool: 0,
    };
    onGroupCreate(newGroup);
    toast({
      title: "Group Created!",
      description: `"${groupName}" has been successfully created.`,
    });
    setOpen(false); // Close dialog
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="groupName">Group Name</Label>
        <Input
          id="groupName"
          value={groupName}
          onChange={(e) => setGroupName(e.target.value)}
          placeholder="e.g., Harare Savings Club"
          required
        />
      </div>
      <div>
        <Label htmlFor="contributionAmount">Contribution Amount (ZWL)</Label>
        <Input
          id="contributionAmount"
          type="number"
          value={contributionAmount}
          onChange={(e) => setContributionAmount(e.target.value)}
          placeholder="e.g., 500"
          required
        />
      </div>
      <div>
        <Label htmlFor="contributionFrequency">Contribution Frequency</Label>
        <Select value={contributionFrequency} onValueChange={setContributionFrequency}>
          <SelectTrigger id="contributionFrequency">
            <SelectValue placeholder="Select frequency" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="weekly">Weekly</SelectItem>
            <SelectItem value="bi-weekly">Bi-Weekly</SelectItem>
            <SelectItem value="monthly">Monthly</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label htmlFor="description">Description (Optional)</Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="A brief description of the group's purpose."
        />
      </div>
      <div className="flex justify-end space-x-2 pt-2">
        <Button type="button" variant="outline" onClick={() => setOpen(false)}>
          Cancel
        </Button>
        <Button type="submit" className="bg-primary hover:bg-primary/90">Create Group</Button>
      </div>
    </form>
  );
}
