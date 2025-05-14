
"use client";

import { useState, useEffect } from "react";
import { PageHeader } from "@/components/shared/page-header";
import { PolicyCard } from "@/components/insurance/policy-card";
import { type HealthPolicy } from "@/types/insurance";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Heart, Users, ShieldCheck, Briefcase, CheckCircle, XCircle, PlusCircle, Info } from "lucide-react";
import Image from "next/image";

const availablePoliciesData: HealthPolicy[] = [
  {
    id: "basic_health_cover",
    name: "Basic Health Cover",
    premium: 200, // Updated from 500
    frequency: "monthly",
    coverageHighlights: ["GP Consultations", "Prescribed Medication (Basic)", "Emergency Ambulance"],
    icon: Heart,
    imagePlaceholder: "https://placehold.co/600x400.png",
    dataAiHint: "medical health",
    annualLimit: 25000, // Adjusted for lower premium
    details: "Essential health services for peace of mind. Covers day-to-day medical needs and basic emergencies."
  },
  {
    id: "family_vitality_plan",
    name: "Family Vitality Plan",
    premium: 750, // Updated from 1800
    frequency: "monthly",
    coverageHighlights: ["Covers 2 Adults + 2 Children", "Select Specialist Visits", "Basic Maternity Benefits (Waiting Period Applies)"],
    icon: Users,
    imagePlaceholder: "https://placehold.co/600x400.png",
    dataAiHint: "family protection",
    annualLimit: 100000, // Adjusted
    details: "Affordable cover for the whole family, ensuring access to essential healthcare when needed."
  },
  {
    id: "senior_wellness_shield",
    name: "Senior Wellness Shield",
    premium: 400, // Updated from 950
    frequency: "monthly",
    coverageHighlights: ["Chronic Condition Support", "Annual Health Check-up", "Limited Optical & Dental"],
    icon: ShieldCheck,
    imagePlaceholder: "https://placehold.co/600x400.png",
    dataAiHint: "elderly care",
    annualLimit: 60000, // Adjusted
    details: "Tailored for seniors, focusing on wellness, chronic care support, and maintaining a healthy lifestyle."
  },
   {
    id: "accident_protect_plus",
    name: "Accident Protect Plus",
    premium: 150, // Updated from 300
    frequency: "monthly",
    coverageHighlights: ["Accidental Injury Treatment (Basic)", "Hospital Cash (Limited Days)", "Partial Disability Support"],
    icon: Briefcase,
    imagePlaceholder: "https://placehold.co/600x400.png",
    dataAiHint: "safety insurance",
    annualLimit: 40000, // Adjusted
    details: "Provides financial support and medical cover in case of minor accidents, helping you recover with less worry."
  }
];

const ACTIVE_POLICY_STORAGE_KEY = "zimsave_active_health_policy";

