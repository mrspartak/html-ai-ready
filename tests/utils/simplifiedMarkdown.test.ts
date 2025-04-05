import { describe, expect, it } from "vitest";
import { simplifiedMarkdown } from "../../src/utilities/simplified_markdown";

describe("simplifiedMarkdown", () => {
  it("should return empty string for falsy input", () => {
    expect(simplifiedMarkdown("")).toBe("");
    expect(simplifiedMarkdown(null as unknown as string)).toBe("");
    expect(simplifiedMarkdown(undefined as unknown as string)).toBe("");
  });

  it("should convert headings to markdown", () => {
    expect(simplifiedMarkdown("<h1>Title</h1>")).toContain("# Title");
    expect(simplifiedMarkdown("<h2>Subtitle</h2>")).toContain("## Subtitle");
    expect(simplifiedMarkdown("<h3>Section</h3>")).toContain("### Section");
    expect(simplifiedMarkdown("<h4>Subsection</h4>")).toContain("#### Subsection");
    expect(simplifiedMarkdown("<h5>Minor section</h5>")).toContain("##### Minor section");
    expect(simplifiedMarkdown("<h6>Detail</h6>")).toContain("###### Detail");

    // With attributes
    expect(simplifiedMarkdown('<h1 class="title">Heading with class</h1>')).toContain("# Heading with class");
  });

  it("should convert unordered lists to markdown", () => {
    const html = "<ul><li>Item 1</li><li>Item 2</li><li>Item 3</li></ul>";
    const markdown = simplifiedMarkdown(html);
    expect(markdown).toContain("- Item 1");
    expect(markdown).toContain("- Item 2");
    expect(markdown).toContain("- Item 3");
  });

  it("should convert ordered lists to markdown", () => {
    const html = "<ol><li>First</li><li>Second</li><li>Third</li></ol>";
    const markdown = simplifiedMarkdown(html);
    expect(markdown).toContain("1. First");
    expect(markdown).toContain("2. Second");
    expect(markdown).toContain("3. Third");
  });

  it("should convert links to markdown", () => {
    expect(simplifiedMarkdown('<a href="https://example.com">Example</a>')).toBe("[Example](https://example.com)");

    expect(simplifiedMarkdown('<a href="https://example.com" target="_blank">Example</a>')).toBe(
      "[Example](https://example.com)",
    );
  });

  it("should convert emphasis tags to markdown", () => {
    expect(simplifiedMarkdown("<strong>Bold text</strong>")).toBe("**Bold text**");
    expect(simplifiedMarkdown("<b>Bold text</b>")).toBe("**Bold text**");
    expect(simplifiedMarkdown("<em>Italic text</em>")).toBe("*Italic text*");
    expect(simplifiedMarkdown("<i>Italic text</i>")).toBe("*Italic text*");
  });

  it("should convert paragraphs and line breaks to markdown", () => {
    expect(simplifiedMarkdown("<p>Paragraph text</p>")).toContain("\n\nParagraph text\n\n");

    expect(simplifiedMarkdown("Line 1<br>Line 2")).toContain("Line 1\nLine 2");

    expect(simplifiedMarkdown("Line 1<br/>Line 2")).toContain("Line 1\nLine 2");
  });

  it("should convert code blocks to markdown", () => {
    expect(simplifiedMarkdown("<pre><code>console.log('hello');</code></pre>")).toContain(
      "```\nconsole.log('hello');\n```",
    );

    expect(simplifiedMarkdown("<code>const x = 1;</code>")).toBe("`const x = 1;`");
  });

  it("should convert tables to markdown", () => {
    const html = `
      <table>
        <tr><th>Name</th><th>Age</th></tr>
        <tr><td>Alice</td><td>25</td></tr>
        <tr><td>Bob</td><td>30</td></tr>
      </table>
    `;

    const markdown = simplifiedMarkdown(html);
    expect(markdown).toContain("| Name | Age |");
    expect(markdown).toContain("| --- | --- |");
    expect(markdown).toContain("| Alice | 25 |");
    expect(markdown).toContain("| Bob | 30 |");
  });

  it("should handle complex HTML with multiple elements", () => {
    const html = `
      <h1>Document Title</h1>
      <p>This is an <strong>important</strong> paragraph with <a href="https://example.com">a link</a>.</p>
      <ul>
        <li>Item with <em>emphasis</em></li>
        <li>Another item</li>
      </ul>
      <blockquote>This is a quote</blockquote>
      <pre><code>function test() { return true; }</code></pre>
    `;

    const markdown = simplifiedMarkdown(html);
    expect(markdown).toContain("# Document Title");
    expect(markdown).toContain("This is an **important** paragraph");
    expect(markdown).toContain("[a link](https://example.com)");
    expect(markdown).toContain("- Item with *emphasis*");
    expect(markdown).toContain("- Another item");
    expect(markdown).toContain("```\nfunction test() { return true; }\n```");
  });
});
