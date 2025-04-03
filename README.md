# HTML AI Ready

Raw HTML is usable by AI, but contains huge amount of token noise, implodes costs and latency.
One of the approaches is to just strip all the HTML tags and leave only the text, which still leaves some useless information like `style` and `script` tags.
The other and actually really good approach is to use HTML -> Markdown converter. But we can still gain a bit of performance and reduce tokens as AI does not really care about proper markdown, spaces etc.

This library is experimental and in personal tests showed the same quality results as plain HTML or Markdown, but much less tokens and a bit faster.

## Installation

```bash
npm install @mrspartak/html-ai-ready
```

## Usage

```ts
import { htmlToAiReady } from "@mrspartak/html-ai-ready";
```
