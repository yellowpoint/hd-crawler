import { GoogleGenerativeAI } from '@google/generative-ai';
import 'dotenv/config';

// Access your API key (see "Set up your API key" above)
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function gemini({ prompt, text }) {
  // The Gemini 1.5 models are versatile and work with both text-only and multimodal prompts
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

  const promptAll = '数据:' + text + '要求：' + prompt;

  const result = await model.generateContent(promptAll);
  const response = await result.response;
  const res = response.text();
  // console.log(res);
  return res;
}
export default gemini;
// gemini();
