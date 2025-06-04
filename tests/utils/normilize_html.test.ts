import { describe, expect, it } from "vitest";
import { normalizeHtml } from "../../src/utilities/normilize_html";

describe("normalizeHtml", () => {
  it("should return empty string for falsy input", () => {
    expect(normalizeHtml("")).toBe("");
    expect(normalizeHtml(null as any)).toBe("");
    expect(normalizeHtml(undefined as any)).toBe("");
  });

  // Tests for self-closing tags
  it("should correctly format known self-closing tags", () => {
    expect(normalizeHtml("<br>")).toBe("<br/>");
    expect(normalizeHtml("<img src='test.jpg'>")).toBe("<img src='test.jpg'/>");
    expect(normalizeHtml("<hr class='divider'>")).toBe("<hr class='divider'/>");
    expect(normalizeHtml("<input type='text'>")).toBe("<input type='text'/>");
  });

  it("should preserve already correctly formatted self-closing tags", () => {
    expect(normalizeHtml("<br/>")).toBe("<br/>");
    expect(normalizeHtml("<img src='test.jpg'/>")).toBe("<img src='test.jpg'/>");
  });
  
  it("should handle known self-closing tags with attributes and extra spaces before closing", () => {
    // Pre-normalizer handles <img src='test.jpg'  > into <img src='test.jpg'/>
    expect(normalizeHtml("<img src='test.jpg'  >")).toBe("<img src='test.jpg'/>");
    // Pre-normalizer handles <br  /> into <br/>
    expect(normalizeHtml("<br  />")).toBe("<br/>"); 
  });

  it("should correctly format explicitly self-closed tags like <div/>", () => {
    expect(normalizeHtml("<div/>")).toBe("<div/>");
    // Pre-normalizer handles <div id='test' /> into <div id='test'/>
    expect(normalizeHtml("<div id='test' />")).toBe("<div id='test'/>"); 
  });

  // Tests for unclosed tags
  it("should close unclosed tags", () => {
    expect(normalizeHtml("<div><p>text")).toBe("<div><p>text</p></div>");
    // Tag names are lowercased. Text case is preserved.
    expect(normalizeHtml("<ul><li>Item 1<li>Item 2")).toBe("<ul><li>Item 1</li><li>Item 2</li></ul>"); 
  });

  it("should close deeply nested unclosed tags", () => {
    expect(normalizeHtml("<div><span><a><b>text")).toBe("<div><span><a><b>text</b></a></span></div>");
  });

  // Tests for mismatched and orphaned closing tags
  it("should ignore orphaned closing tags", () => {
    expect(normalizeHtml("</p><div>text</div>")).toBe("<div>text</div>"); 
    expect(normalizeHtml("<div>text</p></div>")).toBe("<div>text</div>"); 
    // `</span>` is encountered. Stack: [div]. Top is `div`. Mismatch. `</span>` is ignored. `</div>` closes `div`.
    expect(normalizeHtml("<div>text</span>")).toBe("<div>text</div>"); 
  });
  
  it("Corrected: should handle text after an ignored mismatched closing tag", () => {
    // `</span>` is ignored. `<p>` remains open. " and more" is text content of `<p>`. `</p>` closes `<p>`. `</div>` closes `<div>`.
    expect(normalizeHtml("<div><p>text</span> and more</p></div>")).toBe("<div><p>text and more</p></div>"); 
  });

  it("should handle mismatched closing tags by ignoring the incorrect ones and closing open ones", () => {
    // `</span>` is ignored. `</p>` closes `p`. `</div>` closes `div`.
    expect(normalizeHtml("<div><p>text</span></div>")).toBe("<div><p>text</p></div>");
    // `</b>` is encountered. Stack: [b, i]. Top is `i`. Mismatch. `</b>` is ignored.
    // `</i>` is encountered. Stack: [b, i]. Top is `i`. Match. `</i>` is added. Stack: [b].
    // End of string. Stack: [b]. `</b>` is added.
    expect(normalizeHtml("<b><i>text</b></i>")).toBe("<b><i>text</i></b>");
  });

  // Tests for improperly nested tags
  it("should correct improperly nested tags by closing based on stack and ignoring mismatches", () => {
    // `<b>` -> stack [b]
    // `<i>` -> stack [b, i]
    // `text`
    // `</b>` -> stack top is `i`. Mismatch. `</b>` is ignored.
    // End of string. Stack [b,i]. Close `</i>`, then `</b>`.
    expect(normalizeHtml("<b><i>text</b>")).toBe("<b><i>text</i></b>"); 
  });

  // Combinations and complex cases
  it("should handle mixed issues: unclosed, self-closing, and mismatched tags", () => {
    const input = "<div><p>Text with <img src='test.jpg'> image<span>and span</p></div>";
    // <div> -> stack [div] -> output "<div>"
    // <p> -> stack [div, p] -> output "<p>"
    // Text with 
    // <img src='test.jpg'> -> pre-normalized to <img src='test.jpg'/> -> output "<img src='test.jpg'/>"
    // image
    // <span> -> stack [div, p, span] -> output "<span>"
    // and span
    // </p> -> stack top is span. Mismatch. Ignored.
    // </div> -> stack top is span. Mismatch. Ignored.
    // End: stack has [div, p, span]. Close in order: </span>, then </p>, then </div>.
    expect(normalizeHtml(input)).toBe("<div><p>Text with <img src='test.jpg'/> image<span>and span</span></p></div>");
  });

  it("should preserve well-formed HTML", () => {
    const wellFormedHtml = "<div><p><span>text</span></p><img src='test.jpg'/></div>";
    expect(normalizeHtml(wellFormedHtml)).toBe(wellFormedHtml);
  });

  it("should handle HTML with comments and CDATA (they should be treated as text by normalizeHtml)", () => {
    // The parser does not specifically handle comments or CDATA. They are treated as literal text.
    const htmlWithComment = "<div><!-- comment -->text</div>";
    expect(normalizeHtml(htmlWithComment)).toBe("<div><!-- comment -->text</div>");
    const htmlWithCdata = "<div><![CDATA[data]]>text</div>";
    expect(normalizeHtml(htmlWithCdata)).toBe("<div><![CDATA[data]]>text</div>");
  });
  
  it("should handle tags with attributes containing special characters like < > & \"", () => {
    // Attributes are largely preserved as-is by the regex.
    expect(normalizeHtml("<div data-info='<hello> & \"world\"'>text</div>"))
      .toBe("<div data-info='<hello> & \"world\"'>text</div>");
  });

  it("should handle empty tags correctly", () => {
    expect(normalizeHtml("<div></div><p></p>")).toBe("<div></div><p></p>");
    expect(normalizeHtml("<div><p>")).toBe("<div><p></p></div>"); // Unclosed p inside div
  });
  
  it("should handle text nodes correctly interspersed with tags", () => {
    expect(normalizeHtml("text1<div>text2<p>text3</p>text4</div>text5"))
      .toBe("text1<div>text2<p>text3</p>text4</div>text5");
  });

  it("should correctly parse tags with mixed case (outputting lowercase tags, preserving text case)", () => {
    expect(normalizeHtml("<Div><P>text</P></dIv>")).toBe("<div><p>text</p></div>");
    // Pre-normalization handles self-closing tags and lowercases their names.
    expect(normalizeHtml("<IMG sRc='test.jpg'>")).toBe("<img src='test.jpg'/>");
  });

  it("should handle tags without attributes correctly", () => {
    expect(normalizeHtml("<html><body><p>...</p></body></html>"))
      .toBe("<html><body><p>...</p></body></html>");
  });

  it("OLD-scenario: unclosed block elements - text case preserved", () => {
    expect(normalizeHtml("<div><p>Text")).toBe("<div><p>Text</p></div>"); 
  });

  it("OLD-scenario: nested structures with mismatched closer - text case preserved", () => {
    const input = "<div><p>Outer paragraph <span>with span <strong>and strong</div>";
    // </div> is mismatched for <strong>. Ignored.
    // End: close strong, then span, then p, then div.
    expect(normalizeHtml(input)).toBe("<div><p>Outer paragraph <span>with span <strong>and strong</strong></span></p></div>");
  });
  
  it("should handle complex HTML with multiple issues (adapted from original tests) - text case preserved", () => {
    const input = `
      <div class="container">
        <H1>Title</H1>
        <p>Some text with <Strong>bold content
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
    const expectedOutput = `
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
    const normalizeWhitespace = (str: string) => str.replace(/\s+/g, " ").trim();
    expect(normalizeWhitespace(normalizeHtml(input))).toBe(normalizeWhitespace(expectedOutput));
  });

  it("should handle a tag closing itself immediately", () => {
    expect(normalizeHtml("<div><p></p>text</div>")).toBe("<div><p></p>text</div>");
  });

  it("should handle mixed self-closing and normal tags with correct output casing", () => {
    expect(normalizeHtml("<div><br><p>text</p><hr/></div>")).toBe("<div><br/><p>text</p><hr/></div>");
  });
  
  it("should handle incomplete tags at end of input gracefully", () => {
    // <span is matched as a tag, no attributes. Then closed.
    expect(normalizeHtml("<div><p>text</p><span")).toBe("<div><p>text</p><span></span></div>");
    // <span  (with space) is matched as <span > (space as attribute). Then closed.
    expect(normalizeHtml("<div><p>text</p><span ")).toBe("<div><p>text</p><span ></span></div>"); 
    // <div is matched as a tag, no attributes. Then closed.
    expect(normalizeHtml("<div")).toBe("<div></div>");
    // A lone < is treated as text.
    expect(normalizeHtml("<")).toBe("<");
    // <sometext (not a valid tag start for the main parser if no > follows) is treated as text.
    expect(normalizeHtml("<sometext")).toBe("<sometext"); 
  });

  it("should handle text before any tags", () => {
    expect(normalizeHtml("Just text")).toBe("Just text");
    expect(normalizeHtml("Text before <div>and after</div>")).toBe("Text before <div>and after</div>");
  });
  
  it("should handle null and undefined inputs gracefully via initial check", () => {
    expect(normalizeHtml(null as any)).toBe("");
    expect(normalizeHtml(undefined as any)).toBe("");
  });

});
