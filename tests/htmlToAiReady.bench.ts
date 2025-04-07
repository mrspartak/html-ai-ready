import fs from "node:fs";
import { NodeHtmlMarkdown } from "node-html-markdown";
import { beforeAll, bench, describe } from "vitest";
import { PRESET_FAST, PRESET_QUALITY, htmlToAiReady } from "../src";

let steamPage = "";

function getTokenSize(text: string) {
  return new TextEncoder().encode(text).length;
}

beforeAll(async () => {
  steamPage = await fs.promises.readFile("./tests/data/steam.html", "utf-8");

  const HTML_TO_AI_FAST = htmlToAiReady(steamPage, PRESET_FAST);
  const HTML_TO_AI_QUALITY = htmlToAiReady(steamPage, PRESET_QUALITY);
  const NODE_HTML_MARKDOWN = NodeHtmlMarkdown.translate(steamPage);

  console.log(`RAW size: ${steamPage.length}`);
  console.log(
    `HTML_TO_AI_FAST size: ${getTokenSize(HTML_TO_AI_FAST)}, ${((getTokenSize(HTML_TO_AI_FAST) * 100) / steamPage.length).toFixed(2)}%`,
  );
  console.log(
    `HTML_TO_AI_QUALITY size: ${getTokenSize(HTML_TO_AI_QUALITY)}, ${((getTokenSize(HTML_TO_AI_QUALITY) * 100) / steamPage.length).toFixed(2)}%`,
  );
  console.log(
    `NODE_HTML_MARKDOWN size: ${getTokenSize(NODE_HTML_MARKDOWN)}, ${((getTokenSize(NODE_HTML_MARKDOWN) * 100) / steamPage.length).toFixed(2)}%`,
  );
});

describe("Benchmark steam page", () => {
  bench("htmlToAiReady FAST", () => {
    htmlToAiReady(steamPage, PRESET_FAST);
  });

  bench("htmlToAiReady QUALITY", () => {
    htmlToAiReady(steamPage, PRESET_QUALITY);
  });

  bench("node-html-markdown", () => {
    NodeHtmlMarkdown.translate(steamPage);
  });
});
