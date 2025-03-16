// This file serves as a unified API service that can be used throughout the application
// It will use the mock API service during development and can be switched to a real API service in production

import { mockApi } from "./mock-api"

// Export the mockApi as the default API implementation
export const api = mockApi

