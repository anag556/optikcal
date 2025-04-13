import Link from "next/link";
import { Button } from "@/components/ui/button";
import Navbar from "./components/landingNav";

export default function Home() {
  return (
    <main className="min-h-screen flex-col items-center justify-center">
      <Navbar />
      <div className="max-w-3xl text-center pt-25 p-4">
        <h1 className="text-4xl font-bold mb-6">Weight Tracker</h1>
        <p className="text-lg mb-8">
          Track your weight, set goals, and achieve your fitness targets
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
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