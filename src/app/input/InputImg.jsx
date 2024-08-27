import { useState } from 'react';

import { Button, Form } from 'antd';

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
          url: 'https://play-lh.googleusercontent.com/_OSB1gXiLCDa8Wj1HPBvDuMuUmrs_sB_3GZ5RdgbU7Diuz905jQx1HB9tDZMj62A0xQ=w480-h960-rw',
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
      {data && <pre>{JSON.stringify(data, null, 2)}</pre>}
    </Form>
  );
};

export default InputImg;
