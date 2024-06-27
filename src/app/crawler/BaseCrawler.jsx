import React, { useState } from 'react';

import { useRequest } from 'ahooks';
import { Button, Input, Table } from 'antd';
import dayjs from 'dayjs';

import API from './api';

function renderArrayData(data, index) {
  return <pre style={{ whiteSpace: 'pre-wrap' }}>{data}</pre>;
}
const format = (data) => {
  return data.map(({ content, ...rest }) => ({
    ...rest,
    content: JSON.parse(content),
  }));
};
export default function BaseCrawler() {
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const { data: allData } = useRequest(API.baseAll, {
    // refreshDeps: [searchTerm],
    onSuccess: (data) => {
      if (!data) return;
      const data1 = format(data);
      console.log('data1', data1);
      setSuggestions(data1[0].content);
    },
  });

  const handleSearch = async () => {
    const res = await API.baseAdd({
      keyword: searchTerm,
    });
    console.log('res', res);
    const data1 = format(res);
    setSuggestions(data1);
  };

  const columns = [
    {
      title: 'id',
      dataIndex: 'id',
      width: 100,
      ellipsis: true,
    },
    {
      title: 'url',
      dataIndex: 'url',
      width: 100,
      ellipsis: true,
    },
    // {
    //   title: 'html',
    //   dataIndex: 'html',
    //   render: (html) => renderArrayData(html),
    // },
    {
      title: 'aiSummary',
      dataIndex: 'aiSummary',
      render: (aiSummary) => renderArrayData(aiSummary),
    },
    {
      title: 'createdAt',
      dataIndex: 'createdAt',
      width: 100,
      ellipsis: true,
      render: (data) => dayjs(data).format('YYYY-MM-DD HH:mm:ss'),
    },
  ];

  return (
    <div className="p-24">
      <div className="flex items-center gap-16">
        <Input
          className="w-300"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onPressEnter={handleSearch}
          placeholder="Enter a keyword"
        />
        <Button type="primary" onClick={handleSearch}>
          Search
        </Button>
      </div>
      <Table
        rowKey="url"
        dataSource={suggestions}
        columns={columns}
        pagination={false}
        style={{ marginTop: '16px' }}
      />
    </div>
  );
}
