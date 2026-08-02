"use client";

import { useRef, useState } from "react";
import Image from "next/image";

export function SingleImageUploader({
  name,
  defaultValue = "",
  folder = "misc",
  label = "Upload image",
  aspectClassName = "h-40 w-full max-w-sm",
}: {
  name: string;
  defaultValue?: string;
  folder?: string;
  label?: string;
  aspectClassName?: string;
}) {
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
      formData.append("folder", folder);
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
      <input type="hidden" name={name} value={url} />
      {url && (
        <div className={`bg-muted relative overflow-hidden rounded-lg ${aspectClassName}`}>
          <Image src={url} alt="" fill className="object-cover" />
        </div>
      )}
      <label className="border-border text-muted-foreground inline-flex cursor-pointer items-center rounded-lg border border-dashed px-4 py-2 text-sm hover:bg-white">
        {isUploading ? "Uploading…" : url ? "Replace image" : label}
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
