
"use client";
import type { ReactNode } from "react";
import { useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AppHeader } from "@/components/layout/app-header";
import { BottomNavigation } from "@/components/layout/bottom-navigation";
import { useAuth } from "@/hooks/use-auth";
import { useRouter } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInset,
  SidebarSeparator, // This is the UI component from '@/components/ui/sidebar'
  useSidebar,
} from "@/components/ui/sidebar";
import {
  LayoutDashboard,
  Users,
  MessageCircle,
  Wallet,
  Bell,
  HeartHandshake,
  LogOut,
  Briefcase,
  Target, // Added Target icon
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
  tooltip: string;
}

const sidebarNavItems: NavItem[] = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard, tooltip: "Dashboard" },
  { href: "/dashboard/mukando", label: "Mukando Groups", icon: Users, tooltip: "Mukando Groups" },
  { href: "/dashboard/wallet", label: "My Wallet", icon: Wallet, tooltip: "My Wallet" },
  { href: "/dashboard/wallet#savings-goals", label: "Savings Goals", icon: Target, tooltip: "Savings Goals" }, // Added Savings Goals
  { href: "/dashboard/insurance", label: "Insurance", icon: HeartHandshake, tooltip: "Insurance" },
  { href: "/dashboard/chatbot", label: "AI Chatbot", icon: MessageCircle, tooltip: "AI Chatbot" },
  { href: "/dashboard/notifications", label: "Notifications", icon: Bell, tooltip: "Notifications" },
];

function UserProfileSidebarFooter() {
  const { user, logout } = useAuth();
  const { state } = useSidebar();

  if (!user) return null;

  return (
    <>
      <SidebarSeparator /> {/* This is the UI component */}
      <div className="p-2">
        <Link href="#" passHref legacyBehavior>
          <SidebarMenuButton
            variant="default"
            size="lg"
            className={cn(
              "h-auto p-2 group-data-[collapsible=icon]:p-2",
              state === "collapsed" ? "justify-center" : ""
            )}
            tooltip={{
              children: (
                <>
                  {user.name}
                  <br />
                  <span className="text-xs text-muted-foreground">{user.email || user.phone}</span>
                </>
              ),
              className: "w-auto min-w-[150px]",
              side: "right",
              align: "start",
            }}
          >
            <Avatar className="h-8 w-8">
              <AvatarImage src={`https://placehold.co/40x40.png?text=${user.name.charAt(0)}`} alt={user.name} data-ai-hint="person avatar" />
              <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className={cn("flex flex-col items-start", state === "collapsed" ? "hidden" : "ml-2")}>
              <span className="font-medium truncate max-w-[120px]">{user.name}</span>
              <span className="text-xs text-muted-foreground truncate max-w-[120px]">{user.email || user.phone}</span>
            </div>
          </SidebarMenuButton>
        </Link>
        <Button variant="ghost" onClick={logout} className={cn("w-full mt-2 justify-start p-2", state === "collapsed" ? "justify-center" : "")}
         tooltip={{ children: "Logout", side: "right", align: "center" }}
        >
          <LogOut className={cn("h-5 w-5", state === "collapsed" ? "" : "mr-2")} />
          {state === "expanded" && <span className="ml-0">Logout</span>}
        </Button>
      </div>
    </>
  );
}


export default function DashboardLayout({ children }: { children: ReactNode }) {
  const { isAuthenticated, isLoading, user } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace("/");
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading || !isAuthenticated) {
    return (
      <div className="flex flex-col min-h-screen">
        <Skeleton className="h-16 w-full" /> {/* AppHeader skeleton */}
        <div className="flex flex-1">
          <Skeleton className="hidden md:block w-12 lg:w-64 h-full" /> {/* Sidebar skeleton */}
          <div className="flex-grow container mx-auto p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Skeleton className="h-40 w-full rounded-lg" />
            <Skeleton className="h-40 w-full rounded-lg" />
            <Skeleton className="h-40 w-full rounded-lg md:col-span-2 lg:col-span-1" />
            <Skeleton className="h-64 w-full rounded-lg col-span-1 md:col-span-2 lg:col-span-3" />
          </div>
        </div>
        <Skeleton className="h-16 w-full md:hidden" /> {/* Bottom nav placeholder */}
      </div>
    );
  }

  return (
    <SidebarProvider>
      <Sidebar collapsible="icon" className="border-r">
        <SidebarHeader className="p-2 border-b">
          <Link href="/dashboard" className="flex items-center gap-2 p-2 hover:bg-sidebar-accent rounded-md group-data-[collapsible=icon]:justify-center">
            <Briefcase className="h-7 w-7 text-primary shrink-0" />
            <span className="text-xl font-bold text-primary group-data-[collapsible=icon]:hidden">ZimSave+</span>
          </Link>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            {sidebarNavItems.map((item) => (
              <SidebarMenuItem key={item.href}>
                <Link href={item.href} passHref legacyBehavior>
                  <SidebarMenuButton
                    isActive={pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href.split('#')[0]))} // Adjust isActive for hash links
                    tooltip={{ children: item.tooltip, side: "right", align: "center" }}
                  >
                    <item.icon className="shrink-0" />
                    {item.label}
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter>
          <UserProfileSidebarFooter />
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <AppHeader />
        <main className="flex-1 pb-16 md:pb-0 bg-background"> {/* Padding for bottom nav on mobile */}
          {children}
        </main>
      </SidebarInset>
      <BottomNavigation />
    </SidebarProvider>
  );
}
