import { useState } from 'react';

import { Button, Form, Input, Switch, Table } from 'antd';

import { copyText } from '@/components';
import UploadImg from '@/components/UploadImg';
import API from '@/lib/api';

import testData from './testData.json';

const filterEcommerces = (data, reg) =>
  data.filter((item) => item.link && reg.test(item.link));

const InputImg = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState();
  const [filteredData, setFilteredData] = useState();
  const [filter, setFilter] = useState(true);
  const [reg, setReg] = useState(
    /(amazon|taobao|jd\.com|ebay|walmart|shopee|aliexpress)/i,
  );

  const handleFilterChange = (checked) => {
    setFilter(checked);
    if (checked) {
      if (data) {
        setFilteredData(filterEcommerces(data, reg));
      }
    } else {
      setFilteredData(data);
    }
  };

  const handleRegChange = (e) => {
    try {
      const reg = new RegExp(e.target.value, 'i');
      setReg(reg);
      if (filter && data) {
        setFilteredData(filterEcommerces(data, reg));
      }
    } catch (error) {
      console.error(error);
    }
  };
  const handleSearch = (data) => {
    console.log('data', data);
    setData(data);
    if (filter) {
      setFilteredData(filterEcommerces(data, reg));
    } else {
      setFilteredData(data);
    }
  };
  return (
    <Form
      onFinish={async (values) => {
        const { image } = values;
        console.log('image', image);
        setLoading(true);
        const data = await API.googleAddImg({
          url: 'https://120.27.141.74/api/uploads/20240829174505-17159.png',
          // url: image,
        }).finally(() => setLoading(false));
        console.log('InputImg', data);
        handleSearch(data);
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
      <div className="mb-16 flex gap-8">
        <Button type="primary" htmlType="submit" loading={loading}>
          搜索
        </Button>

        <Button
          type="primary"
          loading={loading}
          disabled={!filteredData}
          onClick={() => {
            copyText(JSON.stringify(filteredData.map((i) => i.label)));
          }}
        >
          复制全部标题
        </Button>
        <Button
          onClick={() => handleSearch(testData?.data)}
          className="ml-auto"
        >
          使用测试数据
        </Button>
      </div>

      <div className="mb-8 flex items-center justify-center gap-8">
        <div className="flex-none">是否过滤</div>
        <Switch
          checked={filter}
          onChange={handleFilterChange}
          style={{ marginRight: 8 }}
        />
        <Input
          value={reg.source}
          onChange={handleRegChange}
          placeholder="请输入正则表达式"
        />
        {filteredData && (
          <div className="flex-none">
            {filteredData?.length}/{data?.length}
          </div>
        )}
      </div>
      <Table
        dataSource={filteredData || data}
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
