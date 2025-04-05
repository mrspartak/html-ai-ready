export function cleanupHtml(html: string): string {
  if (!html) return "";

  // Remove comments
  html = html.replace(/<!--[\s\S]*?-->/g, "");

  // Remove CDATA sections
  html = html.replace(/<!\[CDATA\[[\s\S]*?\]\]>/g, "");

  return html;
}
