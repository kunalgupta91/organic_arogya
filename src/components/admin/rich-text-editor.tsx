"use client";

import { useRef } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  Quote,
  Heading2,
  ImageIcon,
  LinkIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

export function RichTextEditor({
  name,
  defaultValue = "",
}: {
  name: string;
  defaultValue?: string;
}) {
  const hiddenInputRef = useRef<HTMLInputElement>(null);

  const editor = useEditor({
    extensions: [StarterKit, Image, Link.configure({ openOnClick: false })],
    content: defaultValue,
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class: "prose-editor min-h-[240px] px-4 py-3 text-sm focus:outline-none",
      },
    },
    onUpdate: ({ editor }) => {
      if (hiddenInputRef.current) {
        hiddenInputRef.current.value = editor.getHTML();
      }
    },
  });

  async function uploadImage(file: File) {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("kind", "image");
    formData.append("folder", "blog");
    const res = await fetch("/api/admin/upload", { method: "POST", body: formData });
    if (!res.ok) return;
    const data = await res.json();
    editor?.chain().focus().setImage({ src: data.url }).run();
  }

  if (!editor) return null;

  const buttons = [
    {
      icon: Bold,
      label: "Bold",
      active: editor.isActive("bold"),
      onClick: () => editor.chain().focus().toggleBold().run(),
    },
    {
      icon: Italic,
      label: "Italic",
      active: editor.isActive("italic"),
      onClick: () => editor.chain().focus().toggleItalic().run(),
    },
    {
      icon: Heading2,
      label: "Heading",
      active: editor.isActive("heading", { level: 2 }),
      onClick: () => editor.chain().focus().toggleHeading({ level: 2 }).run(),
    },
    {
      icon: List,
      label: "Bullet list",
      active: editor.isActive("bulletList"),
      onClick: () => editor.chain().focus().toggleBulletList().run(),
    },
    {
      icon: ListOrdered,
      label: "Numbered list",
      active: editor.isActive("orderedList"),
      onClick: () => editor.chain().focus().toggleOrderedList().run(),
    },
    {
      icon: Quote,
      label: "Quote",
      active: editor.isActive("blockquote"),
      onClick: () => editor.chain().focus().toggleBlockquote().run(),
    },
    {
      icon: LinkIcon,
      label: "Link",
      active: editor.isActive("link"),
      onClick: () => {
        const url = window.prompt("URL");
        if (url) editor.chain().focus().setLink({ href: url }).run();
      },
    },
  ];

  return (
    <div className="border-border rounded-lg border bg-white">
      <input ref={hiddenInputRef} type="hidden" name={name} defaultValue={defaultValue} />
      <div className="border-border flex flex-wrap gap-1 border-b p-2">
        {buttons.map(({ icon: Icon, label, active, onClick }) => (
          <button
            key={label}
            type="button"
            onClick={onClick}
            aria-label={label}
            className={cn(
              "rounded p-1.5 hover:bg-neutral-100",
              active && "bg-primary-50 text-primary-700",
            )}
          >
            <Icon size={15} />
          </button>
        ))}
        <label className="cursor-pointer rounded p-1.5 hover:bg-neutral-100" aria-label="Insert image">
          <ImageIcon size={15} />
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp,image/avif"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) uploadImage(file);
            }}
          />
        </label>
      </div>
      <EditorContent editor={editor} />
    </div>
  );
}
