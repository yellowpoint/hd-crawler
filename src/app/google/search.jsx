import { useEffect, useState } from 'react';

import Pusher from 'pusher-js';

import API from '@/lib/api';

const useSearch = () => {
  const [channel, setChannel] = useState(null);
  const [dataList, setDataList] = useState([]);

  const handleConnect = () => {
    return new Promise((resolve, reject) => {
      const pusher = new Pusher('1a7382794c3a45f962f9', {
        cluster: 'ap1',
        encrypted: true,
      });

      const newChannel = pusher.subscribe('google');
      setChannel(newChannel);

      newChannel.bind('google', (data) => {
        console.log('data', data);
        setDataList((prevDataList) => [...prevDataList, data]);
      });
      pusher.connection.bind('state_change', function (states) {
        // states = {previous: 'oldState', current: 'newState'}
        console.log('states', states.current);
        if (states.current === 'connected') {
          resolve(newChannel);
        } else {
          reject(states.current);
        }
      });
    });
  };

  const handleCrawler = async (keyword) => {
    if (!channel) {
      const newChannel = await handleConnect();
    }
    await API.googleAddws({
      keyword,
    });

    // if (channel && keyword) {
    //   channel.trigger('google', keyword);
    // }
  };

  useEffect(() => {
    return () => {
      if (channel) {
        channel.unbind_all();
        channel.unsubscribe();
      }
    };
  }, [channel]);

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
