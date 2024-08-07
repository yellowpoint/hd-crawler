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

import '@xyflow/react/dist/style.css';

import API from '@/lib/api';
import { ContextPage } from '@/lib/BaseContext.jsx';

import nodeTypes from './nodes';

const flowData2 = {
  nodes: [
    {
      id: 'img',
      position: { x: 0, y: 0 },
      data: { title: '商品图' },
      type: 'NodeImg',
    },
    {
      id: 'keyword',
      position: { x: 0, y: 400 },
      data: { title: '关键词' },
      type: 'NodeKeyword',
    },
    {
      id: 'text',
      position: { x: 0, y: 600 },
      data: { title: '分析结果' },
      type: 'NodeText',
    },
  ],
  edges: [
    {
      id: 'e1-2',
      source: 'img',
      target: 'keyword',
      label: '1-2',
      animated: true,
    },
    {
      id: 'e2-3',
      source: 'keyword',
      target: 'text',
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
      const flowData = JSON.parse(data.content || '{}');
      setNodes(flowData.nodes);
      setEdges(flowData.edges);
      setPageData(flowData.data);
    },
  });

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

  useEffect(() => {
    if (!data) return;
    setTimeout(() => {
      setPageData({
        img: {
          status: 'success',
          value: 'https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png',
        },
        keyword: {
          status: 'loading',
        },
      });
    }, 1000);
    setTimeout(() => {
      setPageData({
        keyword: {
          status: 'success',
          value: 'aaa',
        },
        text: {
          status: 'loading',
        },
      });
    }, 2000);
    setTimeout(() => {
      setPageData({
        keyword: {
          status: 'success',
          value: 'aaa',
        },
        text: {
          status: 'success',
          value: 'abababababababababaab',
        },
      });
    }, 3000);
  }, [data]);

  return (
    <ContextPage.Provider value={{ pageData, setPageData }}>
      <div className="h-full w-full">
        <ReactFlow
          nodes={nodes}
          onNodesChange={onNodesChange}
          edges={edges}
          onEdgesChange={onEdgesChange}
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
