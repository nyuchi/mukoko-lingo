// Development mode utilities for bypassing authentication during testing

export const isDevMode = () => {
  if (typeof window !== "undefined" && window.localStorage?.getItem("DEV_MODE_DISABLED") === "true") {
    return false
  }

  const devMode =
    process.env.NEXT_PUBLIC_DEV_MODE === "true" ||
    (typeof window !== "undefined" && window.localStorage?.getItem("DEV_MODE") === "true")

  if (devMode && typeof window !== "undefined") {
    console.log("[v0] Dev mode is enabled on client")
  }

  return devMode
}

// Mock admin user for dev mode testing
export const DEV_USER = {
  id: "00000000-0000-0000-0000-000000000000",
  email: "dev@nyuchi.com",
  user_metadata: {
    display_name: "Dev User (Admin)",
  },
  role: "admin" as const,
}

// Mock user profile for dev mode
export const DEV_PROFILE = {
  user_id: "00000000-0000-0000-0000-000000000000",
  email: "dev@nyuchi.com",
  display_name: "Dev User (Admin)",
  preferred_ui_language: "en",
  learning_goal: "Testing and development",
  daily_goal: 30,
  study_streak: 0,
  last_study_date: new Date().toISOString().split("T")[0],
  role: "admin" as const,
  status: "active" as const,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
}

// Get mock user for dev mode
export function getDevUser() {
  if (!isDevMode()) {
    return null
  }
  return DEV_USER
}

// Get mock profile for dev mode
export function getDevProfile() {
  if (!isDevMode()) {
    return null
  }
  return DEV_PROFILE
}
