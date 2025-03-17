// API Configuration

// Get the API URL from environment variables or use a default
const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api"

// Determine if we should use the real API
const useRealApi = process.env.NEXT_PUBLIC_USE_REAL_API === "true"

// API Configuration object
export const apiConfig = {
  apiUrl,
  useRealApi,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  timeout: 30000, // 30 seconds
  includeCredentials: true,
}

