import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import { verifyUserFromCookies, isAdmin } from "@/lib/auth";

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
  secure: true,
});

export async function GET() {
  try {
    // 1. Verify Authentication
    const user = await verifyUserFromCookies();
    if (!user || !isAdmin(user)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 2. Fetch assets from Cloudinary
    // We fetch the latest 50 resources. You can adjust limits or add pagination as needed.
    const result = await cloudinary.api.resources({
      type: "upload",
      max_results: 50,
      direction: "desc",
    });

    // 3. Map to our local interface
    const assets = result.resources.map(
      (resource: {
        public_id: string;
        url: string;
        secure_url: string;
        format: string;
        width: number;
        height: number;
        created_at: string;
      }) => ({
        publicId: resource.public_id,
        url: resource.url,
        secureUrl: resource.secure_url,
        format: resource.format,
        width: resource.width,
        height: resource.height,
        original_filename: resource.public_id.split("/").pop() || "unknown", // Admin API doesn't always return original_filename unless requested specifically
        created_at: resource.created_at,
      }),
    );

    return NextResponse.json({ assets });
  } catch (error) {
    console.error("Cloudinary Fetch Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch assets from Cloudinary" },
      { status: 500 },
    );
  }
}

export async function DELETE(request: Request) {
  try {
    // 1. Verify Authentication
    const user = await verifyUserFromCookies();
    if (!user || !isAdmin(user)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { publicId, resourceType = "image" } = await request.json();

    if (!publicId) {
      return NextResponse.json({ error: "Public ID is required" }, { status: 400 });
    }

    // 2. Delete asset from Cloudinary
    const result = await cloudinary.uploader.destroy(publicId, {
      resource_type: resourceType,
    });

    if (result.result === "ok" || result.result === "not found") {
      return NextResponse.json({ success: true, result: result.result });
    } else {
      console.error("Cloudinary Delete Result:", result);
      return NextResponse.json(
        { error: "Failed to delete asset from Cloudinary", details: result },
        { status: 500 },
      );
    }
  } catch (error) {
    console.error("Cloudinary Delete Error:", error);
    return NextResponse.json(
      { error: "An error occurred while deleting the asset" },
      { status: 500 },
    );
  }
}
