import mongoose from 'mongoose';

export class HttpError extends Error {
  constructor(status, message, errors) {
    super(message);
    this.status = status;
    this.errors = errors;
  }
}

export const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

export const validateObjectId = (req, _res, next) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return next(new HttpError(400, 'Invalid contact id'));
  }
  next();
};

export const notFound = (req, _res, next) =>
  next(new HttpError(404, `Route not found: ${req.method} ${req.originalUrl}`));

// eslint-disable-next-line no-unused-vars
export const errorHandler = (err, _req, res, _next) => {
  let status = err.status || 500;
  let message = err.message || 'Something went wrong';
  let errors = err.errors;

  if (err instanceof mongoose.Error.ValidationError) {
    status = 400;
    message = 'Validation failed';
    errors = Object.fromEntries(Object.entries(err.errors).map(([k, v]) => [k, v.message]));
  } else if (err instanceof mongoose.Error.CastError) {
    status = 400;
    message = `Invalid value for ${err.path}`;
  } else if (err.code === 11000) {
    status = 409;
    message = 'A contact with this email already exists';
    errors = { email: message };
  } else if (err.type === 'entity.parse.failed') {
    status = 400;
    message = 'Request body is not valid JSON';
  } else if (err.type === 'entity.too.large') {
    status = 413;
    message = 'Request body is too large';
  } else if (status === 500) {
    if (process.env.NODE_ENV !== 'test') console.error(err);
    message = 'Internal server error';
  }

  res.status(status).json({ success: false, message, ...(errors && { errors }) });
};
