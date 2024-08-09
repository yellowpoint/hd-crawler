// 表单页面模板
import { useState } from 'react';

import { useAntdTable, useRequest } from 'ahooks';
import {
  Table,
  Tag,
  Space,
  Button,
  Modal,
  Input,
  Form,
  message,
  Popconfirm,
} from 'antd';
import dayjs from 'dayjs';

import API from '@/lib/api';

const Page = ({ flowId }) => {
  const [showModal, setShowModal] = useState(false);
  const [form] = Form.useForm();
  const { tableProps, search, runAsync } = useAntdTable(
    async (params) => {
      const { current, pageSize, sorter } = params;
      const res = await API.crud({
        model: 'FlowRecord',
        operation: 'readManyWithFilter',
        filter: { key: 'flowId', value: flowId },
        page: current,
        pageSize,
      });
      return res;
    },
    {
      defaultPageSize: 10,
      form,
    },
  );
  const { submit, reset } = search;

  const columns = [
    { title: 'id', dataIndex: 'id' },
    {
      title: '内容',
      dataIndex: 'content',
      render: (content) => (
        <pre>
          {content
            ? content.slice(0, 10) + (content.length > 10 ? '...' : '')
            : content}
        </pre>
      ),
    },
    {
      title: '时间',
      dataIndex: 'createdAt',
      render: (createdAt) => dayjs(createdAt).format('YYYY-MM-DD HH:mm:ss'),
    },
    {
      title: '操作',
      render: (_, record) => (
        <Space>
          {/* <Button
            type="primary"
            onClick={() => {
              form.setFieldsValue({ ...record });
              setShowModal(true);
            }}
          >
            编辑
          </Button> */}
          {/* <Popconfirm
            title="确定要删除吗?"
            onConfirm={async () => {
              await API.crud({
                model: 'prompt',
                operation: 'delete',
                id: record.id,
              });
              message.success('删除成功');
              submit();
            }}
            okText="确定"
            cancelText="取消"
          >
            <Button type="primary" danger>
              删除
            </Button>
          </Popconfirm> */}
        </Space>
      ),
    },
  ];

  const handleFinish = async (values) => {
    const { id } = values;
    console.log('values', values);
    const res = id
      ? await API.crud({
          model: 'prompt',
          operation: 'update',
          id,
          data: { ...values },
        })
      : await API.crud({
          model: 'prompt',
          operation: 'create',
          data: { ...values },
        });
    message.success(id ? '更新成功' : '添加成功');
    setShowModal(false);
    submit();
  };

  return (
    <div>
      <Table rowKey="id" {...tableProps} columns={columns} />
      <Modal
        title={form.getFieldValue('id') ? '编辑' : '添加'}
        open={showModal}
        onOk={() => form.submit()}
        onCancel={() => setShowModal(false)}
      >
        <Form form={form} onFinish={handleFinish}>
          <Form.Item name="name" label="名称" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="content" label="内容" rules={[{ required: true }]}>
            <Input.TextArea autoSize />
          </Form.Item>
          <Form.Item name="id" hidden>
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Page;
