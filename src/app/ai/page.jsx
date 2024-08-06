import { useState, KeyboardEvent } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { useRequest } from 'ahooks';
import { Form, Input, Button, Card, message, Select } from 'antd';

import API from '@/lib/api';

import { main } from './kimi';
import { keyword } from './prompt';

const { Option } = Select;

const Ai = () => {
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);
  const defaultContent = useLocation()?.state;
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const {
    data: res,
    error,
    loading: loadingPrompt,
  } = useRequest(API.crud, {
    defaultParams: [{ model: 'prompt', operation: 'readMany' }],
  });
  const data = res?.list || [];
  const handleFinish = async (values) => {
    const { promptId, content, prompt } = values;

    setLoading(true);
    try {
      // const prompt = data.find((item) => item.id === promptId).content;
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
      initialValues={{ promptId: data[0]?.id, content: defaultContent }}
      onFinish={handleFinish}
      form={form}
    >
      <div className="flex h-full gap-16">
        <div className="flex flex-1 flex-col">
          <Form.Item
            label="选择prompt"
            name="promptId"
            rules={[{ required: true, message: '请选择prompt' }]}
          >
            <Select
              className="w-full"
              loading={loadingPrompt}
              placeholder="Select a prompt"
              optionFilterProp="children"
              onChange={(value) => {
                form.setFieldsValue({
                  prompt: data.find((item) => item.id === value)?.content,
                });
              }}
            >
              {data.map((item) => (
                <Option key={item.id} value={item.id}>
                  {item.name}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            label="prompt内容"
            name="prompt"
            rules={[{ required: true, message: '请输入prompt' }]}
          >
            <Input.TextArea
              className="!resize-none"
              rows={16}
              // autoSize={{ minRows: 1, maxRows: 20 }}
              disabled={loading}
            />
          </Form.Item>
        </div>

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
