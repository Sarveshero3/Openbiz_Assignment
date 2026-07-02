export class HttpError extends Error {
  public statusCode: number;

  constructor(statusCode: number, message: string) {
    super(message);
    this.statusCode = statusCode;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class BadRequestError extends HttpError {
  constructor(message: string = 'Bad Request') {
    super(400, message);
  }
}

export class UnauthorizedError extends HttpError {
  constructor(message: string = 'Unauthorized') {
    super(401, message);
  }
}

export class NotFoundError extends HttpError {
  constructor(message: string = 'Resource Not Found') {
    super(404, message);
  }
}

export class InternalServerError extends HttpError {
  constructor(message: string = 'Internal Server Error') {
    super(500, message);
  }
}

export class ApiSuccessResponse<T> {
  public success = true;
  public message: string;
  public data?: T;

  constructor(message: string, data?: T) {
    this.message = message;
    this.data = data;
  }
}

export class ApiErrorResponse {
  public success = false;
  public message: string;
  public errors?: any;

  constructor(message: string, errors?: any) {
    this.message = message;
    this.errors = errors;
  }
}
