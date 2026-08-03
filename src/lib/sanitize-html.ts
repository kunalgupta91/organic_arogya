import DOMPurify from "isomorphic-dompurify";

/**
 * Sanitizes rich-text HTML from the TipTap admin editor before it's
 * persisted. Defense-in-depth: even though only STAFF/ADMIN can write
 * blog content, sanitizing at write time means a compromised admin
 * account (or a future editor integration) can't inject scripts that
 * live in the database forever.
 */
export function sanitizeRichText(html: string): string {
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: [
      "p",
      "br",
      "strong",
      "em",
      "u",
      "s",
      "h2",
      "h3",
      "ul",
      "ol",
      "li",
      "blockquote",
      "a",
      "img",
      "code",
      "pre",
    ],
    ALLOWED_ATTR: ["href", "src", "alt", "title", "target", "rel"],
  });
}
