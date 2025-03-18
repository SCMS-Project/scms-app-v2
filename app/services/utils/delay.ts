/**
 * Utility function to simulate API delay
 * @param ms Milliseconds to delay
 * @returns Promise that resolves after the specified delay
 */
export const delay = (ms: number): Promise<void> => {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

// Set the default delay to 0 milliseconds for immediate response
export const DEFAULT_DELAY = 0

