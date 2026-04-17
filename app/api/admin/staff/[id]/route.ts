import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { verifyUserFromCookies, isAdmin } from "@/lib/auth";

// PUT update staff member
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const user = await verifyUserFromCookies();
    if (!user || !isAdmin(user)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const { photo_url, description } = body;

    const staffMember = await db.updateStaff(Number(id), { photo_url, description });

    revalidatePath("/admin/staff");
    revalidatePath("/team");
    return NextResponse.json({ staff: staffMember });
  } catch (error) {
    console.error("PUT staff error:", error);
    return NextResponse.json(
      { error: "Failed to update staff member", details: error instanceof Error ? error.message : String(error) },
      { status: 500 },
    );
  }
}

// DELETE staff member
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const user = await verifyUserFromCookies();
    if (!user || !isAdmin(user)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    await db.deleteStaff(Number(id));

    revalidatePath("/admin/staff");
    revalidatePath("/team");
    return NextResponse.json({ message: "Staff member deleted successfully" });
  } catch (error) {
    console.error("DELETE staff error:", error);
    return NextResponse.json(
      { error: "Failed to delete staff member", details: error instanceof Error ? error.message : String(error) },
      { status: 500 },
    );
  }
}
