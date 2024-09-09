import { useState } from 'react';

import { useSetState } from 'ahooks';
import { Button, Form, Input } from 'antd';

import { ai } from '@/components';

import InputBase from './InputBase';
import InputImg from './InputImg';
import InputTree from './InputTree';

const Page = () => {
  const [state, setState] = useSetState({
    prompt: '',
    input: {
      amazon: '',
      google: '',
    },
    output: '',
  });
  const [output, setOutput] = useState();
  const [form] = Form.useForm();
  const style_title = 'flex items-center gap-8 text-36';
  const handleFinish = async (values) => {
    console.log('values', values);
    const res = await ai.main({
      prompt: '分析以下数据，给出十个商品关键词',
      text: JSON.stringify(values),
    });
    console.log('res', res);
    setOutput(res);
  };

  return (
    <Form form={form} onFinish={handleFinish}>
      <div className="flex flex-col gap-30">
        <div>
          <h1 className={style_title}>
            <span className="icon-[devicon--amazonwebservices-wordmark]"></span>
            Amazon类目
          </h1>

          <Form.Item name="amazon" rules={[{ required: true }]}>
            <InputBase />
          </Form.Item>
        </div>
        <div>
          <h1 className={style_title}>
            <span className="icon-[flat-color-icons--google]"></span>
            Google搜图
          </h1>
          <Form.Item name="google" rules={[{ required: true }]}>
            <InputImg />
          </Form.Item>
        </div>
        <div>
          <h1 className={style_title}>
            <span className="icon-[catppuccin--adobe-ai]"></span>
            AI 分析
          </h1>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              分析
            </Button>
          </Form.Item>

          <pre>{output}</pre>
        </div>
      </div>
    </Form>
  );
};

export default Page;
