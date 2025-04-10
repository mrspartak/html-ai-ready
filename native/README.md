# HTML AI Ready Native

<p align="center">
  <a href="https://npmjs.com/package/@mrspartak/html-ai-ready"><img src="https://img.shields.io/npm/v/@mrspartak/html-ai-ready.svg" alt="npm package"></a>
  <a href="https://npmjs.com/package/@mrspartak/html-ai-ready"><img src="https://img.shields.io/bundlephobia/min/%40mrspartak/html-ai-ready.svg" alt="bundle size"></a>
  <a href="https://npmjs.com/package/@mrspartak/html-ai-ready"><img src="https://img.shields.io/npm/dw/%40mrspartak%2Fhtml-ai-ready.svg" alt="downloads"></a>
  <a href="https://nodejs.org/en/about/previous-releases"><img src="https://img.shields.io/node/v/@mrspartak/html-ai-ready.svg" alt="node compatibility"></a>
  <a href='https://coveralls.io/github/mrspartak/html-ai-ready?branch=master'><img src='https://coveralls.io/repos/github/mrspartak/html-ai-ready/badge.svg?branch=master' alt='Coverage Status' /></a>
</p>
<br/>

This is a attempt to make a rust version (with changed logic of course) of the original [html-ai-ready](https://github.com/mrspartak/html-ai-ready) package.

## Installation

```bash
# yarn
yarn add @mrspartak/html-ai-ready-native
# npm
npm i @mrspartak/html-ai-ready-native
# pnpm
pnpm add @mrspartak/html-ai-ready-native
# bun
bun add @mrspartak/html-ai-ready-native
```

## Usage

```ts
import {
  htmlToAiReadyNative,
  PRESET_QUALITY,
} from "@mrspartak/html-ai-ready-native";

const html = "<p>Hello, world!</p>";
const aiReady = htmlToAiReadyNative(html, PRESET_QUALITY);

console.log(aiReady);
```

## Benchmark

The main point of this package is to be fast, give the smallest result in terms of token size and also still maintain the context to answer questions.
It is compared to a couple of other methods I saw so far.

## Kudos

This project wouldn't be possible without the valuable contributions and support from:

- [Marcel van de Weerd](https://github.com/mvandeweerd)
- [Siddhesh Deshpande](https://github.com/siddhesh-deshpande89)
- [Trengo Team](https://github.com/weerdm) - For providing real-world use case

## Contributing

I welcome contributions from the community! Whether it's improving the documentation, adding new features, or reporting bugs, please feel free to make a pull request or open an issue.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
