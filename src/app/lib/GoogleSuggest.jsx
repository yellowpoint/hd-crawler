import React, { useState } from 'react';

import { Button, Input, Table } from 'antd';

import API from './api';

function renderArrayData(data, index) {
  return data.map((suggestion, index) => (
    <div key={index}>
      {index + 1}. {suggestion}
    </div>
  ));
}

export default function GoogleSuggest() {
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const handleSearch = async () => {
    const res = await API.google({
      key: searchTerm,
    });
    console.log('res', res);
    setSuggestions(res);
  };

  const columns = [
    {
      title: 'Keyword',
      dataIndex: 'key',
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
    <div>
      <Input
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        onPressEnter={handleSearch}
        placeholder="Enter a keyword"
      />
      <Button type="primary" onClick={handleSearch}>
        Search
      </Button>
      <Table
        dataSource={suggestions}
        columns={columns}
        pagination={false}
        style={{ marginTop: '16px' }}
      />
    </div>
  );
}
