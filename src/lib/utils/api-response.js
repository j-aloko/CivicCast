export class ApiResponse {
  static success(data, message = "Success", statusCode = 200) {
    return {
      data,
      message,
      statusCode,
      success: true,
    };
  }

  static error(
    message = "Internal Server Error",
    statusCode = 500,
    errors = null
  ) {
    return {
      errors,
      message,
      statusCode,
      success: false,
    };
  }

  static validationError(errors) {
    return this.error("Validation Failed", 422, errors);
  }

  static notFound(message = "Resource not found") {
    return this.error(message, 404);
  }

  static unauthorized(message = "Unauthorized") {
    return this.error(message, 401);
  }

  static forbidden(message = "Forbidden") {
    return this.error(message, 403);
  }
}

export const handleApiError = (error, res) => {
  console.error("API Error:", error);

  // Handle Prisma errors
  if (error.code === "P2002") {
    return res
      .status(409)
      .json(ApiResponse.error("Resource already exists", 409));
  }

  if (error.code === "P2025") {
    return res.status(404).json(ApiResponse.notFound());
  }

  // Handle custom business logic errors
  if (
    error.message.includes("not found") ||
    error.message.includes("Invalid option")
  ) {
    return res.status(404).json(ApiResponse.notFound(error.message));
  }

  if (
    error.message.includes("closed") ||
    error.message.includes("access denied")
  ) {
    return res.status(400).json(ApiResponse.error(error.message, 400));
  }

  // Default error
  return res.status(500).json(ApiResponse.error("Internal server error"));
};
