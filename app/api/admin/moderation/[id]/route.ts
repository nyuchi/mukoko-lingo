import { createClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const supabase = await createClient()

    // Check if user is admin
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single()

    if (profile?.role !== "admin") {
      return NextResponse.json({ error: "Forbidden - Admin access required" }, { status: 403 })
    }

    const { status, admin_notes } = await request.json()

    // Update the moderation alert
    const { error } = await supabase
      .from("moderation_alerts")
      .update({
        status,
        admin_notes,
        reviewed_by: user.id,
        reviewed_at: new Date().toISOString(),
      })
      .eq("id", params.id)

    if (error) {
      console.error("[v0] Error updating moderation alert:", error)
      return NextResponse.json({ error: "Failed to update alert" }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Error in moderation update:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
