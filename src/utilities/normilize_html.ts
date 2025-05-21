export function normalizeHtml(html: string): string {
  if (!html) return "";

  const selfClosingTags = new Set([
    "area", "base", "br", "col", "embed", "hr", "img", "input", "link", "meta", "param", "source", "track", "wbr"
  ]);

  const stack: string[] = [];
  let output = "";
  let i = 0;

  // Pre-normalize known self-closing tags to simplify subsequent parsing.
  // This ensures they are in <tag .../> format.
  // Adjusted regex to capture attributes correctly and handle optional space before slash.
  html = html.replace(
    /<(area|base|br|col|embed|hr|img|input|link|meta|param|source|track|wbr)((?:\s+[^>]*)?)(\s*\/)?>/gi,
    (match, tagName, attributesStr, slash) => {
      // attributesStr will include the leading space if attributes exist.
      // Trim it to avoid issues if it's empty or only whitespace.
      const attributes = (attributesStr || "").trimRight();
      return `<${tagName.toLowerCase()}${attributes ? attributes : ''}/>`; // Attributes already has leading space if non-empty
    }
  );

  while (i < html.length) {
    if (html[i] === "<") {
      // Attempt to match closing tag: </tag_name>
      const closingTagMatch = html.substring(i).match(/^<\/\s*([a-zA-Z0-9]+)\s*>/);
      if (closingTagMatch) {
        const tagName = closingTagMatch[1].toLowerCase();
        if (stack.length > 0 && stack[stack.length - 1] === tagName) {
          stack.pop();
          output += `</${tagName}>`;
        } else {
          // Mismatched or orphaned closing tag, ignore.
        }
        i += closingTagMatch[0].length;
        continue;
      }

      // Attempt to match opening tag or an explicitly self-closed tag (e.g., <div/>)
      // Regex: <tag_name attributes_string optional_slash>
      // Attributes part (?:\s+[^>]*)? is non-capturing, optional, and matches if there's a space followed by attributes.
      const tagMatch = html.substring(i).match(/^<([a-zA-Z0-9]+)((?:\s+[^>]*)?)??(\s*\/)?>/);
      if (tagMatch) {
        const tagName = tagMatch[1].toLowerCase();
        const attributes = (tagMatch[2] || "").trimRight(); // Attribs will have leading space if present
        const isExplicitlySelfClosed = !!tagMatch[3];

        if (selfClosingTags.has(tagName) || isExplicitlySelfClosed) {
          output += `<${tagName}${attributes ? attributes : ''}/>`;
        } else {
          stack.push(tagName);
          output += `<${tagName}${attributes ? attributes : ''}>`;
        }
        i += tagMatch[0].length;
        continue;
      }
    }

    // Text content processing
    const nextTagStart = html.indexOf("<", i);
    if (nextTagStart === -1) {
      output += html.substring(i);
      break;
    }
    output += html.substring(i, nextTagStart);
    i = nextTagStart;
  }

  while (stack.length > 0) {
    const tagName = stack.pop();
    output += `</${tagName}>`;
  }

  return output;
}
