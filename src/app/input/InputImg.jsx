import { useState } from 'react';

import { Button, Form, Table } from 'antd';

import UploadImg from '@/components/UploadImg';
import API from '@/lib/api';

const InputImg = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState();
  return (
    <Form
      onFinish={async (values) => {
        const { image } = values;
        console.log('image', image);
        setLoading(true);
        const data = await API.googleAddImg({
          // url: 'https://120.27.141.74/api/uploads/20240829174505-17159.png',
          url: image,
        }).finally(() => setLoading(false));
        console.log('InputImg', data);
        setData(data);
      }}
      form={form}
      disabled={loading}
    >
      <Form.Item
        name="image"
        rules={[{ required: true, message: '请先上传图片' }]}
      >
        <UploadImg maxCount={1} />
      </Form.Item>
      <Button
        type="primary"
        htmlType="submit"
        loading={loading}
        className="mb-16"
      >
        搜索
      </Button>

      <Table
        dataSource={data}
        rowKey={'link'}
        columns={[
          {
            title: 'img',
            dataIndex: 'img',
            width: 200,
            render: (img) =>
              img && <img src={img} className="h-200 w-200 object-contain" />,
          },
          {
            title: 'label',
            dataIndex: 'label',
          },
          {
            title: 'link',
            dataIndex: 'link',
          },
        ]}
      />
    </Form>
  );
};

export default InputImg;
