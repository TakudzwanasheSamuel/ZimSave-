
export interface Transaction {
  id: string;
  type: "deposit" | "withdrawal" | "transfer_in" | "transfer_out" | "mukando" | "goal_contribution" | "purchase" | "fee";
  amount: number;
  description: string;
  date: string; // ISO string
  status: "completed" | "pending" | "failed";
  goalId?: string; // Optional: to link transaction to a specific goal
}

export interface SavingsGoal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  createdAt: string; // ISO string
  emoji?: string; // Optional: for visual flair
}
