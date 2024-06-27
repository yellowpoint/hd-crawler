import React from 'react';

import { Table, Button, Input } from 'antd';
import dayjs from 'dayjs';

import API from '@/lib/api';

const renderArrayData = (data, index) => {
  if (!data || data.length === 0) return null;
  return data.map((suggestion, index) => (
    <div key={index}>
      {index + 1}. {suggestion}
    </div>
  ));
};

const format = (data) => {
  return data.map(({ content, ...rest }) => ({
    ...rest,
    content: JSON.parse(content),
  }));
};

const GoogleSuggest = () => {
  const [searchTerm, setSearchTerm] = React.useState('');
  const [suggestions, setSuggestions] = React.useState([]);
  React.useEffect(() => {
    const fetchData = async () => {
      const res = await API.googleAll();
      if (!res) return;
      const data1 = format(res);
      setSuggestions(data1);
    };
    fetchData();
  }, []);

  const handleSearch = async () => {
    const res = await API.googleAdd({
      keyword: searchTerm,
    });
    const data1 = format(res);
    setSuggestions(data1);
  };

  const columns = [
    {
      title: 'id',
      dataIndex: 'id',
    },
    {
      title: 'Keyword',
      dataIndex: 'keyword',
    },
    {
      title: 'createdAt',
      dataIndex: 'createdAt',
      render: (data) => dayjs(data).format('YYYY-MM-DD HH:mm:ss'),
    },
  ];

  const expandedRowRender = (record) => {
    const { content } = record;
    return (
      <Table
        pagination={false}
        rowKey="keyword"
        dataSource={content}
        columns={[
          {
            title: 'keyword',
            dataIndex: 'keyword',
          },
          // {
          //   title: 'url',
          //   dataIndex: 'url',
          // },
          {
            title: 'suggest',
            dataIndex: 'presentation',
            render: (suggestions) => renderArrayData(suggestions),
          },
          {
            title: 'people_also_ask',
            dataIndex: 'people_also_ask',
            render: (suggestions) => renderArrayData(suggestions),
          },
          {
            title: 'related_searches',
            dataIndex: 'related_searches',
            render: (suggestions) => renderArrayData(suggestions),
          },
        ]}
      />
    );
  };

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
        rowKey="keyword"
        dataSource={suggestions}
        columns={columns}
        pagination={false}
        expandable={{ expandedRowRender }}
        style={{ marginTop: '16px' }}
      />
    </div>
  );
};

export default GoogleSuggest;
