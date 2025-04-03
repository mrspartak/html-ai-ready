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

  // Convert links to markdown
  html = html.replace(/<a[^>]*href=["'](.*?)["'][^>]*>(.*?)<\/a>/gi, "[$2]($1)");

  // Convert emphasis
  html = html.replace(/<strong[^>]*>(.*?)<\/strong>/gi, "**$1**");
  html = html.replace(/<b[^>]*>(.*?)<\/b>/gi, "**$1**");
  html = html.replace(/<em[^>]*>(.*?)<\/em>/gi, "*$1*");
  html = html.replace(/<i[^>]*>(.*?)<\/i>/gi, "*$1*");

  // Convert paragraphs and line breaks
  html = html.replace(/<p[^>]*>(.*?)<\/p>/gi, "\n\n$1\n\n");
  html = html.replace(/<br\s*\/?>/gi, "\n");

  // Convert blockquotes
  html = html.replace(/<blockquote[^>]*>(.*?)<\/blockquote>/gis, "\n> $1\n");

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

  return html;
}
