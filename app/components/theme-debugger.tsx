"use client"

import { useTheme } from "@/app/components/theme-provider"
import { useEffect } from "react"

export function ThemeDebugger() {
  const { theme, resolvedTheme } = useTheme()

  useEffect(() => {
    console.log("Current theme state:", { theme, resolvedTheme })
    console.log("HTML classes:", document.documentElement.classList.toString())
  }, [theme, resolvedTheme])

  return null
}

