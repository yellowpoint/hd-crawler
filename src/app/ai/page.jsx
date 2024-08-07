import { useState, KeyboardEvent } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { InboxOutlined } from '@ant-design/icons';
import { useRequest } from 'ahooks';
import { Form, Input, Button, Card, message, Select, Upload } from 'antd';

import API from '@/lib/api';

// import { main, llm } from './kimi';
import { main, llm } from './gemini';

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
    const { promptId, content, prompt, image } = values;
    setLoading(true);
    try {
      const res = await main({ prompt, text: content, image });
      setOutput(res);
      await API.crud({
        model: 'ai',
        operation: 'create',
        data: {
          prompt,
          input: `${image && '图片文件,\n'}${content}`,
          output: res,
          llm,
        },
      });
    } catch (error) {
      message.error('生成文本失败');
      console.error('Error generating text:', error);
    } finally {
      setLoading(false);
    }
  };

  const uploadButton = (
    <div>
      <p className="ant-upload-drag-icon">
        <InboxOutlined />
      </p>
      <p className="ant-upload-text">上传图片</p>
    </div>
  );
  const beforeUpload = (file) => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
      message.error('只能上传 JPG/PNG 格式的图片!');
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error('图片大小必须小于 2MB!');
    }
    return isJpgOrPng && isLt2M;
  };

  return (
    <Form
      layout="vertical"
      initialValues={{ promptId: data[0]?.id, content: defaultContent }}
      onFinish={handleFinish}
      form={form}
      disabled={loading}
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
            <Input.TextArea className="!resize-none" rows={16} />
          </Form.Item>
        </div>
        <div className=" flex flex-1 flex-col">
          <Form.Item
            label="内容"
            name="content"
            rules={[
              {
                validator: (_, value) => {
                  if (
                    form.getFieldValue('image')?.length ||
                    form.getFieldValue('content')?.length
                  ) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('内容或图片必传'));
                },
              },
            ]}
          >
            <Input.TextArea
              className="!resize-none"
              placeholder="输入需分析的数据"
              rows={12}
              // autoSize={{ minRows: 1, maxRows: 20 }}
            />
          </Form.Item>

          <Form.Item
            label="上传图片"
            name="image"
            valuePropName="fileList"
            getValueFromEvent={(e) => {
              if (Array.isArray(e)) {
                return e;
              }
              return e && e.fileList;
            }}
            rules={[
              {
                validator: (_, value) => {
                  if (
                    form.getFieldValue('image')?.length ||
                    form.getFieldValue('content')?.length
                  ) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('内容或图片必传'));
                },
              },
            ]}
          >
            <Upload
              accept=".png, .jpg, .jpeg, .webp"
              name="image"
              listType="picture-card"
              className="!w-full"
              showUploadList={{
                showPreviewIcon: false,
              }}
              beforeUpload={(file) => {
                // beforeUpload(file);
                return false;
              }}
              onChange={(info) => {
                const { status } = info.file;
                if (status === 'done') {
                  form.setFieldsValue({
                    image: info.fileList,
                  });
                }
              }}
            >
              {/* {(form.getFieldValue('image') || []).length >= 1
                ? null
                : uploadButton} */}
              {uploadButton}
            </Upload>
          </Form.Item>
        </div>
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
        <div className="mb-8 text-xs text-gray-500">使用{llm}大模型</div>
        {/* {loading && <Spin className="mt-4" />} */}
        <Card bordered={false}>
          <pre style={{ whiteSpace: 'pre-wrap' }}>{output}</pre>
        </Card>
      </Form.Item>
    </Form>
  );
};

export default Ai;
