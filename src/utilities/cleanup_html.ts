/**
 * Cleans up HTML content by removing unnecessary elements to reduce token count
 * and prepare it for AI context.
 *
 * @param html - The HTML string to clean up
 * @returns A cleaned version of the HTML with unnecessary elements removed
 */
export function cleanupHtml(html: string): string {
  // Return empty string for null/undefined/empty input
  if (!html) return "";

  // Remove HTML comments (<!-- comment -->)
  // This pattern matches anything between <!-- and --> including newlines
  html = html.replace(/<!--[\s\S]*?-->/g, "");

  // Remove CDATA sections (<![CDATA[ data ]]>)
  // This pattern matches anything between <![CDATA[ and ]]> including newlines
  html = html.replace(/<!\[CDATA\[[\s\S]*?\]\]>/g, "");

  return html;
}
