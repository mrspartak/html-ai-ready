import { cleanupHtml } from "./utilities/cleanup_html";
import { simplifiedMarkdown } from "./utilities/simplified_markdown";
import { stripTagsWithContent } from "./utilities/striptag";

const PRESETS = {
  FAST: {
    tags: ["head", "svg", "nav", "script", "style", "form", "button"],
    stripTagsOptions: {
      handleSelfClosingTags: false,
    },
  },
  QUALITY: {
    tags: [
      "head",
      "svg",
      "nav",
      "script",
      "style",
      "form",
      "button",
      "aside",
      "noscript",
      "iframe",
      "video",
      "canvas",
      "object",
      "audio",
      "embed",
      "link",
    ],
    stripTagsOptions: {
      handleSelfClosingTags: true,
    },
  },
};
export type Preset = keyof typeof PRESETS;
export const PRESET_FAST: Preset = "FAST";
export const PRESET_QUALITY: Preset = "QUALITY";

export function htmlToAiReady(html: string, preset: Preset = PRESET_FAST): string {
  // Strip scripts, styles, and other non-content tags
  html = stripTagsWithContent(html, PRESETS[preset].tags, PRESETS[preset].stripTagsOptions);

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
