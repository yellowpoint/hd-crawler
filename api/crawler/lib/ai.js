import gemini from './gemini.js';
import openai from './openai.js';

export async function ai(props) {
  const { prompt, text } = props;
  if (!prompt || !text) {
    console.log('prompt or text is empty', prompt, text);
    return 'prompt or text is empty';
  }
  return await gemini(props);
}

export default ai;
