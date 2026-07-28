"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

type ImageItem = { url: string; alt: string | null; isThumbnail: boolean };

export function ImageUploader({ defaultImages = [] }: { defaultImages?: ImageItem[] }) {
  const [images, setImages] = useState<ImageItem[]>(defaultImages);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFiles(files: FileList | null) {
    if (!files?.length) return;
    setIsUploading(true);
    setError(null);
    try {
      const uploaded: ImageItem[] = [];
      for (const file of Array.from(files)) {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("kind", "image");
        formData.append("folder", "products");
        const res = await fetch("/api/admin/upload", { method: "POST", body: formData });
        if (!res.ok) {
          const body = await res.json().catch(() => ({}));
          throw new Error(body.error ?? "Upload failed");
        }
        const data = await res.json();
        uploaded.push({ url: data.url, alt: "", isThumbnail: false });
      }
      setImages((prev) => [...prev, ...uploaded]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setIsUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  function removeImage(index: number) {
    setImages((prev) => prev.filter((_, i) => i !== index));
  }

  function setThumbnail(index: number) {
    setImages((prev) => prev.map((img, i) => ({ ...img, isThumbnail: i === index })));
  }

  return (
    <div className="space-y-3">
      <input type="hidden" name="images" value={JSON.stringify(images)} />
      <div className="flex flex-wrap gap-3">
        {images.map((img, i) => (
          <div
            key={img.url}
            className={cn(
              "border-border relative h-24 w-24 overflow-hidden rounded-lg border",
              img.isThumbnail && "ring-primary-500 ring-2",
            )}
          >
            <Image src={img.url} alt={img.alt || "Product image"} fill className="object-cover" />
            <button
              type="button"
              onClick={() => removeImage(i)}
              className="absolute top-0.5 right-0.5 rounded-full bg-black/60 px-1.5 text-xs text-white"
            >
              ✕
            </button>
            <button
              type="button"
              onClick={() => setThumbnail(i)}
              className="absolute bottom-0.5 left-0.5 rounded bg-black/60 px-1.5 text-[10px] text-white"
            >
              {img.isThumbnail ? "Thumbnail" : "Set thumbnail"}
            </button>
          </div>
        ))}
        <label className="border-border text-muted-foreground flex h-24 w-24 cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed text-xs hover:bg-white">
          {isUploading ? "Uploading…" : "+ Add image"}
          <input
            ref={inputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/avif"
            multiple
            className="hidden"
            onChange={(e) => handleFiles(e.target.files)}
            disabled={isUploading}
          />
        </label>
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
}