export default function InsurancePage() {
  const [selectedPolicy, setSelectedPolicy] = useState<HealthPolicy | null>(null);
  const [activePolicy, setActivePolicy] = useState<HealthPolicy | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const storedPolicyJson = localStorage.getItem(ACTIVE_POLICY_STORAGE_KEY);
    if (storedPolicyJson) {
      try {
        const storedPolicy = JSON.parse(storedPolicyJson) as HealthPolicy;
        // Ensure the stored policy is one of the available policies
        const isValidPolicy = availablePoliciesData.find(p => p.id === storedPolicy.id);
        if (isValidPolicy) {
          // Update active policy with potentially new data from availablePoliciesData
          setActivePolicy(isValidPolicy);
        } else {
          localStorage.removeItem(ACTIVE_POLICY_STORAGE_KEY); // Clear invalid stored policy
        }
      } catch (error) {
        console.error("Failed to parse active policy from localStorage", error);
        localStorage.removeItem(ACTIVE_POLICY_STORAGE_KEY);
      }
    }
    setIsLoading(false);
  }, []);

  const handleSelectPolicy = (policy: HealthPolicy) => {
    if (activePolicy?.id === policy.id) {
      // If it's already active, deselect (or do nothing)
      setSelectedPolicy(null);
      return;
    }
    setSelectedPolicy(policy.id === selectedPolicy?.id ? null : policy);
  };

  const handleInvest = () => {
    if (!selectedPolicy) return;

    if (activePolicy?.id === selectedPolicy.id) {
      toast({ title: "Already Active", description: `You are already covered by ${selectedPolicy.name}.`, variant: "default" });
      return;
    }

    setActivePolicy(selectedPolicy);
    localStorage.setItem(ACTIVE_POLICY_STORAGE_KEY, JSON.stringify(selectedPolicy));
    toast({
      title: "Investment Successful!",
      description: `You are now covered by ${selectedPolicy.name}. First premium of ZWL ${selectedPolicy.premium.toFixed(2)} processed.`,
      className: "bg-accent text-accent-foreground",
      duration: 5000,
    });
    setSelectedPolicy(null); // Reset selection after investing
  };
  
  const handleCancelPolicy = () => {
    if (!activePolicy) return;
    const policyName = activePolicy.name;
    setActivePolicy(null);
    setSelectedPolicy(null); // Also clear selection if it was the active policy
    localStorage.removeItem(ACTIVE_POLICY_STORAGE_KEY);
    toast({
        title: "Policy Cancelled",
        description: `Your ${policyName} cover has been successfully cancelled.`,
        variant: "destructive",
        duration: 5000,
    });
  }

  if (isLoading) {
    // Basic loading state, can be replaced with skeletons
    return <div className="container mx-auto p-4"><PageHeader title="Micro-Insurance" description="Loading plans..." /> <p>Loading...</p></div>;
  }

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8">
      <PageHeader
        title="Micro-Insurance Marketplace"
        description="Secure your health and well-being with affordable micro-insurance plans."
      />

      {activePolicy ? (
        <Card className="mb-8 shadow-xl border-2 border-accent">
          <CardHeader>
            <div className="flex items-center justify-between">
                <div>
                    <CardTitle className="text-2xl text-accent flex items-center">
                        <CheckCircle className="mr-3 h-7 w-7" /> Your Active Policy
                    </CardTitle>
                    <CardDescription>You are currently covered by {activePolicy.name}.</CardDescription>
                </div>
                 <activePolicy.icon className="h-10 w-10 text-accent opacity-80" />
            </div>
          </CardHeader>
          <CardContent>
            <h3 className="text-xl font-semibold text-primary mb-1">{activePolicy.name}</h3>
            <p className="text-lg text-muted-foreground mb-2">
              Premium: <span className="font-bold text-primary">ZWL {activePolicy.premium.toFixed(2)}</span> / {activePolicy.frequency}
            </p>
            <p className="text-sm text-muted-foreground mb-1">Annual Limit: ZWL {activePolicy.annualLimit.toFixed(2)}</p>
            <p className="text-sm mb-3">{activePolicy.details}</p>
            <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                {activePolicy.coverageHighlights.map(highlight => <li key={highlight}>{highlight}</li>)}
            </ul>
          </CardContent>
          <CardFooter>
            <Button variant="destructive" onClick={handleCancelPolicy} className="w-full sm:w-auto">
              <XCircle className="mr-2 h-5 w-5" /> Cancel Active Policy
            </Button>
          </CardFooter>
        </Card>
      ) : (
        <Card className="mb-8 shadow-lg bg-muted">
          <CardHeader>
            <CardTitle className="text-xl text-primary flex items-center">
                <Info className="mr-3 h-6 w-6 text-blue-500"/> No Active Policy
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">You do not have an active health insurance policy through ZimSave+.</p>
            <p className="text-muted-foreground mt-1">Browse the available plans below and secure your peace of mind today!</p>
             <Image 
                src="https://placehold.co/600x300.png" 
                alt="Insurance promotion" 
                width={600} 
                height={300} 
                className="mt-4 rounded-lg object-cover w-full"
                data-ai-hint="health safety" 
            />
          </CardContent>
        </Card>
      )}

      {selectedPolicy && (!activePolicy || selectedPolicy.id !== activePolicy.id) && (
        <Card className="my-6 p-4 shadow-md sticky top-20 z-10 bg-background/90 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                    <h3 className="text-lg font-semibold text-primary">Ready to Invest?</h3>
                    <p className="text-sm text-muted-foreground">You've selected: <span className="font-bold">{selectedPolicy.name}</span> (ZWL {selectedPolicy.premium.toFixed(2)}/{selectedPolicy.frequency})</p>
                </div>
                <Button 
                    size="lg" 
                    onClick={handleInvest} 
                    className="bg-primary hover:bg-primary/90 text-primary-foreground w-full sm:w-auto"
                    disabled={!selectedPolicy || activePolicy?.id === selectedPolicy.id}
                >
                    <PlusCircle className="mr-2 h-5 w-5" /> Invest in {selectedPolicy.name}
                </Button>
            </div>
        </Card>
      )}
      
      <div className="mt-6">
        <h2 className="text-2xl font-semibold mb-2 text-primary">Available Insurance Plans</h2>
        <p className="text-muted-foreground mb-6">Choose a plan that best suits your needs and budget. Click on a plan to select it for investment.</p>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {availablePoliciesData.map((policy) => (
            <PolicyCard
              key={policy.id}
              policy={policy}
              isSelected={selectedPolicy?.id === policy.id}
              isActivePolicy={activePolicy?.id === policy.id}
              onSelect={handleSelectPolicy}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
