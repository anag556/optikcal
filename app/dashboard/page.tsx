"use client";

import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import Navbar from "../components/dashboardNav";
import DailyProgress from "../components/DailyProgress";
import { FoodHistory } from "../components/FoodHistory";
import Link from "next/link";

interface FoodLog {
  _id?: string;
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

  const fetchFoodLogs = useCallback(async () => {
    try {
      const logsResponse = await fetch('/api/food-logs');
      if (!logsResponse.ok) throw new Error('Failed to fetch food logs');
      const logsData = await logsResponse.json();
      setFoodLogs(logsData.map((log: any) => ({
        ...log,
        date: new Date(log.date)
      })));
    } catch (error) {
      console.error('Error fetching food logs:', error);
    }
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      await fetchFoodLogs();

      try {
        const profileResponse = await fetch('/api/user/profile');
        if (!profileResponse.ok) throw new Error('Failed to fetch user profile');
        const profileData = await profileResponse.json();
        setUserProfile(profileData);
      } catch (error) {
        console.error('Error fetching user profile:', error);
      }
    };

    fetchData();
  }, [fetchFoodLogs]);

  const handleFoodLogUpdate = useCallback(async (updatedLog: FoodLog) => {
    try {
      await fetchFoodLogs(); // Refresh food logs after update
    } catch (error) {
      console.error('Error refreshing food logs:', error);
    }
  }, [fetchFoodLogs]);

  if (status === "loading") {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }

  // Calculate today's totals for macros and calories
  const today = new Date();
  const todaysLogs = foodLogs.filter(log => {
    const logDate = new Date(log.date);
    return logDate.getDate() === today.getDate() &&
           logDate.getMonth() === today.getMonth() &&
           logDate.getFullYear() === today.getFullYear();
  });

  const todaysTotals = {
    calories: todaysLogs.reduce((sum, log) => sum + log.calories, 0),
    macros: todaysLogs.reduce((sum, log) => ({
      protein: sum.protein + (log.macros?.protein || 0),
      carbs: sum.carbs + (log.macros?.carbs || 0),
      fats: sum.fats + (log.macros?.fat || 0),
      fiber: sum.fiber + (log.macros?.fiber || 0)
    }), { protein: 0, carbs: 0, fats: 0, fiber: 0 })
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-6">
        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl md:text-3xl font-bold">Dashboard</h1>
            <Button asChild>
              <Link href="/log">Log Meal</Link>
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

          <FoodHistory logs={foodLogs} onUpdate={handleFoodLogUpdate} />
        </div>
      </main>
    </div>
  );
}