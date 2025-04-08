import { cleanupHtml } from "./utilities/cleanup_html";
import { simplifiedMarkdown } from "./utilities/simplified_markdown";
import { stripTagsWithContent } from "./utilities/striptag";

/**
 * Predefined configurations for HTML processing with different optimization priorities.
 * Each preset contains settings for tag removal and processing options.
 */
const PRESETS = {
  /**
   * Optimized for maximum speed with minimal processing.
   * Removes only essential non-content elements and skips markdown conversion.
   */
  FAST: {
    tags: ["head", "svg", "nav", "script", "style", "form", "button"],
    stripTagsOptions: {
      handleSelfClosingTags: false,
    },
    simplifiedMarkdownOptions: {
      skip: true,
    },
  },
  /**
   * Optimized for content quality and cleanliness.
   * Removes a comprehensive set of non-content elements and converts to simplified markdown.
   * Produces cleaner output at the cost of slightly more processing time.
   */
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
    simplifiedMarkdownOptions: {
      skip: false,
    },
  },
};

/**
 * Preset configuration for HTML processing.
 *
 * - `FAST`: Optimized for speed with minimal processing. Removes basic non-content elements
 *   and skips markdown conversion for maximum performance.
 *
 * - `QUALITY`: Provides more thorough content extraction by removing a comprehensive set
 *   of non-content elements and converting the result to simplified markdown format.
 *   This produces cleaner output at the cost of slightly more processing time.
 */
export type Preset = keyof typeof PRESETS;

/**
 * Preset optimized for maximum processing speed.
 * Use when performance is more important than content quality.
 */
export const PRESET_FAST: Preset = "FAST";

/**
 * Preset optimized for content quality and cleanliness.
 * Use when you need the cleanest possible output for AI processing.
 */
export const PRESET_QUALITY: Preset = "QUALITY";

/**
 * Converts HTML content to a format optimized for AI processing.
 *
 * This function performs several transformations:
 * 1. Removes non-content HTML elements like scripts, styles, and navigation
 * 2. Cleans up remaining HTML content
 * 3. Optionally converts to simplified markdown (with QUALITY preset)
 * 4. Removes remaining HTML tags
 * 5. Normalizes whitespace and line breaks
 *
 * @param html - The HTML string to process
 * @param preset - Processing configuration preset (FAST or QUALITY)
 * @returns A clean text representation of the content, optimized for AI consumption
 *
 * @includeExample examples/htmlToAiReady.ts
 */
export function htmlToAiReady(html: string, preset: Preset = PRESET_FAST): string {
  // Strip scripts, styles, and other non-content tags
  html = stripTagsWithContent(html, PRESETS[preset].tags, PRESETS[preset].stripTagsOptions);

  // Cleanup HTML
  html = cleanupHtml(html);

  // Convert to simplified markdown
  if (!PRESETS[preset].simplifiedMarkdownOptions.skip) {
    html = simplifiedMarkdown(html);
  }

  // Remove remaining HTML tags
  let text = html.replace(/<[^>]*>/g, " ");

  // Normalize whitespace
  text = text.replace(/\s+/g, " ");

  // Fix line breaks and spacing
  text = text.replace(/\n\s+/g, "\n");
  text = text.replace(/\n{3,}/g, "\n\n");

  return text.trim();
}
