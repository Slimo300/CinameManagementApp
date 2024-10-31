import { AppError } from "./app-error";

export class ForbiddenError extends AppError {
    statusCode: number = 403;

    constructor(public message: string) {
        super(message);

        Object.setPrototypeOf(this, ForbiddenError.prototype)
    }

    serializeErrors() {
        return [{message: this.message}]
    }
}