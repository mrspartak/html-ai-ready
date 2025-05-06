/**
 * Normalizes HTML content by fixing common HTML formatting issues.
 *
 * This function performs two main operations:
 * 1. Ensures self-closing tags have proper closure format (e.g., <br> → <br/>)
 * 2. Adds missing closing tags for potentially truncated HTML content
 *
 * @param html - The HTML string to normalize
 * @returns A normalized version of the HTML with proper tag formatting
 */
export function normalizeHtml(html: string) {
  if (!html) return "";

  // Fix common issues in malformed HTML
  // 1. Self-closing tags without proper closure
  html = html.replace(
    /<(area|base|br|col|embed|hr|img|input|link|meta|param|source|track|wbr)([^>]*)(\s*)(?!\/)>/gi,
    "<$1$2$3/>",
  );

  // 2. Fix unclosed tags in truncated content
  const openingTags = html.match(/<([a-z]+)[^>]*>/gi) || [];
  const closingTags = html.match(/<\/([a-z]+)[^>]*>/gi) || [];
  const openTagsCount: Record<string, number> = {};

  // Count opening tags
  for (const tag of openingTags) {
    const tagName = tag.match(/<([a-z]+)[^>]*>/i)?.[1].toLowerCase();
    if (tagName) {
      openTagsCount[tagName] = (openTagsCount[tagName] || 0) + 1;
    }
  }

  // Subtract closing tags
  for (const tag of closingTags) {
    const tagName = tag.match(/<\/([a-z]+)[^>]*>/i)?.[1].toLowerCase();
    if (tagName) {
      openTagsCount[tagName] = (openTagsCount[tagName] || 0) - 1;
    }
  }

  // Add missing closing tags
  let additionalClosingTags = "";
  for (const tag in openTagsCount) {
    const count = openTagsCount[tag];
    if (count > 0) {
      // Only add closing tags for block elements that might affect parsing
      if (["div", "p", "span", "table", "tr", "td", "th", "ul", "ol", "li", "form"].includes(tag)) {
        for (let i = 0; i < count; i++) {
          additionalClosingTags += `</${tag}>`;
        }
      }
    }
  }

  return html + additionalClosingTags;
}
