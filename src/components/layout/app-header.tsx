
"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { Briefcase, LogOut } from "lucide-react";
import { SidebarTrigger } from "@/components/ui/sidebar"; // Import SidebarTrigger

export function AppHeader() {
  const { user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"> {/* z-index adjusted for sidebar */}
      <div className="container flex h-16 items-center justify-between px-4">
        <div className="flex items-center">
          {/* SidebarTrigger for mobile and collapsible desktop */}
          <SidebarTrigger className="mr-2 md:hidden" /> 
          {/* Logo for desktop, hidden when sidebar trigger takes its place or sidebar is full */}
          <div className="hidden md:flex items-center group-data-[sidebar-state=expanded]:hidden">
            <Briefcase className="h-7 w-7 text-primary mr-2" />
            <span className="text-xl font-bold text-primary">ZimSave+</span>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          {/* User avatar and logout are now managed by SidebarFooter in dashboard layout for a cleaner header */}
          {/* If needed, they can be conditionally rendered here too for non-sidebar pages */}
        </div>
      </div>
    </header>
  );
}
