"use client";

import { useRef, useState } from "react";
import { Input } from "@/components/ui/input";

type DocItem = { url: string; title: string; type: "BROCHURE" | "CERTIFICATE" };

export function DocumentUploader({ defaultDocuments = [] }: { defaultDocuments?: DocItem[] }) {
  const [documents, setDocuments] = useState<DocItem[]>(defaultDocuments);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFile(file: File | undefined) {
    if (!file) return;
    setIsUploading(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("kind", "pdf");
      formData.append("folder", "product-documents");
      const res = await fetch("/api/admin/upload", { method: "POST", body: formData });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error ?? "Upload failed");
      }
      const data = await res.json();
      setDocuments((prev) => [
        ...prev,
        { url: data.url, title: file.name.replace(/\.pdf$/i, ""), type: "BROCHURE" },
      ]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setIsUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  function updateDoc(index: number, patch: Partial<DocItem>) {
    setDocuments((prev) => prev.map((doc, i) => (i === index ? { ...doc, ...patch } : doc)));
  }

  function removeDoc(index: number) {
    setDocuments((prev) => prev.filter((_, i) => i !== index));
  }

  return (
    <div className="space-y-3">
      <input type="hidden" name="documents" value={JSON.stringify(documents)} />
      {documents.map((doc, i) => (
        <div key={doc.url} className="border-border flex items-center gap-2 rounded-lg border p-2">
          <Input
            value={doc.title}
            onChange={(e) => updateDoc(i, { title: e.target.value })}
            className="h-9"
            placeholder="Document title"
          />
          <select
            value={doc.type}
            onChange={(e) => updateDoc(i, { type: e.target.value as DocItem["type"] })}
            className="border-border h-9 rounded-md border bg-white px-2 text-sm"
          >
            <option value="BROCHURE">Brochure</option>
            <option value="CERTIFICATE">Certificate</option>
          </select>
          <a
            href={doc.url}
            target="_blank"
            rel="noreferrer"
            className="text-primary-600 text-sm whitespace-nowrap hover:underline"
          >
            Preview
          </a>
          <button
            type="button"
            onClick={() => removeDoc(i)}
            className="text-sm text-red-600 hover:underline"
          >
            Remove
          </button>
        </div>
      ))}
      <label className="border-border text-muted-foreground inline-flex cursor-pointer items-center rounded-lg border border-dashed px-4 py-2 text-sm hover:bg-white">
        {isUploading ? "Uploading…" : "+ Upload PDF"}
        <input
          ref={inputRef}
          type="file"
          accept="application/pdf"
          className="hidden"
          onChange={(e) => handleFile(e.target.files?.[0])}
          disabled={isUploading}
        />
      </label>
      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
}
