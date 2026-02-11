import { NextRequest, NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

const BLOG_IMAGES_DIR = path.join(process.cwd(), "content/blog/images");

const MIME_TYPES: Record<string, string> = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".gif": "image/gif",
  ".webp": "image/webp",
  ".svg": "image/svg+xml",
  ".heic": "image/heic",
};

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> },
) {
  try {
    const { path: pathSegments } = await params;
    if (!pathSegments?.length) {
      return new NextResponse("Not Found", { status: 404 });
    }

    const safePath = pathSegments.map((s) => path.basename(s)).join(path.sep);
    const fullPath = path.join(BLOG_IMAGES_DIR, safePath);

    const resolved = path.resolve(fullPath);
    if (!resolved.startsWith(path.resolve(BLOG_IMAGES_DIR))) {
      return new NextResponse("Forbidden", { status: 403 });
    }

    const stat = await fs.stat(fullPath);
    if (!stat.isFile()) {
      return new NextResponse("Not Found", { status: 404 });
    }

    const ext = path.extname(fullPath).toLowerCase();
    const contentType = MIME_TYPES[ext] ?? "application/octet-stream";

    const buffer = await fs.readFile(fullPath);
    return new NextResponse(buffer, {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code === "ENOENT") {
      return new NextResponse("Not Found", { status: 404 });
    }
    console.error("Blog image serve error:", err);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
