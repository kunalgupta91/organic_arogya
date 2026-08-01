"use client";

import { useRef, useState } from "react";
import Image from "next/image";

export function CoverImageUploader({ defaultValue = "" }: { defaultValue?: string }) {
  const [url, setUrl] = useState(defaultValue);
  const [isUploading, setIsUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFile(file: File | undefined) {
    if (!file) return;
    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("kind", "image");
      formData.append("folder", "blog-covers");
      const res = await fetch("/api/admin/upload", { method: "POST", body: formData });
      if (res.ok) {
        const data = await res.json();
        setUrl(data.url);
      }
    } finally {
      setIsUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <div className="space-y-2">
      <input type="hidden" name="coverImage" value={url} />
      {url && (
        <div className="bg-muted relative h-40 w-full max-w-sm overflow-hidden rounded-lg">
          <Image src={url} alt="Cover" fill className="object-cover" />
        </div>
      )}
      <label className="border-border text-muted-foreground inline-flex cursor-pointer items-center rounded-lg border border-dashed px-4 py-2 text-sm hover:bg-white">
        {isUploading ? "Uploading…" : url ? "Replace cover image" : "Upload cover image"}
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/avif"
          className="hidden"
          onChange={(e) => handleFile(e.target.files?.[0])}
          disabled={isUploading}
        />
      </label>
    </div>
  );
}
