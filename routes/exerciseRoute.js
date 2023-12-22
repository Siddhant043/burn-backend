import express from 'express';
import {
  createExercise,
  deleteExercise,
  getAllExercises,
  getExercise,
  updateExercise,
  // eslint-disable-next-line import/extensions
} from '../controllers/exerciseController.js';
import {
  protect,
  restrictTo,
} from '../controllers/authenticationController.js';

const exerciseRouter = express.Router();

exerciseRouter.route('/').get(getAllExercises);
exerciseRouter.route('/:id').get(getExercise);

//exerciseRouter.use(protect, restrictTo('admin'));
exerciseRouter.route('/').post(createExercise);
exerciseRouter.route('/:id').patch(updateExercise).delete(deleteExercise);

export default exerciseRouter;
