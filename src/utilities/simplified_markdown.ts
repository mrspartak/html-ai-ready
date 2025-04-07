export function simplifiedMarkdown(html: string): string {
  if (!html) return "";

  // Convert headings to markdown
  html = html.replace(/<h1[^>]*>(.*?)<\/h1>/gi, "\n# $1\n");
  html = html.replace(/<h2[^>]*>(.*?)<\/h2>/gi, "\n## $1\n");
  html = html.replace(/<h3[^>]*>(.*?)<\/h3>/gi, "\n### $1\n");
  html = html.replace(/<h4[^>]*>(.*?)<\/h4>/gi, "\n#### $1\n");
  html = html.replace(/<h5[^>]*>(.*?)<\/h5>/gi, "\n##### $1\n");
  html = html.replace(/<h6[^>]*>(.*?)<\/h6>/gi, "\n###### $1\n");

  // Convert lists to markdown
  html = html.replace(/<ul[^>]*>(.*?)<\/ul>/gis, (match) => match.replace(/<li[^>]*>(.*?)<\/li>/gi, "\n- $1"));

  html = html.replace(/<ol[^>]*>(.*?)<\/ol>/gis, (match) => {
    let index = 1;
    return match.replace(/<li[^>]*>(.*?)<\/li>/gi, (match, content) => `\n${index++}. ${content}`);
  });

  // Convert emphasis (combined regexes)
  html = html.replace(/<(strong|b)[^>]*>(.*?)<\/\1>/gi, "**$2**");
  html = html.replace(/<(em|i)[^>]*>(.*?)<\/\1>/gi, "*$2*");

  // Convert paragraphs and line breaks
  html = html.replace(/<p[^>]*>(.*?)<\/p>/gi, "\n\n$1\n\n");
  html = html.replace(/<br\s*\/?>/gi, "\n");

  // Handle images - only keep those with non-empty alt attributes
  html = html.replace(/<img[^>]*alt=["']([^"']+)["'][^>]*>/gi, "[Image: $1]");

  // Remove any remaining images without alt text or with empty alt text
  html = html.replace(/<img[^>]*>/gi, "");

  // Handle code blocks
  html = html.replace(/<pre[^>]*><code[^>]*>(.*?)<\/code><\/pre>/gis, "\n```\n$1\n```\n");
  html = html.replace(/<code[^>]*>(.*?)<\/code>/gi, "`$1`");

  // Handle tables (basic conversion)
  html = html.replace(/<table[^>]*>(.*?)<\/table>/gis, (match) => {
    let result = "\n";
    // Extract rows
    const rows = match.match(/<tr[^>]*>(.*?)<\/tr>/gis);
    if (rows) {
      let headerProcessed = false;

      for (const row of rows) {
        // Extract cells
        const cells = row.match(/<t[hd][^>]*>(.*?)<\/t[hd]>/gi);
        if (cells) {
          result += `| ${cells
            .map((cell) => {
              return cell
                .replace(/<t[hd][^>]*>(.*?)<\/t[hd]>/i, "$1")
                .replace(/<[^>]*>/g, "") // Remove any nested tags
                .trim();
            })
            .join(" | ")} |\n`;

          // Add markdown table separator after header row
          if (!headerProcessed) {
            result += `| ${cells.map(() => "---").join(" | ")} |\n`;
            headerProcessed = true;
          }
        }
      }
    }

    return result;
  });

  // Convert links to simplified format - preserving any complex content inside
  html = html.replace(
    /<a[^>]*(?:title=["'](.*?)["'][^>]*)?href=["'][^"']*["'][^>]*>([\s\S]*?)<\/a>/gi,
    (match, title, content) => {
      if (!content) return "";
      if (title) {
        return `[Link (${title}): ${content}]`;
      }
      return `[Link: ${content}]`;
    },
  );

  return html;
}
