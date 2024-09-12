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
      render: (text) => <EllipsisFlex>{text}</EllipsisFlex>,
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
      width: 40,
      align: 'right',
      render: (html, { id, type }) => (
        <Button
          type="link"
          onClick={() => {
            const isDetail = type && type !== 'default';
            if (isDetail) {
              navigate(`/crawler/${id}`);
              return;
            }
            setDrawerVisible(true);
            setHtmlData(html);
          }}
        >
          {type ? '详情页' : '内容'}
        </Button>
      ),
    },
    {
      title: 'createdAt',
      dataIndex: 'createdAt',
      width: 50,
      render: (text) => (
        <EllipsisFlex>{dayjs(text).format('YYYY-MM-DD HH:mm:ss')}</EllipsisFlex>
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
        title="html"
        placement="right"
        closable={false}
        onClose={() => setDrawerVisible(false)}
        open={drawerVisible}
        width={500}
      >
        <pre style={{ whiteSpace: 'pre-wrap' }}>{htmlData}</pre>
      </Drawer>
      <Table
        {...tableProps}
        rowKey="id"
        columns={columns}
        style={{ marginTop: '16px' }}
      />
    </>
  );
};

export default TableCrawler;
