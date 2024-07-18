import { useState, KeyboardEvent } from 'react';
import { useLocation } from 'react-router-dom';

import { Form, Input, Button, Card, message, Spin } from 'antd';

import API from '@/lib/api';

import { main } from './kimi';
import { keyword } from './prompt';

const Ai = () => {
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);
  const defaultContent = useLocation()?.state;
  const handleFinish = async (values) => {
    const { prompt, content } = values;

    setLoading(true);
    try {
      const res = await main({ prompt, text: content });
      setOutput(res);
      await API.crud({
        model: 'ai',
        operation: 'create',
        data: { prompt, input: content, output: res, llm: 'kimi' },
      });
    } catch (error) {
      message.error('生成文本失败');
      console.error('Error generating text:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form
      layout="vertical"
      initialValues={{ prompt: keyword, content: defaultContent }}
      onFinish={handleFinish}
    >
      <div className="flex h-full gap-16">
        <Form.Item
          className="flex-1"
          label="prompt"
          name="prompt"
          rules={[{ required: true, message: '请输入prompt' }]}
        >
          <Input.TextArea
            className="!resize-none"
            rows={20}
            // autoSize={{ minRows: 1, maxRows: 20 }}
            disabled={loading}
          />
        </Form.Item>
        <Form.Item
          className="flex-1"
          label="内容"
          name="content"
          rules={[{ required: true, message: '请输入内容' }]}
        >
          <Input.TextArea
            className="!resize-none"
            placeholder="输入需分析的数据"
            rows={20}
            // autoSize={{ minRows: 1, maxRows: 20 }}
            disabled={loading}
          />
        </Form.Item>
      </div>
      <Form.Item>
        <Button
          type="primary"
          htmlType="submit"
          className="mb-16"
          loading={loading}
        >
          分析
        </Button>
        <div className="mb-8 text-xs text-gray-500">使用kimi大模型</div>
        {/* {loading && <Spin className="mt-4" />} */}
        <Card bordered={false}>
          <pre style={{ whiteSpace: 'pre-wrap' }}>{output}</pre>
        </Card>
      </Form.Item>
    </Form>
  );
};

export default Ai;
