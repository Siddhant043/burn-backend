// eslint-disable-next-line import/extensions
import AppError from '../utils/appError.js';

const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value}.`;
  return new AppError(message, 400);
};
const handleValidationErrorDB = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message);
  const message = `Invalid input entered. ${errors.join('. ')}`;
  return new AppError(message, 400);
};
const handleDuplicateFileDB = (err) => {
  const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];
  const message = `Duplicate field value: ${value}`;
  return new AppError(message, 400);
};
const handleJWTError = () =>
  new AppError('Invlaid token. Please login again', 401);
const handleJWTExpiredError = () =>
  new AppError('Your token has expred. Please login again', 401);

const sendErrorToDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    stack: err.stack,
    error: err,
  });
};

const sendErrorToProd = (err, res) => {
  // Operational, trusted error: send message to the client
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });

    //Programming or other unknown error: don't leak error details
  } else {
    // 1. Log error
    console.error('Error 💥', err);
    // 2. Send Generic message
    res.status(500).json({
      status: 'Error',
      message: 'Something went very wrong!',
    });
  }
};

export default (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';
  if (process.env.NODE_ENV === 'development') {
    sendErrorToDev(err, res);
  } else if (process.env.NODE_ENV === 'production') {
    let error = Object.assign(err);
    if (error.name === 'CastError') error = handleCastErrorDB(error);
    if (error.name === 'JsonWebTokenError') error = handleJWTError();
    if (error.name === 'TokenExpiredError') error = handleJWTExpiredError();
    error = handleValidationErrorDB(error);
    if (error.name === 'ValidationError')
      error = handleValidationErrorDB(error);
    if (error.code === 11000) error = handleDuplicateFileDB(error);

    sendErrorToProd(error, res);
  }
};
