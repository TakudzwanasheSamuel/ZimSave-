
import type { LucideIcon } from "lucide-react";

export interface HealthPolicy {
  id: string;
  name: string;
  premium: number;
  frequency: "monthly" | "annually";
  coverageHighlights: string[];
  icon: LucideIcon;
  imagePlaceholder?: string; // URL for an image, e.g. for the card background
  dataAiHint: string; // For image placeholder if used
  annualLimit: number;
  details: string;
}
