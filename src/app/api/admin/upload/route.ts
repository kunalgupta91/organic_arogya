import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { uploadToCloudinary, type UploadKind } from "@/lib/cloudinary";

const MAX_BYTES: Record<UploadKind, number> = {
  image: 10 * 1024 * 1024,
  pdf: 20 * 1024 * 1024,
};

const ALLOWED_TYPES: Record<UploadKind, string[]> = {
  image: ["image/jpeg", "image/png", "image/webp", "image/avif"],
  pdf: ["application/pdf"],
};

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user || (session.user.role !== "ADMIN" && session.user.role !== "STAFF")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const formData = await request.formData();
  const file = formData.get("file");
  const kindRaw = formData.get("kind");
  const folder = formData.get("folder");

  if (!(file instanceof File) || (kindRaw !== "image" && kindRaw !== "pdf")) {
    return NextResponse.json({ error: "Invalid upload request" }, { status: 400 });
  }
  const kind: UploadKind = kindRaw;

  if (!ALLOWED_TYPES[kind].includes(file.type)) {
    return NextResponse.json({ error: `Unsupported file type: ${file.type}` }, { status: 400 });
  }
  if (file.size > MAX_BYTES[kind]) {
    return NextResponse.json({ error: "File too large" }, { status: 400 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const result = await uploadToCloudinary(
    buffer,
    kind,
    typeof folder === "string" && folder ? folder : "misc",
  );

  return NextResponse.json(result);
}
