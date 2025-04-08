import fs from "node:fs";
import { PRESET_FAST, PRESET_QUALITY, htmlToAiReady } from "@mrspartak/html-ai-ready";

// Load an HTML file
const htmlContent = fs.readFileSync("./path/to/your/file.html", "utf-8");

// Example 1: Using PRESET_FAST for maximum token reduction
// This is ideal when you need to minimize token usage and don't need formatting
const fastResult = htmlToAiReady(htmlContent, PRESET_FAST);
console.log("FAST MODE RESULT:");
console.log(fastResult);
console.log(`Token reduction: ${((fastResult.length / htmlContent.length) * 100).toFixed(2)}% of original size`);

// Example 2: Using PRESET_QUALITY for better readability
// This preserves more formatting like bold, italic, lists, and headings
const qualityResult = htmlToAiReady(htmlContent, PRESET_QUALITY);
console.log("\nQUALITY MODE RESULT:");
console.log(qualityResult);
console.log(`Token reduction: ${((qualityResult.length / htmlContent.length) * 100).toFixed(2)}% of original size`);

// Example 3: Custom configuration, beta! no proper type support yet
// You can create your own configuration to fine-tune the behavior
const customConfig = {
  // Tags to completely remove with their content
  tags: ["script", "style", "noscript", "iframe", "svg", "video", "audio", "canvas", "footer"],

  // Whether to use simplified markdown formatting
  useMarkdown: true,

  // Additional cleanup options
  cleanup: {
    removeExtraWhitespace: true,
    collapseNewlines: true,
    removeEmptyLines: true,
  },
};

const customResult = htmlToAiReady(htmlContent, customConfig);
console.log("\nCUSTOM CONFIG RESULT:");
console.log(customResult);
console.log(`Token reduction: ${((customResult.length / htmlContent.length) * 100).toFixed(2)}% of original size`);

// Example 4: Comparing token usage for AI context
function estimateTokens(text: string): number {
  // Rough estimate: ~4 characters per token for English text
  return Math.ceil(text.length / 4);
}

console.log("\nTOKEN USAGE COMPARISON:");
console.log(`Original HTML: ~${estimateTokens(htmlContent)} tokens`);
console.log(`FAST mode: ~${estimateTokens(fastResult)} tokens`);
console.log(`QUALITY mode: ~${estimateTokens(qualityResult)} tokens`);
console.log(`Custom config: ~${estimateTokens(customResult)} tokens`);
