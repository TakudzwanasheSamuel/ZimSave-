
"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth"; // Updated import
import { Briefcase, LogOut } from "lucide-react";

export function AppHeader() {
  const { user, logout } = useAuth(); // Updated hook usage

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4">
        <div className="flex items-center">
          <Briefcase className="h-7 w-7 text-primary mr-2" /> {/* Consider updating icon if needed */}
          <span className="text-xl font-bold text-primary">ZimSave+</span>
        </div>
        <div className="flex items-center space-x-3">
          {user && (
            <>
              <Avatar className="h-8 w-8">
                <AvatarImage src={`https://placehold.co/40x40.png?text=${user.name.charAt(0)}`} alt={user.name} data-ai-hint="person avatar" />
                <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <Button variant="ghost" size="icon" onClick={logout} aria-label="Logout">
                <LogOut className="h-5 w-5" />
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
