"use client"

import { AlertTriangle, X } from "lucide-react"
import { useState } from "react"
import { Button } from "@/components/ui/button"

export function DevModeBanner() {
  const [isVisible, setIsVisible] = useState(true)
  const isDevMode =
    process.env.NEXT_PUBLIC_DEV_MODE === "true" ||
    (typeof window !== "undefined" && window.localStorage?.getItem("DEV_MODE") === "true")

  const handleToggleDevMode = () => {
    console.log("[v0] Dev mode toggle clicked")
    if (typeof window !== "undefined") {
      const envDevMode = process.env.NEXT_PUBLIC_DEV_MODE === "true"
      const localStorageDevMode = window.localStorage?.getItem("DEV_MODE") === "true"

      console.log("[v0] Env dev mode:", envDevMode)
      console.log("[v0] LocalStorage dev mode:", localStorageDevMode)

      if (envDevMode) {
        // Can't disable environment variable dev mode from UI
        alert(
          "Dev mode is enabled via NEXT_PUBLIC_DEV_MODE environment variable. Please remove it from your environment variables in the Vars section to disable dev mode.",
        )
        return
      }

      // Remove from localStorage and set a flag to disable it
      window.localStorage.removeItem("DEV_MODE")
      window.localStorage.setItem("DEV_MODE_DISABLED", "true")
      console.log("[v0] Dev mode disabled, reloading...")
      // Reload to apply changes
      window.location.reload()
    }
  }

  if (!isDevMode || !isVisible) {
    return null
  }

  return (
    <div className="bg-yellow-500 text-yellow-950 px-4 py-2 text-sm font-medium flex items-center justify-center gap-2">
      <AlertTriangle className="h-4 w-4" />
      <span>DEV MODE ACTIVE - Authentication Bypassed</span>
      <div className="ml-auto flex items-center gap-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleToggleDevMode}
          className="h-6 px-2 text-xs text-yellow-950 hover:bg-yellow-600 hover:text-yellow-950"
        >
          Disable Dev Mode
        </Button>
        <button
          onClick={() => setIsVisible(false)}
          className="hover:bg-yellow-600 rounded p-1"
          aria-label="Hide banner"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}
