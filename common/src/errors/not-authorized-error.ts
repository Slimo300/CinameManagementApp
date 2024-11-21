import { AppError } from './app-error';

export class NotAuthorizedError extends AppError {
  statusCode = 401;

  constructor() {
    super("user not authorized");

    Object.setPrototypeOf(this, NotAuthorizedError.prototype);
  }

  serializeErrors() {
    return [{ message: 'Not authorized' }];
  }
}
