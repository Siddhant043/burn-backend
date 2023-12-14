// eslint-disable-next-line import/extensions
import Exercise from '../models/exerciseModel.js';

export const filtering = (query) => {
  // eg. url: http://localhost:8000/api/v1/tours?price[gte]=4&difficulty=easy
  const queryObj = { ...query };

  // Filtering
  const excludeFields = ['page', 'sort', 'limit', 'fields'];
  excludeFields.forEach((el) => delete queryObj[el]);

  // Advance filtering
  let queryString = JSON.stringify(queryObj);
  queryString = queryString.replace(
    /\b(gte|gt|lte|lt)\b/g,
    (match) => `$${match}`,
  );
  return JSON.parse(queryString);
};

export const sorting = (reqHasSort, resultQuery) => {
  // eg. url: http://localhost:8000/api/v1/tours?sort=-price,ratingAvg
  if (reqHasSort) {
    const sortBy = reqHasSort.replaceAll(',', ' ');
    return resultQuery.sort(sortBy);
  }
  return resultQuery.sort('-createdAt');
};

export const limiting = (reqHasFields, resultQuery) => {
  // eg. url: http://localhost:8000/api/v1/tours?fields=name,price,duration,difficulty
  if (reqHasFields) {
    const limitBy = reqHasFields.replaceAll(',', ' ');
    return resultQuery.select(limitBy);
  }
  return resultQuery.select('-__v');
};

export const pagination = async (req, resultQuery) => {
  // eg. url: http://localhost:8000/api/v1/tours?page=1&limit=3
  const page = req.query.page * 1 || 1;
  const limit = req.query.limit * 1 || 10;
  const skip = (page - 1) * limit;
  if (req.query.page) {
    const numTours = await Exercise.countDocuments();
    if (skip >= numTours) {
      throw new Error('This page does not exists');
    }
  }
  return resultQuery.skip(skip).limit(limit);
};
