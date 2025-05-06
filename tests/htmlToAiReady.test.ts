import { describe, expect, it } from "vitest";
import { PRESET_FAST, PRESET_QUALITY, htmlToAiReady } from "../src";

describe("htmlToAiReady", () => {
  describe("PRESET_FAST", () => {
    it("should handle nested elements with basic formatting", () => {
      const html = "<div><p>Text with <strong>bold</strong> and <em>italic</em> content</p></div>";
      const result = htmlToAiReady(html, PRESET_FAST);
      expect(result).toBe("Text with bold and italic content");
    });

    it("should handle lists in a basic way", () => {
      const html = "<ul><li>Item 1</li><li>Item 2</li><li>Item 3</li></ul>";
      const result = htmlToAiReady(html, PRESET_FAST);
      expect(result).toBe("Item 1 Item 2 Item 3");
    });

    it("should handle ordered lists in a basic way", () => {
      const html = "<ol><li>First</li><li>Second</li><li>Third</li></ol>";
      const result = htmlToAiReady(html, PRESET_FAST);
      expect(result).toBe("First Second Third");
    });

    it("should handle headings in a basic way", () => {
      const html = "<h1>Title</h1><h2>Subtitle</h2><p>Content</p>";
      const result = htmlToAiReady(html, PRESET_FAST);
      expect(result).toBe("Title Subtitle Content");
    });

    it("should handle links in a basic way", () => {
      const html = "<p>Visit our <a href='https://example.com'>website</a></p>";
      const result = htmlToAiReady(html, PRESET_FAST);
      expect(result).toBe("Visit our website");
    });

    it("should ignore script and style tags", () => {
      const html = "<div>Visible content<script>alert('hidden')</script><style>.hide{display:none}</style></div>";
      const result = htmlToAiReady(html, PRESET_FAST);
      expect(result).toBe("Visible content");
    });

    it("should keep content of form tag", () => {
      const html =
        "<form><input type='text' name='name' value='John'><input type='submit' value='Submit'> Content</form>";
      const result = htmlToAiReady(html, PRESET_FAST);
      expect(result).toBe("Content");
    });
  });

  describe("PRESET_QUALITY", () => {
    it("should handle nested elements with better formatting", () => {
      const html = "<div><p>Text with <strong>bold</strong> and <em>italic</em> content</p></div>";
      const result = htmlToAiReady(html, PRESET_QUALITY);
      expect(result).toBe("Text with **bold** and *italic* content");
    });

    it("should handle lists with better formatting", () => {
      const html = "<ul><li>Item 1</li><li>Item 2</li><li>Item 3</li></ul>";
      const result = htmlToAiReady(html, PRESET_QUALITY);
      expect(result).toBe("- Item 1 - Item 2 - Item 3");
    });

    it("should handle ordered lists with better formatting", () => {
      const html = "<ol><li>First</li><li>Second</li><li>Third</li></ol>";
      const result = htmlToAiReady(html, PRESET_QUALITY);
      expect(result).toBe("1. First 2. Second 3. Third");
    });

    it("should handle headings with better formatting", () => {
      const html = "<h1>Title</h1><h2>Subtitle</h2><p>Content</p>";
      const result = htmlToAiReady(html, PRESET_QUALITY);
      expect(result).toBe("# Title ## Subtitle Content");
    });

    it("should handle links with better formatting", () => {
      const html = "<p>Visit our <a href='https://example.com'>website</a></p>";
      const result = htmlToAiReady(html, PRESET_QUALITY);
      expect(result).toBe("Visit our [Link: website]");
    });

    it("should handle tables with better formatting", () => {
      const html = `
        <table>
          <tr><th>Name</th><th>Age</th></tr>
          <tr><td>John</td><td>30</td></tr>
          <tr><td>Jane</td><td>25</td></tr>
        </table>
      `;
      const result = htmlToAiReady(html, PRESET_QUALITY);
      expect(result).toBe("| Name | Age | | --- | --- | | John | 30 | | Jane | 25 |");
    });

    it("should handle code blocks with better formatting", () => {
      const html = "<pre><code>function example() {\n  return true;\n}</code></pre>";
      const result = htmlToAiReady(html, PRESET_QUALITY);
      expect(result).toBe("``` function example() { return true; } ```");
    });

    it("should handle images with alt text", () => {
      const html = "<img src='image.jpg' alt='Description of image'>";
      const result = htmlToAiReady(html, PRESET_QUALITY);
      expect(result).toBe("[Image: Description of image]");
    });

    it("should handle images without alt text", () => {
      const html = "<img src='image.jpg'>";
      const result = htmlToAiReady(html, PRESET_QUALITY);
      expect(result).toBe("");
    });

    it("should remove more unnecessary tags compared to FAST preset", () => {
      const html = "<div>Content<aside>Side note</aside><iframe src='example.com'></iframe></div>";
      const result = htmlToAiReady(html, PRESET_QUALITY);
      expect(result).toBe("Content");
    });

    it("should handle select components", () => {
      const html = "<select name='color'><option value='red'>Red</option><option value='blue'>Blue</option></select>";
      const result = htmlToAiReady(html, PRESET_QUALITY);
      expect(result).toBe("[Select: color] Options: red: Red, blue: Blue");
    });
  });
});
