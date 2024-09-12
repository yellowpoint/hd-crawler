import { useNavigate, useParams } from 'react-router-dom';

import { useAntdTable, useRequest } from 'ahooks';
import { Table, Button } from 'antd';

import { EllipsisFlex, copyText } from '@/components';
import { POST } from '@/lib/api';

import TableCrawler from '../TableCrawler';

const Page = ({ params }) => {
  const navigate = useNavigate();
  const { id } = useParams();

  const { data } = useRequest(() =>
    POST('/crawler/get', {
      id: Number(id),
    }),
  );
  const dataSource = data?.subPagesData || [];
  console.log('dataSource', dataSource);
  const handleCopy = () => {
    copyText(JSON.stringify(data));
  };
  const handleAi = () => {
    navigate('/ai', { state: JSON.stringify(data) });
  };

  return (
    <div>
      <div className="mb-16 flex items-center gap-16">
        <div>
          主关键词:
          {data?.url &&
            new URLSearchParams(new URL(data?.url).search).get('q')?.trim()}
        </div>
        <Button onClick={handleCopy} disabled={!data}>
          复制数据
        </Button>
        <Button onClick={handleAi} disabled={!data}>
          进行分析
        </Button>
      </div>
      <TableCrawler tableProps={{ dataSource, rowKey: 'url' }} isSub />
    </div>
  );
};

export default Page;
