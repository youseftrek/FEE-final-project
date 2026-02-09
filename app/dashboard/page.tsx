"use client";

import { useEffect, useState } from "react";
import { getSession } from "@/lib/auth";
import { WorkoutPlan } from "@/components/workout-plan";

export default function DashboardPage() {
  const [userName, setUserName] = useState<string>("");

  useEffect(() => {
    async function loadUser() {
      const currentUser = await getSession();
      if (currentUser) {
        setUserName(currentUser.name);
      }
    }
    loadUser();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Welcome Section */}
        <div>
          <h1 className="text-3xl font-bold">
            Welcome back{userName && `, ${userName}`}!
          </h1>
          <p className="text-muted-foreground mt-1">
            Ready for your personalized workout?
          </p>
        </div>

        {/* Workout Plan Component */}
        <WorkoutPlan />
      </div>
    </div>
  );
}
