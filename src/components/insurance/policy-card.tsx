
"use client";

import Image from "next/image";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { HealthPolicy } from "@/types/insurance";
import { cn } from "@/lib/utils";
import { CheckCircle, Zap } from "lucide-react"; // Zap for "Select Plan"

interface PolicyCardProps {
  policy: HealthPolicy;
  isSelected: boolean;
  isActivePolicy: boolean;
  onSelect: (policy: HealthPolicy) => void;
}

export function PolicyCard({ policy, isSelected, isActivePolicy, onSelect }: PolicyCardProps) {
  const { name, premium, frequency, coverageHighlights, icon: Icon, imagePlaceholder, dataAiHint, annualLimit, details } = policy;

  return (
    <Card 
        className={cn(
            "shadow-lg hover:shadow-xl transition-all duration-300 flex flex-col justify-between",
            isSelected && !isActivePolicy && "border-primary ring-2 ring-primary scale-105",
            isActivePolicy && "border-accent ring-2 ring-accent"
        )}
    >
      <CardHeader className="relative p-0">
        {imagePlaceholder && (
            <div className="relative h-40 w-full">
                 <Image 
                    src={imagePlaceholder} 
                    alt={`${name} background`} 
                    layout="fill" 
                    objectFit="cover" 
                    className="rounded-t-lg"
                    data-ai-hint={dataAiHint} 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent rounded-t-lg" />
            </div>
        )}
        <div className={cn("p-4", imagePlaceholder && "absolute bottom-0 left-0 w-full")}>
            <div className="flex items-center justify-between">
                <CardTitle className={cn("text-xl", imagePlaceholder ? "text-white" : "text-primary")}>{name}</CardTitle>
                <Icon className={cn("h-8 w-8", imagePlaceholder ? "text-white/90" : "text-primary opacity-70")} />
            </div>
             <CardDescription className={cn(imagePlaceholder ? "text-gray-200" : "text-muted-foreground")}>
                ZWL {premium.toFixed(2)} / {frequency}
            </CardDescription>
        </div>
      </CardHeader>
      <CardContent className="flex-grow pt-2 pb-4 px-4">
        <p className="text-sm text-muted-foreground mb-1">Annual Limit: <span className="font-semibold text-card-foreground">ZWL {annualLimit.toLocaleString()}</span></p>
        <p className="text-sm text-muted-foreground mb-3 leading-relaxed">{details}</p>
        
        <h4 className="font-semibold text-sm mb-1 text-card-foreground">Key Benefits:</h4>
        <ul className="space-y-1 text-xs text-muted-foreground list-disc list-inside">
          {coverageHighlights.map((highlight, index) => (
            <li key={index}>{highlight}</li>
          ))}
        </ul>
      </CardContent>
      <CardFooter className="p-4 border-t">
        {isActivePolicy ? (
          <Button variant="outline" disabled className="w-full border-accent text-accent">
            <CheckCircle className="mr-2 h-5 w-5" /> Your Active Plan
          </Button>
        ) : isSelected ? (
          <Button variant="default" disabled className="w-full bg-primary/90">
            <CheckCircle className="mr-2 h-5 w-5" /> Selected
          </Button>
        ) : (
          <Button variant="secondary" onClick={() => onSelect(policy)} className="w-full">
            <Zap className="mr-2 h-5 w-5" /> Select Plan
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
