# HTML AI Ready

<p align="center">
  <a href="https://npmjs.com/package/@mrspartak/html-ai-ready"><img src="https://img.shields.io/npm/v/@mrspartak/html-ai-ready.svg" alt="npm package"></a>
  <a href="https://npmjs.com/package/@mrspartak/html-ai-ready"><img src="https://img.shields.io/bundlephobia/min/%40mrspartak/html-ai-ready.svg" alt="bundle size"></a>
  <a href="https://npmjs.com/package/@mrspartak/html-ai-ready"><img src="https://img.shields.io/npm/dw/%40mrspartak%2Fhtml-ai-ready.svg" alt="downloads"></a>
  <a href="https://nodejs.org/en/about/previous-releases"><img src="https://img.shields.io/node/v/@mrspartak/html-ai-ready.svg" alt="node compatibility"></a>
  <a href='https://coveralls.io/github/mrspartak/html-ai-ready?branch=master'><img src='https://coveralls.io/repos/github/mrspartak/html-ai-ready/badge.svg?branch=master' alt='Coverage Status' /></a>
</p>
<br/>

Raw HTML is usable by AI, but contains huge amount of token noise, implodes costs and latency.
One of the approaches is to just strip all the HTML tags and leave only the text, which still leaves some useless information like `style` and `script` tags.
The other and actually really good approach is to use HTML -> Markdown converter. But we can still gain a bit of performance and reduce tokens as AI does not really care about proper markdown, spaces etc.

This library is experimental and in personal tests showed the same quality results as plain HTML or Markdown, but much less tokens and a bit faster.

## Installation

```bash
# yarn
yarn add @mrspartak/html-ai-ready
# npm
npm i @mrspartak/html-ai-ready
# pnpm
pnpm add @mrspartak/html-ai-ready
# bun
bun add @mrspartak/html-ai-ready
```

## Usage

```ts
import { htmlToAiReady, PRESET_QUALITY } from "@mrspartak/html-ai-ready";

const html = "<p>Hello, world!</p>";
const aiReady = htmlToAiReady(html, PRESET_QUALITY);

console.log(aiReady);
```

## Benchmark

The main point of this package is to be fast, give the smallest result in terms of token size and also still maintain the context to answer questions.
It is compared to a couple of other methods I saw so far.

### Output Size Comparison

```bash
pnpm benchmark
```

When comparing the output size across all tested pages (average percentage of original HTML size):

| Method                 | Average Size (% of original) |
| ---------------------- | ---------------------------- |
| HTML_TO_AI_FAST        | 24.69%                       |
| HTML_TO_AI_QUALITY     | 7.76%                        |
| NODE_HTML_MARKDOWN     | 13.88%                       |
| CHEERIO_QUALITY_PARSED | 19.31%                       |

### Performance Benchmark

Performance comparison across all pages combined:

| Method                | Operations/sec | Mean time (ms) | Comparison             |
| --------------------- | -------------- | -------------- | ---------------------- |
| htmlToAiReady FAST    | 28.76          | 34.77          | Fastest                |
| htmlToAiReady QUALITY | 15.36          | 65.09          | 1.87x slower than FAST |
| cheerioParse          | 7.31           | 136.76         | 3.93x slower than FAST |
| node-html-markdown    | 6.30           | 158.77         | 4.57x slower than FAST |

### AI Response Quality and Token Usage

```bash
# don't forget to add OPENAI_API_KEY to .env file first
pnpm aiq
```

To test real-world effectiveness, we used 3 HTML pages as context for AI and asked deterministic questions. The results show accuracy rates, token usage, and AI response times:

| Method                   | Accuracy       | Avg Tokens | Avg Response Time |
| ------------------------ | -------------- | ---------- | ----------------- |
| htmlToAiReadyTextQuality | 15/20 (75.00%) | 10,759     | 618.75ms          |
| cherioText               | 15/20 (75.00%) | 12,931     | 5,377.55ms        |
| nodeHtmlMarkdownText     | 14/20 (70.00%) | 27,389     | 2,099.20ms        |

As shown in the benchmarks, the QUALITY preset not only maintains the same accuracy as Cheerio while using fewer tokens, but it also delivers responses significantly faster. The FAST preset offers the best performance while the QUALITY preset provides the smallest output size with excellent accuracy, giving you options depending on your priority.

## Some website statistics

To determing tags that I would like to strip, first of course I gathered tags that would not make any context for AI. Those are style, head, iframe etc.
But stripping the tags is costly operation, so I wanted to actually know if stripping them makes any difference. So I gathered a list of ~800 random websites, crawled and parsed them.
Here are some details:

### Page Size Statistics

| Metric  | Value            |
| ------- | ---------------- |
| Minimum | 242 bytes        |
| Maximum | 11,647,892 bytes |
| Average | 517,804 bytes    |
| Median  | 346,929 bytes    |

### Crawl Timing Statistics

| Metric  | Value    |
| ------- | -------- |
| Average | 3,202 ms |
| Median  | 2,504 ms |

### Element Size Analysis

Ordered by total size across all pages:

| Element  | Average Size (bytes) | % of Page | % of Body | Total Size (bytes) |
| -------- | -------------------- | --------- | --------- | ------------------ |
| body     | 406,357              | 76.11%    | -         | 349,061,078        |
| head     | 110,629              | 23.55%    | 73.40%    | 95,030,079         |
| links    | 98,256               | 19.18%    | 24.71%    | 84,401,659         |
| svgs     | 83,426               | 12.76%    | 15.38%    | 71,662,569         |
| nav      | 103,673              | 12.17%    | 15.00%    | 89,055,316         |
| script   | 73,849               | 10.84%    | 14.09%    | 63,435,956         |
| images   | 31,274               | 6.18%     | 8.17%     | 26,864,083         |
| footer   | 17,350               | 4.21%     | 5.81%     | 14,903,361         |
| style    | 16,031               | 3.82%     | 4.80%     | 13,770,735         |
| forms    | 14,827               | 3.29%     | 4.33%     | 12,736,770         |
| button   | 12,395               | 2.54%     | 3.47%     | 10,647,352         |
| comments | 7,163                | 1.67%     | 2.28%     | 6,152,769          |
| aside    | 6,539                | 1.04%     | 1.19%     | 5,617,229          |
| noscript | 1,663                | 0.32%     | 0.44%     | 1,428,938          |
| iframe   | 902                  | 0.27%     | 0.40%     | 775,052            |
| video    | 74                   | 0.03%     | 0.03%     | 63,815             |
| canvas   | 4                    | 0.00%     | 0.00%     | 3,149              |

## Kudos

This project wouldn't be possible without the valuable contributions and support from:

- [Marcel van de Weerd](https://github.com/mvandeweerd)
- [Siddhesh Deshpande](https://github.com/siddhesh-deshpande89)
- [Trengo Team](https://github.com/weerdm) - For providing real-world use case

## Contributing

I welcome contributions from the community! Whether it's improving the documentation, adding new features, or reporting bugs, please feel free to make a pull request or open an issue.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
