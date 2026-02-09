"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Dumbbell, Loader2 } from "lucide-react";
import { getSession } from "@/lib/auth";
import { UserMenu } from "@/components/user-menu";
import { ModeToggle } from "@/components/ModeToggle";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadUser() {
      const currentUser = await getSession();
      if (!currentUser) {
        window.location.href = "/auth/signin";
        return;
      }

      // Check if profile is completed
      const profileResponse = await fetch("/api/profile/get");
      const profileResult = await profileResponse.json();

      if (
        !profileResult.success &&
        window.location.pathname !== "/complete-profile"
      ) {
        // Profile not completed, redirect to complete-profile
        window.location.href = "/complete-profile";
        return;
      }

      setUser(currentUser);
      setLoading(false);
    }

    loadUser();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Fixed Navigation */}
      <nav className="fixed top-0 left-0 right-0 border-b bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60 z-50 shadow-sm">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="relative">
              <Dumbbell className="h-6 w-6 text-primary" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-primary via-purple-600 to-orange-500 bg-clip-text text-transparent">
              Healthify
            </span>
          </Link>
          <div className="flex items-center gap-2">
            <ModeToggle />
            <UserMenu user={user} />
          </div>
        </div>
      </nav>

      {/* Main Content with padding for fixed nav */}
      <main className="pt-16">{children}</main>
    </div>
  );
}
