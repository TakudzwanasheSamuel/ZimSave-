
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
  HeartHandshake, // Added for Insurance
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
}

// Re-ordered for better flow
const navItems: NavItem[] = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/mukando", label: "Mukando", icon: Users },
  { href: "/dashboard/wallet", label: "Wallet", icon: Wallet },
  { href: "/dashboard/insurance", label: "Insurance", icon: HeartHandshake }, // Added Insurance
  { href: "/dashboard/chatbot", label: "Chatbot", icon: MessageCircle },
  { href: "/dashboard/notifications", label: "Alerts", icon: Bell },
];

export function BottomNavigation() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 md:hidden">
      <div className="container mx-auto grid h-16 max-w-lg grid-cols-6 items-center px-1 sm:px-2"> {/* Adjusted to grid-cols-6 */}
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "group flex flex-col items-center justify-center rounded-md p-1.5 text-center text-sm font-medium", // Adjusted padding
                isActive
                  ? "text-primary"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              )}
            >
              <item.icon
                className={cn(
                  "h-5 w-5 shrink-0 sm:h-6 sm:w-6", // Adjusted icon size
                  isActive ? "text-primary" : "text-muted-foreground group-hover:text-accent-foreground"
                )}
                aria-hidden="true"
              />
              <span className="mt-1 text-[10px] sm:text-xs truncate">{item.label}</span> {/* Adjusted font size */}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
