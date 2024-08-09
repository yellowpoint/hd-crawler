import { useState } from 'react';

import { Button, Form, Select } from 'antd';

import { main, llm } from '@/app/ai/gemini';
import { EllipsisFlex } from '@/components';
import API from '@/lib/api';

import NodeBase from './NodeBase';

export default function Node(props) {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const { readonly = false } = props;

  if (readonly) {
    return (
      <NodeBase {...props}>
        {({ item }) => {
          return <div className="flex flex-col gap-8">{item.value}</div>;
        }}
      </NodeBase>
    );
  }
  return (
    <NodeBase {...props}>
      {({ item, setData, next, prevValue, resPrompt, loadingPrompt }) => {
        console.log('resPrompt', resPrompt);

        return (
          <Form
            layout="vertical"
            onFinish={async (values) => {
              const { prompt } = values;
              console.log('prompt', prevValue);
              setLoading(true);
              const text = prevValue.value;
              const res = await main({ prompt, text });
              console.log('res', res);
              setData({ value: res, status: 'success' });

              await API.crud({
                model: 'ai',
                operation: 'create',
                data: {
                  prompt,
                  input: text,
                  output: res,
                  llm,
                },
              });
              setLoading(false);
              next?.();
            }}
            disabled={loading || item.status === 'success'}
          >
            <Form.Item
              label="选择prompt"
              name="prompt"
              rules={[{ required: true, message: '请选择prompt' }]}
            >
              <Select
                className="nodrag"
                placeholder="Select a prompt"
                optionFilterProp="children"
                onChange={(value) => {
                  form.setFieldsValue({
                    prompt: value,
                  });
                }}
              >
                {resPrompt &&
                  resPrompt.map((item) => (
                    <Select.Option key={item.id} value={item.content}>
                      {item.name}
                    </Select.Option>
                  ))}
              </Select>
            </Form.Item>
            <EllipsisFlex rows={3}>{item.value || '输出结果区域'}</EllipsisFlex>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              className="mt-8"
            >
              下一步
            </Button>
          </Form>
        );
      }}
    </NodeBase>
  );
}
