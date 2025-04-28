import mongoose, { Schema } from 'mongoose';

const foodLogSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  imageUrl: {
    type: String,
    required: false
  },
  calories: {
    type: Number,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  macros: {
    protein: {
      type: Number,
      required: true,
      default: 0
    },
    carbs: {
      type: Number,
      required: true,
      default: 0
    },
    fat: {
      type: Number,
      required: true,
      default: 0
    },
    fiber: {
      type: Number,
      required: true,
      default: 0
    }
  }
}, {
  timestamps: true
});

export const FoodLog = mongoose.models.FoodLog || mongoose.model('FoodLog', foodLogSchema);