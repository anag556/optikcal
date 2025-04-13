import bcrypt from "bcrypt";
import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import { User } from "@/lib/models/User";

// Helper function to calculate maintenance calories based on user data
function calculateMaintenanceCalories(
  gender: string,
  weight: number,
  height: number,
  age: number,
  activityLevel: string
): number {
  // Base BMR calculation using Mifflin-St Jeor Equation
  let bmr: number;
  
  if (gender === 'male') {
    bmr = 10 * weight + 6.25 * height - 5 * age + 5;
  } else {
    bmr = 10 * weight + 6.25 * height - 5 * age - 161;
  }
  
  // Activity multipliers
  const activityMultipliers = {
    'sedentary': 1.2,       // Little or no exercise
    'light': 1.375,         // Light exercise 1-3 days/week
    'moderate': 1.55,       // Moderate exercise 3-5 days/week
    'active': 1.725,        // Active - hard exercise 6-7 days/week
    'very-active': 1.9      // Very active - hard daily exercise & physical job
  };
  
  // Calculate TDEE (Total Daily Energy Expenditure)
  return Math.round(bmr * activityMultipliers[activityLevel as keyof typeof activityMultipliers]);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      name,
      email,
      password,
      age,
      gender,
      height,
      currentWeight,
      goalWeight,
      targetWeeks,
      activityLevel
    } = body;

    // Validate required fields
    if (!name || !email || !password || !age || !gender || !height ||
        !currentWeight || !goalWeight || !targetWeeks || !activityLevel) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    await connectToDatabase();

    // Check if user already exists
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 409 }
      );
    }

    // Calculate maintenance calories
    const maintenanceCalories = calculateMaintenanceCalories(
      gender,
      currentWeight,
      height,
      age,
      activityLevel
    );

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      age,
      gender,
      height,
      currentWeight,
      goalWeight,
      targetWeeks,
      activityLevel,
      maintenanceCalories
    });

    await newUser.save();

    return NextResponse.json(
      { success: true, message: "User registered successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "An error occurred during registration" },
      { status: 500 }
    );
  }
}