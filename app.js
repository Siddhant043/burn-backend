/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable import/extensions */
import express from 'express';
import hpp from 'hpp';
import rateLimit from 'express-rate-limit';
import ExpressMongoSanitize from 'express-mongo-sanitize';
import helmet, { xssFilter } from 'helmet';

import userRouter from './routes/userRoute.js';
import exerciseRouter from './routes/exerciseRoute.js';
import workoutRouter from './routes/workoutRoute.js';
import globalErrorHandler from './controllers/errorController.js';
import AppError from './utils/appError.js';

const app = express();

// set security http headers
app.use(helmet());

app.use(express.json());

// Rate limiting
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this IP, please try in an hour.',
});
// In below code rate limiting only applies to the '/api' route
app.use('/api', limiter);

// Body parser, reading data from body into req.body
app.use(
  express.json({
    limit: '10kb',
  }),
);

// Data sanitization against NoSQL query injection
app.use(ExpressMongoSanitize());

// Data sanitization against XSS
app.use(xssFilter());

// Prevent Parameter pollution
app.use(
  hpp({
    whitelist: [
      'duration',
      'ratingQuantity',
      'ratingAvg',
      'maxGroupSize',
      'difficulty',
      'price',
    ],
  }),
);

// 3. Routes
app.use('/api/v1/users', userRouter);
app.use('/api/v1/workouts', workoutRouter);
app.use('/api/v1/exercises', exerciseRouter);

// 4. Handling not defined routes (404 routes)
app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server.`, 404));
});

// error handling custom middleware
app.use(globalErrorHandler);

export default app;
