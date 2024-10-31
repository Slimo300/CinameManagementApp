import { FieldValidationError, ValidationError } from 'express-validator';
import { AppError } from './app-error';

export class RequestValidationError extends AppError {
  statusCode = 400;

  constructor(public errors: ValidationError[]) {
    super('Invalid request parameters');

    // Only because we are extending a built in class
    Object.setPrototypeOf(this, RequestValidationError.prototype);
  }

  serializeErrors() {
    return this.errors.map(err => {
      const fieldErr = err as FieldValidationError;
      return { message: fieldErr.msg, field: fieldErr.path};
    });
  }
}
