// Please install OpenAI SDK first: `npm install openai`

import OpenAI from "openai";
import { DEEPSEEK_API_KEY } from "./configs";

const openai = new OpenAI({
  baseURL: "https://api.deepseek.com",
  apiKey: DEEPSEEK_API_KEY,
});

async function main() {
  const completion = await openai.chat.completions.create({
    messages: [
      { role: "system", content: "" },
      {
        role: "user",
        content: "你是谁",
      },
    ],
    model: "deepseek-coder",
    temperature: 0,
  });

  console.log(completion.choices[0].message.content);
}

main();
