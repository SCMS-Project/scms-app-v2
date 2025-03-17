// Add a safety wrapper to the login method to prevent technical errors
// Add this at the beginning of the file if it exists, or create a new wrapper function:

// Add this function if it doesn't already exist
export function safeApiCall<T>(apiCall: () => Promise<T>, fallback: T): Promise<T> {
  return new Promise<T>(async (resolve) => {
    try {
      const result = await apiCall()
      resolve(result)
    } catch (error) {
      console.error("API call failed:", error)
      resolve(fallback)
    }
  })
}

// Import from the correct path
import { api } from "../app/services/api"

// Re-export the API service
export { api }

