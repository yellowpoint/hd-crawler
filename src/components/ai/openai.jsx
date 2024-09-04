import { HumanMessage, SystemMessage } from '@langchain/core/messages';
import { StringOutputParser } from '@langchain/core/output_parsers';
import { ChatOpenAI } from '@langchain/openai';

const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY;

// const model = new ChatOpenAI({
//   model: 'gpt-3.5-turbo',
//   apiKey: OPENAI_API_KEY,
// });
// const parser = new StringOutputParser();
// const chain = model.pipe(parser);

// const messages = [
//   new SystemMessage('Translate the following from English into Italian'),
//   new HumanMessage('hi!'),
// ];

// const res = await chain.invoke(messages);
