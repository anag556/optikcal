"use client";

import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Navbar from "../components/dashboardNav";

export default function Dashboard() {
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      redirect("/login");
    },
  });

  if (status === "loading") {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }

  return (
    <main className="min-h-screen flex-col">
    <Navbar />
      <div className="flex justify-between items-center mb-8 p-6">
        <h1 className="text-3xl font-bold">Dashboard</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Welcome, {session?.user?.name}</CardTitle>
        </CardHeader>
        <CardContent>
          <p>This is your weight tracker dashboard. Your progress will be displayed here.</p>
        </CardContent>
      </Card>
    </main>
  );
}