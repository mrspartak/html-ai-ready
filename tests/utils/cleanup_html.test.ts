import { describe, expect, it } from "vitest";
import { cleanupHtml } from "../../src/utilities/cleanup_html";

describe("cleanupHtml", () => {
  it("should remove HTML comments", () => {
    expect(cleanupHtml("before <!-- comment --> after")).toBe("before  after");
    expect(cleanupHtml("<!-- comment -->")).toBe("");
    expect(cleanupHtml("<!--multi\nline\ncomment-->")).toBe("");
  });

  it("should remove CDATA sections", () => {
    expect(cleanupHtml("before <![CDATA[data content]]> after")).toBe("before  after");
    expect(cleanupHtml("<![CDATA[just cdata]]>")).toBe("");
    expect(cleanupHtml("<![CDATA[\nmulti-line\ncdata\n]]>")).toBe("");
  });

  it("should handle multiple different elements", () => {
    const html = `
      <?xml version="1.0" encoding="UTF-8"?>
      <!DOCTYPE html>
      <html>
        <!-- Header comment -->
        <head>
          <title>Test</title>
        </head>
        <body>
          <![CDATA[Some data]]>
          <p>Regular content</p>
          <!-- Footer comment -->
        </body>
      </html>
    `;

    const expected = `
      <?xml version="1.0" encoding="UTF-8"?>
      <!DOCTYPE html>
      <html>
        
        <head>
          <title>Test</title>
        </head>
        <body>
          
          <p>Regular content</p>
          
        </body>
      </html>
    `;

    expect(cleanupHtml(html)).toBe(expected);
  });

  it("should handle nested comments", () => {
    // Note: HTML spec doesn't actually support nested comments,
    // but testing the regex handling for complex cases
    expect(cleanupHtml("<!-- outer <!-- nested --> comment -->")).toBe(" comment -->");
  });

  it("should handle complex CDATA sections", () => {
    expect(cleanupHtml("<![CDATA[This CDATA section contains <tags> & entities]]>")).toBe("");
  });

  it("should handle empty strings", () => {
    expect(cleanupHtml("")).toBe("");
  });

  it("should handle null or undefined input", () => {
    expect(cleanupHtml(null as any)).toBe("");
    expect(cleanupHtml(undefined as any)).toBe("");
  });

  it("should not modify HTML without special elements", () => {
    const html = "<div><p>Just regular HTML without comments or special sections</p></div>";
    expect(cleanupHtml(html)).toBe(html);
  });

  it("should handle malformed special elements", () => {
    expect(cleanupHtml("<!-- unclosed comment")).toBe("<!-- unclosed comment");
    expect(cleanupHtml("<![CDATA[unclosed cdata")).toBe("<![CDATA[unclosed cdata");
    expect(cleanupHtml("<!DOCTYPE html unclosed")).toBe("<!DOCTYPE html unclosed");
    expect(cleanupHtml("<?xml unclosed")).toBe("<?xml unclosed");
  });
});
