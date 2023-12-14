import Workout from '../models/workoutModel.js';
import {
  createOne,
  deleteOne,
  getAll,
  getOne,
  updateOne,
} from './hadlerFactory.js';

export const getAllWorkouts = getAll(Workout);

export const getWorkout = getOne(Workout);

export const createWorkout = createOne(Workout);

export const updateWorkout = updateOne(Workout);

export const deleteWorkout = deleteOne(Workout);
