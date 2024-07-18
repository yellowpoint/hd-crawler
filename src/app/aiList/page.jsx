import { Link } from 'react-router-dom';

import { useRequest } from 'ahooks';
import { Table, Tooltip, Typography } from 'antd';

import API from '@/lib/api';

const renderCopyableText = (text) => (
  <Typography.Paragraph
    copyable
    ellipsis={{ tooltip: false }}
    className="!mb-0"
    title={text}
  >
    {text}
  </Typography.Paragraph>
);

const AiList = () => {
  const { data, loading, error } = useRequest(API.crud, {
    defaultParams: [{ model: 'ai', operation: 'readMany' }],
  });

  const columns = [
    {
      title: 'id',
      dataIndex: 'id',
      render: (id) => <Link to={'/ai/' + id}>{id}</Link>,
    },
    {
      title: 'prompt',
      dataIndex: 'prompt',
      render: renderCopyableText,
    },
    {
      title: 'input',
      dataIndex: 'input',
      render: renderCopyableText,
    },
    {
      title: 'output',
      dataIndex: 'output',
      render: renderCopyableText,
    },
    {
      title: 'llm',
      dataIndex: 'llm',
    },
    {
      title: 'createdAt',
      dataIndex: 'createdAt',
      render: (text) => <span>{new Date(text).toLocaleString()}</span>,
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={data}
      loading={loading}
      rowKey="id"
      pagination={{ pageSize: 10 }}
    />
  );
};

export default AiList;
