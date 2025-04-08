import fs from "node:fs";
import * as cheerio from "cheerio";
import { NodeHtmlMarkdown } from "node-html-markdown";
import { beforeAll, bench, describe } from "vitest";
import { PRESET_FAST, PRESET_QUALITY, htmlToAiReady } from "../src";

const pages = {
  steam: "",
  mystofa: "",
  apple: "",
};

function getTokenSize(text: string) {
  return new TextEncoder().encode(text).length;
}

function cheerioParse(html: string) {
  const $ = cheerio.load(html);
  $(
    "script, iframe, style, img, svg, path, button, input, textarea, form, meta, noscript, object, embed, applet, canvas, audio, video, head, nav, aside, link",
  ).remove();
  return $.text();
}

beforeAll(async () => {
  // Load all pages
  pages.steam = await fs.promises.readFile("./tests/data/steam.html", "utf-8");
  pages.mystofa = await fs.promises.readFile("./tests/data/mystofa.html", "utf-8");
  pages.apple = await fs.promises.readFile("./tests/data/apple.html", "utf-8");

  // Calculate and display size info for each page
  const results: Record<
    string,
    {
      raw: number;
      fast: { size: number; percentage: number };
      quality: { size: number; percentage: number };
      markdown: { size: number; percentage: number };
      cheerio: { size: number; percentage: number };
    }
  > = {};
  let totalRawSize = 0;

  for (const [pageName, pageContent] of Object.entries(pages)) {
    const rawSize = pageContent.length;
    totalRawSize += rawSize;

    const htmlToAiFast = htmlToAiReady(pageContent, PRESET_FAST);
    const htmlToAiQuality = htmlToAiReady(pageContent, PRESET_QUALITY);
    const nodeHtmlMarkdown = NodeHtmlMarkdown.translate(pageContent);
    const cheerioResult = cheerioParse(pageContent);

    const fastSize = getTokenSize(htmlToAiFast);
    const qualitySize = getTokenSize(htmlToAiQuality);
    const markdownSize = getTokenSize(nodeHtmlMarkdown);
    const cheerioSize = getTokenSize(cheerioResult);

    results[pageName] = {
      raw: rawSize,
      fast: { size: fastSize, percentage: (fastSize * 100) / rawSize },
      quality: { size: qualitySize, percentage: (qualitySize * 100) / rawSize },
      markdown: { size: markdownSize, percentage: (markdownSize * 100) / rawSize },
      cheerio: { size: cheerioSize, percentage: (cheerioSize * 100) / rawSize },
    };
  }

  // Calculate and display average sizes across all pages
  let avgFastSize = 0;
  let avgQualitySize = 0;
  let avgMarkdownSize = 0;
  let avgCheerioSize = 0;

  for (const result of Object.values(results)) {
    avgFastSize += result.fast.percentage;
    avgQualitySize += result.quality.percentage;
    avgMarkdownSize += result.markdown.percentage;
    avgCheerioSize += result.cheerio.percentage;
  }

  const pageCount = Object.keys(pages).length;

  console.log("\n--- AVERAGE ACROSS ALL PAGES ---");
  console.log(`Total RAW size: ${totalRawSize}`);
  console.log(`HTML_TO_AI_FAST avg: ${(avgFastSize / pageCount).toFixed(2)}%`);
  console.log(`HTML_TO_AI_QUALITY avg: ${(avgQualitySize / pageCount).toFixed(2)}%`);
  console.log(`NODE_HTML_MARKDOWN avg: ${(avgMarkdownSize / pageCount).toFixed(2)}%`);
  console.log(`CHEERIO_QUALITY_PARSED avg: ${(avgCheerioSize / pageCount).toFixed(2)}%`);
});

// Benchmark all pages combined
describe("Benchmark all pages combined", () => {
  bench("htmlToAiReady FAST - all pages", () => {
    for (const page of Object.values(pages)) {
      htmlToAiReady(page, PRESET_FAST);
    }
  });

  bench("htmlToAiReady QUALITY - all pages", () => {
    for (const page of Object.values(pages)) {
      htmlToAiReady(page, PRESET_QUALITY);
    }
  });

  bench("node-html-markdown - all pages", () => {
    for (const page of Object.values(pages)) {
      NodeHtmlMarkdown.translate(page);
    }
  });

  bench("cheerioParse - all pages", () => {
    for (const page of Object.values(pages)) {
      cheerioParse(page);
    }
  });
});
