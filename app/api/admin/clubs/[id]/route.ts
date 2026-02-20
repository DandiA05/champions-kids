import { sql } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

// PUT update club
export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await context.params;
    const body = await request.json();
    const { name, logo_url, is_our_team } = body;

    if (!name) {
      return NextResponse.json(
        { error: "Club name is required" },
        { status: 400 },
      );
    }

    const result = await sql`
      UPDATE clubs 
      SET 
        name = ${name},
        logo_url = ${logo_url || null},
        is_our_team = ${is_our_team || false},
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ${id}
      RETURNING *
    `;

    if (result.length === 0) {
      return NextResponse.json({ error: "Club not found" }, { status: 404 });
    }

    revalidatePath("/");
    return NextResponse.json({ club: result[0] });
  } catch (error) {
    console.error("PUT club error:", error);
    return NextResponse.json(
      { error: "Failed to update club" },
      { status: 500 },
    );
  }
}

// DELETE club
export async function DELETE(
  _request: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await context.params;

    const result = await sql`
      DELETE FROM clubs WHERE id = ${id} RETURNING id
    `;

    if (result.length === 0) {
      return NextResponse.json({ error: "Club not found" }, { status: 404 });
    }

    revalidatePath("/");
    return NextResponse.json({
      message: "Club deleted successfully",
    });
  } catch (error) {
    console.error("DELETE club error:", error);
    return NextResponse.json(
      { error: "Failed to delete club" },
      { status: 500 },
    );
  }
}
