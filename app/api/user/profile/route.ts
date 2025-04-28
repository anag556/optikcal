import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { User } from "@/lib/models/User";
import connectToDatabase from "@/lib/db";

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
      dailyCalorieTarget: user.dailyCalorieTarget,
      macronutrients: user.macronutrients
    });
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}