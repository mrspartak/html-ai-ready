type StripTagWithContentOptions = {
  handleSelfClosingTags?: boolean;
};

const defaultOptions: StripTagWithContentOptions = {
  handleSelfClosingTags: true,
};

export function stripTagWithContent(html: string, tag: string, options: StripTagWithContentOptions = {}): string {
  if (!html) return "";

  options = { ...defaultOptions, ...options };

  // Handle self-closing tags first
  if (options.handleSelfClosingTags === true) {
    const selfClosingRegex = new RegExp(`<\\s*${tag}\\b\\s*[^>]*\\s*\\/>`, "gi");
    html = html.replace(selfClosingRegex, "");
  }

  // Process nested tags with a character-by-character approach
  // Add flexibility for whitespace around tag names and word boundary for exact matches
  const openingTagRegex = new RegExp(`<\\s*${tag}\\b\\s*(?:[^>]*)?>`, "i");
  const closingTagRegex = new RegExp(`<\\s*/\\s*${tag}\\b\\s*>`, "i");

  let result = "";
  let i = 0;

  while (i < html.length) {
    // Check if we're at the start of an opening tag
    const restOfHtml = html.slice(i);
    const openMatch = restOfHtml.match(openingTagRegex);

    if (!openMatch || openMatch.index === undefined) {
      // No more opening tags, add the rest and break
      result += restOfHtml;
      break;
    }

    // Add text before the opening tag
    result += restOfHtml.slice(0, openMatch.index);

    // Find the matching closing tag (accounting for nesting)
    let depth = 1;
    let j = i + openMatch.index + openMatch[0].length;

    while (j < html.length && depth > 0) {
      const remainingHtml = html.slice(j);
      const nextOpenMatch = remainingHtml.match(openingTagRegex);
      const nextCloseMatch = remainingHtml.match(closingTagRegex);

      // No more tags, break
      if (!nextOpenMatch && !nextCloseMatch) break;

      const nextOpenIndex = nextOpenMatch?.index ?? Number.POSITIVE_INFINITY;
      const nextCloseIndex = nextCloseMatch?.index ?? Number.POSITIVE_INFINITY;

      if (nextOpenIndex !== Number.POSITIVE_INFINITY && nextOpenIndex < nextCloseIndex) {
        // Found another opening tag first
        depth++;
        j += nextOpenIndex + (nextOpenMatch?.[0].length ?? 0);
      } else if (nextCloseIndex !== Number.POSITIVE_INFINITY) {
        // Found a closing tag
        depth--;
        j += nextCloseIndex + (nextCloseMatch?.[0].length ?? 0);
      } else {
        // Shouldn't happen, but just in case
        break;
      }
    }

    // Move past the entire tag structure (including content)
    i = j;
  }

  return result;
}

export function stripTagsWithContent(html: string, tags: string[], options: StripTagWithContentOptions = {}): string {
  if (!html) return "";

  options = { ...defaultOptions, ...options };

  return tags.reduce((acc, tag) => stripTagWithContent(acc, tag, options), html);
}
