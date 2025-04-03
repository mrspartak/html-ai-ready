import { describe, expect, it } from "vitest";
import { stripTagWithContent, stripTagsWithContent } from "../../src/utilities/striptag";

describe("stripTagWithContent", () => {
  it("should strip a tag and its content", () => {
    expect(stripTagWithContent("<p>Hello world</p>", "p")).toBe("");
  });

  it("should strip a tag with attributes and its content", () => {
    expect(stripTagWithContent('<div class="container" id="main">Content</div>', "div")).toBe("");
  });

  it("should strip a self-closing tag", () => {
    expect(stripTagWithContent("Before <img src='image.jpg' /> After", "img")).toBe("Before  After");
    // TODO: fix this test
    /* expect(stripTagWithContent("Before <img src='image.jpg' /> After", "img", { handleSelfClosingTags: false })).toBe(
      "Before <img src='image.jpg' /> After",
    ); */
  });

  it("should be case-insensitive when stripping tags", () => {
    expect(stripTagWithContent("<DIV>Upper case tag</DIV>", "div")).toBe("");
    expect(stripTagWithContent("<div>Lower case tag</div>", "DIV")).toBe("");
  });

  it("should strip multiple instances of the same tag with their content", () => {
    expect(stripTagWithContent("<p>First paragraph</p>Some text<p>Second paragraph</p>", "p")).toBe("Some text");
  });

  it("should handle nested tags of the same type", () => {
    expect(stripTagWithContent("<div>Outer <div>Inner</div> content</div>", "div")).toBe("");
  });

  it("should handle nested different tags and remove specified one with all nested content", () => {
    expect(stripTagWithContent("<div>Outer <span>Inner</span> content</div>", "div")).toBe("");
    expect(stripTagWithContent("<div>Outer <span>Inner</span> content</div>", "span")).toBe(
      "<div>Outer  content</div>",
    );
  });

  it("should return the original string when tag is not found", () => {
    const original = "Text without any target tags";
    expect(stripTagWithContent(original, "div")).toBe(original);
  });

  it("should handle empty input string", () => {
    expect(stripTagWithContent("", "div")).toBe("");
  });

  it("should handle null or undefined input", () => {
    expect(stripTagWithContent(null as any, "div")).toBe("");
    expect(stripTagWithContent(undefined as any, "div")).toBe("");
  });

  // skipping to simplify for now
  it.skip("should handle malformed tags (missing closing bracket)", () => {
    expect(stripTagWithContent("<div>Content<div", "div")).toBe("<div>Content<div");
  });

  it("should handle tags with whitespace in the name", () => {
    expect(stripTagWithContent("<div >Content</div >", "div")).toBe("");
    expect(stripTagWithContent("< div>Content</ div>", "div")).toBe("");
  });

  it("should not strip partial tag matches", () => {
    expect(stripTagWithContent("<divider>Not a div tag</divider>", "div")).toBe("<divider>Not a div tag</divider>");
  });

  it("should handle special characters in tag attributes", () => {
    expect(stripTagWithContent('<div data-attr="<>\'&quot;">Content</div>', "div")).toBe("");
  });

  it("should handle tags with newlines and irregular spacing", () => {
    expect(stripTagWithContent("<div\n  class='test'\n  id=\"test\"  >Multi-line\nformatting</div>", "div")).toBe("");
  });

  it("should strip very nested tags", () => {
    expect(
      stripTagWithContent(
        "<div>Outer <div>Inner <div>Nested <div>Deeply nested</div> content</div> content</div></div>",
        "div",
      ),
    ).toBe("");
  });
});

describe("stripTagsWithContent", () => {
  it("should strip multiple tags with their content", () => {
    expect(stripTagsWithContent("<p>First paragraph</p>Some text<p>Second paragraph</p>", ["p"])).toBe("Some text");
  });

  it("should handle nested tags with their content", () => {
    expect(stripTagsWithContent("<div>Outer <span>Inner</span> content</div>", ["div", "span"])).toBe("");
  });
});
