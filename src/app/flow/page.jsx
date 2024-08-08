import React, { useCallback, useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

import {
  ReactFlow,
  Background,
  Controls,
  applyNodeChanges,
  applyEdgeChanges,
} from '@xyflow/react';
import { useRequest, useSetState } from 'ahooks';
import { Button } from 'antd';

import '@xyflow/react/dist/style.css';

import API from '@/lib/api';
import { ContextPage } from '@/lib/BaseContext.jsx';

import nodeTypes from './nodes';

const flowData2 = {
  nodes: [
    {
      id: '0',
      position: { x: 0, y: 0 },
      data: { title: '商品图', readonly: true, status: 'loading' },
      type: 'NodeImg',
    },
    {
      id: '1',
      position: { x: 0, y: 300 },
      data: { title: '关键词', status: 'waiting' },
      type: 'NodeKeyword',
    },
    {
      id: '2',
      position: { x: 0, y: 600 },
      data: { title: '分析结果' },
      type: 'NodeText',
    },
  ],
  edges: [
    {
      id: 'e1-2',
      source: '0',
      target: '1',
      label: '0-1',
      animated: true,
    },
    {
      id: 'e2-3',
      source: '1',
      target: '2',
      label: '1-2',
      animated: true,
    },
  ],
  data: {
    img: {
      status: 'loading',
    },
    keyword: {},
    text: {},
  },
};
// init loading success error
export default function Flow() {
  const { id } = useParams();
  const { data = {}, error } = useRequest(API.crud, {
    defaultParams: [{ model: 'flow', operation: 'readOne', id }],
    onSuccess: (data) => {
      console.log('data', data);
      // const flowData = JSON.parse(data.content || '{}');
      const flowData = flowData2;
      setNodes(flowData.nodes);
      setEdges(flowData.edges);
      setPageData(flowData.nodes);
    },
  });

  const { data: _resPrompt, loading: loadingPrompt } = useRequest(API.crud, {
    defaultParams: [{ model: 'prompt', operation: 'readMany' }],
  });
  const resPrompt = _resPrompt?.list;
  // console.log('data', data.content, flowData);
  const [pageData, setPageData] = useSetState();
  const [nodes, setNodes] = useState();
  const [edges, setEdges] = useState();
  const onNodesChange = useCallback(
    (changes) => setNodes((nds) => applyNodeChanges(changes, nds)),
    [],
  );
  const onEdgesChange = useCallback(
    (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    [],
  );
  const next = (id) => {
    const newData = pageData;
    const nextId = Number(id) + 1;
    const nextItem = newData[nextId];
    if (!nextItem) return;
    newData[nextId].data = {
      ...nextItem.data,
      status: 'loading',
    };
    setPageData(newData);
  };

  return (
    <ContextPage.Provider
      value={{ pageData, setPageData, next, resPrompt, loadingPrompt }}
    >
      <div className="relative h-full w-full">
        <div className="absolute right-0 top-0 z-20">
          <Button>历史记录</Button>
        </div>
        <ReactFlow
          nodes={nodes}
          // onNodesChange={onNodesChange}
          edges={edges}
          // onEdgesChange={onEdgesChange}
          // fitView
          nodeTypes={nodeTypes}
        >
          <Background />
          <Controls />
        </ReactFlow>
      </div>
    </ContextPage.Provider>
  );
}
