import { useNavigate, useParams } from 'react-router-dom';

import { useAntdTable, useRequest } from 'ahooks';
import { Table, Button } from 'antd';

import { EllipsisFlex, copyText } from '@/components';
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
  if (!data) return null;
  const { children, ...rest } = data;
  const c = children.map(({ content, ...rest }) => ({
    ...rest,
    ...JSON.parse(content),
  }));
  const main = {
    ...rest,
    ...JSON.parse(rest.content),
  };
  return [main, ...c];
};
const Page = ({ params }) => {
  const navigate = useNavigate();
  const { id } = useParams();

  const { data } = useRequest(API.googleGet, {
    defaultParams: [
      {
        keyword: decodeURIComponent(id),
      },
    ],
  });
  const dataSource = format(data);
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
        <div>主关键词: {id}</div>
        <Button onClick={handleCopy} disabled={!data}>
          复制数据
        </Button>
        <Button onClick={handleAi} disabled={!data}>
          进行分析
        </Button>
      </div>
      <Table
        pagination={false}
        rowKey="keyword"
        dataSource={dataSource}
        columns={[
          {
            title: 'keyword',
            dataIndex: 'keyword',
          },
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
    </div>
  );
};

export default Page;
