
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
    premium: 2.00, // Micro premium
    frequency: "monthly",
    coverageHighlights: ["Tele-Doctor Consultations", "Basic Prescribed Medication", "Emergency Hotline Access"],
    icon: Heart,
    imagePlaceholder: "https://placehold.co/600x400.png",
    dataAiHint: "medical health",
    annualLimit: 250, // Micro annual limit
    details: "Essential remote health services for peace of mind. Covers basic tele-medical needs."
  },
  {
    id: "family_vitality_plan",
    name: "Family Vitality Plan",
    premium: 7.50, // Micro premium
    frequency: "monthly",
    coverageHighlights: ["Covers 1 Adult + 1 Child (Tele-Doctor)", "Select Wellness Tips", "Basic Virtual Consults"],
    icon: Users,
    imagePlaceholder: "https://placehold.co/600x400.png",
    dataAiHint: "family protection",
    annualLimit: 750, // Micro annual limit
    details: "Affordable virtual cover for a small family, ensuring access to basic remote healthcare."
  },
  {
    id: "senior_wellness_shield",
    name: "Senior Wellness Shield",
    premium: 4.00, // Micro premium
    frequency: "monthly",
    coverageHighlights: ["Chronic Condition Info Line", "Annual Wellness Call", "Limited Health Reminders"],
    icon: ShieldCheck,
    imagePlaceholder: "https://placehold.co/600x400.png",
    dataAiHint: "elderly care",
    annualLimit: 400, // Micro annual limit
    details: "Tailored for seniors, focusing on virtual wellness support and health information."
  },
   {
    id: "accident_protect_lite", // Renamed for "micro"
    name: "Accident Protect Lite",
    premium: 1.50, // Micro premium
    frequency: "monthly",
    coverageHighlights: ["Minor Accidental Injury Info", "First Aid Guidance Call", "Small Emergency Fund Access (conditions apply)"],
    icon: Briefcase,
    imagePlaceholder: "https://placehold.co/600x400.png",
    dataAiHint: "safety insurance",
    annualLimit: 150, // Micro annual limit
    details: "Provides basic information and support for minor accidents, helping with initial guidance."
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
        const isValidPolicy = availablePoliciesData.find(p => p.id === storedPolicy.id);
        if (isValidPolicy) {
          setActivePolicy(isValidPolicy);
        } else {
          localStorage.removeItem(ACTIVE_POLICY_STORAGE_KEY);
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
      description: `You are now covered by ${selectedPolicy.name}. First premium of $${selectedPolicy.premium.toFixed(2)} USD processed.`,
      className: "bg-accent text-accent-foreground",
      duration: 5000,
    });
    setSelectedPolicy(null); 
  };
  
  const handleCancelPolicy = () => {
    if (!activePolicy) return;
    const policyName = activePolicy.name;
    setActivePolicy(null);
    setSelectedPolicy(null); 
    localStorage.removeItem(ACTIVE_POLICY_STORAGE_KEY);
    toast({
        title: "Policy Cancelled",
        description: `Your ${policyName} cover has been successfully cancelled.`,
        variant: "destructive",
        duration: 5000,
    });
  }

  if (isLoading) {
    return <div className="container mx-auto p-4"><PageHeader title="Micro-Insurance" description="Loading plans..." /> <p>Loading...</p></div>;
  }

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8">
      <PageHeader
        title="Micro-Insurance Marketplace"
        description="Secure your well-being with affordable micro-insurance plans."
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
              Premium: <span className="font-bold text-primary">${activePolicy.premium.toFixed(2)} USD</span> / {activePolicy.frequency}
            </p>
            <p className="text-sm text-muted-foreground mb-1">Annual Limit: ${activePolicy.annualLimit.toFixed(2)} USD</p>
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
                    <p className="text-sm text-muted-foreground">You've selected: <span className="font-bold">{selectedPolicy.name}</span> (${selectedPolicy.premium.toFixed(2)} USD/{selectedPolicy.frequency})</p>
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
