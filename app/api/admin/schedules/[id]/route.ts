import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { verifyUserFromCookies, isAdmin } from "@/lib/auth";

// GET schedule by ID
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const user = await verifyUserFromCookies();
    if (!user || !isAdmin(user)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: idStr } = await params;
    const id = parseInt(idStr);
    const schedule = await db.getScheduleById(id);

    if (!schedule) {
      return NextResponse.json(
        { error: "Schedule not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({ schedule });
  } catch (error) {
    console.error("GET schedule error:", error);
    return NextResponse.json(
      { error: "Failed to fetch schedule", details: error instanceof Error ? error.message : String(error) },
      { status: 500 },
    );
  }
}

// PATCH update schedule
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const user = await verifyUserFromCookies();
    if (!user || !isAdmin(user)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: idStr } = await params;
    const id = parseInt(idStr);
    const body = await request.json();

    const schedule = await db.updateSchedule(id, body);

    revalidatePath("/admin/schedules");
    return NextResponse.json({ schedule });
  } catch (error) {
    console.error("PATCH schedule error:", error);
    return NextResponse.json(
      { error: "Failed to update schedule", details: error instanceof Error ? error.message : String(error) },
      { status: 500 },
    );
  }
}

// DELETE schedule
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const user = await verifyUserFromCookies();
    if (!user || !isAdmin(user)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: idStr } = await params;
    const id = parseInt(idStr);
    await db.deleteSchedule(id);

    revalidatePath("/admin/schedules");
    return NextResponse.json({ message: "Schedule deleted successfully" });
  } catch (error) {
    console.error("DELETE schedule error:", error);
    return NextResponse.json(
      { error: "Failed to delete schedule", details: error instanceof Error ? error.message : String(error) },
      { status: 500 },
    );
  }
}
