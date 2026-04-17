import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { verifyUserFromCookies, isAdmin } from "@/lib/auth";

// GET all staff members
export async function GET() {
  try {
    const user = await verifyUserFromCookies();
    if (!user || !isAdmin(user)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const staff = await db.getAllStaff();
    return NextResponse.json({ staff });
  } catch (error) {
    console.error("GET staff error:", error);
    return NextResponse.json(
      { error: "Failed to fetch staff members", details: error instanceof Error ? error.message : String(error) },
      { status: 500 },
    );
  }
}

// POST create new staff member
export async function POST(request: Request) {
  try {
    const user = await verifyUserFromCookies();
    if (!user || !isAdmin(user)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { user_id, photo_url, description } = body;

    if (!user_id) {
      return NextResponse.json(
        { error: "User is required" },
        { status: 400 },
      );
    }

    const staffMember = await db.createStaff(Number(user_id), photo_url || "", description || "");

    revalidatePath("/admin/staff");
    revalidatePath("/team");
    return NextResponse.json({ staff: staffMember }, { status: 201 });
  } catch (error) {
    console.error("POST staff error:", error);
    return NextResponse.json(
      { error: "Failed to create staff member", details: error instanceof Error ? error.message : String(error) },
      { status: 500 },
    );
  }
}
