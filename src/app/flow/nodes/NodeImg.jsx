import { useState } from 'react';

import { Button, Form } from 'antd';

import UploadImg from '@/components/UploadImg';

import NodeBase from './NodeBase';

export default function Node(props) {
  console.log('NodeImg', props);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const { readonly = false } = props;

  if (readonly) {
    return (
      <NodeBase {...props}>
        {({ item }) => {
          return (
            <img
              className="h-240 w-300 object-contain"
              alt="example"
              src={item.value}
            />
          );
        }}
      </NodeBase>
    );
  }
  return (
    <NodeBase {...props}>
      {({ item, setData, next }) => {
        return (
          <Form
            onFinish={async (values) => {
              const { image } = values;
              console.log('image', image);
              // setLoading(true);
              setData({ value: image, status: 'success' });
              next?.();
            }}
            form={form}
            disabled={loading || item.status === 'success'}
          >
            <Form.Item
              name="image"
              rules={[{ required: true, message: '请先上传图片' }]}
            >
              <UploadImg
                value={item.value}
                // onChange={(fileList) => setData(fileList)}
              />
            </Form.Item>
            <Button type="primary" htmlType="submit" loading={loading}>
              下一步
            </Button>
          </Form>
        );
      }}
    </NodeBase>
  );
}
