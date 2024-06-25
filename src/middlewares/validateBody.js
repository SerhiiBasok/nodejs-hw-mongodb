import createHttpError from 'http-errors';
import Joi from 'joi';

export const validateBody = (schema) => async (req, res, next) => {
  try {
    await schema.validateAsync(req.body, { abortEarly: false });
    next();
  } catch (error) {
    const validationErrors = error.details.map((detail) => ({
      message: detail.message,
      path: detail.path,
    }));

    next(
      createHttpError(400, 'Validation error', { errors: validationErrors }),
    );
  }
};
