# HTML AI Ready (beta)

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
import { htmlToAiReady, PRESET_FAST } from "@mrspartak/html-ai-ready";

const html = "<p>Hello, world!</p>";
const aiReady = htmlToAiReady(html, PRESET_FAST);

console.log(aiReady);
```

## Benchmark

Take these with a grain of salt, as I did not setup a proper benchmark environment.
I did 10 runs over a medium sized HTML page (150KB) (33230 tokens) with different tags and content in it.

| Library                                          | Processing Time | Token Count   |
| ------------------------------------------------ | --------------- | ------------- |
| @mrspartak/html-ai-ready                         | 4.97ms          | 3,814 tokens  |
| cherio (parse + remove some tags + text content) | 9.98ms          | 5,850 tokens  |
| node-html-markdown (convert html to markdown)    | 20.35ms         | 10,027 tokens |

Steam Main Page (1MB) (345,697 tokens)

| Library                                          | Processing Time | Token Count   |
| ------------------------------------------------ | --------------- | ------------- |
| @mrspartak/html-ai-ready                         | 18.62ms         | 12,128 tokens |
| cherio (parse + remove some tags + text content) | 87.81ms         | 11,055 tokens |
| node-html-markdown (convert html to markdown)    | 106.86ms        | 10,027 tokens |

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

## Contributing

I welcome contributions from the community! Whether it's improving the documentation, adding new features, or reporting bugs, please feel free to make a pull request or open an issue.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
