import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { FoodLog } from '@/lib/models/FoodLog';
import connectToDatabase from '@/lib/db';
import mongoose from 'mongoose';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const db = await connectToDatabase();
    
    // Get date range from query params
    const { searchParams } = new URL(request.url);
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    // Find the user's ID from their email
    const User = mongoose.models.User;
    const user = await User.findOne({ email: session.user.email });
    
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const query: any = { userId: user._id };
    if (startDate && endDate) {
      query.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    const foodLogs = await FoodLog.find(query).sort({ date: -1 });
    return NextResponse.json(foodLogs);
  } catch (error) {
    console.error('Error fetching food logs:', error);
    return NextResponse.json(
      { error: 'Failed to fetch food logs' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectToDatabase();
    
    // Find the user's ID from their email
    const User = mongoose.models.User;
    const user = await User.findOne({ email: session.user.email });
    
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const data = await request.json();
    // Destructure _id out of data and create food log with remaining fields
    const { _id, ...foodLogData } = data;
    const foodLog = await FoodLog.create({
      ...foodLogData,
      userId: user._id,
      date: new Date()
    });

    return NextResponse.json(foodLog);
  } catch (error) {
    console.error('Error creating food log:', error);
    return NextResponse.json(
      { error: 'Failed to create food log' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectToDatabase();
    
    // Get the food log ID from the URL
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json({ error: 'Food log ID is required' }, { status: 400 });
    }

    // Find the user's ID from their email
    const User = mongoose.models.User;
    const user = await User.findOne({ email: session.user.email });
    
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const data = await request.json();
    // Remove _id and userId from update data for security
    const { _id, userId, ...updateData } = data;

    // Find and update the food log, ensuring it belongs to the user
    const foodLog = await FoodLog.findOneAndUpdate(
      { _id: id, userId: user._id },
      updateData,
      { new: true }
    );

    if (!foodLog) {
      return NextResponse.json({ error: 'Food log not found' }, { status: 404 });
    }

    return NextResponse.json(foodLog);
  } catch (error) {
    console.error('Error updating food log:', error);
    return NextResponse.json(
      { error: 'Failed to update food log' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectToDatabase();
    
    // Get the food log ID from the URL
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json({ error: 'Food log ID is required' }, { status: 400 });
    }

    // Find the user's ID from their email
    const User = mongoose.models.User;
    const user = await User.findOne({ email: session.user.email });
    
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Find and delete the food log, ensuring it belongs to the user
    const foodLog = await FoodLog.findOneAndDelete({ _id: id, userId: user._id });

    if (!foodLog) {
      return NextResponse.json({ error: 'Food log not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting food log:', error);
    return NextResponse.json(
      { error: 'Failed to delete food log' },
      { status: 500 }
    );
  }
}