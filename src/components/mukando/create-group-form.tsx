
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
import type { MukandoGroup } from "./group-card"; // Ensure type is imported

interface CreateGroupFormProps {
  onGroupCreate: (group: MukandoGroup) => void;
  setOpen: (open: boolean) => void;
}

export function CreateGroupForm({ onGroupCreate, setOpen }: CreateGroupFormProps) {
  const [groupName, setGroupName] = useState("");
  const [contributionAmount, setContributionAmount] = useState("");
  const [contributionFrequency, setContributionFrequency] = useState("weekly");
  const [description, setDescription] = useState("");
  const [upcomingNeeds, setUpcomingNeeds] = useState(""); // New state for upcoming needs
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
    const newGroup: MukandoGroup = {
      id: Date.now().toString(),
      name: groupName,
      contributionAmount: parseFloat(contributionAmount),
      contributionFrequency,
      description,
      upcomingNeeds: upcomingNeeds.trim() || "Not specified", // Add upcoming needs
      members: 1,
      currentPool: 0,
    };
    onGroupCreate(newGroup);
    toast({
      title: "Group Created!",
      description: `"${groupName}" has been successfully created.`,
    });
    setOpen(false);
    // Reset form fields
    setGroupName("");
    setContributionAmount("");
    setContributionFrequency("weekly");
    setDescription("");
    setUpcomingNeeds("");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="groupName">Group Name</Label>
        <Input
          id="groupName"
          value={groupName}
          onChange={(e) => setGroupName(e.target.value)}
          placeholder="e.g., Community Savers Club"
          required
        />
      </div>
      <div>
        <Label htmlFor="contributionAmount">Contribution Amount (USD)</Label>
        <Input
          id="contributionAmount"
          type="number"
          value={contributionAmount}
          onChange={(e) => setContributionAmount(e.target.value)}
          placeholder="e.g., 5.00"
          step="0.01"
          min="0.01"
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
      <div>
        <Label htmlFor="upcomingNeeds">Upcoming Needs (Optional)</Label>
        <Textarea
          id="upcomingNeeds"
          value={upcomingNeeds}
          onChange={(e) => setUpcomingNeeds(e.target.value)}
          placeholder="e.g., School fees, new inventory, event planning."
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
