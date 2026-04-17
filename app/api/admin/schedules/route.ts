import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { verifyUserFromCookies, isAdmin } from "@/lib/auth";

// GET all schedules
export async function GET() {
  try {
    const user = await verifyUserFromCookies();
    if (!user || !isAdmin(user)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const schedules = await db.getAllSchedules();
    return NextResponse.json({ schedules });
  } catch (error) {
    console.error("GET schedules error:", error);
    return NextResponse.json(
      { error: "Failed to fetch schedules", details: error instanceof Error ? error.message : String(error) },
      { status: 500 },
    );
  }
}

// POST create new schedule
export async function POST(request: Request) {
  try {
    const user = await verifyUserFromCookies();
    if (!user || !isAdmin(user)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { name, date, category, description } = body;

    if (!name || !date || !category) {
      return NextResponse.json(
        { error: "Name, date, and category are required" },
        { status: 400 },
      );
    }

    const schedule = await db.createSchedule(name, date, category, description);

    revalidatePath("/admin/schedules");
    return NextResponse.json({ schedule }, { status: 201 });
  } catch (error) {
    console.error("POST schedule error:", error);
    return NextResponse.json(
      { error: "Failed to create schedule", details: error instanceof Error ? error.message : String(error) },
      { status: 500 },
    );
  }
}
