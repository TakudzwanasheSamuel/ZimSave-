
"use client";
import type { ReactNode } from "react";
import { useEffect } from "react";
import { AppHeader } from "@/components/layout/app-header";
import { BottomNavigation } from "@/components/layout/bottom-navigation";
import { useAuth } from "@/hooks/use-auth"; // Updated import
import { useRouter } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth(); // Updated hook usage
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace("/");
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading || !isAuthenticated) {
    return (
      <div className="flex flex-col min-h-screen">
        <Skeleton className="h-16 w-full" />
        <div className="flex-grow container mx-auto p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Skeleton className="h-40 w-full rounded-lg" />
          <Skeleton className="h-40 w-full rounded-lg" />
          <Skeleton className="h-40 w-full rounded-lg md:col-span-2 lg:col-span-1" />
          <Skeleton className="h-64 w-full rounded-lg col-span-1 md:col-span-2 lg:col-span-3" />
        </div>
        <Skeleton className="h-16 w-full md:hidden" /> {/* Bottom nav placeholder */}
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      <AppHeader />
      <main className="flex-1 pb-16 md:pb-0"> {/* Padding for bottom nav on mobile */}
        {children}
      </main>
      <BottomNavigation />
    </div>
  );
}
