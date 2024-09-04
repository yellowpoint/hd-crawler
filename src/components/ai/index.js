import API from '@/lib/api';

import * as gemini from './gemini';
import * as kimi from './kimi';

const llmEngine = gemini;

export const main = async (props) => {
  const { prompt, text, image } = props;
  const res = await llmEngine.main(props);
  await API.crud({
    model: 'ai',
    operation: 'create',
    data: {
      prompt,
      input: `${image ? '图片文件,\n' : ''}${text}`,
      output: res,
      llm: llmEngine.llm,
    },
  });
  return res;
};

export const llm = llmEngine.llm;
