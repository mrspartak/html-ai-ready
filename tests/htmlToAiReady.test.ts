import { describe, expect, it } from "vitest";
import { htmlToAiReady } from "../src";

describe("htmlToAiReady", () => {
  it("should convert simple HTML to AI-ready text", () => {
    const html = "<p>Hello, world!</p>";
    const result = htmlToAiReady(html);
    expect(result).toBe("Hello, world!");
  });

  it("should handle multiple paragraphs", () => {
    const html = "<p>First paragraph</p><p>Second paragraph</p>";
    const result = htmlToAiReady(html);
    expect(result).toBe("First paragraph Second paragraph");
  });

  it("should handle nested elements", () => {
    const html = "<div><p>Text with <strong>bold</strong> and <em>italic</em> content</p></div>";
    const result = htmlToAiReady(html);
    expect(result).toBe("Text with **bold** and *italic* content");
  });

  it("should handle lists properly", () => {
    const html = "<ul><li>Item 1</li><li>Item 2</li><li>Item 3</li></ul>";
    const result = htmlToAiReady(html);
    expect(result).toBe("- Item 1 - Item 2 - Item 3");
  });

  it("should handle ordered lists", () => {
    const html = "<ol><li>First</li><li>Second</li><li>Third</li></ol>";
    const result = htmlToAiReady(html);
    expect(result).toBe("1. First 2. Second 3. Third");
  });

  it("should handle headings", () => {
    const html = "<h1>Title</h1><h2>Subtitle</h2><p>Content</p>";
    const result = htmlToAiReady(html);
    expect(result).toBe("# Title ## Subtitle Content");
  });

  it("should handle links", () => {
    const html = "<p>Visit our <a href='https://example.com'>website</a></p>";
    const result = htmlToAiReady(html);
    expect(result).toBe("Visit our [Link: website]");
  });

  it("should handle tables", () => {
    const html = `
      <table>
        <tr><th>Name</th><th>Age</th></tr>
        <tr><td>John</td><td>30</td></tr>
        <tr><td>Jane</td><td>25</td></tr>
      </table>
    `;
    const result = htmlToAiReady(html);
    expect(result).toBe("| Name | Age | | --- | --- | | John | 30 | | Jane | 25 |");
  });

  it("should handle code blocks", () => {
    const html = "<pre><code>function example() {\n  return true;\n}</code></pre>";
    const result = htmlToAiReady(html);
    expect(result).toBe("``` function example() { return true; } ```");
  });

  it("should handle images", () => {
    const html = "<img src='image.jpg' alt='Description of image'>";
    const result = htmlToAiReady(html);
    expect(result).toBe("[Image: Description of image]");

    const html2 = "<img src='image.jpg'>";
    const result2 = htmlToAiReady(html2);
    expect(result2).toBe("");
  });

  it("should ignore script and style tags", () => {
    const html = "<div>Visible content<script>alert('hidden')</script><style>.hide{display:none}</style></div>";
    const result = htmlToAiReady(html);
    expect(result).toBe("Visible content");
  });

  it("should handle empty input", () => {
    const html = "";
    const result = htmlToAiReady(html);
    expect(result).toBe("");
  });

  it("should handle malformed HTML", () => {
    const html = "<p>Unclosed paragraph <div>Nested content</p>";
    const result = htmlToAiReady(html);
    expect(result).toBe("Unclosed paragraph Nested content");
  });

  it("should handle HTML with comments", () => {
    const html = "<p>Text<!-- This is a comment -->More text</p>";
    const result = htmlToAiReady(html);
    expect(result).toBe("TextMore text");
  });
});
