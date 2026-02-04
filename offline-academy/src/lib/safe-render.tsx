/**
 * OWASP Security: Safe React Content Rendering
 *
 * React prevents XSS by default by escaping text content.
 * This module provides safe abstractions for rendering user input.
 */

import { sanitizeHtmlContent } from "./sanitizer";

/* -------------------- SafeText -------------------- */

interface SafeTextProps {
  text: string;
  className?: string;
}

/**
 * SafeText
 * React auto-escapes text → XSS impossible
 */
export function SafeText({ text, className }: SafeTextProps) {
  return <span className={className}>{text}</span>;
}

/* -------------------- SafeHtml -------------------- */

type AllowedHtmlTag =
  | "div"
  | "span"
  | "p"
  | "section"
  | "article"
  | "blockquote";

/**
 * SafeHtml
 * Renders sanitized HTML ONLY
 */
interface SafeHtmlProps {
  html: string;
  className?: string;
  tag?: AllowedHtmlTag;
}

export function SafeHtml({
  html,
  className,
  tag = "div",
}: SafeHtmlProps) {
  const sanitized = sanitizeHtmlContent(html);

  const Tag = tag;

  return (
    <Tag
      className={className}
      dangerouslySetInnerHTML={{ __html: sanitized }}
    />
  );
}

/* -------------------- Helpers -------------------- */

/**
 * Escape raw HTML for code / debug output
 */
export function escapeHtml(text: string): string {
  const map: Record<string, string> = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#x27;",
    "/": "&#x2F;",
  };

  return text.replace(/[&<>"'/]/g, (char) => map[char]);
}

/**
 * Detects presence of HTML tags
 */
export function containsHtml(text: string): boolean {
  return /<[^>]+>/.test(text);
}

/**
 * Automatically chooses SafeText or SafeHtml
 */
export function renderSafeContent(
  content: string,
  className?: string
) {
  return containsHtml(content) ? (
    <SafeHtml html={content} className={className} />
  ) : (
    <SafeText text={content} className={className} />
  );
}
