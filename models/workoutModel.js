import mongoose from 'mongoose';

const workoutSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'Workout must belong to a user.'],
    },
    workoutName: {
      type: String,
      required: [true, 'Workout name is required.'],
    },
    createdAt: {
      type: Date,
      default: Date.now(),
    },
    history: [
      {
        type: Date,
        exercisesPerformed: [
          {
            type: mongoose.Schema.ObjectId,
            ref: 'Exercise',
          },
        ],
      },
    ],
    exercises: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'Exercise',
      },
    ],
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

workoutSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'exercises',
    select: 'exerciseName imageUrl bodyPart target',
  });
  this.populate({
    path: 'user',
    select: 'name _id email',
  });
  next();
});

const Workout = mongoose.model('Workout', workoutSchema);

export default Workout;
