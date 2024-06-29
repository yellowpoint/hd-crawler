import OpenAI from 'openai';
import 'dotenv/config';

// console.log('请先配置 OPENAI_API_KEY', process.env.OPENAI_API_KEY);
// model: 'moonshot-v1-8k',
const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  // baseURL: 'https://api.chatanywhere.tech/v1',
  baseURL: 'https://api.moonshot.cn/v1',
  dangerouslyAllowBrowser: true,
});

export const defaultPrompt =
  '你是 Kimi，由 Moonshot AI 提供的人工智能助手，你更擅长中文和英文的对话。你会为用户提供安全，有帮助，准确的回答。同时，你会拒绝一切涉及恐怖主义，种族歧视，黄色暴力等问题的回答。Moonshot AI 为专有名词，不可翻译成其他语言。';

export async function openai({ prompt, text }) {
  if (!process.env.OPENAI_API_KEY) {
    console.log('请先配置 OPENAI_API_KEY', process.env.OPENAI_API_KEY);
    return '请先配置 OPENAI_API_KEY';
  }
  if (!prompt || !text) {
    console.log('prompt or text is empty', prompt, text);
    return 'prompt or text is empty';
  }
  console.log('prompt', prompt, 'text', text.substring(0, 10));
  const completion = await client.chat.completions.create({
    // model: 'gpt-3.5-turbo',
    model: 'moonshot-v1-8k',
    messages: [
      {
        role: 'system',
        content: prompt,
      },
      {
        role: 'user',
        content: text,
      },
    ],
    temperature: 0.3,
  });
  const res = completion.choices[0].message.content;
  console.log(res);
  return res;
}

// openai({
//   prompt: defaultPrompt,
//   text: '自我介绍下',
// });

export default openai;
