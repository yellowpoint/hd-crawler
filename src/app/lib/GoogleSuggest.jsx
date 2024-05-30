import React, { useState } from 'react';

import { useRequest } from 'ahooks';
import { Button, Input, Table } from 'antd';

import API from './api';

function renderArrayData(data, index) {
  if (!data || data.length === 0) return null;
  return data.map((suggestion, index) => (
    <div key={index}>
      {index + 1}. {suggestion}
    </div>
  ));
}
const format = (data) => {
  return data.map((i) => JSON.parse(i.content));
};
export default function GoogleSuggest() {
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const { data: allData } = useRequest(API.googleAll, {
    // refreshDeps: [searchTerm],
    onSuccess: (data) => {
      if (!data) return;
      const data1 = format(data);
      setSuggestions(data1);
    },
  });

  const handleSearch = async () => {
    const res = await API.googleAdd({
      keyword: searchTerm,
    });
    console.log('res', res);
    const data1 = format(res);
    setSuggestions(data1);
  };

  const columns = [
    {
      title: 'Keyword',
      dataIndex: 'keyword',
    },
    {
      title: 'url',
      dataIndex: 'url',
    },
    {
      title: 'people_also_ask',
      dataIndex: 'people_also_ask',
      render: (suggestions) => renderArrayData(suggestions),
    },
    {
      title: 'presentation',
      dataIndex: 'presentation',
      render: (suggestions) => renderArrayData(suggestions),
    },
    {
      title: 'related_searches',
      dataIndex: 'related_searches',
      render: (suggestions) => renderArrayData(suggestions),
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
        rowKey="keyword"
        dataSource={suggestions}
        columns={columns}
        pagination={false}
        style={{ marginTop: '16px' }}
      />
    </div>
  );
}
