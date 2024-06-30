import { useEffect, useState } from 'react';

import { Button, Input } from 'antd';

import { baseURL } from '@/lib/api/axios';

const useSearch = () => {
  const [ws, setWs] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [dataList, setDataList] = useState([]);

  const handleConnect = async () => {
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

  const handleCrawler = async (keyword) => {
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

  const DataList = () => {
    if (!Array.isArray(dataList) || dataList.length === 0) return null;
    return (
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
    );
  };

  return {
    handleCrawler,
    dataList,
    DataList,
  };
};

export default useSearch;
