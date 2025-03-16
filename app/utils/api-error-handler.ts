// API Error Handler

// Custom API Error class
export class ApiError extends Error {
  status: number
  data?: any

  constructor(message: string, status: number, data?: any) {
    super(message)
    this.name = "ApiError"
    this.status = status
    this.data = data
  }
}

// Function to handle API errors
export function handleApiError(error: unknown): ApiError {
  if (error instanceof ApiError) {
    return error
  }

  if (error instanceof Error) {
    // Check if it's a network error
    if (error.message.includes("Failed to fetch") || error.message.includes("Network request failed")) {
      return new ApiError("Network error. Please check your connection.", 0)
    }

    // Check if it's an abort error (timeout)
    if (error.name === "AbortError") {
      return new ApiError("Request timed out. Please try again.", 408)
    }

    // Generic error
    return new ApiError(error.message, 500)
  }

  // Unknown error
  return new ApiError("An unknown error occurred", 500)
}

// Function to display error messages to the user
export function displayApiError(error: unknown): string {
  const apiError = handleApiError(error)

  // You can customize error messages based on status codes
  switch (apiError.status) {
    case 401:
      return "You are not authorized to perform this action. Please log in again."
    case 403:
      return "You do not have permission to access this resource."
    case 404:
      return "The requested resource was not found."
    case 408:
      return "The request timed out. Please try again."
    case 429:
      return "Too many requests. Please try again later."
    case 500:
      return "A server error occurred. Please try again later."
    default:
      return apiError.message
  }
}

