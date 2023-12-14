import Exercise from '../models/exerciseModel.js';
import {
  createOne,
  deleteOne,
  getAll,
  getOne,
  updateOne,
} from './hadlerFactory.js';

export const getAllExercises = getAll(Exercise);

export const getExercise = getOne(Exercise);

export const createExercise = createOne(Exercise);

export const updateExercise = updateOne(Exercise);

export const deleteExercise = deleteOne(Exercise);
