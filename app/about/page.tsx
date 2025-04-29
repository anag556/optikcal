"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import Navbar from "../components/landingNav";
import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { ShieldCheck, Heart, TrendingUp, Users } from "lucide-react";

export default function AboutPage() {
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

  const features = [
    {
      icon: <TrendingUp className="h-10 w-10 text-primary" />,
      title: "Data-Driven Nutrition Insights",
      description: "Our advanced analytics provide clear visualizations of your caloric intake and macronutrient balance, helping you understand your nutrition patterns over time."
    },
    {
      icon: <Heart className="h-10 w-10 text-red-500" />,
      title: "Balanced Nutrition Approach",
      description: "We prioritize balanced nutrition and sustainable dietary changes over restrictive diets or extreme methods, focusing on proper macro distribution."
    },
    {
      icon: <ShieldCheck className="h-10 w-10 text-blue-500" />,
      title: "Privacy Protected",
      description: "Your nutrition data is sensitive. We use industry-leading encryption and never share your personal information with third parties."
    },
  ];

 /* const team = [
    {
      name: "Alex Morgan",
      role: "Founder & CEO",
      bio: "Certified nutritionist with 15+ years of experience helping clients achieve their macro and fitness goals."
    },
    {
      name: "Dr. Sarah Chen",
      role: "Nutrition Expert",
      bio: "PhD in Nutritional Sciences with research focus on macronutrient optimization and metabolic health."
    },
    {
      name: "Marcus Johnson",
      role: "Head of Development",
      bio: "Software engineer passionate about creating intuitive nutrition tech solutions."
    }
  ]; */

  return (
    <main className="min-h-screen flex-col">
      <Navbar />
      
      {/* Hero Section */}
      <div className="bg-gradient-to-b from-gray-50 to-white py-16">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h1 className="text-4xl font-bold mb-6">About OptiKcal</h1>
          <p className="text-lg text-gray-600 mb-8">
            We're on a mission to help people achieve their nutrition and fitness goals through simple, 
            effective calorie and macro tracking with personalized insights.
          </p>
        </div>
      </div>
      
      {/* Our Story */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-6 text-center">Our Story</h2>
          <div className="space-y-6 text-lg">
            <p>
              OptiKcal was born out of a simple observation: tracking calories and macronutrients consistently 
              is one of the most effective ways to achieve nutrition goals, but existing tools were 
              either too complicated or didn't provide meaningful insights.
            </p>
            <p>
              Founded in 2025, we started with a vision to create a simple nutrition tracking tool that anyone could use, 
              regardless of their dietary preferences or tech-savviness. What began as a personal project 
              quickly grew as more people discovered how our straightforward approach to macro tracking helped them stay 
              accountable and motivated.
            </p>
            <p>
              Today, OptiKcal helps thousands of users across India monitor their nutrition, 
              set realistic macro goals, and make informed decisions about their dietary journey.
            </p>
          </div>
        </div>
      </section>
      
      {/* Features */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold mb-12 text-center">What Sets Us Apart</h2>
          <div className="grid md:grid-cols-2 gap-12">
            {features.map((feature, index) => (
              <div key={index} className="flex gap-4">
                <div className="flex-shrink-0">
                  {feature.icon}
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      
     {/* Team */}
    {/* <section className="py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold mb-12 text-center">Meet Our Team</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <div key={index} className="text-center">
                <div className="w-32 h-32 bg-gray-200 rounded-full mx-auto mb-4"></div>
                <h3 className="text-xl font-semibold mb-1">{member.name}</h3>
                <p className="text-primary font-medium mb-3">{member.role}</p>
                <p className="text-gray-600">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section> */}
      
      {/* CTA */}
      <section className="py-16 px-4 bg-primary text-primary-foreground">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to optimize your nutrition?</h2>
          <p className="text-lg mb-8 opacity-90">
            Join thousands of users who are achieving their nutrition and fitness goals with OptiKcal.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" variant="secondary">
              <Link href="/signup">Sign Up Free</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="bg-transparent border-white hover:bg-white hover:text-primary">
              <Link href="/login">Login</Link>
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}