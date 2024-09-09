import { Link } from 'react-router-dom';

import { useRequest, useAntdTable } from 'ahooks';
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
  const { tableProps, search } = useAntdTable(
    async (params) => {
      const { current, pageSize, sorter } = params;
      const res = await API.crud({
        model: 'ai',
        operation: 'readMany',
        page: current,
        pageSize,
      });
      return res;
    },
    {
      defaultPageSize: 10,
    },
  );

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
    <>
      <Table {...tableProps} rowKey="id" columns={columns} />
    </>
  );
};

export default AiList;
