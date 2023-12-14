import { Schema, model } from 'mongoose';

const exerciseSchema = new Schema({
  exerciseName: {
    type: String,
    required: [true, 'Exercise Name is required'],
    trim: true,
  },
  instructions: [
    {
      type: String,
      trim: true,
    },
  ],
  equipment: {
    type: String,
    required: [true, 'Equipment is required'],
  },

  imageUrl: {
    type: String,
  },
  bodyPart: {
    type: String,
    required: [true, 'Body Part is required'],
  },

  secondaryMuscels: [String],
  target: [String],
  usersUsing: [String],
  workoutsUsing: [String],
});

const Exercise = model('Exercise', exerciseSchema);

export default Exercise;
