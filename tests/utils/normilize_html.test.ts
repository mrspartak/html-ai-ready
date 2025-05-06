import { describe, expect, it } from "vitest";
import { normalizeHtml } from "../../src/utilities/normilize_html";

describe("normalizeHtml", () => {
  it("should return empty string for falsy input", () => {
    expect(normalizeHtml("")).toBe("");
    expect(normalizeHtml(null as any)).toBe("");
    expect(normalizeHtml(undefined as any)).toBe("");
  });

  it("should fix self-closing tags without proper closure", () => {
    expect(normalizeHtml("<img src='test.jpg'>")).toBe("<img src='test.jpg'/>");
    expect(normalizeHtml("<br>")).toBe("<br/>");
    expect(normalizeHtml("<input type='text'>")).toBe("<input type='text'/>");
    expect(normalizeHtml("<hr class='divider'>")).toBe("<hr class='divider'/>");
  });

  it("should handle multiple self-closing tags", () => {
    const input = "<div><img src='img1.jpg'><img src='img2.jpg'><br></div>";
    const expected = "<div><img src='img1.jpg'/><img src='img2.jpg'/><br/></div>";
    expect(normalizeHtml(input)).toBe(expected);
  });

  it("should add closing tags for unclosed block elements", () => {
    expect(normalizeHtml("<div><p>Text")).toBe("<div><p>Text</p></div>");
    expect(normalizeHtml("<ul><li>Item 1<li>Item 2")).toBe("<ul><li>Item 1</li><li>Item 2</li></ul>");
    expect(normalizeHtml("<table><tr><td>Data")).toBe("<table><tr><td>Data</td></tr></table>");
  });

  it("should handle mixed issues with self-closing and unclosed tags", () => {
    const input = "<div><p>Text with <img src='test.jpg'> image<span>and span";
    const expected = "<div><p>Text with <img src='test.jpg'/> image<span>and span</span></p></div>";
    expect(normalizeHtml(input)).toBe(expected);
  });

  it("should handle nested structures correctly", () => {
    const input = "<div><p>Outer paragraph <span>with span <strong>and strong</div>";
    const expected = "<div><p>Outer paragraph <span>with span <strong>and strong</strong></span></p></div>";
    expect(normalizeHtml(input)).toBe(expected);
  });

  it("should not add closing tags for self-closing elements", () => {
    const input = "<div><p>Text with <br> and <hr> and <img src='test.jpg'></p></div>";
    const expected = "<div><p>Text with <br/> and <hr/> and <img src='test.jpg'/></p></div>";
    expect(normalizeHtml(input)).toBe(expected);
  });

  it("should preserve already well-formed HTML", () => {
    const wellFormedHtml = "<div><p>Text</p><img src='test.jpg'/></div>";
    expect(normalizeHtml(wellFormedHtml)).toBe(wellFormedHtml);
  });

  it("should handle already correctly closed self-closing tags", () => {
    const input = "<div><img src='test.jpg'/><br/></div>";
    expect(normalizeHtml(input)).toBe(input);
  });

  it("should handle complex HTML with multiple issues", () => {
    const input = `
      <div class="container">
        <h1>Title</h1>
        <p>Some text with <strong>bold content
        <ul>
          <li>Item 1 with <img src="item1.jpg">
          <li>Item 2 with <br>
          <li>Item 3
        </ul>
        <table>
          <tr><th>Header 1<th>Header 2
          <tr><td>Data 1<td>Data 2
      </div>
    `;

    const expected = `
      <div class="container">
        <h1>Title</h1>
        <p>Some text with <strong>bold content</strong></p>
        <ul>
          <li>Item 1 with <img src="item1.jpg"/></li>
          <li>Item 2 with <br/></li>
          <li>Item 3</li>
        </ul>
        <table>
          <tr><th>Header 1</th><th>Header 2</th></tr>
          <tr><td>Data 1</td><td>Data 2</td></tr>
        </table>
      </div>
    `;

    // Clean up whitespace to make comparison easier
    const normalizedInput = normalizeHtml(input).replace(/\s+/g, " ").trim();
    const normalizedExpected = expected.replace(/\s+/g, " ").trim();

    expect(normalizedInput).toBe(normalizedExpected);
  });
});
