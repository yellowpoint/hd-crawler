import React from 'react';
import { Link } from 'react-router-dom';

import { Table, Button, Input, message } from 'antd';
import dayjs from 'dayjs';

import API from '@/lib/api';

import useSearch from './search';

const format = (data) => {
  return data.map(({ content, ...rest }) => ({
    ...rest,
    content: JSON.parse(content),
  }));
};

const GoogleSuggest = () => {
  const [searchTerm, setSearchTerm] = React.useState('');
  const { handleCrawler, DataList } = useSearch();
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
    const keywordExist = await API.googleGet({
      keyword: searchTerm,
    });
    setSuggestions(keywordExist ? [keywordExist] : []);
    if (!keywordExist) {
      handleCrawler(searchTerm);
    }
  };

  const columns = [
    {
      title: 'id',
      dataIndex: 'id',
    },
    {
      title: 'Keyword',
      dataIndex: 'keyword',
      render: (data) => (
        <Link to={`/google/${encodeURIComponent(data)}`}>{data}</Link>
      ),
    },
    {
      title: 'createdAt',
      dataIndex: 'createdAt',
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
      <DataList />
      <Table
        rowKey="keyword"
        dataSource={suggestions}
        columns={columns}
        pagination={false}
        expandable={false}
        style={{ marginTop: '16px' }}
      />
    </div>
  );
};

export default GoogleSuggest;
