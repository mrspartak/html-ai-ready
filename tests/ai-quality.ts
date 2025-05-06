import fs from "node:fs";
import * as cheerio from "cheerio";
import { NodeHtmlMarkdown } from "node-html-markdown";
import { OpenAI } from "openai";
import { htmlToAiReadyNative } from "../native";
import { PRESET_QUALITY, htmlToAiReady } from "../src";

const prompt = `
You are an assistant that finds an answer to a <QUESTION> from a <TEXT>.

<GUIDELINES>
  - You should find an answer to the question from the text.
  - You should return the answer in the same language as the question.
  - You should return directly the answer with none additional details.
  - If there is no answer in the text, you should return <no_answer>.
  - You get the answer from the page and don't use any other sources.
</GUIDELINES>

<QUESTION>
  {question}
</QUESTION>

<TEXT>
  {text}
</TEXT>

Return only the answer with none additional details or <no_answer> if there is no answer.
`;

const questions = {
  steamHtml: [
    {
      question: "How much money do I have available in my Steam wallet?",
      expectedAnswer: "1 036,77€",
    },
    {
      question: "Are there any free games that are also trending right now? Yes or No",
      expectedAnswer: "Yes",
    },
    {
      question: "What is the game recomended based on games I like? (Return only the name of the game)",
      expectedAnswer: "ELDEN RING",
    },
    {
      question: "What game curator recommends?",
      expectedAnswer: "Suikoden I&II HD Remaster Gate Rune and Dunan Unification Wars",
    },
    {
      question: "Does Devil May Cry HD Collection costs more than 20€? Yes or No",
      expectedAnswer: "No",
    },
    {
      question: "Does Steam provide dedicated support for users with disabilities?",
      expectedAnswer: "<no_answer>",
    },
    {
      question: "What are user reviews for the game 'Starfield'?",
      expectedAnswer: "<no_answer>",
    },
  ],
  mystofaHtml: [
    {
      question: "Is there a style comparison feature? Yes or No",
      expectedAnswer: "Yes",
    },
    {
      question: "Are design professionals listed? Yes or No",
      expectedAnswer: "Yes",
    },
    {
      question: "Does this style allow to combine 'deep blue' and 'weird beige'? Yes or No",
      expectedAnswer: "No",
    },
    {
      question: "What is the telephone number for Design Labodina?",
      expectedAnswer: "<no_answer>",
    },
    {
      question: "What year this style was created?",
      expectedAnswer: "<no_answer>",
    },
    {
      question: "How can I furnish my boho style living room?",
      expectedAnswer: "<no_answer>",
    },
  ],
  appleHtml: [
    {
      question: "What model of iphone is this page about?",
      expectedAnswer: "iPhone 16 Pro",
    },
    {
      question: "Does this iphone has the largest display ever? Yes or No",
      expectedAnswer: "Yes",
    },
    {
      question: "Does this iPhone cost less than 900€? Yes or No",
      expectedAnswer: "No",
    },
    {
      question: "What is the name of the person who designed this iphone?",
      expectedAnswer: "<no_answer>",
    },
    {
      question: "What is the maximum video resolution this iphone can record? Just resolution.",
      expectedAnswer: "4K",
    },
    {
      question: "How does a new audio recording feature called?",
      expectedAnswer: "Audio Mix",
    },
    {
      question: "Is there a 48mm lens equialent in the iphone? Yes or No",
      expectedAnswer: "Yes",
    },
  ],
};
type Question = (typeof questions)["steamHtml"][number];

if (!process.env.OPENAI_API_KEY) {
  throw new Error("OPENAI_API_KEY is not set");
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

function prepareTexts(html: string) {
  const $ = cheerio.load(html);
  $(
    "script, iframe, style, img, svg, path, button, input, textarea, form, meta, noscript, object, embed, applet, canvas, audio, video, head, nav, aside, link",
  ).remove();
  const cherioText = $.text();
  const htmlToAiReadyTextQuality = htmlToAiReady(html, PRESET_QUALITY);
  const htmlToAiReadyTextNative = htmlToAiReadyNative(html, PRESET_QUALITY);
  const nodeHtmlMarkdownText = NodeHtmlMarkdown.translate(html);

  return { cherioText, htmlToAiReadyTextQuality, htmlToAiReadyTextNative, nodeHtmlMarkdownText };
}

function getHtmls(path: string) {
  const steamHtml = fs.readFileSync(path, "utf-8");
  const mystofaHtml = fs.readFileSync("./tests/data/mystofa.html", "utf-8");
  const appleHtml = fs.readFileSync("./tests/data/apple.html", "utf-8");

  return { steamHtml, mystofaHtml, appleHtml };
}

async function evaluateQuestion(question: Question, text: string) {
  const questionPrompt = prompt.replace("{question}", question.question).replace("{text}", text);

  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: questionPrompt }],
    temperature: 0,
    seed: 42,
  });

  return {
    answer: response.choices[0].message.content,
    tokens: response.usage?.total_tokens,
  };
}

async function main() {
  const htmls = await getHtmls("./tests/data/steam.html");

  const stats: Record<string, { ok: number; fail: number; totalTokens: number; totalTime: number }> = {};

  for (const [htmlKey, html] of Object.entries(htmls)) {
    const texts = prepareTexts(html);
    console.log(`> html: ${htmlKey}`);

    for (const [variantKey, text] of Object.entries(texts)) {
      fs.writeFileSync(`./tests/data/texts/${htmlKey}-${variantKey}.md`, text);
      if (!stats[variantKey]) {
        stats[variantKey] = { ok: 0, fail: 0, totalTime: 0, totalTokens: 0 };
      }
    }

    for (const question of questions[htmlKey]) {
      console.log(`>> Evaluating ${question.question}`);
      for (const [variantKey, text] of Object.entries(texts)) {
        console.log(`> variant: ${variantKey}`);

        const tsStart = Date.now();
        try {
          const { answer, tokens } = await evaluateQuestion(question, text);
          console.log(`>> answer: ${answer} > expected: ${question.expectedAnswer}`);
          console.log(`> tokens: ${tokens}`);
          console.log(`> ${question.expectedAnswer === answer ? "OK" : "FAIL"}`);
          stats[variantKey][question.expectedAnswer === answer ? "ok" : "fail"]++;
          stats[variantKey].totalTokens += tokens ?? 0;
        } catch (error) {
          console.error("> error: ", error.message);
          stats[variantKey].fail++;
        } finally {
          const tsEnd = Date.now();
          stats[variantKey].totalTime += tsEnd - tsStart;
        }
      }
      console.log("--------------------------------");
    }
  }

  console.log("Stats:");
  for (const [key, value] of Object.entries(stats)) {
    const avgTokens = value.totalTokens / value.ok;
    const avgTime = value.totalTime / (value.ok + value.fail);

    console.log(
      `> ${key}: ${value.ok} / ${value.ok + value.fail} (${((value.ok / (value.ok + value.fail)) * 100).toFixed(2)}%)`,
    );
    console.log(`> avgTokens: ${avgTokens.toFixed(2)}`);
    console.log(`> avgTime: ${avgTime.toFixed(2)}ms`);
    console.log("");
  }
}

main().catch(console.error);
