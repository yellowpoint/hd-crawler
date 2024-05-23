import { useState } from 'react';

import { useRequest } from 'ahooks';
import { Button } from 'antd';

import API from '../lib/api';

const Home = () => {
  const [data, setData] = useState();
  const onClick = async () => {
    const res = await API.crawl({
      url: ['https://en.wikipedia.org/wiki/D'],
      maxRequestsPerCrawl: 2,
    });
    setData(JSON.stringify(res));
  };
  return (
    <div>
      home
      <Button onClick={onClick}>爬取</Button>
      结果：{data}
    </div>
  );
};

export default Home;
