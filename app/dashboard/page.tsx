"use client";

import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import Navbar from "../components/dashboardNav";
import DailyProgress from "../components/DailyProgress";
import Link from "next/link";

interface FoodLog {
  date: Date;
  calories: number;
  description: string;
  macros: {
    protein: number;
    carbs: number;
    fat: number;
    fiber: number;
  };
}

interface UserProfile {
  dailyCalorieTarget: number;
  macronutrients: {
    protein: number;
    carbs: number;
    fats: number;
    fiber: number;
  };
}

export default function Dashboard() {
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      redirect('/login');
    },
  });

  const [foodLogs, setFoodLogs] = useState<FoodLog[]>([]);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch food logs
        const logsResponse = await fetch('/api/food-logs');
        if (!logsResponse.ok) throw new Error('Failed to fetch food logs');
        const logsData = await logsResponse.json();
        setFoodLogs(logsData.map((log: any) => ({
          ...log,
          date: new Date(log.date)
        })));

        // Fetch user profile
        const profileResponse = await fetch('/api/user/profile');
        if (!profileResponse.ok) throw new Error('Failed to fetch user profile');
        const profileData = await profileResponse.json();
        setUserProfile(profileData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  if (status === "loading") {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }

  // Calculate today's totals
  const today = new Date();
  const todaysLogs = foodLogs.filter(log => 
    log.date.toDateString() === today.toDateString()
  );

  const todaysTotals = todaysLogs.reduce((acc, log) => ({
    calories: acc.calories + log.calories,
    macros: {
      protein: acc.macros.protein + log.macros.protein,
      carbs: acc.macros.carbs + log.macros.carbs,
      fats: acc.macros.fats + log.macros.fat,
      fiber: acc.macros.fiber + log.macros.fiber
    }
  }), {
    calories: 0,
    macros: { protein: 0, carbs: 0, fats: 0, fiber: 0 }
  });

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-6">
        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl md:text-3xl font-bold">Dashboard</h1>
            <Button asChild>
              <Link href="/log">Log Food</Link>
            </Button>
          </div>

          {userProfile && (
            <DailyProgress
              dailyCalorieTarget={userProfile.dailyCalorieTarget}
              currentCalories={todaysTotals.calories}
              macroTargets={userProfile.macronutrients}
              currentMacros={todaysTotals.macros}
            />
          )}
        </div>
      </main>
    </div>
  );
}