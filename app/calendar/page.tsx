"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import Navbar from "@/app/components/dashboardNav";
import { FoodHistory } from "@/app/components/FoodHistory";

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

export default function CalendarPage() {
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      redirect('/login');
    },
  });

  const [foodLogs, setFoodLogs] = useState<FoodLog[]>([]);

  useEffect(() => {
    const fetchFoodLogs = async () => {
      try {
        const response = await fetch('/api/food-logs');
        if (!response.ok) throw new Error('Failed to fetch food logs');
        const logsData = await response.json();
        setFoodLogs(logsData.map((log: any) => ({
          ...log,
          date: new Date(log.date)
        })));
      } catch (error) {
        console.error('Error fetching food logs:', error);
      }
    };

    fetchFoodLogs();
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-6">
        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl md:text-3xl font-bold">My Log</h1>
          </div>
          <FoodHistory logs={foodLogs} />
        </div>
      </main>
    </div>
  );
}