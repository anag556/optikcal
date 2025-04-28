"use client";

import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { useState, useEffect } from "react";
import Navbar from "../components/dashboardNav";
import { FoodLogger } from "../components/FoodLogger";
import { FoodHistory } from "../components/FoodHistory";

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

export default function LogPage() {
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      redirect('/login');
    },
  });

  const [logs, setLogs] = useState<FoodLog[]>([]);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const response = await fetch('/api/food-logs');
        if (!response.ok) throw new Error('Failed to fetch food logs');
        const data = await response.json();
        setLogs(data);
      } catch (error) {
        console.error('Error fetching food logs:', error);
      }
    };

    if (session) {
      fetchLogs();
    }
  }, [session]);

  const handleLogFood = async (log: FoodLog) => {
    try {
      const response = await fetch('/api/food-logs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(log),
      });

      if (!response.ok) throw new Error('Failed to create food log');
      const newLog = await response.json();
      
      // Update the local logs state with the new log
      setLogs(prevLogs => [...prevLogs, newLog]);
    } catch (error) {
      console.error('Error creating food log:', error);
    }
  };

  const handleUpdateLog = async (updatedLog: FoodLog) => {
    try {
      const response = await fetch(`/api/food-logs?id=${updatedLog._id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedLog),
      });

      if (!response.ok) throw new Error('Failed to update food log');
      const updated = await response.json();
      
      // Update the local logs state with the updated log
      setLogs(prevLogs => prevLogs.map(log => log._id === updated._id ? updated : log));
    } catch (error) {
      console.error('Error updating food log:', error);
    }
  };

  if (status === "loading") {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-6">
        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl md:text-3xl font-bold">Log Meal</h1>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="max-w-xl w-full">
              <FoodLogger onLogFood={handleLogFood} />
            </div>
            <div>
              <FoodHistory logs={logs} onUpdate={handleUpdateLog} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}