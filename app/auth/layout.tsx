import { ModeToggle } from "@/components/ModeToggle";
import { BackgroundBeams } from "@/components/ui/beams";
import { Dumbbell } from "lucide-react";
import Link from "next/link";
import React from "react";

export default function Latout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Left side - Form */}
      <div className="relative flex items-center justify-center p-8">
        <div className="w-full max-w-md space-y-8">
          {/* Logo */}
          <Link href="/" className="flex items-center justify-center gap-2">
            <div className="flex items-center justify-center gap-2">
              <Dumbbell className="h-8 w-8 text-primary" />
              <span className="text-3xl font-bold bg-gradient-to-r from-primary via-purple-600 to-orange-500 bg-clip-text text-transparent">
                fitAI
              </span>
            </div>
          </Link>

          {/* Form Content */}
          {children}
        </div>
        <ModeToggle className="absolute top-4 left-4" />
      </div>

      {/* Right side - Image */}
      <div className="hidden lg:block relative">
        <BackgroundBeams />
      </div>
    </div>
  );
}
