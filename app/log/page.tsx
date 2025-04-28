"use client";

import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { useState } from "react";
import Navbar from "../components/dashboardNav";
import { FoodLogger } from "../components/FoodLogger";

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

export default function LogPage() {
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      redirect('/login');
    },
  });

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
      
      // After successful log, redirect to dashboard
      redirect('/dashboard');
    } catch (error) {
      console.error('Error creating food log:', error);
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
            <h1 className="text-2xl md:text-3xl font-bold">Log Food</h1>
          </div>
          <div className="max-w-xl mx-auto w-full">
            <FoodLogger onLogFood={handleLogFood} />
          </div>
        </div>
      </main>
    </div>
  );
}