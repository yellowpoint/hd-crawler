import React, { useState } from 'react';

import { useRequest, useAntdTable } from 'ahooks';
import { Button, Input, Modal, Form, message, Select } from 'antd';

import { POST } from '@/lib/api';

import TableCrawler from './TableCrawler';

export default function BaseCrawler() {
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(false);
  const [form] = Form.useForm();

  const [type, setType] = useState('');
  const { tableProps, refreshAsync } = useAntdTable(
    async (params) => {
      const { current, pageSize, sorter } = params;
      const res = await POST('/crawler/all', {
        page: current,
        pageSize,
      });
      return res;
    },
    {
      defaultPageSize: 10,
    },
  );

  const handleAdd = () => {
    setVisible(true);
  };

  const handleOk = async () => {
    try {
      let { keyword, url, selector } = await form.validateFields();
      if (type === 'googleTop10') {
        url = `https://www.google.com/search?q=${encodeURIComponent(keyword)}`;
      }
      if (type === 'amazonSearch') {
        url = keyword;
      }
      const data = {
        type,
        url,
        selector,
      };
      setVisible(false);
      setLoading(true);
      await POST('/crawler/create', data);
      await refreshAsync();
      setLoading(false);
      message.success('添加成功');
    } catch (error) {
      setLoading(false);
      console.log('error', error);
    }
  };

  return (
    <div className="">
      <div className="flex items-center gap-16">
        <Button type="primary" onClick={handleAdd} loading={loading}>
          新建爬取
        </Button>
      </div>
      <Modal
        disabled={true}
        title="新建"
        open={visible}
        onOk={handleOk}
        onCancel={() => setVisible(false)}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            label="type"
            name="type"
            initialValue={type}
            // rules={[{ required: true, message: '请选择类型' }]}
          >
            <Select
              onChange={(val) => {
                setType(val);
              }}
              options={[
                { value: '', label: '默认' },
                { value: 'googleTop10', label: 'googleTop10' },
                { value: 'amazonSearch', label: 'amazonSearch' },
              ]}
            />
          </Form.Item>
          {['googleTop10', 'amazonSearch'].includes(type) ? (
            <Form.Item
              label="关键词"
              name="keyword"
              rules={[{ required: true, message: '请输入关键词' }]}
            >
              <Input />
            </Form.Item>
          ) : (
            <Form.Item
              label="url"
              name="url"
              rules={[{ required: true, message: '请输入url' }]}
            >
              <Input />
            </Form.Item>
          )}

          {!['googleTop10', 'amazonSearch'].includes(type) && (
            <Form.Item
              label="selector"
              name="selector"
              initialValue="body"
              rules={[{ required: true, message: '请输入selector' }]}
            >
              <Input />
            </Form.Item>
          )}
        </Form>
      </Modal>

      <TableCrawler tableProps={tableProps} />
    </div>
  );
}
