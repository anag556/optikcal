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

// New helper function to calculate macronutrients
interface MacroNutrients {
  protein: number;
  carbs: number;
  fats: number;
  fiber: number;
}

function calculateMacronutrients(maintenanceCalories: number, weight: number): MacroNutrients {
  // Protein: 2g per kg of body weight
  const proteinInGrams = weight * 2;
  const proteinCalories = proteinInGrams * 4; // 4 calories per gram of protein

  // Fats: 25% of total calories
  const fatCalories = maintenanceCalories * 0.25;
  const fatInGrams = Math.round(fatCalories / 9); // 9 calories per gram of fat

  // Remaining calories go to carbs
  const carbCalories = maintenanceCalories - proteinCalories - fatCalories;
  const carbInGrams = Math.round(carbCalories / 4); // 4 calories per gram of carbs

  // Fiber: recommended 14g per 1000 calories
  const fiberInGrams = Math.round((maintenanceCalories / 1000) * 14);

  return {
    protein: Math.round(proteinInGrams),
    carbs: carbInGrams,
    fats: fatInGrams,
    fiber: fiberInGrams
  };
}

function calculateDailyCalorieTarget(
  currentWeight: number,
  goalWeight: number,
  targetWeeks: number,
  maintenanceCalories: number
): number {
  // Calculate total weight difference
  const weightDifference = goalWeight - currentWeight; // Negative for weight loss, positive for gain
  
  // Calculate required weekly weight change
  const weeklyWeightChange = weightDifference / targetWeeks;
  
  // 1 pound of fat = 3500 calories
  // 1 kg of fat = 7700 calories
  const CALORIES_PER_KG = 7700;
  
  // Calculate daily calorie adjustment needed
  const dailyCalorieAdjustment = (weeklyWeightChange * CALORIES_PER_KG) / 7;
  
  // Add the adjustment to maintenance calories
  const dailyCalorieTarget = Math.round(maintenanceCalories + dailyCalorieAdjustment);
  
  return dailyCalorieTarget;
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

    // Calculate daily calorie target
    const dailyCalorieTarget = calculateDailyCalorieTarget(
      currentWeight,
      goalWeight,
      targetWeeks,
      maintenanceCalories
    );

    // Calculate macronutrients
    const macros = calculateMacronutrients(maintenanceCalories, currentWeight);

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
      maintenanceCalories,
      dailyCalorieTarget,
      macronutrients: {
        protein: macros.protein,
        carbs: macros.carbs,
        fats: macros.fats,
        fiber: macros.fiber
      }
    });

    await newUser.save();

    return NextResponse.json(
      { 
        success: true, 
        message: "User registered successfully",
        macronutrients: macros // Optional: return macros in response
      },
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