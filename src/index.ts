import { cleanupHtml } from "./utilities/cleanup_html";
import { simplifiedMarkdown } from "./utilities/simplified_markdown";
import { stripTagsWithContent } from "./utilities/striptag";

export function htmlToAiReady(html: string): string {
  // Strip scripts, styles, and other non-content tags
  html = stripTagsWithContent(html, ["head", "script", "style", "svg", "iframe", "noscript", "object", "embed"]);

  // Cleanup HTML
  html = cleanupHtml(html);

  // Convert to simplified markdown
  html = simplifiedMarkdown(html);

  // Remove remaining HTML tags
  let text = html.replace(/<[^>]*>/g, " ");

  // Normalize whitespace
  text = text.replace(/\s+/g, " ");

  // Fix line breaks and spacing
  text = text.replace(/\n\s+/g, "\n");
  text = text.replace(/\n{3,}/g, "\n\n");

  return text.trim();
}
