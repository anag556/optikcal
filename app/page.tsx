"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import Navbar from "./components/landingNav";
import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { SimpleFoodAnalyzer } from "./components/SimpleFoodAnalyzer";

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();

  // When session is loaded and user is authenticated, redirect to dashboard
  useEffect(() => {
    if (status === "authenticated") {
      router.push('/dashboard');
    }
  }, [status, router]);

  // While checking authentication status, show loading indicator
  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Loading...</h2>
        </div>
      </div>
    );
  }

  // If user is not authenticated, show the landing page
  return (
    <main className="min-h-screen flex-col items-center justify-center">
      <Navbar />
      <div className="max-w-5xl mx-auto text-center pt-16 p-4">
        <h1 className="text-4xl font-bold mb-6">OptiKcal</h1>
        <div className="mt-16">
          <h2 className="text-2xl font-semibold mb-6">Try Our Meal Analysis Tool</h2>
          
          <SimpleFoodAnalyzer />
        </div>
        <p className="text-lg mb-8 pt-8">
          Track your calories, set goals, and achieve your fitness targets
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <Button asChild size="lg">
            <Link href="/signup">Sign Up</Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/login">Login</Link>
          </Button>
        </div>
      </div>
    </main>
  );
}