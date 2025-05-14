
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Users,
  MessageCircle,
  Wallet,
  Bell,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
}

const navItems: NavItem[] = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/mukando", label: "Mukando", icon: Users },
  { href: "/dashboard/chatbot", label: "Chatbot", icon: MessageCircle },
  { href: "/dashboard/wallet", label: "Wallet", icon: Wallet },
  { href: "/dashboard/notifications", label: "Alerts", icon: Bell },
];

export function BottomNavigation() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 md:hidden">
      <div className="container mx-auto grid h-16 max-w-lg grid-cols-5 items-center px-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "group flex flex-col items-center justify-center rounded-md p-2 text-sm font-medium",
                isActive
                  ? "text-primary"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              )}
            >
              <item.icon
                className={cn(
                  "h-6 w-6 shrink-0",
                  isActive ? "text-primary" : "text-muted-foreground group-hover:text-accent-foreground"
                )}
                aria-hidden="true"
              />
              <span className="mt-1 text-xs truncate">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
