import mongoose, { Schema, models } from 'mongoose';

export interface UserDocument extends mongoose.Document {
  name: string;
  email: string;
  password: string;
  age: number;
  gender: 'male' | 'female' | 'other';
  height: number;
  currentWeight: number;
  goalWeight: number;
  targetWeeks: number;
  activityLevel: 'sedentary' | 'light' | 'moderate' | 'active' | 'very-active';
  maintenanceCalories: number;
  dailyCalorieTarget: number;
  macronutrients: string;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<UserDocument>({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  age: {
    type: Number,
    required: true,
  },
  gender: {
    type: String,
    enum: ['male', 'female', 'other'],
    required: true,
  },
  height: {
    type: Number, // in cm
    required: true,
  },
  currentWeight: {
    type: Number, // in kg
    required: true,
  },
  goalWeight: {
    type: Number, // in kg
    required: true,
  },
  targetWeeks: {
    type: Number,
    required: true,
  },
  activityLevel: {
    type: String,
    enum: ['sedentary', 'light', 'moderate', 'active', 'very-active'],
    required: true,
  },
  maintenanceCalories: {
    type: Number,
    required: true,
  },
  dailyCalorieTarget: {
    type: Number,
    required: true,
  },
  macronutrients: {
    protein: { type: Number, required: true },
    carbs: { type: Number, required: true },
    fats: { type: Number, required: true },
    fiber: { type: Number, required: true }
  },
}, {
  timestamps: true,
});

export const User = models.User || mongoose.model<UserDocument>('User', UserSchema);
