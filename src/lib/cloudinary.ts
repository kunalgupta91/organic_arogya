import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export type UploadKind = "image" | "pdf";

export async function uploadToCloudinary(
  buffer: Buffer,
  kind: UploadKind,
  folder: string,
): Promise<{ url: string; publicId: string; width?: number; height?: number; bytes: number }> {
  const result = await new Promise<import("cloudinary").UploadApiResponse>((resolve, reject) => {
    cloudinary.uploader
      .upload_stream(
        {
          folder: `organic-arogya/${folder}`,
          resource_type: kind === "pdf" ? "raw" : "image",
        },
        (error, uploadResult) => {
          if (error || !uploadResult) reject(error ?? new Error("Upload failed"));
          else resolve(uploadResult);
        },
      )
      .end(buffer);
  });

  return {
    url: result.secure_url,
    publicId: result.public_id,
    width: result.width,
    height: result.height,
    bytes: result.bytes,
  };
}

export async function deleteFromCloudinary(publicId: string, kind: UploadKind) {
  await cloudinary.uploader.destroy(publicId, {
    resource_type: kind === "pdf" ? "raw" : "image",
  });
}

export { cloudinary };
