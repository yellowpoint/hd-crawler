import React, { useState } from 'react';

import { useRequest, useAntdTable } from 'ahooks';
import {
  Button,
  Input,
  Table,
  Modal,
  Form,
  message,
  Drawer,
  Popconfirm,
  Select,
} from 'antd';
import dayjs from 'dayjs';

import { POST } from '@/lib/api';

export default function BaseCrawler() {
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(false);
  const [form] = Form.useForm();
  const [htmlData, setHtmlData] = useState('');
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
  const [drawerVisible, setDrawerVisible] = useState(false);

  const handleAdd = () => {
    setVisible(true);
  };

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      const data = {
        url: values.url,
        selector: values.selector,
        type: values.type,
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

  const handleDelete = async (id) => {
    try {
      setLoading(true);
      await POST(`/crawler/delete`, { id });
      await refreshAsync();
      setLoading(false);
      message.success('删除成功');
    } catch (error) {
      setLoading(false);
      console.log('error', error);
    }
  };

  const columns = [
    {
      title: 'id',
      dataIndex: 'id',
      width: 20,
      ellipsis: true,
    },
    {
      title: 'url',
      dataIndex: 'url',
      width: 50,
      ellipsis: true,
    },
    {
      title: 'title',
      dataIndex: 'title',
      width: 100,
      ellipsis: true,
    },
    {
      title: 'html',
      dataIndex: 'html',
      width: 30,
      align: 'right',
      render: (html) => (
        <Button
          type="link"
          onClick={() => {
            setDrawerVisible(true);
            setHtmlData(html);
          }}
        >
          查看
        </Button>
      ),
    },
    {
      title: 'createdAt',
      dataIndex: 'createdAt',
      width: 50,
      ellipsis: true,
      render: (data) => dayjs(data).format('YYYY-MM-DD HH:mm:ss'),
    },
    // {
    //   title: 'type',
    //   dataIndex: 'type',
    //   width: 50,
    //   ellipsis: true,
    // },
    {
      title: '操作',
      align: 'right',
      width: 30,
      render: (data) => (
        <Popconfirm
          title="确定删除吗?"
          onConfirm={() => handleDelete(data.id)}
          okText="确定"
          cancelText="取消"
        >
          <Button type="link">删除</Button>
        </Popconfirm>
      ),
    },
  ];

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
            label="url"
            name="url"
            rules={[{ required: true, message: '请输入url' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="selector"
            name="selector"
            initialValue="body"
            rules={[{ required: true, message: '请输入selector' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item label="type" name="type">
            <Select>
              <Select.Option value="googleTop10">googleTop10</Select.Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>

      <Drawer
        title="html"
        placement="right"
        closable={false}
        onClose={() => setDrawerVisible(false)}
        open={drawerVisible}
        width={500}
      >
        <pre style={{ whiteSpace: 'pre-wrap' }}>{htmlData}</pre>
      </Drawer>

      <Table
        {...tableProps}
        rowKey="id"
        columns={columns}
        style={{ marginTop: '16px' }}
      />
    </div>
  );
}
