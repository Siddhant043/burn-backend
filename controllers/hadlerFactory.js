import {
  filtering,
  limiting,
  pagination,
  sorting,
} from '../utils/exerciseApiFeatures.js';
import AppError from '../utils/appError.js';
import catchAsync from '../utils/catchAsync.js';

export const deleteOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndDelete(req.params.id);

    if (!doc) {
      return next(new AppError('No document found with that ID', 404));
    }
    res.status(204).json({
      status: 'Success',
      message: 'Tour deleted successfully',
    });
  });

export const updateOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!doc) {
      return next(new AppError('No document found with that ID', 404));
    }

    res.status(200).json({
      status: 'Success',
      data: {
        data: doc,
      },
    });
  });

export const createOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.create(req.body);

    res.status(200).json({
      status: 'Created',
      data: {
        data: doc,
      },
    });
  });

export const getOne = (Model, popOptions) =>
  catchAsync(async (req, res, next) => {
    const { id } = req.params;
    let query = Model.findById(id);
    if (popOptions) {
      query = query.populate(popOptions);
    }
    const doc = await query;

    if (!doc) {
      return next(new AppError('No document found with that ID', 404));
    }

    res.status(200).json({
      status: 'Success',
      data: {
        data: doc,
      },
    });
  });

export const getAll = (Model) =>
  catchAsync(async (req, res, next) => {
    let filter;
    if (req.params.tourId) filter = { tour: req.params.tourId };
    // Filtering
    // eslint-disable-next-line node/no-unsupported-features/es-syntax
    const filteredQuery = filtering(req.query);

    // eslint-disable-next-line node/no-unsupported-features/es-syntax
    let query = Model.find({ ...filteredQuery, ...filter });

    // Sorting
    query = sorting(req.query.sort, query);

    // Field Limiting
    query = limiting(req.query.fields, query);

    // Pagination
    query = pagination(req, query);

    const docs = await query;
    res.status(200).json({
      status: 'Successfull',
      result: docs.length,
      data: {
        docs,
      },
    });
  });
