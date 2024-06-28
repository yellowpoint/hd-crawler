import { useEffect, useState } from 'react';

import { Button, Input } from 'antd';

import { baseURL } from '@/lib/api/axios';

const Search = ({}) => {
  const [keyword, setKeyword] = useState('');

  const [ws, setWs] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [dataList, setDataList] = useState([]);

  const handleConnect = () => {
    return new Promise((resolve, reject) => {
      const newWs = new WebSocket(baseURL + '/google/addws');

      newWs.onopen = () => {
        console.log('Connected to the server');
        setIsConnected(true);
        resolve(newWs);
      };
      newWs.onmessage = (event) => {
        // const message = JSON.parse(event.data);
        const message = event.data;
        console.log('Received message:', message);
        setDataList((prevDataList) => [...prevDataList, message]);
      };

      newWs.onclose = (event) => {
        console.log('onclose message:', event);
        setIsConnected(false);
      };
      newWs.onerror = (error) => {
        console.error('WebSocket error:', error);
        reject(error);
      };
    });
  };

  const handleSearch = async () => {
    if (!ws) {
      const newWs = await handleConnect();
      setWs(newWs);
      newWs.send(keyword);
    }
    if (ws && isConnected && keyword) {
      ws.send(keyword);
    }
  };

  useEffect(() => {
    return () => {
      if (ws) {
        ws.close();
      }
    };
  }, [ws]);

  return (
    <div>
      <div className="flex items-center gap-16">
        <Input
          className="w-300"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          onPressEnter={handleSearch}
          placeholder="Enter a keyword"
        />
        <Button type="primary" onClick={handleSearch} disabled={!keyword}>
          Search
        </Button>
      </div>

      <ul className="border-gray-20 mt-16 rounded-16 border bg-white p-16 text-12">
        {dataList.map((data, index) => (
          <li
            key={index}
            className="border-gray-20 border-b p-8 last:border-b-0"
          >
            {data}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Search;
