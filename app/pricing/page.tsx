"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import Navbar from "../components/landingNav";
import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { CheckIcon } from "lucide-react";

export default function PricingPage() {
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

  const plans = [
    {
      name: "Premium",
      price: "₹47",
      period: "per month",
      description: "Advanced nutrition tracking with detailed macro insights",
      features: [
        "Unlimited nutrition history",
        "Detailed macro breakdown",
        "Goal setting & tracking"
      ],
      buttonText: "Get Premium",
      buttonVariant: "default",
      popular: true
    },
    {
      name: "Lifetime",
      price: "₹977",
      period: "one-time",
      description: "All premium features forever with a single payment",
      features: [
        "Lifetime access to all features",
        "Unlimited nutrition history",
        "Detailed macro breakdown",
        "Goal setting & tracking"
      ],
      buttonText: "Get Lifetime",
      buttonVariant: "outline",
      popular: false
    }
  ];

  return (
    <main className="min-h-screen flex-col">
      <Navbar />
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">OptiKcal Pricing Plans</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Choose the plan that fits your nutrition goals. All plans include our core calorie and macro tracking features.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {plans.map((plan) => (
            <div 
              key={plan.name} 
              className={`border rounded-lg p-6 flex flex-col h-full ${
                plan.popular ? 'ring-2 ring-primary shadow-lg' : ''
              }`}
            >
              {plan.popular && (
                <div className="bg-primary text-primary-foreground text-sm font-medium py-1 px-3 rounded-full self-start mb-4">
                  Most Popular
                </div>
              )}
              <h3 className="text-2xl font-bold">{plan.name}</h3>
              <div className="mt-2 mb-4">
                <span className="text-3xl font-bold">{plan.price}</span>
                <span className="text-gray-500 ml-1">{plan.period}</span>
              </div>
              <p className="text-gray-600 mb-6">{plan.description}</p>
              <div className="flex-grow">
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start">
                      <CheckIcon className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <Button 
                asChild 
                variant={plan.buttonVariant as "default" | "outline"} 
                className="w-full"
                size="lg"
              >
                <Link href="/signup">{plan.buttonText}</Link>
              </Button>
            </div>
          ))}
        </div>
        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
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