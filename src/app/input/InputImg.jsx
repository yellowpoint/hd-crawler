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
        const { data } = await API.googleAddImg({
          url: image,
        }).finally(() => setLoading(false));

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
      <Button type="primary" htmlType="submit" loading={loading}>
        搜索
      </Button>
      {data && (
        <Table
          dataSource={data}
          rowKey={'link'}
          columns={[
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
      )}
    </Form>
  );
};

export default InputImg;
