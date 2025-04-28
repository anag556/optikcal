import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { User } from "@/lib/models/User";
import connectToDatabase from "@/lib/db";

function calculateMaintenanceCalories(
  gender: string,
  weight: number,
  height: number,
  age: number,
  activityLevel: string
): number {
  let bmr: number;
  
  if (gender === 'male') {
    bmr = 10 * weight + 6.25 * height - 5 * age + 5;
  } else {
    bmr = 10 * weight + 6.25 * height - 5 * age - 161;
  }
  
  const activityMultipliers = {
    'sedentary': 1.2,
    'light': 1.375,
    'moderate': 1.55,
    'active': 1.725,
    'very-active': 1.9
  };
  
  return Math.round(bmr * activityMultipliers[activityLevel as keyof typeof activityMultipliers]);
}

function calculateDailyCalorieTarget(
  currentWeight: number,
  goalWeight: number,
  targetWeeks: number,
  maintenanceCalories: number
): number {
  const weightDifference = currentWeight - goalWeight;
  const caloriesPerDay = (weightDifference * 7700) / (targetWeeks * 7);
  return Math.round(maintenanceCalories - caloriesPerDay);
}

function calculateMacronutrients(maintenanceCalories: number, weight: number) {
  const proteinPerKg = 2.2;
  const protein = Math.round(weight * proteinPerKg);
  const proteinCalories = protein * 4;
  
  const fatsPercentage = 0.25;
  const fats = Math.round((maintenanceCalories * fatsPercentage) / 9);
  
  const remainingCalories = maintenanceCalories - proteinCalories - (fats * 9);
  const carbs = Math.round(remainingCalories / 4);
  const fiber = Math.round(maintenanceCalories / 1000 * 14);

  return {
    protein,
    carbs,
    fats,
    fiber
  };
}

export async function GET() {
  try {
    const session = await getServerSession();
    if (!session?.user?.email) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    await connectToDatabase();
    const user = await User.findOne({ email: session.user.email });
    
    if (!user) {
      return new NextResponse("User not found", { status: 404 });
    }

    return NextResponse.json({
      name: user.name,
      age: user.age,
      gender: user.gender,
      height: user.height,
      currentWeight: user.currentWeight,
      goalWeight: user.goalWeight,
      targetWeeks: user.targetWeeks,
      activityLevel: user.activityLevel,
      maintenanceCalories: user.maintenanceCalories,
      dailyCalorieTarget: user.dailyCalorieTarget,
      macronutrients: user.macronutrients
    });
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const session = await getServerSession();
    if (!session?.user?.email) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await request.json();
    const {
      name,
      age,
      gender,
      currentWeight,
      height,
      goalWeight,
      targetWeeks,
      activityLevel
    } = body;

    await connectToDatabase();
    const user = await User.findOne({ email: session.user.email });
    
    if (!user) {
      return new NextResponse("User not found", { status: 404 });
    }

    // Calculate new values
    const maintenanceCalories = calculateMaintenanceCalories(
      gender,
      currentWeight,
      height,
      age,
      activityLevel
    );

    const dailyCalorieTarget = calculateDailyCalorieTarget(
      currentWeight,
      goalWeight,
      targetWeeks,
      maintenanceCalories
    );

    const macros = calculateMacronutrients(maintenanceCalories, currentWeight);

    const updatedUser = await User.findOneAndUpdate(
      { email: session.user.email },
      {
        name,
        age,
        gender,
        currentWeight,
        height,
        goalWeight,
        targetWeeks,
        activityLevel,
        maintenanceCalories,
        dailyCalorieTarget,
        macronutrients: macros
      },
      { new: true }
    );

    return NextResponse.json({
      success: true,
      user: updatedUser
    });
  } catch (error) {
    console.error("Error updating user profile:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}