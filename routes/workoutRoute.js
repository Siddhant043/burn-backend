import express from 'express';
import {
  createWorkout,
  deleteWorkout,
  getAllWorkouts,
  getWorkout,
  updateWorkout,
} from '../controllers/workoutController.js';
import { protect } from '../controllers/authenticationController.js';

const workoutRouter = express.Router();

workoutRouter.use(protect);

workoutRouter.route('/').get(getAllWorkouts).post(createWorkout);
workoutRouter
  .route('/:id')
  .get(getWorkout)
  .patch(updateWorkout)
  .delete(deleteWorkout);

export default workoutRouter;
