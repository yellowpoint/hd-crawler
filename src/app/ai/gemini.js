import { GoogleGenerativeAI } from '@google/generative-ai';

// Access your API key (see "Set up your API key" above)
const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);
export const llm = 'gemini';

async function fileToGenerativePart(file) {
  const base64EncodedDataPromise = new Promise((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result.split(',')[1]);
    reader.readAsDataURL(file);
  });
  return {
    inlineData: { data: await base64EncodedDataPromise, mimeType: file.type },
  };
}

export async function gemini({ prompt, text: input, image }) {
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
  let imageParts = [];
  if (Array.isArray(image) && image.length > 0) {
    imageParts = await Promise.all(
      image.map((i) => i?.originFileObj).map(fileToGenerativePart),
    );
  }

  const history = [
    {
      role: 'user',
      parts: [{ text: prompt }],
    },
    // {
    //   role: 'user',
    //   parts: [{ text: input }],
    // },
  ];
  const chat = model.startChat({
    history,
    // generationConfig: { responseMimeType: 'application/json' },
  });

  // const contents = [...history];
  // const { totalTokens } = await model.countTokens({ contents });
  // console.log('totalTokens', totalTokens);
  const allInput = imageParts;
  if (input) {
    allInput.push(input);
  }
  const result = await chat.sendMessage(allInput);
  const response = await result.response;
  console.log('response', response);
  const text = response.text();
  return text;
}

export async function main(props) {
  // const { prompt, text } = props;
  // if (!prompt || !text) {
  //   console.log('prompt or text is empty', prompt, text);
  //   return 'prompt or text is empty';
  // }
  return await gemini(props);
}

export default main;
