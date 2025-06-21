class ApiError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }

  static badRequest(msg = "Bad Request") {
    return new ApiError(msg, 400);
  }

  static unauthorized(msg = "Unauthorized") {
    return new ApiError(msg, 401);
  }

  static forbidden(msg = "Forbidden") {
    return new ApiError(msg, 403);
  }

  static notFound(msg = "Not Found") {
    return new ApiError(msg, 404);
  }

  static internal(msg = "Internal Server Error") {
    return new ApiError(msg, 500);
  }
}

export default ApiError;
