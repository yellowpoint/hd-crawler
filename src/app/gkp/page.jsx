import React, { useState } from 'react';

import { Input, Button, Table, message } from 'antd';

import API from '@/lib/api';

const GKP = () => {
  const [keyword, setKeyword] = useState('');
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!keyword.trim()) {
      message.error('请输入关键词');
      return;
    }
    setLoading(true);
    try {
      const result = await API.gkp({ keyword });
      setData(result);
    } catch (error) {
      message.error('获取数据失败');
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      title: '关键词',
      dataIndex: 'keyword',
      key: 'keyword',
    },
    {
      title: '搜索量',
      dataIndex: 'searchVolume',
      key: 'searchVolume',
    },
    {
      title: '竞争度',
      dataIndex: 'competition',
      key: 'competition',
    },
    {
      title: '平均CPC',
      dataIndex: 'avgCPC',
      key: 'avgCPC',
      render: (text) => `$${text.toFixed(2)}`,
    },
  ];

  return (
    <div>
      <h1>Google Keyword Planner</h1>
      <div style={{ marginBottom: 16 }}>
        <Input
          placeholder="输入关键词"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          style={{ width: 200, marginRight: 16 }}
        />
        <Button type="primary" onClick={handleSearch} loading={loading}>
          搜索
        </Button>
      </div>
      <Table columns={columns} dataSource={data} loading={loading} />
    </div>
  );
};

export default GKP;
