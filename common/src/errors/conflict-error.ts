import { AppError } from "./app-error";

export class ConflictError extends AppError {
    statusCode: number = 409;

    constructor(public message: string) {
        super(message);
    
        Object.setPrototypeOf(this, ConflictError.prototype);
      }
    

    serializeErrors() { 
        return [{message: this.message}];
    }
}