import { crawlerRun } from './base.js';
import axios from 'axios';


const publishSnsMessage = async (message, params) => {
  const sns = new AWS.SNS();
  const topicArn = 'arn:aws:sns:ap-southeast-1:585768170001:crawler';
  const snsParams = {
    Message: JSON.stringify({
      default: JSON.stringify({
        ...message,
        originalParams: params // 添加原始参数
      })
    }),
    TopicArn: topicArn,
    MessageStructure: 'json'
  };

  await sns.publish(snsParams).promise();
  console.log('SNS消息已发送');
};

const callCallbackUrl = async (cbUrl, data) => {
  if (!data.taskId) {
    throw new Error('taskId 是必须的');
  }
  const response = await axios.post(cbUrl, data);
  console.log('回调请求成功:', response.data);

};

export const handler = async (req) => {
  console.log('handler参数：', req);
  const method = req?.requestContext?.http?.method;

  // 统一处理GET和POST请求的参数
  let params;
  if (method === 'GET') {
    params = req.queryStringParameters;
  } else if (method === 'POST') {
    params = req.body ? JSON.parse(req.body) : {};
  } else {
    params = req;
  }
  const { isSns, cbUrl, taskId } = params;
  try {
    if (cbUrl) {
      await callCallbackUrl(cbUrl, { status: 'running', req: params, taskId });
    }

    const res = await crawlerRun(params);

    if (isSns) {
      await publishSnsMessage({ status: 'success', message: '爬取成功', data: res }, params);
    }

    if (cbUrl) {
      await callCallbackUrl(cbUrl, { status: 'success', req: params, taskId, res });
    }

    // 返回成功结果
    return {
      statusCode: 200,
      body: JSON.stringify(res),
    };
  } catch (error) {
    console.error('爬取过程中发生错误:', error);

    if (isSns) {
      await publishSnsMessage({ status: 'error', message: '爬取失败', error: error.message }, params);
    }

    if (cbUrl) {
      await callCallbackUrl(cbUrl, { status: 'fail', taskId, req: params, res: { error: JSON.stringify(error.message) } });
    }

    // 返回错误结果
    return {
      statusCode: 500,
      body: JSON.stringify({ message: '爬取失败', error: error.message }),
    };
  }
};
