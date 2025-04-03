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
import { htmlToAiReady } from "@mrspartak/html-ai-ready";

const html = "<p>Hello, world!</p>";
const aiReady = htmlToAiReady(html);

console.log(aiReady);
```

## Benchmark

Take these with a grain of salt, as I did not setup a proper benchmark environment.
I did 10 runs over a medium sized HTML page (150KB) with different tags and content in it.

| Library                                          | Processing Time | Token Count   |
| ------------------------------------------------ | --------------- | ------------- |
| @mrspartak/html-ai-ready                         | 4.97ms          | 3,814 tokens  |
| cherio (parse + remove some tags + text content) | 9.98ms          | 5,850 tokens  |
| node-html-markdown (convert html to markdown)    | 20.35ms         | 10,027 tokens |

## Contributing

I welcome contributions from the community! Whether it's improving the documentation, adding new features, or reporting bugs, please feel free to make a pull request or open an issue.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
