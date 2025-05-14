
"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHeader } from "@/components/shared/page-header";
import { useAuth } from "@/hooks/use-auth"; // Updated import
import { Users, MessageCircle, Wallet, Bell, ArrowRight, DollarSign, ShieldCheck } from "lucide-react";
import Image from "next/image";

export default function DashboardPage() {
  const { user } = useAuth(); // Updated hook usage

  const quickLinks = [
    { title: "My Mukando Groups", href: "/dashboard/mukando", icon: Users, description: "View and manage your savings groups.", color: "text-blue-500", image: "https://placehold.co/600x400.png", dataAiHint: "community savings"},
    { title: "AI Chatbot", href: "/dashboard/chatbot", icon: MessageCircle, description: "Chat with ZimSave+ AI for financial and health advice.", color: "text-green-500", image: "https://placehold.co/600x400.png", dataAiHint: "chat help" },
    { title: "My Wallet", href: "/dashboard/wallet", icon: Wallet, description: "Check balance and make transactions.", color: "text-yellow-500", image: "https://placehold.co/600x400.png", dataAiHint: "finance money" },
    { title: "Notifications", href: "/dashboard/notifications", icon: Bell, description: "See important updates and alerts.", color: "text-red-500", image: "https://placehold.co/600x400.png", dataAiHint: "alert message" },
  ];

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8">
      <PageHeader 
        title={user ? `Welcome, ${user.name}!` : "Dashboard"}
        description="Your central hub for managing finances and well-being."
      />

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
        <Card className="shadow-lg hover:shadow-xl transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Wallet Balance</CardTitle>
            <DollarSign className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">$1,250.75 ZWL</div>
            <p className="text-xs text-muted-foreground">
              +5.2% from last month
            </p>
          </CardContent>
        </Card>
         <Card className="shadow-lg hover:shadow-xl transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Mukando Groups</CardTitle>
            <Users className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">3</div>
            <p className="text-xs text-muted-foreground">
              1 group payout this week
            </p>
          </CardContent>
        </Card>
        <Card className="shadow-lg hover:shadow-xl transition-shadow md:col-span-2 lg:col-span-1">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Micro-Insurance</CardTitle>
            <ShieldCheck className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold text-accent">Basic Health Cover</div>
            <p className="text-xs text-muted-foreground">
              Next premium due: 15 July
            </p>
            <Button variant="outline" size="sm" className="mt-2 border-accent text-accent hover:bg-accent hover:text-accent-foreground">Manage Policy</Button>
          </CardContent>
        </Card>
      </div>
      
      <div>
        <h2 className="text-xl font-semibold mb-4 text-primary">Quick Actions</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {quickLinks.map((link) => (
            <Card key={link.title} className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
              <Link href={link.href} className="block hover:bg-card/90">
                <div className="relative h-32 w-full">
                    <Image src={link.image} alt={link.title} layout="fill" objectFit="cover" data-ai-hint={link.dataAiHint} />
                    <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                       <link.icon className={`h-12 w-12 ${link.color} opacity-80`} />
                    </div>
                </div>
                <CardHeader>
                  <CardTitle className="text-lg">{link.title}</CardTitle>
                  <CardDescription>{link.description}</CardDescription>
                </CardHeader>
                <CardContent>
                    <Button variant="link" className="p-0 text-secondary">
                        Go to {link.label || link.title.split(' ')[1] || link.title} <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                </CardContent>
              </Link>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
