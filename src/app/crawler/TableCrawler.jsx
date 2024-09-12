import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useRequest, useAntdTable } from 'ahooks';
import { Button, message, Drawer, Popconfirm, Table } from 'antd';
import dayjs from 'dayjs';

import { EllipsisFlex } from '@/components';
import { POST } from '@/lib/api';

const TableCrawler = ({ tableProps, isSub }) => {
  const navigate = useNavigate();
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [htmlData, setHtmlData] = useState('');
  const handleDelete = async (id) => {
    try {
      setLoading(true);
      await POST(`/crawler/delete`, { id });
      await refreshAsync();
      setLoading(false);
      message.success('删除成功');
    } catch (error) {
      setLoading(false);
      console.log('error', error);
    }
  };
  const columns = [
    {
      title: 'id',
      dataIndex: 'id',
      width: 20,
      ellipsis: true,
    },
    {
      title: 'url',
      dataIndex: 'url',
      width: 50,
      render: (text) => (
        <a href={text} target="_blank" rel="noreferrer">
          <EllipsisFlex>{text}</EllipsisFlex>
        </a>
      ),
    },
    {
      title: 'title',
      dataIndex: 'title',
      width: 100,
      render: (text) => <EllipsisFlex>{text}</EllipsisFlex>,
    },
    {
      title: 'html',
      dataIndex: 'html',
      width: 60,
      align: 'right',
      render: (html, { id, type, error, subPages }) => {
        if (error) return <EllipsisFlex>{error}</EllipsisFlex>;
        return (
          <Button
            type="link"
            onClick={() => {
              if (subPages) {
                navigate(`/crawler/${id}`);
                return;
              }
              setDrawerVisible(true);
              setHtmlData(html);
            }}
          >
            {subPages ? '详情页' : '内容'}
          </Button>
        );
      },
    },
    {
      title: 'createdAt',
      dataIndex: 'createdAt',
      width: 50,
      render: (text) =>
        text && (
          <EllipsisFlex>
            {dayjs(text).format('YYYY-MM-DD HH:mm:ss')}
          </EllipsisFlex>
        ),
    },
    {
      title: 'type',
      dataIndex: 'type',
      width: 50,
      ellipsis: true,
    },
    {
      title: '操作',
      align: 'right',
      width: 30,
      hidden: isSub,
      render: (data) => (
        <Popconfirm
          title="确定删除吗?"
          onConfirm={() => handleDelete(data.id)}
          okText="确定"
          cancelText="取消"
        >
          <Button type="link">删除</Button>
        </Popconfirm>
      ),
    },
  ];

  return (
    <>
      <Drawer
        title={
          <div className="flex items-center justify-between">
            html
            <Button
              type="primary"
              onClick={() => {
                navigator.clipboard.writeText(htmlData);
                message.success('复制成功');
              }}
            >
              复制
            </Button>
          </div>
        }
        placement="right"
        closable={false}
        onClose={() => setDrawerVisible(false)}
        open={drawerVisible}
        width={500}
      >
        <pre style={{ whiteSpace: 'pre-wrap' }}>{htmlData}</pre>
      </Drawer>
      <Table
        rowKey="id"
        columns={columns}
        style={{ marginTop: '16px' }}
        {...tableProps}
      />
    </>
  );
};

export default TableCrawler;
